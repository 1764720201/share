<template>
	<view class="tabbar">
		<view class="icon">
			<uni-badge
				size="small"
				:text="totalNum"
				absolute="rightTop"
				type="error"
			>
				<view
					class="t-icon t-icon-cailanSVG"
					@click="openShoppingCart"
				></view>
			</uni-badge>
		</view>
		<view
			class="total-price"
			:class="total == 0 ? 'no-good' : ''"
			@click="openShoppingCart"
		>
			{{ total > 0 ? '￥' + total : '未选购商品' }}
		</view>
		<view
			class="close"
			@click="goPayment"
			:class="total == 0 ? 'cant-go' : ''"
		>
			去结算
		</view>
	</view>
	<uni-popup ref="shoppingCartPopup" type="bottom" :safeArea="false">
		<view class="shopping-cart">
			<view class="header">
				<view class="title">餐品详情</view>
				<view class="right" @click="openRemoveAll">
					<uni-icons type="trash"></uni-icons>
					清空购物车
				</view>
			</view>
			<view class="goods">
				<view v-for="item in shoppingCart" :key="item.name">
					<view class="item">
						<image
							class="image"
							:src="item.image"
							mode="aspectFill"
						></image>
						<view class="right">
							<view class="name">{{ item.name }}</view>
							<view class="footer">
								<view class="price">￥{{ item.price }}</view>
								<view class="num">
									<view
										class="t-icon t-icon-jian"
										@click="changeNum(item, -1)"
									></view>
									<view>{{ item.num }}</view>
									<view
										class="t-icon t-icon-tianjia"
										@click="changeNum(item, 1)"
									></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</uni-popup>
	<uni-popup ref="removeAllPopup" type="dialog">
		<uni-popup-dialog
			type="warning"
			cancelText="取消"
			confirmText="确认"
			content="确定是否清空购物车"
			@confirm="confirmRemoveAll"
		></uni-popup-dialog>
	</uni-popup>
</template>

<script lang="ts" setup>
import { Food } from '@/types/canteen';
const { total, shoppingCart, totalNum } = useStore('canteen');

const shoppingCartPopup = ref();
// 打开购物车
const openShoppingCart = () => {
	if (total.value > 0) {
		shoppingCartPopup.value.open();
	}
};
const changeNum = (item: Food, num: number) => {
	shoppingCart.value.filter(i => {
		return i.name == item.name;
	})[0].num += num;
	// 如果数量为0 就移除
	if (
		shoppingCart.value.filter(i => {
			return i.name == item.name;
		})[0].num == 0
	) {
		shoppingCart.value.splice(
			shoppingCart.value.findIndex(i => {
				return i.name == item.name;
			}),
			1
		);
		shoppingCartPopup.value.close();
	}
};

const removeAllPopup = ref();
// 打开清空购物车弹出层
const openRemoveAll = () => {
	removeAllPopup.value.open();
};

// 清空购物车
const confirmRemoveAll = () => {
	shoppingCart.value.length = 0;
	shoppingCartPopup.value.close();
};

// 前往订单确认
const goPayment = () => {
	if (total.value) {
		uni.navigateTo({
			url: '/pages/Payment/index'
		});
	}
};
</script>

<style lang="scss" scoped>
.tabbar {
	padding: 30rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: flex-end;
	padding-bottom: 50rpx;
	background-color: rgba(236, 235, 236, 0.2);
	z-index: 9999;
	.icon {
		position: absolute;
		bottom: 43rpx;
		.t-icon {
			width: 140rpx;
			height: 140rpx;
		}
	}
	.total-price {
		margin-left: 110rpx;
		width: 550rpx;
		background-color: #424142;
		color: #fff;
		font-size: 45rpx;
		height: 88rpx;
		font-weight: 900;
		line-height: 88rpx;
		padding-left: 20rpx;
	}
	.no-good {
		color: #a5a5a5;
		font-size: 33rpx;
	}
	.close {
		position: absolute;
		right: -10rpx;
		top: 31rpx;
		padding: 22rpx 60rpx;
		background-color: $uni-color-theme;
		border-radius: 40rpx;
		font-size: 35rpx;
	}
	.cant-go {
		background-color: #797979;
		color: #bdbdbd;
	}
}
.shopping-cart {
	padding: 30rpx;
	background-color: #fff;
	border-top-right-radius: 30rpx;
	border-top-left-radius: 30rpx;
	padding-bottom: 200rpx;
	.header {
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title {
			font-weight: 900;
			font-size: 35rpx;
		}
		.right {
			color: #666;
			font-size: 25rpx;
			display: flex;
			align-items: center;
		}
	}
	.goods {
		.item {
			margin-top: 50rpx;
			display: flex;
			align-items: center;
			.image {
				width: 200rpx;
				height: 200rpx;
			}
			.right {
				width: 600rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 160rpx;
				margin-left: 50rpx;
				font-weight: 900;
				font-size: 32rpx;
				.footer {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.t-icon {
						width: 50rpx;
						height: 50rpx;
					}
					.num {
						width: 170rpx;
						justify-content: space-between;
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}
}
</style>
