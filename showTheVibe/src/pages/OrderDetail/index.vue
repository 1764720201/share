<template>
	<view class="order-detail">
		<view class="content">
			<view class="header">
				<view class="left" @click="goStoreDetail">
					<view class="store-name">{{ orderDetail.store_name }}</view>
					<uni-icons type="right" />
				</view>
				<view class="collect">
					<uni-icons
						type="heart"
						:color="ifCollect ? '#ec673a' : '#666'"
						size="22"
						@click="collect"
					/>
					收藏
				</view>
			</view>
			<view class="goods">
				<view
					class="good"
					v-for="good in orderDetail.goods"
					:key="good.image"
				>
					<image
						class="image"
						:src="good.image"
						mode="aspectFill"
					></image>
					<view class="right">
						<view class="name">{{ good.name }}</view>
						<view class="footer">
							<view class="num">{{ good.num }}份</view>
							<view class="price">
								￥{{ good.price * good.num }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="total">
				实付￥
				<text class="total-num">{{ orderDetail.total }}</text>
			</view>
		</view>
		<view class="info">
			<view class="label">订单信息</view>
			<view class="info-list">
				<Item
					label="订单号"
					:content="orderDetail._id?.toUpperCase()"
				></Item>
				<Item
					label="预计取餐"
					:content="
						dayjs(scheduledTime).format('YYYY-MM-DD HH:mm:ss')
					"
				></Item>
				<Item
					label="餐具要求"
					:content="`${orderDetail.tableware}餐具`"
				></Item>
				<Item label="支付方式" :content="orderDetail.pay_mode"></Item>
				<Item
					label="下单时间"
					:content="
						dayjs(orderDetail.create_time).format(
							'YYYY-MM-DD HH:mm:ss'
						)
					"
					ifHideBorder
				></Item>
			</view>
		</view>
	</view>
	<view class="tabbar">
		<view class="again" @click="again">再来一单</view>
	</view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
const { getOrderDetail, orderDetail, scheduledTime } = useStore('order');
const { getCollect, collectStore, ifCollect } = useStore('collect');
const { shoppingCart } = useStore('canteen');
const storeId = ref<string>('');
const db = uniCloud.database();
onLoad(async options => {
	await getOrderDetail(options.id!);
	await db
		.collection('canteen')
		.where(`name=='${orderDetail.value.store_name}'`)
		.get()
		.then(res => {
			storeId.value = res.result.data[0]._id;
		});
	getCollect(storeId.value);
});
//再来一单
const again = () => {
	shoppingCart.value = orderDetail.value.goods;
	uni.navigateTo({
		url: `/pages/StoreDetail/index?id=${storeId.value}`
	});
};

// 收藏
const collect = async () => {
	await collectStore(storeId.value);
	getCollect(storeId.value);
};

// 前往店铺详情
const goStoreDetail = () => {
	uni.navigateTo({
		url: `/pages/StoreDetail/index?id=${storeId.value}`
	});
};
</script>

<style lang="scss" scoped>
.order-detail {
	padding: 20rpx;
	padding-bottom: 200rpx;
	.content {
		padding: 30rpx 40rpx;
		background-color: #fff;
		border-radius: 30rpx;
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left {
				display: flex;
				align-items: center;
			}
			.collect {
				width: 100rpx;
				display: flex;
				align-items: center;
			}
		}
		.goods {
			.good {
				margin-top: 50rpx;
				display: flex;
				.image {
					width: 100rpx;
					height: 100rpx;
				}
				.right {
					margin-left: 20rpx;
					width: 80%;
					display: flex;
					flex-direction: column;
					height: 120rpx;
					justify-content: space-between;
					.name {
						font-weight: 900;
						font-size: 30rpx;
					}
					.footer {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.price {
							font-weight: 900;
						}
					}
				}
			}
		}
		.total {
			margin-top: 70rpx;
			border-top: 1rpx solid #ccc;
			padding: 30rpx 0;
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			&-num {
				font-size: 40rpx;
				font-weight: 900;
			}
		}
	}
	.info {
		margin-top: 20rpx;
		padding: 40rpx;
		background-color: #fff;
		border-radius: 30rpx;
		.label {
			font-weight: 900;
			font-size: 35rpx;
		}
		&-list {
			margin-top: 50rpx;
		}
	}
}
.tabbar {
	padding: 20rpx 40rpx;
	position: fixed;
	background-color: #e6e5e6;
	height: 120rpx;
	display: flex;
	align-items: flex-start;
	width: 100%;
	justify-content: flex-end;
	bottom: 0;
	.again {
		background-color: $uni-color-theme;
		padding: 18rpx;
		border-radius: 30rpx;
		font-size: 25rpx;
	}
}
</style>
