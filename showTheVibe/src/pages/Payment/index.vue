<template>
	<view class="payment">
		<Time></Time>
		<Detail></Detail>
		<Other></Other>
	</view>
	<view class="tabbar">
		<view class="total">
			合计￥
			<view class="total-num">{{ total }}</view>
		</view>
		<view class="goPay" @click="goCheckstand">去支付</view>
	</view>
</template>

<script lang="ts" setup>
// 时间
import Time from './time/index';
//餐品详情
import Detail from './detail/index';
// 其它
import Other from './other/index';
const { getRecommend, total } = useStore('canteen');
onLoad(() => {
	getRecommend();
});

// 前往支付页面
const goCheckstand = () => {
	uni.navigateTo({
		url: '/pages/Checkstand/index'
	});
};
</script>
<style lang="scss" scoped>
.payment {
	padding: 20rpx;
	padding-bottom: 200rpx;
}
.tabbar {
	position: fixed;
	bottom: 80rpx;
	display: flex;
	align-items: center;
	left: 0;
	height: 85rpx;
	justify-content: center;
	width: 100%;
	.total {
		width: 700rpx;
		height: 100%;
		background-color: #424142;
		color: #fff;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		padding: 30rpx;
		&-num {
			font-size: 40rpx;
		}
	}
	.goPay {
		background-color: $uni-color-theme;
		font-size: 40rpx;
		font-weight: 900;
		height: 100%;
		width: 220rpx;
		position: absolute;
		right: 25rpx;
		text-align: center;
		border-radius: 50rpx;
		line-height: 85rpx;
	}
}
</style>
