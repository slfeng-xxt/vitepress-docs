<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
})

const config = {
  height: 28,
  width: 19,
}

const digitList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
// 无限滚动：只克隆结尾的0：['0','1',...,'9', '0']
const scrollList = [...digitList, '0']
const currentIndex = ref(digitList.indexOf(props.value)) // 初始化当前索引

watch(
  () => props.value,
  (newVal) => {
    const idx = digitList.indexOf(newVal)
    if (idx !== -1) {
      // 特殊处理：从9变到0时，直接滚动到克隆的0（索引10）
      if (newVal === '0' && currentIndex.value === 9) {
        currentIndex.value = 10
      } else {
        // 正常情况：滚动到对应位置
        currentIndex.value = idx
      }
    }
  },
)

// 滚动完成后处理无限循环
const handleChangeCurrentIndex = () => {
  // 如果滚动到了克隆的0（索引10），瞬间跳转到真实的0（索引0）
  if (currentIndex.value === 10) {
    currentIndex.value = 0
  }
}

// 计算样式
const digitStyle = computed(() => ({
  height: `${config.height}px`,
  width: `${config.width}px`,
}))

const listStyle = computed(() => ({
  height: `${scrollList.length * config.height}px`,
  transform: `translateY(-${currentIndex.value * config.height}px)`,
  transition:
    currentIndex.value === 0 && props.value === '0'
      ? 'none'
      : 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
}))

const spanStyle = computed(() => ({
  height: `${config.height}px`,
  lineHeight: `${config.height}px`,
}))
</script>

<template>
  <div class="digit-roller" :style="digitStyle">
    <div class="digit-roller__list" :style="listStyle" @transitionend="handleChangeCurrentIndex">
      <span v-for="(d, index) in scrollList" :key="index" :style="spanStyle">{{ d }}</span>
    </div>
  </div>
</template>

<style scoped>
.digit-roller {
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
}
.digit-roller__list {
  display: flex;
  flex-direction: column;
}
.digit-roller__list span {
  display: block;
  text-align: center;
}
</style>