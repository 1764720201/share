<template>
	<view class="order">
		<Tab
			:list="options"
			@change="changeOption"
			:currentOption="currentOption"
		></Tab>
		<List></List>
	</view>
</template>

<script lang="ts" setup>
import { Option } from '@/types/canteen';
import List from './list/index';
const { currentOption } = useStore('order');
// 改变选项
const changeOption = (index: number) => {
	currentOption.value = index;
};
const options = reactive<Option[]>([
	{
		value: 0,
		text: '全部订单'
	},
	{
		value: 1,
		text: '待付款'
	},
	{
		value: 2,
		text: '已完成'
	},
	{
		value: 3,
		text: '退款/售后'
	}
]);
</script>

<style lang="scss" scoped></style>
