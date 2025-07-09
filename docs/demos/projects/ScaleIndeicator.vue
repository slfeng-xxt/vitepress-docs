<script setup>
import { computed } from 'vue'

const props = defineProps({
  max: { type: Number, default: 20000 },
  min: { type: Number, default: 0 },
  current: { type: Number, default: 5000 },
  marks: { type: Array, default: () => [0, 5000, 10000, 20000] },
  labels: { type: Array, default: () => ['0km', '5km', '10km', '20km'] },
  sections: {
    type: Array,
    default: () => [
      { value: 5000, label: '低' },
      { value: 10000, label: '中' },
      { value: 20000, label: '高' },
    ],
  },
})

// 刻度尺高度(150px * 3)
const scaleHeight = 450

// 区间数
const sectionCount = props.marks.length - 1

// 每个区间高度
const sectionHeight = scaleHeight / sectionCount

// 小刻度偏移量
const minorMarkOffset = 15

// 当前刻度的高度，也算偏移量
const currentMarkHeight = 2

// 主刻度位置（均分）
const markPositions = computed(() =>
  props.marks.map((v, i) => ({
    value: v,
    y: scaleHeight - i * sectionHeight,
  })),
)

// 小刻度
const minorMarkPositions = computed(() => {
  const minors = []
  for (let i = 0; i < props.marks.length - 1; i++) {
    const sectionStart = props.marks[i]
    const sectionEnd = props.marks[i + 1]
    const topY = scaleHeight - i * sectionHeight
    for (let j = 1; j < 10; j++) {
      const percent = j / 10
      const value = sectionStart + (sectionEnd - sectionStart) * percent
      const y = topY - (sectionHeight / 10) * j + minorMarkOffset
      minors.push({ section: i, index: j, y, isMid: j === 5, value })
    }
  }
  return minors
})

// 计算分段标签位置
const sectionLabelPositions = computed(() => {
  // 每个区间的第5个小刻度
  const result = []
  for (let i = 0; i < props.sections.length; i++) {
    // 找到该区间的第5个小刻度
    const minor = minorMarkPositions.value.find((m) => m.section === i && m.index === 5)
    if (minor) {
      result.push({
        label: props.sections[i].label,
        y: minor.y,
        start: props.marks[i],
        end: props.marks[i + 1],
      })
    }
  }
  return result
})

// 当前值位置
const currentY = computed(() => {
  // 找到当前值属于哪个区间
  let idx = 0
  for (let i = 0; i < props.marks.length - 1; i++) {
    if (props.current >= props.marks[i] && props.current <= props.marks[i + 1]) {
      idx = i
      break
    }
  }

  const sectionStart = props.marks[idx]
  const sectionEnd = props.marks[idx + 1]
  const sectionTopY = scaleHeight - idx * sectionHeight

  // 如果 current 恰好等于区间终点，直接返回下一个主刻度的 y
  if (props.current === sectionEnd) {
    // 当前刻度高2px，所以需要减去2
    return scaleHeight - (idx + 1) * sectionHeight + minorMarkOffset - currentMarkHeight
  }
  const percent = (props.current - sectionStart) / (sectionEnd - sectionStart)

  return sectionTopY - percent * sectionHeight + minorMarkOffset
})

const unitConversion = (value) => {
  // 根据传入的值，返回对应的单位值。小于1000返回 value+'m', 大于等于1000返回 value/1000+'km'
  if (value < 1000) {
    return value + 'm'
  } else {
    // 不保留小数点
    return (value / 1000).toFixed(1) + 'km'
  }
}
</script>

<template>
  <div class="scale-indicator">
    <div class="scale-bg">
      <!-- 主刻度 -->
      <div
        v-for="(mark, i) in markPositions"
        :key="mark.value"
        class="mark"
        :style="{ top: mark.y + 'px' }"
      >
        <span :class="['label', { active: mark.value <= current }]">{{ labels[i] }}</span>
        <span class="line" :class="{ active: mark.value <= current }"></span>
      </div>
      <!-- 小刻度 -->
      <div
        v-for="(minor, i) in minorMarkPositions"
        :key="'minor-' + i"
        :class="['minor', { mid: minor.isMid, active: minor.value <= current }]"
        :style="{ top: minor.y + 'px' }"
      ></div>
      <!-- 分段标签 -->
      <div
        v-for="section in sectionLabelPositions"
        :key="section.label"
        :class="['section-label', { active: current >= section.start && current <= section.end }]"
        :style="{ top: section.y + 'px' }"
      >
        {{ section.label }}
      </div>
      <!-- 当前值指示 -->
      <div class="current-indicator" :style="{ top: currentY + 'px' }"></div>
    </div>
    <div class="current-label">当前：{{ unitConversion(current) }}</div>
  </div>
</template>

<style lang="less" scoped>
@active-color: #fff;
@default-color: #91b1da;
.scale-indicator {
  width: 150px;
  height: 550px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  .scale-bg {
    position: relative;
    width: 90px;
    height: 470px;
    margin: 10px 0;
    background: transparent;
  }
  .mark {
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .label {
      color: @default-color;
      font-size: 18px;
      line-height: 30px;
      width: 40px;
      text-align: left;
      margin-right: 10px;
      letter-spacing: 1px;
    }
    .line {
      display: inline-block;
      width: 30px;
      height: 2px;
      background: @default-color;
      margin-left: 5px;
    }
  }
  .label.active {
    color: @active-color;
  }
  .line.active {
    background: @active-color;
  }
  .minor {
    position: absolute;
    right: 0;
    width: 20px;
    height: 1px;
    background: @default-color;
    opacity: 0.5;
    &.mid {
      width: 26px;
      background: @default-color;
    }
  }
  .minor.active {
    background: @active-color;
    opacity: 1;
  }
  .minor.mid.active {
    background: @active-color;
  }
  .section-label {
    position: absolute;
    right: -20px;
    color: @default-color;
    font-size: 16px;
    transform: translateY(-50%);
    user-select: none;
    &.active {
      color: @active-color;
    }
  }
  .current-indicator {
    position: absolute;
    right: 0;
    width: 35px;
    height: 2px;
    background: @active-color;
    box-shadow: 0 0 6px @active-color;
    z-index: 2;
  }
  .current-label {
    color: #fff;
    font-size: 16px;
    width: 100%;
    text-align: center;
    padding-left: 0;
    letter-spacing: 1px;
  }
}
</style>