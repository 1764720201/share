<template>
	<!-- 主体部分 -->
	<view class="main">
		<!-- 左侧选项区 -->
		<swiper
			class="left"
			:duration="500"
			vertical
			:display-multiple-items="navCount"
			:current-item-id="current"
			:style="'height:' + height + 'px'"
		>
			<swiper-item
				class="nav-item"
				:class="{ ac: active == index }"
				v-for="(item, index) in storeDetail.kind"
				:key="item.id"
				:item-id="index"
			>
				<view @click="onNav(index)" class="item">
					<image
						:src="item.goods[0].image"
						mode="aspectFill"
						class="image"
					></image>
					<view class="name">{{ item.name }}</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- 右侧内容区 -->
		<scroll-view
			class="right"
			scroll-y
			scroll-with-animation
			enable-back-to-top
			:scroll-top="scrolltop"
			:style="'height:' + height + 'px'"
			@scroll="scroll"
			:scroll-into-view="currentGood"
		>
			<view
				class="goods-item"
				v-for="item in storeDetail.kind"
				:key="item.id"
			>
				<view
					v-for="i in item.goods"
					:key="i.image"
					class="goods"
					:id="i.image.replace(/[^a-zA-Z]/g, '')"
				>
					<image class="image" :src="i.image" mode="aspectFill" />
					<view class="good-right">
						<view class="name">{{ i.name }}</view>
						<view class="footer">
							<view class="price">￥{{ i.price }}</view>
							<view
								class="t-icon t-icon-jian"
								v-if="shoppingCartName.indexOf(i.name) != -1"
								@click="subtractFood(i)"
							></view>
							<view
								class="num"
								v-if="shoppingCartName.indexOf(i.name) != -1"
							>
								{{
									shoppingCart?.filter(good => {
										return good.name == i.name;
									})[0].num
								}}
							</view>
							<view
								class="t-icon t-icon-tianjia"
								@click="addGood(i)"
							></view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script setup lang="ts">
import { Food } from '@/types/canteen';
const { storeDetail, currentGood, shoppingCartName, shoppingCart } = useStore(
	'canteen'
);
const props = defineProps<{ topheight: number }>();
const arr = ref<number[]>([]);
const scrolltop = ref<number>(0);
const active = ref<number>(0);
const height = ref<number>(0);
const navCount = ref<number>(0);
const current = ref<number>(0);

const onNav = (index: number) => {
	// 当前点击的选项
	active.value = index;
	current.value=index
	// 当前点击的选项的对应的产品的高度
	scrolltop.value = arr.value[index];
};
const scroll = (e: any) => {
	const index = arr.value.findIndex(
		ele => e.detail.scrollTop > ele && ele + 100 > e.detail.scrollTop
	);
	if (index > 0) {
		active.value = index;
		current.value = index;
	}
};
const instance = getCurrentInstance();
setTimeout(() => {
	nextTick(() => {
		const wid = uni.getSystemInfoSync();
		height.value = wid.windowHeight - props.topheight;
		navCount.value = Math.round(height.value / 120);
		// 获取每个分类的高度
		uni.createSelectorQuery()
			.in(instance)
			.selectAll('.goods-item')
			.boundingClientRect((rects: any) => {
				rects.forEach((rect: any) => {
					arr.value.push(rect.top - rects[0].top);
				});
			})
			.exec();
	});
}, 500);

// 添加食物
const addGood = (item: Food) => {
	if (shoppingCartName.value.indexOf(item.name) != -1) {
		shoppingCart.value.filter(i => {
			return i.name == item.name;
		})[0].num += 1;
	} else {
		shoppingCart.value.push(Object.assign(item, { num: 1 }));
	}
};
// 减少食品
const subtractFood = (item: Food) => {
	const num=shoppingCart.value.filter(i => {
		return i.name == item.name;
	})[0]?.num
	if ( num> 1) {
		shoppingCart.value.filter(i => {
			return i.name == item.name;
		})[0].num -= 1;
	} else {
		shoppingCart.value.splice(
			shoppingCart.value.findIndex(i => {
				return i.name == item.name;
			}),
			1
		);
	}
};
</script>
<style lang="scss" scoped>
// 左侧导航背景颜色
$leftbackground: #e4e3e4;
//左侧导航文字颜色
$leftcolor: #000;
//左侧选中背景
$leftacbg: #fff;
//左侧选中文字颜色
$leftacclo: red;
////////////////////////////
.main {
	background-color: #f7f8f9;
	display: flex;
	.left {
		padding-bottom: 30rpx;
		width: 25%;
		background-color: $leftbackground;
		.nav-item {
			// height: 200%;
			font-size: 28rpx;
			color: $leftcolor;
			.item {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-bottom: 1rpx solid #d0d0d0;
				text-align: center;
				.name {
					font-size: 25rpx;
				}
				.image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
			}
		}
		.ac {
			color: $leftacclo;
			font-size: 30rpx;
			background: $leftacbg;
		}
	}
	.right {
		display: flex;
		flex-direction: column;
		padding-bottom: 150rpx;
		.goods-item {
			padding-top: 20rpx;
			background-color: #fff;
			.goods {
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #dfdfdf;
				.image {
					width: 300rpx;
					height: 300rpx;
				}
				.good-right {
					width: 270rpx;
					height: 180rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 10rpx;
					.footer {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.price {
							font-weight: 900;
							font-size: 35rpx;
						}
					}
				}
			}
		}
	}
}
</style>
