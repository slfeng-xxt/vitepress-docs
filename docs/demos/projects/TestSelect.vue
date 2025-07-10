<script setup>
import { ref } from 'vue'
import MySelect from './components/MySelect.vue'
const options = [
    {
        label: '选项1',
        value: '1'
    },
    {
        label: '选项2',
        value: '2'
    },
    {
        label: '选项3',
        value: '3'
    }
]
const selectValue = ref('1')
const handleChange = (val) => {
    selectValue.value = val
}
</script>

<template>
    <div>组件应用：</div>
    <MySelect :options="options" placeholder="请选择" v-model:value="selectValue" @change="handleChange"/>
    <div>当前值：{{ options.find(item => item.value === selectValue)?.label}}</div>
</template>