<template>
	<unicloud-db
		v-slot:default="{ data, loading, error, options }"
		collection="collect"
		:where="`type==${currentOption}&&user_id=='${userId}'`"
		field="canteen_id,_id"
		ref="udb"
	>
		<view v-if="error">{{ error.message }}</view>
		<view v-else>
			<view class="list">
				<view v-for="item in data" :key="item._id">
					<unicloud-db
						v-slot:default="{ data }"
						collection="canteen"
						:where="`_id=='${item.canteen_id}'`"
						field="_id,brand,name"
					>
						<view class="itme" @click="goStoreDetail(data[0]?._id)">
							<image
								class="image"
								:src="data[0]?.brand"
								mode="aspectFill"
							></image>
							<view class="right">
								<view class="name">{{ data[0]?.name }}</view>
								<view class="time">
									{{
										dayjs(item.create_time).format(
											'YYYY - MM - DD'
										)
									}}
								</view>
								<view
									class="cancel"
									@click.stop="cancel(data[0]?._id)"
								>
									取消收藏
								</view>
							</view>
						</view>
					</unicloud-db>
				</view>
			</view>
		</view>
	</unicloud-db>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
const { currentOption, userId } = useStore('collect');
// 前往餐厅详情
const goStoreDetail = (id: string) => {
	uni.navigateTo({
		url: `/pages/StoreDetail/index?id=${id}`
	});
};
const db = uniCloud.database();
const udb = ref();
// 取消收藏
const cancel = async (id: string) => {
	await db
		.collection('collect')
		.where(`canteen_id=='${id}'&&user_id=='${userId.value}'`)
		.get()
		.then(res => {
			udb.value.remove(res.result.data[0]._id);
		});
};
</script>

<style lang="scss" scoped>
.list {
	.itme {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: #fff;
		display: flex;
		.image {
			width: 400rpx;
			height: 250rpx;
		}
		.right {
			margin-left: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.name {
				font-weight: 900;
				font-size: 33rpx;
				.time {
					font-size: 23rpx;
					color: #666;
				}
			}
		}
	}
}
</style>
