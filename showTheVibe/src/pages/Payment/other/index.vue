<template>
	<view class="other">
		<view class="tableware" @click="openOption">
			<view class="left">
				<view class="label">餐具</view>
				<view class="option">{{ currentTableware }}</view>
			</view>
			<uni-icons type="right"></uni-icons>
		</view>
		<view class="invoice">
			<view class="label">发票</view>
			<view class="content">
				订单完成后可开具电子发票
				<br />
				开发金额仅实付金额，红包、优惠、钱包余额
				<br />
				等支付部分不在开票范围内
			</view>
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
					@click="changeTableware(item.text)"
				>
					<view class="label">{{ item.text }}</view>
					<view
						:class="
							`t-icon ${
								item.text == tablewareCopy
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
const { currentTableware } = useStore('canteen');
const list = reactive<Option[]>([
	{
		value: 0,
		text: '不需要'
	},
	{
		value: 1,
		text: '需要'
	}
]);
const popup = ref();
// 打开餐具选择
const openOption = () => {
	popup.value.open();
};

const tablewareCopy = ref(currentTableware.value);

// 选择餐具
const changeTableware = (name: string) => {
	tablewareCopy.value = name;
};
// 改变餐具
const confirm = () => {
	currentTableware.value = tablewareCopy.value;
	popup.value.close();
};
</script>

<style lang="scss" scoped>
.other {
	margin-top: 20rpx;
	background-color: #fff;
	padding: 30rpx;
	border-radius: 30rpx;
	.tableware {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 30rpx;
		.label {
			font-weight: 900;
		}
		.option {
			margin-top: 20rpx;
			font-size: 25rpx;
			color: #666;
		}
	}
	.invoice {
		padding: 20rpx 0;
		border-top: 1rpx solid #ccc;
		.label {
			font-weight: 900;
		}
		.content {
			margin-top: 20rpx;
			font-size: 25rpx;
			color: #666;
		}
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
