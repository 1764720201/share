<template>
	<view class="order">
		<view class="title">我的订单</view>
		<view class="list">
			<view class="item" @click="goOrder(1)">
				<view class="t-icon t-icon-icon-"></view>
				待付款
			</view>
			<view class="item" @click="goOrder(2)">
				<view class="t-icon t-icon-qiandao"></view>
				已完成
			</view>
			<view class="item" @click="goOrder(3)">
				<view class="t-icon t-icon-shouhoutuikuan"></view>
				退款/售后
			</view>
			<view class="item" @click="goOrder(0)">
				<view class="t-icon t-icon-dingdan"></view>
				全部订单
			</view>
		</view>
	</view>
</template>
<script lang="ts" setup>
const { currentOption } = useStore('order');
// 前往订单
const goOrder = (index: number) => {
	currentOption.value = index;
	uni.navigateTo({
		url: '/pages/Order/index'
	});
};
</script>
<style lang="scss" scoped>
.order {
	margin-top: 100rpx;
	.title {
		font-size: 32rpx;
		font-weight: 900;
	}
	.list {
		display: flex;
		align-items: center;
		margin-top: 50rpx;
		.item {
			width: 25%;
			display: flex;
			align-items: center;
			flex-direction: column;
			.t-icon {
				width: 50rpx;
				height: 50rpx;
				margin-bottom: 10rpx;
			}
		}
	}
}
</style>
