<template>
	<view class="order">
		<unicloud-db
			v-slot:default="{ data, error, hasMore }"
			collection="order"
			field="_id,status,total,goods,store_name,create_time,time,pay_mode,tableware"
			:where="where.join('&&')"
			orderby="create_time desc"
			:page-size="3"
			ref="udb"
		>
			<view v-if="error">{{ error.message }}</view>
			<view v-else>
				<view class="list">
					<view class="item" v-for="item in data" :key="item._id">
						<view class="header">
							<view
								class="store-name"
								@click="goStore(item.store_name)"
							>
								{{ item.store_name }}
								<uni-icons type="right" />
							</view>
							<view class="status">
								<view v-if="item.status == 0">待付款</view>
								<view v-if="item.status == 1">已完成</view>
								<view v-if="item.status == 2">已退款</view>
							</view>
						</view>
						<view class="content" @click="goOrderDetail(item)">
							<view class="goods">
								<view class="good" v-for="good in item.goods">
									<image
										:src="good.image"
										mode="aspectFill"
										class="image"
									></image>
									<view class="name">{{ good.name }}</view>
								</view>
							</view>
							<view class="right">
								<view class="total">￥{{ item.total }}</view>
								<view class="num">
									共{{
										item.goods.reduce(
											(
												pre: number,
												cur: ShoppingCart
											) => {
												return pre + cur.num;
											},
											0
										)
									}}件
								</view>
							</view>
						</view>
						<view class="footer">
							<view class="already" v-if="item.status == 1">
								<view
									class="refund"
									@click="goRefund(item._id)"
								>
									申请退款
								</view>
								<view
									class="again"
									@click="again(item.store_name, item.goods)"
								>
									再来一单
								</view>
							</view>
							<view
								class="pay"
								v-if="item.status == 0"
								@click="goCheckstand(item._id, item.total)"
							>
								前往付款
							</view>
							<view
								class="cancel"
								@click="cancelOrder(item._id)"
								v-if="item.status == 2"
							>
								删除订单
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore status="loadmore" v-if="hasMore" />
			<u-loadmore status="nomore" v-else />
		</unicloud-db>
	</view>
</template>

<script lang="ts" setup>
import { ShoppingCart } from '@/types/canteen';
import { Order } from '@/types/order';
const { userId } = useStore('user');
const where = ref<string[]>([`user_id=='${userId.value}'`]);
const { currentOption } = useStore('order');
const { shoppingCart } = useStore('canteen');
// 监听选项的改变
watch(
	() => currentOption.value,
	() => {
		if (currentOption.value > 0) {
			where.value[1] = `status==${currentOption.value - 1}`;
		} else {
			where.value.splice(1, 1);
		}
	},
	{
		immediate: true
	}
);
const db = uniCloud.database();
// 前往店面
const goStore = async (name: string) => {
	await db
		.collection('canteen')
		.where(`name=='${name}'`)
		.field('_id')
		.get()
		.then(res => {
			uni.navigateTo({
				url: `/pages/StoreDetail/index?id=${res.result.data[0]._id}`
			});
		});
};

const again = async (name: string, goods: ShoppingCart[]) => {
	const storeId = ref<string>('');
	await db
		.collection('canteen')
		.where(`name=='${name}'`)
		.field('_id')
		.get()
		.then(res => {
			storeId.value = res.result.data[0]._id;
		});
	shoppingCart.value = JSON.parse(JSON.stringify(goods));
	uni.navigateTo({
		url: `/pages/StoreDetail/index?id=${storeId.value}`
	});
};
// 前往收银台付费
const goCheckstand = (id: string, price: number) => {
	uni.navigateTo({
		url: `/pages/Checkstand/index?id=${id}&&price=${price}`
	});
};
// 前往订单详情
const goOrderDetail = (item: Order) => {
	if (item.status == 0) {
		uni.showToast({
			title: '请先付款',
			icon: 'error'
		});
	}
	if (item.status == 1) {
		uni.navigateTo({
			url: `/pages/OrderDetail/index?id=${item._id}`
		});
	}
};
// 前往退款界面
const goRefund = (id: string) => {
	uni.navigateTo({
		url: `/pages/Refund/index?id=${id}`
	});
};

// 下拉加载更多
const udb = ref();
onReachBottom(() => {
	udb.value.loadMore();
});

// 取消订单
const cancelOrder = (id: string) => {
	udb.value.remove(id, {
		confirmContent: '你确定要删除订单吗'
	});
};
</script>

<style lang="scss" scoped>
.order {
	padding-bottom: 50rpx;
	.list {
		padding: 30rpx;
		.item {
			padding: 30rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-top: 20rpx;
			.header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.store-name {
					display: flex;
					align-items: center;
					font-weight: 900;
				}
				.status {
					font-size: 25rpx;
					color: #666;
					font-weight: 900;
				}
			}
			.content {
				display: flex;

				.goods {
					display: flex;
					flex-wrap: wrap;
					width: 88%;
					justify-content: space-between;
					&::after {
						content: ' ';
						width: 30%;
					}
					.good {
						display: flex;
						flex-direction: column;
						align-items: center;
						font-size: 25rpx;
						.image {
							width: 150rpx;
							height: 150rpx;
						}
					}
				}
				.right {
					width: 12%;
					margin-top: 20rpx;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					.total {
						font-weight: 900;
						font-size: 33rpx;
					}
					.num {
						font-size: 25rpx;
						color: #666;
					}
				}
			}
			.footer {
				margin-top: 50rpx;
				border-top: 1rpx solid #ccc;
				width: 100%;
				padding-top: 30rpx;
				padding-bottom: 10rpx;
				display: flex;
				justify-content: flex-end;
				.already {
					display: flex;
					align-items: center;
					.again {
						padding: 15rpx 30rpx;
						background-color: $uni-color-theme;
						border-radius: 40rpx;
						font-size: 25rpx;
					}
					.refund {
						margin-right: 30rpx;
						color: #666;
					}
				}
			}
		}
	}
}
</style>
