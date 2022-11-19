<template>
	<view
		class="item"
		:style="{ borderBottom: ifHideBorder ? '' : '#ccc 1rpx solid' }"
	>
		<view class="label">{{ props.label }}</view>
		<view class="content">{{ props.content }}</view>
	</view>
</template>

<script lang="ts" setup>
const props = defineProps<{
	label: string;
	content?: string;
	ifHideBorder?: boolean;
}>();
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	justify-content: space-between;
	padding: 30rpx 0;
	.label {
		color: #666;
	}
}
</style>
