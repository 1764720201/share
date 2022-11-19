<template>
	<Tab
		:list="options"
		:currentOption="currentOption"
		@change="getOption"
	></Tab>
	<view class="collect">
		<Notes v-if="!currentOption"></Notes>
		<Store v-else></Store>
	</view>
</template>
<script lang="ts" setup>
import { Option } from '@/types/canteen';
import Notes from './notes/index';
import Store from './store/index';
const { currentOption } = useStore('collect');
const options = reactive<Option[]>([
	{
		value: 0,
		text: '笔记'
	},
	{
		value: 1,
		text: '店铺'
	}
]);
const getOption = (index: number) => {
	currentOption.value = index;
};
</script>
<style lang="scss" scoped></style>
