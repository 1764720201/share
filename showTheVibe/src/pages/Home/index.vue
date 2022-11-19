<template>
	<!-- 首页顶部位置和导航栏 -->
	<view class="header">
		<view class="city" @click="goChooseCity">
			<view class="city-name">{{ currentCity.cityName }}</view>
			<uni-icons type="bottom" />
		</view>
		<view class="search" @click="goSearch">
			<uni-icons type="search" size="25" color="#666" />
			输入笔记关键词
		</view>
	</view>
	<!-- 轮播图 -->
	<carousel :img-list="imgList" url-key="url" @selected="goRepastDetail" />
	<list></list>
</template>
<script lang="ts" setup>
import carousel from '@/components/vear-carousel/vear-carousel';

import list from './list/index';
import { Canteen } from '@/types/canteen';
const { getCity, getUserInfo, currentCity } = useStore('user');
const db = uniCloud.database();
type List = {
	id: string;
	url: string;
};
const imgList = reactive<List[]>([]);
onLoad(() => {
	db.collection('canteen')
		.get()
		.then(res => {
			imgList.push(
				...res.result.data.map((item: Canteen) => {
					return { id: item._id, url: item.brand };
				})
			);
		});
});
onShow(async () => {
	await getUserInfo();
	getCity();
});
// 跳转到就餐页面
const goRepastDetail = (e: List) => {
	uni.navigateTo({
		url: `/pages/StoreDetail/index?id=${e.id}`
	});
};
// 前往搜索界面
const goSearch = () => {
	uni.navigateTo({
		url: '/pages/Search/index'
	});
};

// 前往选择城市
const goChooseCity = () => {
	uni.navigateTo({
		url: '/pages/ChooseCity/index'
	});
};
</script>
<style lang="scss" scoped>
.header {
	padding: 30rpx;
	margin-top: 70rpx;
	display: flex;
	align-items: center;
	width: 75%;
	justify-content: space-between;
	.city {
		font-size: 35rpx;
		font-weight: 900;
		display: flex;
		align-items: center;
		&-name {
			width: 105rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.search {
		width: 360rpx;
		box-shadow: 0 0 10rpx #d7d7d7;
		height: 60rpx;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 27rpx;
		color: #666;
	}
}
</style>
