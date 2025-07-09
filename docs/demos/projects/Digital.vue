<script setup>
import { ref, onUnmounted } from 'vue'
import DigitalAmount from './components/DigitalAmount.vue'

const amount = ref(24637289009.33)
// 每秒增加
const interval = setInterval(() => {
    amount.value += 1.1
}, 1000)

onUnmounted(() => {
    clearInterval(interval)
})
</script>

<template>
   <div class="digital-box">
    <DigitalAmount :value="amount" />
   </div>
</template>

<style scoped>
.digital-box {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #000;
}
</style>