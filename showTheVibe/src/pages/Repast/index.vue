<template>
	<view class="repast">
		<view class="search">
			<uni-search-bar
				radius="30"
				v-model="currentName"
				placeholder="请输入店名"
			></uni-search-bar>
		</view>
		<view class="hint" v-if="hint.length > 0">
			<view
				class="item"
				v-for="item in hint"
				:key="item.id"
				@click="goStoreDetail(item.id)"
			>
				{{ item.name }}
			</view>
		</view>
		<List :currentName="currentName"></List>
	</view>
</template>
<script lang="ts" setup>
import { Canteen } from '@/types/canteen';
import List from './list/index';
const { shoppingCart } = useStore('canteen');
type Search = {
	id: string;
	name: string;
};
const hint = ref<Search[]>([]);
// 输入的店名
const currentName = ref<string>('');
const db = uniCloud.database();
let timer = null;
watch(
	() => currentName.value,
	newValue => {
		if (newValue == '') {
			hint.value.length = 0;
		} else {
			if (timer) {
				clearTimeout(timer);
			}

			//@ts-ignore  节流
			timer = setTimeout(() => {
				db.collection('canteen')
					.where(`${new RegExp(newValue, 'i')}.test(name)`)
					.get()
					.then(res => {
						hint.value = res.result.data.map((item: Canteen) => {
							return { id: item._id, name: item.name };
						});
					});
			}, 500);
		}
	}
);

// 前往店铺详情
const goStoreDetail = (id: string) => {
	shoppingCart.value = [];
	uni.navigateTo({
		url: `/pages/StoreDetail/index?id=${id}`
	});
};
</script>
<style lang="scss" scoped>
.repast {
	padding: 30rpx;
	.hint {
		padding: 20rpx 40rpx;
		background-color: #fff;
		border-radius: 30rpx;
	}
}
</style>
