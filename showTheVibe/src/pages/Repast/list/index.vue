<template>
	<unicloud-db
		v-slot:default="{ data, loading, error, options }"
		collection="canteen"
		field="_id,brand,name,kind"
		:where="`${new RegExp(props.currentName, 'i')}.test(name)`"
	>
		<view v-if="error">{{ error.message }}</view>
		<view v-else>
			<view
				class="item"
				v-for="item in data"
				:key="item._id"
				@click="goStoreDetail(item._id)"
			>
				<image
					class="brand"
					:src="item.brand"
					mode="aspectFill"
				></image>
				<view class="right">
					<view class="name">{{ item.name }}</view>
					<view class="kinds">
						<view
							class="kind"
							v-for="(kind, index) in item.kind"
							:key="index"
						>
							{{ kind.name }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</unicloud-db>
</template>

<script lang="ts" setup>
const props = defineProps<{ currentName: string }>();
const { shoppingCart } = useStore('canteen');
// 前往店铺详情
const goStoreDetail = (id: string) => {
	shoppingCart.value = [];
	uni.navigateTo({
		url: `/pages/StoreDetail/index?id=${id}`
	});
};
</script>

<style lang="scss" scoped>
.item {
	padding: 40rpx;
	display: flex;
	background-color: #fff;
	border-radius: 40rpx;
	margin-top: 30rpx;
	justify-content: space-between;
	.brand {
		width: 300rpx;
		height: 200rpx;
		border-radius: 20rpx;
	}
	.right {
		width: 300rpx;
		.name {
			font-weight: 900;
			font-size: 35rpx;
		}
		.kinds {
			display: flex;
			flex-wrap: wrap;
			.kind {
				padding: 5rpx;
				color: $uni-color-theme;
				border: $uni-color-theme;
			}
		}
	}
}
</style>
