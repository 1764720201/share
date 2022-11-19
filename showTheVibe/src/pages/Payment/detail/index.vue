<template>
	<view class="detail">
		<view class="title">餐品详情</view>
		<view class="list">
			<view class="item" v-for="item in shoppingCart" :key="item.image">
				<image
					class="image"
					:src="item.image"
					mode="aspectFill"
				></image>
				<view class="right">
					<view class="name">{{ item.name }}</view>
					<view class="footer">
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
						<view class="price">
							￥{{ (item.price * item.num).toFixed(2) }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="recommend" v-if="recommend.length > 0">
			<view class="header">
				<view class="t-icon t-icon-health"></view>
				为您精选以下餐品推荐加购
			</view>
			<view class="tag">走心推荐</view>
			<view class="list">
				<view
					v-for="item in recommend.slice(
						0,
						showAll ? recommend.length : 2
					)"
					:key="item.name"
				>
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
								<view
									class="t-icon t-icon-tianjia"
									@click="addShoppingCart(item)"
								></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="unfold" @click="unfold" v-if="recommend.length > 2">
				展开（共{{ recommend.length }}项）
				<uni-transition ref="ani" show>
					<uni-icons type="bottom" color="#ec673a" />
				</uni-transition>
			</view>
		</view>
		<view class="total">
			<view class="text">商品小计</view>
			<view class="total-num">￥{{ total }}</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { Food, ShoppingCart } from '@/types/canteen';
const { shoppingCart, recommend, total } = useStore('canteen');
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
	}
	// 如果购物车没有食品就返回上一个界面
	if (shoppingCart.value.length == 0) {
		uni.navigateBack({
			success(e) {
				console.log(e);
			}
		});
	}
};
// 将推荐的食品加入购物车
const addShoppingCart = (item: ShoppingCart) => {
	shoppingCart.value.push(item);
	recommend.value.forEach((i, index) => {
		if (i.name == item.name) {
			recommend.value.splice(index, 1);
		}
	});
};
const ani = ref();
const showAll = ref<boolean>(false);
// 展开
const unfold = () => {
	if (!showAll.value) {
		ani.value.step({
			rotate: -180
		});
		ani.value.run(() => {
			showAll.value = true;
		});
	} else {
		ani.value.step({
			rotate: 0
		});
		ani.value.run(() => {
			showAll.value = false;
		});
	}
};
</script>

<style lang="scss" scoped>
.detail {
	margin-top: 20rpx;
	padding: 40rpx;
	background-color: #fff;
	border-radius: 25rpx;
	.title {
		font-size: 33rpx;
		font-weight: 900;
		border-bottom: 1rpx solid #ccc;
		padding-bottom: 40rpx;
	}
	.list {
		.item {
			margin-top: 50rpx;
			display: flex;
			align-items: center;
			.image {
				width: 120rpx;
				height: 120rpx;
			}
			.right {
				width: 500rpx;
				display: flex;
				flex-direction: column;
				height: 120rpx;
				justify-content: space-between;
				.name {
					font-weight: 900;
				}
				.footer {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.num {
						width: 140rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.t-icon {
							width: 50rpx;
							height: 50rpx;
						}
					}
					.price {
						font-weight: 900;
						font-size: 30rpx;
					}
				}
			}
		}
	}
	.recommend {
		margin-top: 40rpx;
		padding: 20rpx;
		overflow: hidden;
		position: relative;
		background-color: #f5f4f5;
		border-radius: 30rpx;
		.header {
			display: flex;
			align-items: center;
		}
		.tag {
			text-align: center;
			position: absolute;
			top: 8px;
			font-weight: bold;
			right: -36px;
			width: 40%;
			height: 40rpx;
			line-height: 40rpx;
			transform: rotate(40deg);
			background-color: #d9262c;
			color: #fff;
			font-size: 25rpx;
		}
		.t-icon {
			width: 45rpx;
			height: 45rpx;
		}
		.unfold {
			margin-top: 30rpx;
			color: $uni-color-theme;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.total {
		margin-top: 50rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1rpx solid #ccc;
		font-weight: 900;
	}
}
</style>
