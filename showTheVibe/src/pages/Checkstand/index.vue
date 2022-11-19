<template>
	<view class="checkstand">
		<view class="need-pay">
			<view class="label">需支付</view>
			<view class="total">
				￥
				<view class="total-num">
					{{ supplementPrice ? supplementPrice : total }}
				</view>
			</view>
		</view>
		<view class="pay-mode">
			<view class="label">选择支付方式</view>
			<view class="list">
				<view
					class="item"
					v-for="item in payMode"
					:key="item.value"
					@click="changePayMode(item.value)"
				>
					<view class="left">
						<view :class="`t-icon ${item.icon}`"></view>
						{{ item.text }}
					</view>
					<view
						:class="
							`t-icon ${
								item.value == currentPayMode
									? 't-icon-xuanze'
									: 't-icon-weixuanzhongyuanquan'
							}`
						"
					></view>
				</view>
			</view>
		</view>
		<view class="confirm" @click="openConfirmPay">
			使用{{ payMode[currentPayMode].text }}支付
		</view>
	</view>
	<uni-popup ref="payPopup" type="dialog">
		<uni-popup-dialog
			cancelText="取消"
			confirmText="确认"
			title="通知"
			content="你确认要支付吗"
			@confirm="confirmPay"
			@close="cancelPay"
		></uni-popup-dialog>
	</uni-popup>
</template>

<script lang="ts" setup>
const {
	total,
	shoppingCart,
	storeDetail,
	currentTableware,
	currentTime
} = useStore('canteen');
const { currentOption } = useStore('order');
const payMode = reactive<{ value: number; text: string; icon: string }[]>([
	{
		value: 0,
		text: '微信支付',
		icon: 't-icon-weixindenglu'
	},
	{
		value: 1,
		text: '支付宝支付',
		icon: 't-icon-zhifubao'
	}
]);
const supplement = ref<boolean>(false);
const supplementId = ref<string>('');
const supplementPrice = ref<number>(0);
const currentPayMode = ref<number>(0);

onLoad(options => {
	if (options.id) {
		supplement.value = true;
		supplementId.value = options.id;
		supplementPrice.value = Number(options.price);
	}
});
// 改变支付方式
const changePayMode = (index: number) => {
	currentPayMode.value = index;
};
const payPopup = ref();
// 打开确认支付弹出层
const openConfirmPay = () => {
	payPopup.value.open();
};

const db = uniCloud.database();

const addOrder = async (status: number) => {
	await db.collection('order').add({
		store_name: storeDetail.value.name,
		tableware: currentTableware.value,
		time: currentTime.value,
		status,
		total: total.value,
		goods: shoppingCart.value,
		pay_mode: payMode[currentPayMode.value].text
	});
};
// 确认支付
const confirmPay = async () => {
	if (supplement.value) {
		await db
			.collection('order')
			.where(`_id=='${supplementId.value}'`)
			.update({
				status: 1
			});
	} else {
		await addOrder(1);
	}
	currentOption.value = 2;
	uni.navigateTo({
		url: '/pages/Order/index'
	});
};
const cancelPay = async () => {
	if (supplement.value) {
		payPopup.value.close();
	} else {
		await addOrder(0);
		currentOption.value = 1;
		uni.navigateTo({
			url: '/pages/Order/index'
		});
	}
};
</script>

<style lang="scss" scoped>
.checkstand {
	padding: 30rpx;
	.need-pay {
		padding: 60rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-bottom: 1rpx solid #ccc;
		.total {
			display: flex;
			font-weight: 900;
			align-items: center;
			font-size: 60rpx;
			&-num {
				font-size: 100rpx;
			}
		}
	}
	.pay-mode {
		margin-top: 100rpx;
		.label {
			text-align: center;
		}
		.list {
			.item {
				margin-top: 50rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left {
					display: flex;
					align-items: center;
					.t-icon {
						margin-right: 40rpx;
					}
				}
			}
		}
	}
	.confirm {
		margin-top: 550rpx;
		width: 100%;
		height: 80rpx;
		background-color: $uni-color-theme;
		border-radius: 30rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 35rpx;
	}
}
</style>
