<template>
	<view class="list">
		<view
			class="item"
			v-for="item in props.list"
			:key="item.value"
			:class="item.value == props.currentOption ? 'active' : ''"
			@click="changeOption(item.value)"
		>
			<view class="option">{{ item.text }}</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
type List = {
	value: number;
	text: string;
};
const props = defineProps<{ list: List[]; currentOption: number }>();
const emit = defineEmits(['change']);
const changeOption = (index: number) => {
	emit('change', index);
};
</script>
<style lang="scss" scoped>
.list {
	height: 100rpx;
	box-shadow: 0 0 3rpx #ccc;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.item {
		height: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 5rpx solid transparent;
	}
	.active {
		border-bottom: 5rpx solid $uni-color-theme;
		color: $uni-color-theme;
	}
}
</style>
