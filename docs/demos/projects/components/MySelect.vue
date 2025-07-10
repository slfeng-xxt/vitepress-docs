<script setup>
	import { h, getCurrentInstance } from 'vue'
	import Select from 'ant-design-vue/lib/select'
	import 'ant-design-vue/lib/select/style/css'
	import { DownOutlined } from '@ant-design/icons-vue'

	/**
	 * 1. props 如何穿透
	 * 2. 插槽 如何穿透
	 * 3. 组件方法如何暴露出去
	 */
	const props = defineProps({})
	const vm = getCurrentInstance()

	function changeRef(selectInstance) {
		vm.exposeProxy = vm.exposed = selectInstance || {}
	}

	const getSuffixIcon = () => {
		return h(
			'div',
			{ class: 'customize-suffix' },
			h(DownOutlined, { style: { color: '#fff', fontSize: '18px', pointerEvents: 'none' } })
		)
	}
</script>

<template>
	<div>
        <div>子组件：二次封装ant-design-vue的Select组件</div>
		<component
			class="index-comp"
			:is="h(Select, { ...$attrs, ...props, ref: changeRef }, { suffixIcon: () => getSuffixIcon(), ...$slots })"
		></component>
	</div>
</template>

<style lang="less" scoped>
	.index-comp {
		width: 300px;
	}

	.customize-suffix {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: -8px;
		left: -8px;
		width: 28px;
		height: 28px;
		border-radius: 3px 3px 3px 3px;
		background-color: #1890ff;
		pointer-events: none;
	}
</style>
