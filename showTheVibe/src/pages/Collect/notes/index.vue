<template>
	<unicloud-db
		v-slot:default="{ data, loading, error, options }"
		collection="collect"
		:where="`type==${currentOption}&&user_id=='${userId}'`"
		field="_id,canteen_id,note_id,create_time"
		ref="udb"
	>
		<view v-if="error">{{ error.message }}</view>
		<view v-else>
			<view class="list">
				<view v-for="item in data" :key="item._id">
					<unicloud-db
						v-slot:default="{ data }"
						collection="notes"
						:where="`_id=='${item.note_id}'`"
						field="file,_id,city,user_id,headline"
					>
						<view
							v-for="item in data"
							:key="item._id"
							class="item"
							@click="goNote(item._id)"
						>
							<image
								:src="item.file[0]?.url"
								mode="aspectFill"
								class="image"
							></image>
							<view class="right">
								<view class="header">
									<view class="headline">
										{{ item.headline }}
									</view>
									<view class="time">
										{{
											dayjs(item.create_time).format(
												'YYYY-MM-DD'
											)
										}}
									</view>
								</view>
								<view class="city">{{ item.city }}</view>
								<view class="footer">
									<unicloud-db
										v-slot:default="{
											data
										}"
										collection="uni-id-users"
										:where="`_id=='${item.user_id}'`"
										field="avatar_file,nickname"
									>
										<view class="user-info">
											<image
												:src="data[0]?.avatar_file?.url"
												mode="aspectFill"
												class="avatar"
											></image>
											<view class="nickname">
												{{ data[0]?.nickname }}
											</view>
										</view>
									</unicloud-db>
									<view
										class="cancel"
										@click.stop="cancelCollect(item._id)"
									>
										取消收藏
									</view>
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

// 前往笔记
const goNote = (id: string) => {
	uni.navigateTo({
		url: `/pages/NoteDetail/index?id=${id}`
	});
};
const udb = ref();

const db = uniCloud.database();
// 取消收藏
const cancelCollect = async (id: string) => {
	await db
		.collection('collect')
		.where(`note_id=='${id}'&&user_id=='${userId.value}'`)
		.field('_id')
		.get()
		.then(res => {
			udb.value.remove(res.result.data[0]._id, {
				confirmContent: '是否取消收藏',
				success: () => {
					uni.showToast({
						title: '已取消收藏',
						icon: 'none'
					});
				}
			});
		});
};
</script>

<style lang="scss" scoped>
.list {
	.item {
		padding: 20rpx;
		background-color: #fff;
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
		.image {
			width: 200rpx;
			height: 200rpx;
		}
		.right {
			display: flex;
			flex-direction: column;
			height: 200rpx;
			justify-content: space-between;
			width: 480rpx;
			.header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.headline {
					font-size: 33rpx;
					font-weight: 900;
					width: 60%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.time {
					color: #666;
				}
			}
			.city {
				font-size: 25rpx;
				color: #666;
			}
			.footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.user-info {
					display: flex;
					align-items: center;
					.avatar {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
					}
					.nickname {
						margin-left: 10rpx;
						font-size: 23rpx;
						color: #666;
					}
				}
			}
		}
	}
}
</style>
