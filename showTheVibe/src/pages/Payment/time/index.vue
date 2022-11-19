<template>
	<view class="time" @click="openOption">
		<view class="title">取餐时间</view>
		<view class="right">
			{{ currentTime }}
			<uni-icons type="right"></uni-icons>
		</view>
	</view>
	<uni-popup ref="popup" type="bottom" :safeArea="false">
		<view class="options">
			<view class="title">取餐时间</view>
			<view class="list">
				<view
					class="item"
					v-for="item in list"
					:key="item.value"
					@click="changeTime(item.text)"
				>
					<view class="label">{{ item.text }}</view>
					<view
						:class="
							`t-icon ${
								item.text == timeCopy
									? 't-icon-xuanze'
									: 't-icon-weixuanzhongyuanquan'
							}`
						"
					></view>
				</view>
			</view>
			<view class="confirm" @click="confirm">确认</view>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
import { Option } from '@/types/canteen';
const { currentTime } = useStore('canteen');
const timeCopy = ref(currentTime.value);
const popup = ref();
const openOption = () => {
	popup.value.open();
};
const list = reactive<Option[]>([
	{
		value: 0,
		text: '现在取餐'
	},
	{
		value: 1,
		text: '10分钟后到店'
	},
	{
		value: 2,
		text: '20分钟后到店'
	},
	{
		value: 3,
		text: '30分钟后到店'
	}
]);
// 选择时间
const changeTime = (name: string) => {
	timeCopy.value = name;
};
// 改变时间
const confirm = () => {
	currentTime.value = timeCopy.value;
	popup.value.close();
};
</script>

<style lang="scss" scoped>
.time {
	padding: 40rpx;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 25rpx;
	.right {
		color: $uni-color-theme;
	}
}
.options {
	width: 100%;
	background-color: #fff;
	padding: 40rpx;
	border-top-right-radius: 30rpx;
	border-top-left-radius: 30rpx;
	.title {
		text-align: center;
		font-size: 40rpx;
		font-weight: 900;
	}
	.list {
		.item {
			padding: 40rpx 0;
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #ccc;
			align-items: center;
			.t-icon {
				width: 45rpx;
				height: 45rpx;
			}
		}
	}
	.confirm {
		margin-top: 50rpx;
		width: 100%;
		height: 80rpx;
		background-color: $uni-color-theme;
		text-align: center;
		line-height: 80rpx;
		border-radius: 50rpx;
		font-size: 37rpx;
	}
}
</style>
