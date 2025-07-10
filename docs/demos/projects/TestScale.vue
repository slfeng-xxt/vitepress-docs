<script setup>
import { ref } from 'vue'
import ScaleIndeicator from './components/ScaleIndeicator.vue';

const scale = ref(5000)
</script>

<template>
    <div>地图缩放刻度指示器效果</div>
    <div class="scale-container">
        <ScaleIndeicator :current="scale"></ScaleIndeicator>
        <input type="range" v-model="scale" min="0" max="20000" step="100">
    </div>
</template>

<style scoped>
.scale-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
</style>