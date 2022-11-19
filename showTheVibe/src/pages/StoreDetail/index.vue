<template>
	<u-swiper
		:list="list"
		:height="450"
		indicator-pos="bottomRight"
		@click="choose"
	></u-swiper>
	<view class="header">
		<view class="search">
			<uni-search-bar
				@input="focus"
				:radius="30"
				placeholder="请输入食物名"
			></uni-search-bar>
		</view>
		<uni-icons
			type="star"
			size="30"
			@click="collect"
			:color="ifCollect ? '#ec673a' : '#666'"
		/>
	</view>
	<left-swipe-tab :topheight="200"></left-swipe-tab>
	<Tabbar></Tabbar>
</template>

<script lang="ts" setup>
import Tabbar from './tabbar/index'
const { getStoreDetail,storeDetail,getAllGoods,currentGood,allGoods }=useStore('canteen')
const { getCollect,collectStore,ifCollect }=useStore('collect')
const list = ref<string[]>([]);
onLoad(async options => {
	await getStoreDetail(options.id!)
	getCollect(options.id!)
	uni.setNavigationBarTitle({
		title: storeDetail.value.name
	});
	list.value = storeDetail.value.kind.map(item => {
		return item.goods[0].image;
	});
	// 将所有食品保存在一个数组
	getAllGoods()
});

let timer = null;
const focus = async (e:string) => {
	if (!e) {
		return;
	}
	// 节流
	if (timer) {
		clearTimeout(timer);
	}
	// @ts-ignore
	timer = setTimeout(() => {
		// 根据食物名筛选图片名
		// 正则只保留图片地址的英文
		currentGood.value = allGoods.value
			.filter(item => {
				return item.name == e;
			})[0]
			?.image.replace(/[^a-zA-Z]/g, '');
	}, 500);
};
const choose = (e: number) => {
	// 根据点击的图片传入图片地址的英文
	currentGood.value = list.value[e].replace(/[^a-zA-Z]/g, '');
};

// 收藏
const collect=async()=>{
	await collectStore(storeDetail.value._id)
	getCollect(storeDetail.value._id)
}
</script>

<style lang="scss" scoped>
.header {
	background-color: #fff;
	position: absolute;
	height: 100rpx;
	top: 355rpx;
	width: 100%;
	border-top-left-radius: 50rpx;
	display: flex;
	align-items: center;
	.search {
		width: 85%;
	}
}
</style>
