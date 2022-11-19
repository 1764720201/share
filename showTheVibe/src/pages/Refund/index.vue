<template>
	<view class="refund">
		<view class="total">
			<view class="label">申请金额</view>
			<view class="price">￥{{ orderDetail.total?.toFixed(2) }}</view>
		</view>
		<view class="reason">
			<view class="header">
				<view class="reason">申请说明</view>
				<view class="number-words">
					您还可以输入{{ numberWords }}字
				</view>
			</view>
			<textarea
				placeholder="必填,请您详细填写申请说明"
				class="textarea"
				placeholder-class="textarea-plac"
				v-model="reason"
				maxlength="170"
			></textarea>
		</view>
		<view class="phone">
			<view class="label">联系电话</view>
			<input
				type="number"
				placeholder="请输入手机号"
				class="input"
				placeholder-class="input-plac"
				maxlength="11"
				v-model="phone"
			/>
		</view>
		<view class="confirm" @click="confirmRefund">提交申请</view>
	</view>
</template>

<script lang="ts" setup>
const { getOrderDetail, orderDetail, currentOption } = useStore('order');

const reason = ref<string>('');
const phone = ref<number>();
const numberWords = ref<number>(170);
// 实时计算剩余文字
watch(
	() => reason.value,
	() => {
		numberWords.value = 170 - reason.value.length;
	}
);
onLoad(options => {
	getOrderDetail(options.id!);
});
const db = uniCloud.database();
// 提交申请
const confirmRefund = async () => {
	if (!reason.value) {
		uni.showToast({
			title: '请输入申请说明',
			icon: 'none'
		});
		return;
	}
	if (!phone.value) {
		uni.showToast({
			title: '请填写手机号',
			icon: 'none'
		});
		return;
	}
	await db
		.collection('order')
		.where(`_id=='${orderDetail.value._id}'`)
		.update({
			status: 2
		});
	currentOption.value = 3;
	uni.navigateBack({
		success() {
			uni.showToast({
				title: '已成功退款'
			});
		}
	});
};
</script>

<style lang="scss" scoped>
.refund {
	.total {
		margin-top: 20rpx;
		background-color: #fff;
		padding: 40rpx;
		.price {
			margin-top: 20rpx;
			font-size: 65rpx;
			font-weight: 900;
		}
	}
	.reason {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: #fff;
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.number-words {
				color: #adadad;
			}
		}
		.textarea {
			padding: 20rpx;
			font-size: 30rpx;
		}
		:deep(.textarea-plac) {
			font-size: 30rpx;
			color: #ccc;
		}
	}
	.phone {
		padding: 20rpx;
		background-color: #fff;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		.label {
			font-size: 35rpx;
		}
		.input {
			margin-left: 30rpx;
			font-size: 35rpx;
		}
		:deep(.input-plac) {
			color: #ccc;
			font-size: 35rpx;
		}
	}
	.confirm {
		margin: 100rpx auto;
		width: 90%;
		background-color: $uni-color-theme;
		color: #fff;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		border-radius: 50rpx;
		font-size: 36rpx;
	}
}
</style>
