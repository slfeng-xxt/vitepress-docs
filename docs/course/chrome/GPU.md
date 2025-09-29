# Chrome GPU

基于 [Chrome GPU 加速合成技术文档](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/)，AI总结如下：

## Chrome GPU 加速合成技术概述

### 核心目的

- **硬件加速渲染**：利用 GPU 替代传统 CPU 渲染，提升网页性能并降低功耗
- **并行处理**：CPU 和 GPU 同时工作，构建高效图形管线

### 主要优势

1. **高效合成**：GPU 专为大量像素操作设计，比 CPU 更高效
2. **避免昂贵回读**：已在 GPU 上的内容（视频、Canvas2D、WebGL）无需回读
3. **并行处理**：CPU 和 GPU 可同时工作

### 渲染架构层次

#### 1. DOM 树 → RenderObject 树

- DOM 节点对应 RenderObject，形成渲染树
- RenderObject 负责绘制节点内容到显示表面

#### 2. RenderObject → RenderLayer

- 共享相同坐标空间的 RenderObject 属于同一 RenderLayer
- 创建新 RenderLayer 的条件：
  - 根对象
  - 有 CSS 定位属性（relative、absolute、transform）
  - 透明元素
  - 有溢出、遮罩或滤镜
  - Canvas/Video 元素

#### 3. RenderLayer → GraphicsLayer（合成层）

- 只有满足特定条件的 RenderLayer 才获得自己的合成层：
  - 3D 或透视变换
  - 视频加速解码
  - Canvas 3D/加速 2D 上下文
  - CSS 动画（透明度、变换）
  - 加速 CSS 滤镜
  - 有合成层后代或兄弟层

#### 4. 层压缩（Layer Squashing）

- 防止"层爆炸"：多个重叠层被压缩到单一后备存储
- 避免过多合成层导致的内存和性能问题

### 合成器架构

#### 线程化合成

- **主线程**：处理 JavaScript、样式计算、布局
- **合成线程**：处理层合成、动画
- **光栅化线程**：处理位图生成

#### 硬件 vs 软件渲染

- **硬件路径**：使用 GPU 进行合成
- **软件路径**：CPU 后备方案，用于不支持 GPU 的设备

### 关键技术特性

#### 1. 纹理四边形（Texture Quads）

- 将页面内容渲染为 GPU 纹理
- 通过简单四边形模型进行合成

#### 2. 双缓冲

- 前台缓冲区：当前显示
- 后台缓冲区：正在渲染
- 通过 swapbuffers 切换

#### 3. 帧缓冲对象（FBO）

- 允许离屏渲染到纹理
- 支持 WebGL 等内容独立渲染

### 调试和开发工具

- `--show-composited-layer-borders`：显示合成层边框
- `about:flags`：启用线程化合成、线程化动画等实验性功能
- `-webkit-transform:translateZ(0)`：强制启用合成器

### 内存和性能考虑

- 合成层消耗 VRAM 内存
- 需要平衡层数量和性能
- 软件渲染器作为 GPU 不可用时的后备方案

这个架构使得 Chrome 能够高效处理复杂的网页内容，特别是包含动画、变换和 3D 效果的页面，同时保持良好的性能和用户体验。
