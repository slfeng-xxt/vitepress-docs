<script setup>
import { computed } from 'vue'
import DigitalDigit from './DigitalDigit.vue'

const props = defineProps({
  value: {
    type: [Number, String],
    required: true,
  },
  length: {
    // 总位数（含小数点和逗号）
    type: Number,
    default: 19,
  },
  decimal: {
    // 小数位数
    type: Number,
    default: 2,
  },
})

// 格式化金额，补零、千分位
const formatted = computed(() => {
  let num = Number(props.value).toFixed(props.decimal)
  let [int, dec] = num.split('.')
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  let full = int + (props.decimal > 0 ? '.' + dec : '')
  // 补零到指定长度
  let padLen = props.length - full.length
  if (padLen > 0) {
    full = '0'.repeat(padLen) + full
  }
  return full
})

const chars = computed(() => formatted.value.split(''))

// 计算高亮起始下标（第一个非零数字）
const highlightStart = computed(() => {
  const arr = chars.value
  for (let i = 0; i < arr.length; i++) {
    if (/[1-9]/.test(arr[i])) {
      return i
    }
  }
  // 如果全是0，返回最后一个数字的下标
  for (let i = arr.length - 1; i >= 0; i--) {
    if (/[0-9]/.test(arr[i])) return i
  }
  return arr.length - 1
})
</script>

<template>
  <div class="digital-amount">
    <span
      v-for="(char, idx) in chars"
      :key="idx"
      :class="[
        'digital-amount__item',
        {
          'digital-amount__item--highlight': idx >= highlightStart && /[0-9]/.test(char),
        },
        { 'digital-amount__item--number': /[0-9]/.test(char) },
        { 'digital-amount__item--comma': char === ',' },
        { 'digital-amount__item--dot': char === '.' },
      ]"
    >
      <template v-if="/[0-9]/.test(char)">
        <DigitalDigit :value="char" />
      </template>
      <template v-else>
        {{ char }}
      </template>
    </span>
  </div>
</template>

<style scoped>
.digital-amount {
  display: flex;
  gap: 4px;
}
.digital-amount__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 28px;
  padding: 3px 2px;
  font-size: 18px;
  font-family: 'DIN Black';
  color: #12504d;
  background: rgba(0, 255, 255, 0.08);
  border: 1px dashed #2be7ff44;
  border-radius: 4px;
  box-sizing: border-box;
  transition:
    color 0.2s,
    background 0.2s;
}
.digital-amount__item--highlight {
  color: #00ffe9;
  background: inherit;
  font-weight: 900;
  text-shadow: 0px 0px 4px #00ffe9;
}
.digital-amount__item--comma,
.digital-amount__item--dot {
  background: transparent;
  border: none;
  color: #00ffe9;
  width: 16px;
  font-size: 18px;
}
</style>