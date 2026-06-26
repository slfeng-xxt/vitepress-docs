# 堡垒机

:::tip
了解：堡垒机（Bastion Host）是一个安全网关/跳板机。它就是"唯一的门"，所有人所有操作都要经过它，能看能管能追溯。

工作内容：之前是客户端版本(c/s架构)，迁移浏览器版本（b/s架构）；解决其中的问题和新的需求

tcp -> https
:::

## 1. 浏览器端远程桌面

- guacamole

### 1.1 问题：使用https导致页面卡顿，后改为websocket连接

- 核心代码

```js
this.websocket = new Guacamole.WebSocketTunnel('/web-socket/tunnel', true)

const guacamole = new Guacamole.Client(this.websocket)
```

## 2. 大文件上传下载

- 应用：远程桌面连接后需要通过堡垒机将上传大文件到目标服务器

### 2.1 分片上传

```js
/**
 * Vuex 上传任务模块
 * 功能：创建上传任务、跟踪进度
 * 每个任务独立管理自己的进度
 */

export default {
  namespaced: true,

  state: () => ({
    // 上传任务列表
    tasks: [],
    // 每个任务的 AbortController
    controllers: {},
    // 上传切片大小
    chunkSize: 50 * 1024 * 1024 // 50MB
  }),

  mutations: {
   // ....
  },

  actions: {
    /**
     * 创建并启动上传任务
     * @param { * } uploadApi  上传api实例 {例如：this.$modules.uploadApi }
     * @param { Object } conParams 自定义参数 { host，port，username，password，targetPath...  }
     * @param { Files } files 文件列表 { 获取方法：this.$store.getters['uploadTasks/handleFiles'](files) }
     * @param { String } taskId { 获取方法：this.$store.getters['uploadTasks/generateTaskId']() }
     * @returns 
     */
    async createUploadTask({ commit, state, dispatch }, { uploadApi, conParams, files, taskId }) {
      if (!files || files.length === 0) {
        return { success: false, message: '请选择要上传的文件' }
      }

      if (!uploadApi) {
        return { success: false, message: '缺少 uploadApi 实例' }
      }

      const chunkSize = state.chunkSize

      // TODO: 获取文件名或文件夹名
      let fileName
      if (files.length > 1) {// 文件夹
        fileName = `上传文件夹：${files[0].path.split('/').shift()}`
      } else {
        fileName = `上传文件：${files[0].path}`
      }
      
      // 创建任务
      const task = {
        id: taskId,
        type: 'upload',
        fileName,
        filesName: files.map(f => f.name).join('、'),
        files: files.map((f, idx) => ({
          path: f.path,
          name: f.name,
          size: f.size,
          idx: idx
        })),
        totalSize: files.reduce((sum, f) => sum + f.size, 0),
        uploadedBytes: 0,
        progress: 0,
        status: 'preparing',
        message: '准备上传...',
        uploadId: null,
        backendTaskId: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      commit('ADD_TASK', task)
      commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.P } })

      // 创建 AbortController
      const controller = new AbortController()
      commit('SET_CONTROLLER', { id: taskId, controller })

      try {
        // ---- 步骤1: 初始化上传会话 ----
        commit('UPDATE_TASK', { id: taskId, updates: { message: '初始化会话...' } })

        const fileMetas = files.map((f, idx) => ({
          path: f.path,
          size: f.size,
          idx: idx
        }))

        const initBody = {
          ...conParams,
          chunkSize: chunkSize,
          files: fileMetas.map(m => ({ path: m.path, size: m.size })),
          signal: controller.signal
        }

        console.log('POST /api/upload/chunk/init, 文件数: ' + fileMetas.length)

        const initResp = await uploadApi.uploadChunkInit(initBody)

        if (!initResp || !initResp.uploadId) {
          Message.error('初始化会话失败，未获取到 uploadId')
          throw new Error('初始化会话失败，未获取到 uploadId')
        }

        const uploadId = initResp.uploadId
        commit('UPDATE_PROGRESS', { id: taskId, progress: 0 })
        commit('SET_UPLOAD_ID', { id: taskId, uploadId })
        console.log('会话初始化成功, uploadId=' + uploadId)

        // ---- 步骤2: 逐文件逐分片上传 ----
        let totalChunks = 0
        for (let i = 0; i < fileMetas.length; i++) {
          totalChunks += Math.ceil(fileMetas[i].size / chunkSize)
        }
        console.log('总文件数: ' + fileMetas.length + ', 总分片数: ' + totalChunks)

        let uploadedChunks = 0

        commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.U } })

        for (let fi = 0; fi < files.length; fi++) {
          controller.signal.throwIfAborted()

          const fileItem = files[fi]
          const file = fileItem.file
          const fileChunks = Math.ceil(file.size / chunkSize)

          // console.log(`[${fi + 1}/${files.length}] 文件: ${fileItem.path} (${fileChunks} 分片)`)

          for (let ci = 0; ci < fileChunks; ci++) {
            controller.signal.throwIfAborted()

            const chunkStart = ci * chunkSize
            const chunkEnd = Math.min(chunkStart + chunkSize, file.size)

            // 上传分片（带重试）
            let chunkOk = false
            let retryCount = 0
            const fileChunk = file.slice(chunkStart, chunkEnd)

            while (retryCount < 3 && !chunkOk) {
              try {
                const params = {
                  urlParams: {
                    uploadId: uploadId,
                    fi: fi,
                    ci: ci,
                    fileChunks: fileChunks
                  },
                  file: new Blob([fileChunk], { type: 'application/octet-stream' }),
                  signal: controller.signal
                }

                const chunkResp = await uploadApi.uploadChunk(params)
                chunkOk = !!chunkResp

                if (!chunkResp && retryCount < 2) {
                  retryCount++
                  console.log('分片 ' + ci + ' 上传异常, 重试 ' + retryCount + '/3')
                  await sleep(500 * retryCount)
                }
              } catch (e) {
                if (e.name === 'AbortError') {
                  commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.Q, message: '已取消' } })
                  return { success: false, message: '上传已取消' }
                }
                retryCount++
                console.log('分片 ' + ci + ' 上传异常: ' + e.message + ', 重试 ' + retryCount + '/3')
                await sleep(500 * retryCount)
              }

              if (!chunkOk) retryCount++
            }

            if (!chunkOk) {
              throw new Error('分片 ' + ci + ' 上传失败 (3次重试后)')
            }

            uploadedChunks++
            // 上传阶段占 全阶段的35
            const overallPct = Math.round((uploadedChunks / totalChunks) * 35 ) 

            const progressMsg = `上传: ${fileItem.name} [${uploadedChunks}/${totalChunks}]`
            
            commit('UPDATE_PROGRESS', {
              id: taskId,
              progress: overallPct,
              uploadedBytes: uploadedChunks * chunkSize,
              totalBytes: task.totalSize
            })
            commit('UPDATE_MESSAGE', { id: taskId, message: progressMsg })
          }
        }

        // ---- 步骤3: 通知后端合并 ----
        console.log('全部上传完成, 发起合并...')
        // commit('UPDATE_PROGRESS', { id: taskId, progress: overallPct })
        commit('UPDATE_MESSAGE', { id: taskId, message: '上传完成, 正在合并...' })

        const completeParams = { 
          uploadId: uploadId, 
          signal: controller.signal,
          protocol: conParams.protocol,
          deviceid: conParams.deviceid,
        }
        const completeResp = await uploadApi.uploadComplete(completeParams)

        const backendTaskId = completeResp && completeResp.taskId
        console.log('合并已提交' + (backendTaskId ? ', taskId=' + backendTaskId : ''))

        // 保存后端 taskId
        if (backendTaskId) {
          commit('UPDATE_TASK', { id: taskId, updates: { backendTaskId: backendTaskId } })
        }

        // ---- 步骤4: 轮询后端进度 ----
        if (backendTaskId) {
          const result = await dispatch('pollProgress', { uploadApi, taskId, conParams, totalSize: task.totalSize })
          return result
        } else {
          commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.C, message: '上传合并成功!' } })
          return { success: true, taskId: taskId }
        }

      } catch (err) {
        if (err.name === 'AbortError') {
          commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.Q, message: '上传已取消' } })
          return { success: false, message: '上传已取消' }
        }
        console.error('上传失败: ', err.message)
        Message.error(`上传失败: ${err.message}`)
        commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.F, message: err.message } })
        return { success: false, message: err.message }
      } finally {
        commit('REMOVE_CONTROLLER', taskId)
      }
    },

    // 轮询后端进度
    async pollProgress({ commit, state }, { uploadApi, taskId, conParams, totalSize }) {
      const pollInterval = 2000
      const maxPollTime = 30 * 60 * 1000
      const pollStart = Date.now()
      let lastStatus = ''

      // 获取任务的 taskId
      const task = state.tasks.find(t => t.id === taskId)
      const backendTaskId = task ? task.backendTaskId : ''

      if (!backendTaskId) {
        console.warn('未找到后端 taskId，跳过轮询')
        return { success: true }
      }

      while (true) {
        if (Date.now() - pollStart > maxPollTime) {
          console.log('轮询超时 (30分钟)')
          commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.F, message: '轮询超时' } })
          return { success: false, message: '轮询超时' }
        }

        if (state.controllers[taskId] && state.controllers[taskId].signal.aborted) {
          console.log('任务已取消')
          return { success: false, message: '任务已取消' }
        }

        try {
          // RDP 上传到堡垒机，只需要 guacamoleId ; 其他大文件上传需要taskId来查
          const resp = await uploadApi.uploadProgress({ id: backendTaskId, guacamoleId: conParams.uploadId })

          const status = resp.status || ''
          const message = resp.message || ''

          if (status !== lastStatus) {
            console.log('后台状态: ' + status + (message ? ' - ' + message : ''))
            lastStatus = status
          }

          const uploadedBytes = resp.uploadedBytes || 0
          // 合并阶段占全阶段的 60
          const backPct = Math.round(35 + (uploadedBytes / totalSize) * 60)

          switch (status) {
            case 'MERGING': // 通知后台合并
              commit('UPDATE_PROGRESS', { id: taskId, progress: backPct })
              commit('UPDATE_MESSAGE', { id: taskId, message: `后台合并中... (${backPct ? Math.round(backPct) : 50}%)` })
              break
            case 'CREATED': // 后台上传到目标服务器
              commit('UPDATE_PROGRESS', { id: taskId, progress: backPct })
              commit('UPDATE_TASK', { id: taskId, message: `合并完成，准备发送目标服务器...` })
              break
            case 'COMPLETED': // 上传完成
              commit('UPDATE_PROGRESS', { id: taskId, progress: 100 })
              commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.C, message: '上传成功!' } })
              const currentFiles = state.tasks.find(t => t.id === taskId)
              Message.success(`${currentFiles.fileName}上传成功! `)
              return { success: true }
            case 'FAILED':
              commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.F, message: '失败: ' + message } })
              return { success: false, message }
            case 'CANCELLED':
              commit('UPDATE_TASK', { id: taskId, updates: { status: UPLOAD_TASK_STATUS.Q, message: '任务已取消' } })
              return { success: false, message: '任务已取消' }
          }
        } catch (e) {
          if (e.name === 'AbortError') break
          console.warn('轮询异常: ' + e.message)
        }

        await sleep(pollInterval)
      }
    },
  },

  getters: {
    // ...
  }
}

// 工具函数
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
```

### 2.2 流式下载

```js
/**
 * 功能：创建下载任务、跟踪进度
 */
import streamSaver from 'streamsaver'

export default {
    namespaced: true,

    state: () => ({
        // 任务列表
        tasks: [],
        // 当前活跃的 EventSource 连接
        eventSources: {},
        // 每个任务的 AbortController
        controllers: {},
        // 后台打包进度上限值
        packMaxValue: 80,
        downloadTask: {}
    }),

    mutations: {
       // ...
    },

    actions: {
        /**
        * 创建下载任务
        * @param { * } downloadApi  上传api实例 {例如：this.$modules.uploadApi }
        * @param { Object } configParams 自定义一些参数 { host，port，username，password, paths, basePath ...  }
        * @returns 
        */
        createDownloadTask({ commit, dispatch }, { downloadApi, configParams }) {
            if (!downloadApi) {
                console.error('缺少 downloadApi 实例')
                return
            }

            try {
                // 下载路径列表
                const paths = configParams.paths ? configParams.paths : []
                // 上传路径
                const basePath = configParams.basePath ? configParams.basePath : ''
                // 创建任务id
                const createId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
                // 创建任务对象
                const task = {
                    createId,
                    id: '',
                    type: 'download',
                    fileName: 'download',
                    paths,
                    files: paths || [],
                    filesName: `下载文件：${(paths || []).map(f => f.split('/').pop()).join('、')}`,
                    basePath,
                    progress: 0,
                    speed: 0,
                    downloadedSize: 0,
                    totalSize: 0,
                    status: '',
                    message: '准备中...',
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }

                commit('ADD_TASK', task) 
                commit('UPDATE_TASK_BY_CREATEID', {
                    createId: createId, 
                    updates: {
                        status: DOWNLOAD_TASK_STATUS.S,
                        progress: 0,
                        message: `任务创建中...`
                    }
                })

                const downloadParams = {
                    ...configParams,
                }

                dispatch('getDownTaskId', { downloadApi, downloadParams, createId })

                return task
            } catch (e) {
                Message.error(`创建下载任务失败`)
                console.error('创建下载任务失败:', e)
            }
        },

        async getDownTaskId({ commit, dispatch }, { downloadApi, downloadParams, createId}) {
            try {
                const { taskId, fileName }  = await downloadApi.createDownloadTask(downloadParams)

                // 弹出传输窗口
                commit('downloadOrUploadStore/setDialogType', 'download', { root: true })
                commit('downloadOrUploadStore/setDetialShow', true, { root: true })

                if (taskId) {
                    commit('UPDATE_TASK_BY_CREATEID', {
                        createId: createId,
                        updates: {
                            id: taskId,
                            fileName,
                            progress: 1,
                            message: `任务创建成功...`
                        }
                    })
                    Message.success(`已创建下载任务，请耐心等待...`)
                    // 自动订阅进度
                    dispatch('subscribeProgress', { taskId, fileName, downloadParams })
                } else {
                    Message.warning(`创建下载失败，请联系管理员...`)
                    commit('UPDATE_TASK_BY_CREATEID', {
                        createId: createId,
                        updates: {
                            progress: 0, 
                            status: DOWNLOAD_TASK_STATUS.F,
                            message: `任务创建失败`
                        }
                    })
                }
            } catch (error) {
                console.error('创建下载任务失败:', error)
                Message.warning(`创建下载失败，请联系管理员...`)
                // commit('downloadOrUploadStore/setDetialShow', false, { root: true })
                commit('downloadOrUploadStore/setDialogType', 'transferFail', { root: true })
                commit('UPDATE_TASK_BY_CREATEID', {
                    createId: createId,
                    updates: {
                        progress: 0, 
                        status: DOWNLOAD_TASK_STATUS.F,
                        message: `任务创建失败`
                    }
                })
            }
        },

        // 订阅进度（SSE）
        subscribeProgress({ commit, state, dispatch }, { taskId, fileName, downloadParams }) {
            // 检测 EventSource 支持
            if (typeof EventSource === 'undefined') {
                console.log('检测 EventSource 不支持');
                // dispatch('pollProgress', taskId)
                return
            }

            const REQUEST_URL = downloadParams.customDownloadUrl || 'download/progress'
            const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).user.token : ''
            let eventSourceUrl = `${global.BS_PRO}//${global.TCP_HOST}:${global.TCP_PORT}/${REQUEST_URL}?taskId=${taskId}&token=${token}`
            
            if(process.env.NODE_ENV === "production"){
                eventSourceUrl = `${window.location.origin}/api/${REQUEST_URL}?taskId=${taskId}&token=${token}`
            }

            const eventSource = new EventSource(eventSourceUrl)

            commit('SET_EVENT_SOURCE', { id: taskId, eventSource })

            let fakerTimer,
                fakerNum = 50; // 后台打包开始进度从50%开始

            eventSource.addEventListener('progress', (event) => {
                try {
                    const progress = JSON.parse(event.data)

                    // 根据服务器返回的状态更新
                    if (progress.status.includes('打包')) {
                        if (fakerTimer) return

                        // TODO: 后台打包中更新进度(未知时间段。。。如何计算)
                        // 根据文件大小的不同配置不同的定时器时间
                        const totalSize = progress.totalSize;
                        let intervalTime = 1000;

                        if (!totalSize) return
                        if (totalSize < 10 * 1024 * 1024) { // 小于10M
                            intervalTime = 500
                        } else if (totalSize < 100 * 1024 * 1024) { // 10-100M
                            intervalTime = 1000
                        } else if (totalSize < 1024 * 1024 * 1024) { // 100M - 1G
                            intervalTime = 3000
                        } else if (totalSize < 2 * 1024 * 1024 * 1024) { // 1G - 2G
                            intervalTime = 5000
                        } else { // 大于2G
                            intervalTime = 8000
                        }

                        fakerTimer = setInterval(() => {
                            fakerNum = Math.random() * 0.5 + 0.5 + fakerNum
                            const newProcess = Math.min(fakerNum, state.packMaxValue) // 打包进度上限为 65
                            commit('UPDATE_TASK', {
                                id: taskId,
                                updates: {
                                    status: DOWNLOAD_TASK_STATUS.P,
                                    progress: newProcess || 0,
                                    downloadedSize: progress.currentSize || 0,
                                    totalSize: progress.totalSize || 0,
                                    message: `后台打包中...`
                                }
                            })
                        }, intervalTime);
                    } else {
                        commit('UPDATE_TASK', {
                            id: taskId,
                            updates: {
                                status: progress.status,
                                progress: Math.min(progress.progressPercent, state.packMaxValue) || 0,
                                downloadedSize: progress.currentSize || 0,
                                totalSize: progress.totalSize || 0,
                                message: `${progress.status} [${progress.progressPercent}%]: ${progress.fileName}`
                            }
                        })

                    }

                    // 检查是否完成
                    if (progress.progressPercent >= 100 || progress.status === '完成') {
                        fakerTimer && clearInterval(fakerTimer)
                        commit('REMOVE_EVENT_SOURCE', taskId)
                        // 触发下载
                        dispatch('downloadFile', { taskId, fileName })
                    }

                    // 如果失败，停止订阅
                    if (progress.status === DOWNLOAD_TASK_STATUS.F) {
                        commit('REMOVE_EVENT_SOURCE', taskId)
                        fakerTimer && clearInterval(fakerTimer)
                    }
                } catch (e) {
                    console.error('解析进度失败:', e)
                    commit('REMOVE_EVENT_SOURCE', taskId)
                    fakerTimer && clearInterval(fakerTimer)
                }
            })

            eventSource.onerror = (error) => {
                console.error('SSE错误:', error)
                Message.error('SSE错误')
                commit('UPDATE_TASK', {
                    id: taskId,
                    updates: {
                        status: DOWNLOAD_TASK_STATUS.F,
                        message: '下载失败: SSE错误'
                    }
                })
                commit('REMOVE_EVENT_SOURCE', taskId)
                fakerTimer && clearInterval(fakerTimer)
                // 降级到轮询
                // dispatch('pollProgress', taskId)
            }

            eventSource.onclose = () => {
                console.log('SSE连接关闭:', taskId)
            }
        },

        // 轮询降级方案
        // pollProgress({ commit, state }, taskId) {
        // },

        // 下载文件
        async downloadFile({ commit, state, dispatch }, { taskId, fileName }) {
            const task = state.tasks.find(t => t.id === taskId)
            if (!task) return

            commit('UPDATE_TASK', {
                id: taskId,
                updates: {
                    status: DOWNLOAD_TASK_STATUS.D,
                    message: '正在下载文件...'
                }
            })

            try {
                // 获取下载链接
                const token = 
                    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).user.token : ''
                const downloadUrl = `/api/download/download/${taskId}?token=${token}`

                commit('UPDATE_TASK', {
                    id: taskId,
                    updates: {
                        status: DOWNLOAD_TASK_STATUS.C,
                        progress: 100,
                        message: `已下载，请到浏览器下载记录中查看: 【 ${fileName} 】`,
                        completedAt: Date.now()
                    }
                })

                // commit('SET_DOWNLOAD_TASK', {
                //     url: downloadUrl,
                //     name: fileName
                // })
                
                // Message.success(`已下载，请到浏览器下载记录中查看`)

                // const a = document.createElement('a')
                // a.href = downloadUrl
                // a.download = fileName
                // document.body.appendChild(a)
                // a.click()
                // await new Promise(resolve => setTimeout(resolve, 150))
                // document.body.removeChild(a)


                //流式下载 【 StreamSaver.js + fetch 】=====》*****需要浏览器证书认证*****
                await dispatch('streamDownloadFiles', {
                    taskId,
                    url: downloadUrl,
                    fileName: fileName || 'download.zip',
                    callbacks: {
                        // 进度更新
                        onProgress: ({ taskId, progress, speed, downloadedBytes, totalBytes }) => {
                            // 更新进度
                            commit('UPDATE_TASK', {
                                id: taskId,
                                updates: {
                                    status: DOWNLOAD_TASK_STATUS.D,
                                    progress,
                                    speed,
                                    message: `浏览器下载中... ${formatSize(downloadedBytes)}` + (totalBytes > 0 ? ` / ${formatSize(totalBytes)}` : ''),
                                    completedAt: Date.now()
                                }
                            })
                        },
                        onSuccess: ({ taskId }) => {
                            // TODO: 通知后端下载完了，可以清理缓存文件
                        }
                    }
                })

            } catch (e) {
                console.error('下载失败:', e)
                Message.error(e)
                commit('UPDATE_TASK', {
                    id: taskId,
                    updates: {
                        status: DOWNLOAD_TASK_STATUS.F,
                        message: '下载失败: ' + e.message
                    }
                })
            }
        },

        /**
         * 流式下载文件 ZIP（StreamSaver.js 方式）
         * @param {Object} params
         * @param {string} params.taskId        - 当前任务id
         * @param {string} params.url           - 下载 URL（后端流式生成 ZIP）
         * @param {string} params.fileName      - 文件夹名称
         * @param {Object} [params.headers]     - 额外的请求头
         * @param {Object} [params.callbacks]   - 回调 { onProgress, onSuccess, onError }
         * @returns {string} taskId
         */
        async streamDownloadFiles({ commit, dispatch }, { taskId, url, fileName, headers, callbacks }) {
            if (typeof streamSaver === 'undefined') {
                // TODO: 抛出异常或者降级为浏览器直接链接下载
                // throw new Error('StreamSaver.js 未加载，请确保已引入 streamSaver 库')
                // 方式一: 直接丢给浏览器下载(后端延时清除临时文件)
                // 触发浏览器原生下载
                const a = document.createElement('a')
                a.href = url
                a.download = fileName
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)

                commit('UPDATE_TASK', {
                    id: taskId,
                    updates: {
                        status: DOWNLOAD_TASK_STATUS.C,
                        progress: 100,
                        message: '服务器下载完成',
                        completedAt: Date.now()
                    }
                })
            }

            const controller = new AbortController()

            commit('SET_CONTROLLER', { id: taskId, controller })

            dispatch('_executeStreamDownload', {
                taskId,
                url,
                fileName,
                fileSize: 0,
                headers,
                callbacks,
                controller
            })
        },

        /**
         * 执行流式下载（内部方法）
         * 核心流程：
         * 1. 创建 StreamSaver write stream
         * 2. fetch 请求文件
         * 3. ReadableStream reader → writer pump
         * 4. 实时更新进度/速度
         * 5. 完成/失败回调
         */
        async _executeStreamDownload({ commit, state }, 
        { taskId, url, fileName, fileSize, headers, callbacks, controller }) {
            const task = state.tasks.find(t => t.id === taskId)
            if (!task) return

            let writer = null
            let lastUpdateTime = Date.now()
            let lastDownloadedBytes = 0
            let receivedLength = 0

            try {
                if(process.env.NODE_ENV === "production"){ // TODO: 线上使用
                // mitm.html， streamsaver 库里有
                    streamSaver.mitm = `${window.location.origin}/static/streamsaver/mitm.html`
                } else { // TODO: 本地调试用
                    streamSaver.mitm = `http://localhost:8085/static/streamsaver/mitm.html`
                }

                // 步骤1: 创建 StreamSaver write stream
                const fileStream = streamSaver.createWriteStream(fileName)
                writer = fileStream.getWriter()

                // 步骤2: fetch 请求文件
                const fetchOptions = {
                    signal: controller.signal
                }
                if (headers) {
                    fetchOptions.headers = headers
                }

                commit('UPDATE_TASK', {
                    id: taskId,
                    updates: {
                        message: '发起请求...'
                    }
                }
                )

                const response = await fetch(url, fetchOptions)

                if (!response.ok) {
                    throw new Error(`服务器返回错误: ${response.status} ${response.statusText}`)
                }

                // 步骤3: 获取总大小（如果响应头包含）
                let totalBytes = fileSize
                const contentLength = parseInt(response.headers.get('content-length')) || 0
                if (contentLength > 0) {
                    totalBytes = contentLength
                    commit('UPDATE_TASK', {
                        id: taskId,
                        updates: {
                            totalSize: totalBytes,
                            // isStreaming: false 
                        }
                    })
                }

                commit('UPDATE_TASK', {
                    id: taskId,
                    updates: {
                        message: '下载中...'
                    }
                },
                )

                // 步骤4: 开始读取流
                const reader = response.body.getReader()

                // 步骤5: pump 循环
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) {
                        // 下载完成
                        await writer.close()

                        commit('UPDATE_TASK', {
                            id: taskId,
                            updates: {
                                status: DOWNLOAD_TASK_STATUS.C,
                                progress: 100,
                                downloadedSize: receivedLength,
                                totalSize: totalBytes || receivedLength,
                                message: '下载完成',
                                completedAt: Date.now()
                            }
                        })

                        // 成功回调
                        if (callbacks && callbacks.onSuccess) {
                            callbacks.onSuccess({ taskId, fileName, totalBytes: totalBytes || receivedLength })
                        }

                        break
                    }

                    // 更新接收字节数
                    receivedLength += value.length

                    // 计算进度
                    let progress = 0
                    if (totalBytes > 0) {
                        // 剩下的30%进度计算
                        // progress = ((receivedLength / totalBytes) * 30).toFixed(2) + 65 
                        progress = Math.round((receivedLength / totalBytes) * 35) + state.packMaxValue
                    } else {
                        // 流式下载（未知大小）：使用动态波动百分比
                        progress = 10 + Math.min((receivedLength % 8000000) / 8000000 * 80, 80)
                        progress = Math.floor(progress) + state.packMaxValue
                    }

                    // 计算速度（每秒更新一次）
                    let speed = 0
                    const now = Date.now()
                    const timeDiff = (now - lastUpdateTime) / 1000
                    if (timeDiff >= 1) {
                        speed = (receivedLength - lastDownloadedBytes) / timeDiff
                        lastUpdateTime = now
                        lastDownloadedBytes = receivedLength
                    } else {
                        // 使用上次的速度
                        speed = task.speed || 0
                    }

                    // 进度回调
                    if (callbacks && callbacks.onProgress) {
                        callbacks.onProgress({ taskId, progress, speed, downloadedBytes: receivedLength, totalBytes })
                    }

                    // 步骤6: 写入 StreamSaver
                    await writer.write(value)
                }

            } catch (err) {
                // 处理取消
                if (err.name === 'AbortError') {
                    commit('UPDATE_TASK', {
                        id: taskId,
                        updates: {
                            status: DOWNLOAD_TASK_STATUS.C,
                            message: '已取消'
                        }
                    })

                    return
                }

                // 处理其他错误
                console.error(`[流式下载] 任务 ${taskId} 失败:`, err)
                commit('UPDATE_TASK', {
                    id: taskId,
                    updates: {
                        status: DOWNLOAD_TASK_STATUS.F,
                        message: '下载失败: ' + err.message
                    }
                })

                // 错误回调
                if (callbacks && callbacks.onError) {
                    callbacks.onError({ taskId, error: err })
                }

                // 中止 writer
                if (writer) {
                    try { writer.abort() } catch (e) { /* ignore */ }
                }
            } finally {
                commit('REMOVE_CONTROLLER', taskId)
            }
        },

        // 取消下载
        cancelDownload({ commit, state }, taskId) {
            commit('REMOVE_EVENT_SOURCE', taskId)
            if (state.controllers[taskId]) {
                state.controllers[taskId].abort()
                commit('UPDATE_TASK', {
                    id: taskId,
                    updates: {
                        status: DOWNLOAD_TASK_STATUS.C,
                        message: '已取消'
                    }
                })
                commit('REMOVE_CONTROLLER', taskId)
            }
        },

        // 移除任务
        removeDownloadTask({ commit }, taskId) {
            commit('REMOVE_TASK', taskId)
        },

        // 清空已完成任务
        clearDownloadCompleted({ commit }) {
            commit('CLEAR_COMPLETED')
        },

        // 清空所有任务
        clearAll({ commit }) {
            commit('CLEAR_ALL')
        }
    },

    getters: {
        // 。。。
    }
}

// ==================== 工具函数 ====================

/**
 * 格式化文件大小
 * @param {number} bytes
 * @returns {string}
 */
function formatSize(bytes) {
    if (!bytes || bytes === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let i = 0
    while (bytes >= 1024 && i < units.length - 1) {
        bytes = bytes / 1024
        i++
    }
    return bytes.toFixed(2) + ' ' + units[i]
}


```

- 使用方式

```js
this.$store.dispatch('downloadTask/createDownloadTask', createTaskParams)
```

### 2.3 上传组件

```vue
<template>
  <div>
    <!-- 选择文件夹 -->
    <input
      v-if="isFolder"
      type="file"
      webkitdirectory
      multiple
      ref="folderInput"
      style="display: none"
      @change="handleFileChange"
    />
    <!-- 选择文件 -->
    <input
      v-else
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileChange"
      multiple
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "httpUploadButton",
  data: function () {
    return {
      isFolder: false,
      fileList: [],
      conParams: {},
      modulesApi: null,
    };
  },

  methods: {
    ...mapActions("uploadTasks", ["createUploadTask"]),

    async isDirectoryEmpty(dirHandle) {
      const entries = dirHandle.values();
      const first = await entries.next();
      return first.done;
    },

    async readDirectoryFiles(dirHandle, basePath) {
      const self = this;
      let files = [];

      try {
        const iterator = dirHandle.values();

        while (true) {
          const result = await iterator.next();
          if (result.done) break;

          const entry = result.value;

          if (entry.kind === "file") {
            const file = await entry.getFile();
            // 设置 webkitRelativePath 以兼容现有逻辑
            Object.defineProperty(file, "webkitRelativePath", {
              value: basePath + "/" + file.name,
              writable: true,
              configurable: true,
            });
            files.push(file);
          } else if (entry.kind === "directory") {
            const subFiles = await self.readDirectoryFiles(
              entry,
              basePath + "/" + entry.name
            );
            files = files.concat(subFiles);
          }
        }
      } catch (err) {
        console.error("读取目录文件失败:", err);
        throw err;
      }

      return files;
    },

    // 检查文件夹 如果是空文件，则获取 空文件files对象
    async checkDirectory() {
      try {
        const self = this;
        const dirHandle = await window.showDirectoryPicker();
        const isEmpty = await self.isDirectoryEmpty(dirHandle);

        if (isEmpty) {
          self.$message({
            type: "warning",
            message: "选中的文件夹为空，没有可上传的文件",
          });
          return [];
        }

        const allFiles = await self.readDirectoryFiles(
          dirHandle,
          dirHandle.name
        );

        if (allFiles.length === 0) {
          self.$message({
            type: "warning",
            message: "选中的文件夹中没有找到任何文件",
          });
          return [];
        }

        return self.$store.getters["uploadTasks/handleFiles"](allFiles);
      } catch (error) {
        console.log("error", error);
      }
    },

    async openFileDialog({ api = "", conParams, isFolder = false }) {
      this.conParams = conParams;
      this.isFolder = isFolder;
      this.modulesApi = api || this.$modules.uploadApi;

      // 兼容判断，支持showDirectoryPicker，则校验空文件夹，否则直接使用Input.click()
      const hasShowDirPickerAPI =
        typeof window.showDirectoryPicker === "function";
      if (isFolder && hasShowDirPickerAPI) {
        this.fileList = await this.checkDirectory();
        this.startUpload();
      }

      this.$nextTick(() => {
        if (isFolder && !hasShowDirPickerAPI) {
          this.$refs.folderInput.click(); // 降级操作
        }
        if (!isFolder) {
          this.$refs.fileInput.click();
        }
      });
    },

    // 文件选择处理
    handleFileChange(e) {
      const files = Array.from(e.target.files);
      this.fileList = this.$store.getters["uploadTasks/handleFiles"](files);
      this.startUpload();
    },

    async startUpload() {
      this.currentTaskId = this.$store.getters["uploadTasks/generateTaskId"]();
      await this.createUploadTask({
        uploadApi: this.modulesApi,
        conParams: this.conParams,
        files: this.fileList,
        taskId: this.currentTaskId,
      });
    },
  },
};
</script>
```

## 3. 性能测试脚本

- 主要功能：获取登录token后，使用目标服务器的相关登录配置批量创建guacamole的连接来测试性能

```js
//ssh : node server.https.js -t 【】   -host 【】 -port 【】 -b 【】 -devid 【】 -devname 【】 -m 【】  -u 【】 -p 【】 -n 【】
//X11 : node server.https.js -t X11   -host 11.22.33.44 -port 8080 -b 172.16.30.78:22 -m 500  -u ns5000test  -n 1
//RDP : node server.https.js -t RDP   -host【】 -port 【】 -b 【】 -devid 【】 -devname 【】 -m 【】  -u 【】 -p 【】 -batch 【】  -n 【】


var https = require('https');
var WebSocket = require('ws');
var encryption = require('./encryption')

var DEBUG_FLAG = true
var main = {
  loginUserName: 'operator-jx',
  loginPassword: 'a2ebec427b37a58688d6ac8ba16284de',
  cookie: '',
  uuidHc: [],//uuid和 i的对应关系
  wsHc: [],//WebSocket连接缓存
  params: null,
  host: '',//连接的服务器ip 【必传】
  port: '',//连接的服务器端口 【必传】
  devid: '',//资产id 【不传】
  devicename: '',//资产名称 【不传】
  username: '',//用户名 【必传】
  password: '',//密码 
  token: '',// token 【必传】
  writeml: [],//写入的命令
  typenum: '',
  t: '',//协议类型 【必传】
  n: '',//并发连接数 【必传】
  d: '',//目标服务器列表 【不传】
  b: '',//堡垒机ip地址和协议端口 【必传】
  c: 'ls',//ssh协议 默认发送的指令数据  暂时没用 【不传】
  m: '4000',//定时发送读写操作 时间间隔  默认4000ms 【必传】
  appName: '',// 应用发布名称
  dbType: '', // 数据库连接类型 MySQL
  supportedTool: '', //数据库连接工具 Navicat
  deviceCode: '', // 浏览器连接参数 chrome
  xcommand: '', // VNC连接参数 xclock
  writeIndexNums: [],//每个连接写命令当前索引
  readNs: [],//每个连接读操作计数
  _writeTimer: null,//全局写定时器
  _heartbeatTimer: null,
  _statusTimer: null,//状态打印定时器（每30s）
  connnum: 0,
  batchSize: 10, //ssh模式每批并发连接数
  _batchReady: 0, // 当前批次已就绪计数
  _batchCounted: [], // 标记每个连接索引是否已计入 _batchReady，防止重连漏计/重复

  init: function () {
    var that = this;
    var argParams = process.argv.splice(2);
    that.params = argParams;
    argParams.forEach(function (val, index, array) {
      if (index % 2 == 0) {
        var nextVal = that.params[index + 1];
        if (val == '-t') {
          that.t = nextVal;
        } else if (val == '-n') {
          that.n = nextVal;
        } else if (val == '-d') {
          that.d = nextVal;
        } else if (val == '-b') {
          that.b = nextVal;
        } else if (val == '-c') {
          that.c = nextVal;
        } else if (val == '-m') {
          if (nextVal >= 3000) that.m = nextVal;
        } else if (val == '-host') {
          that.host = nextVal;
        } else if (val == '-port') {
          that.port = nextVal;
        } else if (val == '-u') {
          that.username = nextVal;
        } else if (val == '-p') {
          that.password = nextVal;
        } else if (val == '-devid') {
          that.devid = nextVal;
        } else if (val == '-devname') {
          that.devicename = nextVal;
        } else if (val == '-appName') {
          that.appName = nextVal;
        } else if (val == '-batch') {
          var bs = parseInt(nextVal);
          if (bs > 0) that.batchSize = bs
        } else if (val === '-dbType') {
          that.dbType = nextVal
        } else if (val === '-tool') {
          that.supportedTool = nextVal
        } else if (val === '-devcode') {
          that.deviceCode = nextVal
        } else if (val === '-xcommand') {
          that.xcommand = nextVal
        }
        if (DEBUG_FLAG) console.log(val + ":     " + nextVal);
      }
    });
    
    // 注册进程退出信号，优雅关闭所有连接
    that.registerShutdown();

    // 使用HTTPS登录获取token
    that.loginByHttps();
  },

  // 注册进程信号监听，Ctrl+C 或 kill 时自动关闭所有 WS 连接
  registerShutdown: function () {
    var that = this;

    function gracefulShutdown(signal) {
      console.log('\n收到 ' + signal + ' 信号，开始关闭操作...');

      // 1. 清除所有定时器
      if (that._writeTimer)     { clearInterval(that._writeTimer);     that._writeTimer = null;     }
      if (that._heartbeatTimer) { clearInterval(that._heartbeatTimer); that._heartbeatTimer = null; }
      if (that._statusTimer)    { clearInterval(that._statusTimer);    that._statusTimer = null;    }

      // 2. 关闭所有 WebSocket 连接
      var closedCount = 0;
      for (var i = 0; i < that.wsHc.length; i++) {
        var ws = that.wsHc[i];
        if (ws && ws.readyState === WebSocket.OPEN) {
          // 发送 disconnect 告知服务端
          try { ws.send('11.disconnect;'); } catch (e) {}
          ws.close(1000, 'Client shutdown');
          closedCount++;
        } else if (ws) {
          try { ws.close(); } catch (e) {}
        }
      }

      var totalRecv = that.wsHc.reduce(function (sum, ws) { return sum + ((ws && ws._recvCount) || 0); }, 0)
      console.log('已关闭 ' + closedCount + ' 个活跃连接');
      console.log('总接收指令: ' + totalRecv);

      // 4. todo: 退出登录
      that.loginOutByHttps()

      // 5. 退出进程
      setTimeout(function () { 
        // 打印最终状态
        that.printWsStatus();
        console.log('进程退出');
        process.exit(0);
      }, 500);
    }

    process.on('SIGINT', function () { gracefulShutdown('SIGINT'); });
    process.on('SIGTERM', function () { gracefulShutdown('SIGTERM'); });
    // Windows 兼容
    if (process.platform === 'win32') {
      var rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
      rl.on('SIGINT', function () {
        process.emit('SIGINT');
      });
    }
  },

  // 退出登录
  loginOutByHttps: function () {
    var that = this;

    var postData = querystring.stringify({
      token: that.token
    })

    var options = {
      hostname: that.host,
      port: that.port,
      path: '/api/login/loginout',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json',
        'Cookie': that.cookie
      },
      rejectUnauthorized: false  // 自签名证书允许跳过验证
    };

    var res = https.request(options, function (res) {
      console.log('已退出登录。。。');
      
    });
    res.on('error', (error) => {
      console.log('请求出错：', error.message);
    })
    res.write(postData);
    res.end();
  },

  // HTTPS登录获取token
  loginByHttps: function () {
    var that = this;
    var loginParams = {
      username: that.loginUserName,
      tokenencryption: encryption.encode64(that.loginUserName + ';' + Math.round(new Date().getTime() / 1000)),
      password: that.loginPassword
    };
    var postData = JSON.stringify(loginParams);
    var options = {
      hostname: that.host,
      port: that.port,
      path: '/api/login/login?' + new URLSearchParams(loginParams),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      rejectUnauthorized: false  // 自签名证书允许跳过验证
    };

    var req = https.request(options, function (res) {

      var setCookies = res.headers['set-cookie']
      if (setCookies) {
        var cookies = Array.isArray(setCookies) ? setCookies : [setCookies];
        that.cookie = cookies.map(function(c) {
          return c.split(';')[0];
        }).join(';')
      }

      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        try {
          var logindata = JSON.parse(body);
          if (DEBUG_FLAG) console.log('登录响应 code:', logindata.code);
          if (logindata.code === 200 && logindata.data && logindata.data.params && logindata.data.params.user) {
            that.token = logindata.data.params.user.token;
            if (DEBUG_FLAG) console.log('token ===> ' + that.token);
            that.nextHandler();
          } else {
            if (DEBUG_FLAG) console.log('登录失败...:', logindata.data ? logindata.data.message : 'unknown');
          }
        } catch (e) {
          console.error('解析登录响应失败:', e);
        }
      });
    });

    req.on('error', function (e) {
      console.error('登录请求错误:', e);
    });

    req.write(postData);
    req.end();
  },

  nextHandler: function () {
    var that = this;

    // 启动定期状态打印（每30秒）
    that.startStatusTimer();

    // SSH 命令序列
    var sshCommands = {
      "0": "3.nop;", "1": "3.nop;", "2": "3.nop;",
      "3": "3.key,3.119,1.1;",
      "4": "3.ack,1.1,2.OK,1.0;",
      "5": "3.key,3.119,1.0;",
      "6": "3.key,3.115,1.1;",
      "7": "3.ack,1.1,2.OK,1.0;",
      "8": "3.key,3.115,1.0;",
      "9": "3.nop;",
      "10": "3.key,5.65293,1.1;",
      "11": "3.ack,1.1,2.OK,1.0;",
      "12": "3.key,5.65293,1.0;",
      "13": "3.nop;",
      "14": "3.key,3.112,1.1;",
      "15": "3.ack,1.1,2.OK,1.0;",
      "16": "3.key,3.112,1.0;",
      "17": "3.nop;",
      "18": "3.key,3.119,1.1;",
      "19": "3.ack,1.1,2.OK,1.0;",
      "20": "3.key,3.119,1.0;",
      "21": "3.nop;",
      "22": "3.key,3.115,1.1;",
      "23": "3.ack,1.1,2.OK,1.0;",
      "24": "3.key,3.115,1.0;",
      "25": "3.nop;",
      "26": "3.key,5.65293,1.1;",
      "27": "3.ack,1.1,2.OK,1.0;",
      "28": "3.key,5.65293,1.0;",
      "29": "3.nop;", "30": "3.nop;", "31": "3.nop;", "32": "3.nop;", "33": "3.nop;"
    };

    // 图形协议（RDP/X11/VNC/APP）命令序列
    var guiCommands = {
      "0": "3.nop;", "1": "3.nop;", "2": "3.nop;", "3": "3.nop;",
      "4": "3.nop;", "6": "3.nop;", "7": "3.nop;", "8": "3.nop;",
      "9": "3.ack,1.1,2.OK,1.0;",
      "10": "3.nop;",
      "11": "5.mouse,3.635,3.235,1.0;",
      "12": "3.nop;", "13": "3.nop;", "14": "3.nop;",
      "15": "5.mouse,3.517,3.220,1.4;",
      "16": "5.mouse,3.517,3.220,1.0;",
      "17": "5.mouse,3.407,3.220,1.0;",
      "18": "5.mouse,3.407,3.220,1.1;",
      "19": "5.mouse,3.407,3.220,1.0;",
      "20": "5.mouse,3.517,3.220,1.4;",
      "21": "5.mouse,3.517,3.220,1.0;",
      "22": "5.mouse,3.407,3.220,1.0;",
      "23": "5.mouse,3.407,3.220,1.1;",
      "24": "5.mouse,3.407,3.220,1.0;",
      "25": "5.mouse,3.517,3.220,1.4;",
      "26": "5.mouse,3.517,3.220,1.0;",
      "27": "5.mouse,3.407,3.220,1.0;",
      "28": "5.mouse,3.407,3.220,1.1;",
      "29": "5.mouse,3.407,3.220,1.0;",
      "30": "3.nop;", "31": "3.nop;", "32": "3.nop;", "33": "3.nop;"
    };

    if (that.t == 'SSH' || that.t == 'ssh') {
      that.writeml = sshCommands;
      if (DEBUG_FLAG) console.log("protocol ssh begin...");
      that.ssh();
    } else if (that.t == 'RDP' || that.t == 'rdp') {
      that.writeml = guiCommands;
      if (DEBUG_FLAG) console.log("protocol RDP begin...");
      that.ssh();
    } else if (that.t == 'X11' || that.t == 'x11') {
      that.writeml = guiCommands;
      if (DEBUG_FLAG) console.log("protocol X11 begin...");
      that.x11();
    } else if (that.t == 'vnc' || that.t == 'VNC') {
      that.writeml = guiCommands;
      if (DEBUG_FLAG) console.log("protocol VNC begin...");
      that.ssh();
    } else if (that.t == 'app' || that.t == 'APP') {
      that.writeml = guiCommands;
      if (DEBUG_FLAG) console.log("protocol APP begin...");
      that.ssh();
    } else {
      if (DEBUG_FLAG) console.log("no protocol...");
      that.writeml = sshCommands;
      that.ssh();
    }
  },

  getParams: function (type) {
    var that = this;

    if (type == 'conn') {
      return {
        url: '/tunnel',
        method: '',
        time: 'no',
        type: 4,
        params: {
          // dpi: '96',
          // width: '1280',
          // height: '720',
          devicename: that.devicename,
          devid: that.devid,
          ip: that.b.split(":")[0],
          password: that.password,
          port: that.b.split(":")[1],
          protocol: that.t,
          username: that.username,
          uuid: that.generateUUID(),
          indexnum: '',
          token: that.token,
          remoteAppName: that.appName,
          query: 'performtest',
          dbType: that.dbType,
          supportedTool: that.supportedTool,
          deviceCode: that.deviceCode,
          xcommand: that.xcommand
        }
      };
    } else if (type == 'read') {
      return {
        url: '/tunnel',
        method: '',
        time: 'no',
        type: 4,
        params: {
          uuid: '',
          token: that.token,
          query: ''
        }
      };
    } else if (type == 'write') {
      return {
        url: '/tunnel',
        method: '',
        time: 'no',
        type: 4,
        params: {
          content: '',
          uuid: '',
          token: that.token,
          query: ''
        }
      };
    }
  },

  // 并发连接（X11协议）
  x11: function () {
    var that = this;
    that.typenum = 'x11';
    for (var i = 0; i < that.n; i++) {
      that.connectWs(i);
    }
  },

  // 串行连接（SSH/RDP/VNC/APP）
  ssh: function () {
    var that = this;
    that.typenum = 'ssh';
    // 批量计数
    that._batchReady = 0
    var count = Math.min(that.batchSize, that.n)
    for (let i = 0; i < count; i++) {
      that.connectWs(that.connnum);
      that.connnum++
    }
    if(that.batchSize > 1) console.log(' 第一批启动: ' + count + '个连接, 下批起始=' + that.connnum);
  },

  // 批次推进：连接就绪时调用（connectWs 和 reconnectWs 共用）
  // 用 _batchCounted 数组防止同一个索引重连后重复计数或漏计
  _tryAdvanceBatch: function (i) {
    var that = this;
    if (that.typenum !== 'ssh' || that.connnum >= that.n) return;
    if (that._batchCounted[i]) return;  // 已计数过，跳过
    that._batchCounted[i] = true;
    that._batchReady++;
    var remaining = that.n - that.connnum;
    if (that._batchReady >= that.batchSize || remaining <= 0) {
      that._batchReady = 0;
      var nextCount = Math.min(that.batchSize, remaining);
      if (that.batchSize > 1) console.log('========= 批次就绪，启动下一批: ' + nextCount + '个, 起始=' + that.connnum + ', 剩余=' + remaining + ' =========');
      var delay = 0;
      if (that.t == 'vnc' || that.t == 'VNC') delay = 3000;
      else if (that.t == 'rdp' || that.t == 'RDP') delay = 2000;
      for (var k = 0; k < nextCount; k++) {
        (function (cn, d) {
          setTimeout(function () { that.connectWs(cn); }, d);
        })(that.connnum, delay * k);
        that.connnum++;
      }
    }
  },

  // 创建WebSocket连接并发送连接请求
  connectWs: function (i) {
    var that = this;
    var uuid = that.generateUUID();
    that.uuidHc[i] = uuid;

    var params = that.getParams('conn').params;
    var guacParams = new URLSearchParams(params);
    var wsUrl = 'wss://' + that.host + ':' + that.port + '/web-socket/tunnel?' + guacParams;

    // if (DEBUG_FLAG) console.log('WebSocket连接: ' + wsUrl + ', index=' + i);

    var wsOptions = {
      rejectUnauthorized: false
    }
    if (that.cookie) {
      wsOptions.headers = {
        'Cookie': that.cookie
      }
    }
    var ws = new WebSocket(wsUrl, wsOptions);

    ws.on('open', function () {
      // if (DEBUG_FLAG) console.log(i + ': WebSocket连接已建立');
    });

    ws.connSuccess = false
    ws._rwinited = false // 读写初始化标记，确保只执行一次
    ws._recvCount = 0  // 接收指令计数，用于正确 ack
    ws._errorCount = 0     // 错误计数
    ws._lastError = ''     // 最后一次错误信息
    ws._createdAt = Date.now()
    ws._syncPending = false    // sync 响应去重：是否已有待发送的 sync
    ws._lastSyncTs = ''        // 最新 sync 时间戳，延迟发送用
    ws._bufferedLimit = 65536  // 发送缓冲区上限（64KB），超过则丢 sync

    // 连接超时检测（15秒未进入就绪状态则重连）
    // 注意：只检查 _rwinited，不检查 connSuccess，避免 D 状态（已确认但未初始化）卡死
    ws._connTimer = setTimeout(function () {
      if (!ws._rwinited) {
        console.log(i + ': 连接超时(15s)，_rwinited=' + ws._rwinited + ' connSuccess=' + ws.connSuccess + '，尝试重连..');
        that.reconnectWs(i);
      }
    }, 15000);

    ws.on('message', function (data) {
      var msgStr = data.toString();
      // console.log(i + ': 收到消息', msgStr);

      // 解析 Guacamole 协议指令
      var instructions = that.parseInstructions(msgStr);
      
      ws._recvCount += instructions.length;

      // 判断连接是否成功
      if (msgStr.indexOf(params.uuid) >= 0) {
        ws.connSuccess = true;
        // 不清 _connTimer：此时 _rwinited 可能仍为 false（D 状态），需要超时兜底
      }

      // 逐条处理指令
      for (var j = 0; j < instructions.length; j++) {
        var inst = instructions[j];
        var opcode = inst.opcode;
        var args = inst.args;

        switch (opcode) {

          // ===== 连接管理 =====
          case 'name':
            if (!ws.connSuccess) { ws.connSuccess = true; }
            break;

          case 'disconnect':
            console.log(i + ': 服务端主动断开');
            break;

          case 'error':
            console.log('error=====msgStr', msgStr);
            console.error(i + ': 服务端错误: ' + args[0] + ' code=' + args[1]);
            break;

          // ===== 帧同步（核心） =====
          // 服务端每帧结束时发送 sync(timestamp)，客户端只需回传最新的时间戳
          // 优化：节流 + 背压检测，避免大并发时 sync 响应积压
          case 'sync':
            if (args.length > 0 && ws.connSuccess) {
              ws._lastSyncTs = args[0];
              // 背压检测：发送缓冲区超过阈值时丢弃 sync 响应，避免内存积压
              if (!ws._syncPending && (ws.bufferedAmount || 0) < ws._bufferedLimit) {
                ws._syncPending = true;
                // 用 setImmediate 合并同一个事件循环内的多次 sync，只发最后一次
                setImmediate(function () {
                  if (ws.readyState === WebSocket.OPEN && ws._syncPending && ws._lastSyncTs) {
                    try { ws.send('4.sync,' + (String(ws._lastSyncTs).length) + '.' + ws._lastSyncTs + ';'); } catch (e) {}
                    ws._syncPending = false;
                  }
                });
              }
            }
            // 首次 sync 视为连接就绪
            if (ws.connSuccess && !ws._rwinited) {
              ws._rwinited = true;
              // 连接真正就绪，清除超时定时器
              if (ws._connTimer) { clearTimeout(ws._connTimer); ws._connTimer = null; }
              if (DEBUG_FLAG) console.log(i + ': 连接就绪，启动写操作..');
              that.startHeartbeat();
              that.writemsg(i);
              that._tryAdvanceBatch(i);
            }
            break;

          // ===== 流管理（文件/剪贴板/音视频等） =====
          case 'file':
          case 'audio':
          case 'video':
          case 'img':
          case 'pipe':
          case 'clipboard':
          case 'argv':
          case 'body':
            if (args.length > 0) {
              ws._streams = ws._streams || {};
              ws._streams[args[0]] = opcode;
            }
            break;

          case 'blob':
            // 流数据块，压测只需接收
            break;

          case 'end':
            // 流结束 → 发送 ack 确认
            if (args.length > 0 && ws._streams && ws._streams[args[0]]) {
              that.sendMessage(i, 'ack', parseInt(args[0]), 'OK', 0);
              delete ws._streams[args[0]];
            }
            break;

          // ===== 其他（画面渲染指令，压测只需统计） =====
          default:
            // png, jpeg, size, rect, copy, cfill, cursor, mouse, arc, curve,
            // line, start, move, close, dispose, distort, identity, lfill,
            // lstroke, nest, pop, push, reset, set, shade, transfer, transform, undefine 等
            break;
        }
      }
    });

    ws.on('error', function (err) {
      ws._errorCount++;
      ws._lastError = err.message || String(err);
      console.error(i + ": WebSocket错误:", err.message);
      that.reconnectWs(i);
    });

    ws.on('close', function () {
      // if (DEBUG_FLAG) console.log(i + ": WebSocket连接关闭");
    });

    that.wsHc[i] = ws;
    that.startHeartbeat()
  },

  // 初始化连接读写（记录索引并启动全局定时器）
  writemsg: function (i) {
    this.writeIndexNums[i] = 0;
    this.startWriteTimer();
  },

  startHeartbeat: function () {
    if (this._heartbeatTimer) return
    var that = this
    that._heartbeatTimer = setInterval(function () {
      for (var i = 0; i < that.wsHc.length; i++) {
        var ws = that.wsHc[i];
        if (!ws || ws.readyState !== WebSocket.OPEN) continue;
        ws.send('3.nop;');
      }
    }, 5000)
  },

  // 全局写定时器（单一定时器轮询所有活跃连接）
  // 只发送 key/mouse/nop，ack 由 on('message') 事件驱动
  startWriteTimer: function () {
    if (this._writeTimer) return;
    var that = this;
    that._writeTimer = setInterval(function () {
      
      for (var i = 0; i < that.wsHc.length; i++) {
        var ws = that.wsHc[i];
        if (!ws || ws.readyState !== WebSocket.OPEN) continue;

        var idx = that.writeIndexNums[i] || 0;
        var content;
        if (idx < 33) {
          content = that.writeml[idx + ""] || '3.nop;';
          idx++;
        } else {
          idx = 0;
          content = that.writeml["0"] || '3.nop;';
          idx++;
        }
        that.writeIndexNums[i] = idx;
        // 跳过 ack 指令（ack 现在由 on('message') 根据流结束事件自动发送）
        if (content.indexOf('ack,') > 0) {
          ws.send('3.nop;')
        } else {
          ws.send(content);
        }
      }
    }, that.m);
  },

  // 所有连接关闭时停止全局定时器
  stopTimersIfIdle: function () {
    var allClosed = this.wsHc.every(function (ws) {
      return !ws || ws.readyState !== WebSocket.OPEN;
    });
    if (allClosed) {
      if (this._writeTimer) { clearInterval(this._writeTimer); this._writeTimer = null; }
      if (this._heartbeatTimer) { clearInterval(this._heartbeatTimer); this._heartbeatTimer = null; }
      if (this._statusTimer) { clearInterval(this._statusTimer);     this._statusTimer = null;     }
    }
  },

   // 打印所有 WebSocket 连接状态
  printWsStatus: function () {
    var that = this;
    var now = Date.now();
    var total = that.wsHc.length;

    // 分类统计
    var stats = {
      connecting: 0,   // readyState=0, 正在建连
      open: 0,         // readyState=1, 连接已建立
      closing: 0,      // readyState=2
      closed: 0,       // readyState=3
      nullSlot: 0,     // wsHc[i] 为空
      confirmed: 0,    // connSuccess=true, 服务端确认
      rwReady: 0,      // _rwinited=true, 读写就绪
      hasError: 0,     // _errorCount > 0
      reconnect: 0     // connSuccess=false 但 readyState=1（异常状态）
    };

    var lines = [];
    lines.push('');
    lines.push('========================= WS连接状态统计 (总计: ' + total + ') ==========================');

    for (var i = 0; i < that.wsHc.length; i++) {
      var ws = that.wsHc[i];
      if (!ws) {
        stats.nullSlot++;
        continue;
      }

      var rs = ws.readyState;
      var stateLabel;
      var stateSym;
      if (rs === undefined || rs === null) {
        stateLabel = 'null';
        stateSym = 'A'; // 未知
      } else if (rs === WebSocket.CONNECTING) {
        stateLabel = 'CONNECTING';
        stateSym = 'B'; // 连接中
        stats.connecting++;
      } else if (rs === WebSocket.OPEN) {
        stateLabel = 'OPEN';
        stats.open++;
        if (!ws.connSuccess) {
          stateSym = 'C';  // 已连接但服务端未确认
          stats.reconnect++;
        } else if (!ws._rwinited) {
          stateSym = 'D';  // 已确认但读写未初始化
        } else {
          stateSym = 'S'; // 成功
          stats.rwReady++;
        }
        if (ws.connSuccess) stats.confirmed++;
      } else if (rs === WebSocket.CLOSING) {
        stateLabel = 'CLOSING';
        stateSym = 'F';
        stats.closing++;
      } else if (rs === WebSocket.CLOSED) {
        stateLabel = 'CLOSED';
        stateSym = 'G';
        stats.closed++;
      } else {
        stateLabel = 'UNKNOWN(' + rs + ')';
        stateSym = 'N';
      }

      if (ws._errorCount > 0) stats.hasError++;

      // 连接存活时间
      var aliveSec = ws._createdAt ? Math.floor((now - ws._createdAt) / 1000) : 0;
      var aliveStr = aliveSec >= 3600
        ? Math.floor(aliveSec / 3600) + 'h' + Math.floor((aliveSec % 3600) / 60) + 'm'
        : aliveSec >= 60
          ? Math.floor(aliveSec / 60) + 'm' + (aliveSec % 60) + 's'
          : aliveSec + 's';

      // 拼接单行信息(筛选异常数据)
      var skip = (stateSym === 'S' && ws._errorCount === 0) || stateSym === 'G'
      if(!skip) {
        var line = stateSym + ' [' + i + '] ' + stateLabel
          + ' | 存活:' + aliveStr
          + ' | 确认:' + (ws.connSuccess ? 'Y' : 'N')
          + ' | 读写:' + (ws._rwinited ? 'Y' : 'N')
          + ' | 接收:' + (ws._recvCount || 0);
        if (ws._errorCount > 0) {
          line += ' | 错误(' + ws._errorCount + '):' + (ws._lastError ? ws._lastError.substring(0, 40) : '');
        }
        lines.push(line);
      }
    }

    // 没有异常，提示
    var abnormalCount = stats.connecting + (stats.open - stats.rwReady) + stats.closing + stats.closed + stats.hasError + stats.nullSlot;
    if (abnormalCount === 0) {
      lines.push('    所有连接正常！')
    }

    // 汇总
    lines.push('-----------------------------------------------------------------------------');
    lines.push('汇总:'
      + ' CONNECTING=' + stats.connecting
      + ' OPEN=' + stats.open
      + ' CLOSING=' + stats.closing
      + ' CLOSED=' + stats.closed
      + ' 空槽=' + stats.nullSlot);
    lines.push('就绪:'
      + ' 服务端确认=' + stats.confirmed
      + ' 读写就绪=' + stats.rwReady
      + ' 错误连接=' + stats.hasError
      + ' 异常待确认=' + stats.reconnect);

    // 内存使用情况
    var men = process.memoryUsage();
    function toMB(bytes) { return (bytes / 1024 / 1024).toFixed(1) + 'MB'}
    lines.push('-----------------------------------------------------------------------------');
    lines.push('内存：'
      + ' 进程总占用=' + toMB(men.rss)
      + ' 堆总量=' +  toMB(men.heapTotal)
      + ' 堆已用=' +  toMB(men.heapUsed)
      + ' 堆外内存=' +  toMB(men.external)); // rss：进程总占用； External： 网络收发越频繁越大
    var heapUsage = men.heapTotal > 0 ? (men.heapUsed / men.heapTotal *100).toFixed(1) : '0';
    lines.push('堆使用率：' + heapUsage + '%')

    lines.push('=============================================================================');
    console.log(lines.join('\n'));
  },

  // 启动定期状态打印（每30秒）
  startStatusTimer: function () {
    if (this._statusTimer) return;
    var that = this;
    // that.printWsStatus('');  // 立即打印一次
    that._statusTimer = setInterval(function () {
      that.printWsStatus();
    }, 30000);
  },

  setMessage: function (connIndex) {
    if (arguments.length < 2) return ''
    var that = this;
    var ws = that.wsHc[connIndex];
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    function encodeElement(value) {
      var str = String(value);
      return str.length + '.' + str
    }

    var message = encodeElement(arguments[1]);
    for (let i = 2; i < arguments.length; i++) {
      message += ',' + encodeElement(arguments[i])
    }
    message += ';';

    ws.send(message)
    return message
  },

  // 重新连接
  reconnectWs: function (i) {
    var that = this;
    var uuid = that.generateUUID();
    that.uuidHc[i] = uuid;

    // 关闭旧连接
    if (that.wsHc[i]) {
      try { that.wsHc[i].close(); } catch (e) { }
    }

    var params = that.getParams('conn').params;
    var guacParams = new URLSearchParams(params);
    var wsUrl = 'wss://' + that.host + ':' + that.port + '/web-socket/tunnel?' + guacParams;

     var wsOptions = {
      rejectUnauthorized: false
    }
    if (that.cookie) {
      wsOptions.headers = {
        'Cookie': that.cookie
      }
    }
    var ws = new WebSocket(wsUrl, wsOptions);

    ws.connSuccess = false
    ws._rwinited = false   // 读写初始化标记，确保只执行一次
    ws._recvCount = 0      // 接收指令计数，用于正确 ack
    ws._errorCount = 0     // 错误计数
    ws._lastError = ''     // 最后一次错误信息
    ws._createdAt = Date.now()
    ws._syncPending = false
    ws._lastSyncTs = ''
    ws._bufferedLimit = 65536
    ws.on('open', function () {
      console.log(i + ': WebSocket重连已建立');
    });

    // 连接超时检测（只检查 _rwinited，避免 D 状态卡死）
    ws._connTimer = setTimeout(function () {
      if (!ws._rwinited) {
        console.log(i + ': 重连超时(15s)，再次尝试..');
        that.reconnectWs(i);
      }
    }, 15000);

    ws.on('message', function (data) {
      var msgStr = data.toString();

      var instructions = that.parseInstructions(msgStr);
      ws._recvCount += instructions.length;

      if (msgStr.indexOf(params.uuid) >= 0) {
        ws.connSuccess = true;
        // 不清 _connTimer：等 sync 到来时在 _rwinited 分支统一清除
      }

      for (var j = 0; j < instructions.length; j++) {
        var inst = instructions[j];
        var opcode = inst.opcode;
        var args = inst.args;

        switch (opcode) {

          case 'name':
            if (!ws.connSuccess) { ws.connSuccess = true; }
            break;

          case 'sync':
            if (args.length > 0 && ws.connSuccess) {
              ws._lastSyncTs = args[0];
              if (!ws._syncPending && (ws.bufferedAmount || 0) < ws._bufferedLimit) {
                ws._syncPending = true;
                setImmediate(function () {
                  if (ws.readyState === WebSocket.OPEN && ws._syncPending && ws._lastSyncTs) {
                    try { ws.send('4.sync,' + (String(ws._lastSyncTs).length) + '.' + ws._lastSyncTs + ';'); } catch (e) {}
                    ws._syncPending = false;
                  }
                });
              }
            }
            if (ws.connSuccess && !ws._rwinited) {
              ws._rwinited = true;
              if (ws._connTimer) { clearTimeout(ws._connTimer); ws._connTimer = null; }
              console.log(i + ': 重连就绪，启动写操作..');
              that.wsHc[i] = ws;
              that.startHeartbeat();
              that.writemsg(i);
              that._tryAdvanceBatch(i);
            }
            break;

          case 'file': case 'audio': case 'video':
          case 'img': case 'pipe': case 'clipboard':
          case 'argv': case 'body':
            if (args.length > 0) {
              ws._streams = ws._streams || {};
              ws._streams[args[0]] = opcode;
            }
            break;

          case 'end':
            if (args.length > 0 && ws._streams && ws._streams[args[0]]) {
              that.sendMessage(i, 'ack', parseInt(args[0]), 'OK', 0);
              delete ws._streams[args[0]];
            }
            break;
        }
      }
    });

    ws.on('error', function (err) {
      ws._errorCount++;
      ws._lastError = err.message || String(err);
      console.error(i + ": 重连WebSocket错误:", err.message);
    });

    ws.on('close', function () {
      console.log(i + ": 重连WebSocket关闭");
      ws.connSuccess = false;
      (function (index) {
        setTimeout(function () { that.reconnectWs(index); }, 5000);
      })(i);
    });

    that.wsHc[i] = ws;
  },

  // Guacamole 协议编码辅助：sendMessage(connIndex, 'key', 119, 1) → ws.send("3.key,3.119,1.1;")
  sendMessage: function (connIndex) {
    if (arguments.length < 2) return '';
    var that = this;
    var ws = that.wsHc[connIndex];
    if (!ws || ws.readyState !== WebSocket.OPEN) return '';

    // 编码每个参数为 "长度.值"
    function encodeElement(value) {
      var str = String(value);
      return str.length + '.' + str;
    }

    var message = encodeElement(arguments[1]);        // opcode
    for (var i = 2; i < arguments.length; i++) {
      message += ',' + encodeElement(arguments[i]);
    }
    message += ';';

    ws.send(message);
    return message;
  },


  // Guacamole 协议指令解析器
  // "3.sync,13.1750836400000;3.nop;" → [{opcode:"sync",args:["1750836400000"]}, {opcode:"nop",args:[]}]
  parseInstructions: function (raw) {
    var result = [];
    var parts = raw.split(';');
    for (var i = 0; i < parts.length; i++) {
      var inst = parts[i].trim();
      if (!inst) continue;
      var elements = [];
      var pos = 0;
      while (pos < inst.length) {
        var dotIdx = inst.indexOf('.', pos);
        if (dotIdx < 0) break;
        var len = parseInt(inst.substring(pos, dotIdx));
        if (isNaN(len)) break;
        pos = dotIdx + 1;
        var value = inst.substring(pos, pos + len);
        elements.push(value);
        pos += len;
        if (pos < inst.length && inst[pos] === ',') pos++;
      }
      if (elements.length > 0) {
        result.push({ opcode: elements[0], args: elements.slice(1) });
      }
    }
    return result;
  },

  // 生成UUID
  generateUUID: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
}

main.init();
module.exports = main;
```
