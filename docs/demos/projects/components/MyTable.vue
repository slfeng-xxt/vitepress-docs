<template>
    <Table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    row-key="key"
    bordered
  />
</template>

<script setup>
import { ref } from 'vue'
import { Table } from 'ant-design-vue'
// 表头
const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name', customCell: customCell },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '地址', dataIndex: 'address', key: 'address' }
]

// 数据
const data = ref([
  { key: 1, name: '张三', age: 32, address: '北京' },
  { key: 2, name: '张三', age: 33, address: '上海' },
  { key: 3, name: '李四', age: 34, address: '广州' },
  { key: 4, name: '王五', age: 35, address: '深圳' }
])

// 计算每一行的 rowSpan
function getRowSpan(data, dataIndex) {
  const spanArr = []
  let pos = 0
  data.forEach((item, i) => {
    if (i === 0) {
      spanArr.push(1)
      pos = 0
    } else if (item[dataIndex] === data[i - 1][dataIndex]) {
      spanArr[pos] += 1
      spanArr.push(0)
    } else {
      spanArr.push(1)
      pos = i
    }
  })
  
  return spanArr
}

const nameRowSpanArr = getRowSpan(data.value, 'name')

// 自定义单元格
function customCell(_, rowIndex) {
  return {
    rowSpan: nameRowSpanArr[rowIndex]
  }
}
</script>
