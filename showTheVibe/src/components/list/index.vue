<template>
	<view class="list">
		<unicloud-db
			v-slot:default="{ data, loading, error, options, hasMore }"
			collection="notes"
			field="_id,headline,user_id,file,create_time,city"
			ref="udb"
			orderby="create_time desc"
			:where="props.where"
		>
			<view v-if="error">{{ error.message }}</view>

			<view v-else class="list-page">
				<view
					class="item"
					v-for="item in data"
					:key="item._id"
					@click="goCommentDetail(item._id)"
				>
					<image
						class="image"
						:src="item.file[0].url"
						mode="widthFix"
					></image>
					<view class="headline">{{ item.headline }}</view>
					<view class="footer">
						<unicloud-db
							v-slot:default="{
								data
							}"
							collection="uni-id-users"
							:where="`_id=='${item.user_id}'`"
							field="nickname,avatar_file"
						>
							<view class="user-info">
								<image
									class="avatar"
									:src="data[0]?.avatar_file.url"
									mode="aspectFill"
								></image>
								<view class="nickname">
									{{ data[0]?.nickname }}
								</view>
							</view>
						</unicloud-db>
						<view class="praise">
							<uni-icons type="hand-up" size="20"></uni-icons>
							<unicloud-db
								v-slot:default="{
									data
								}"
								collection="praise"
								:where="`note_id=='${item._id}'&&type==0`"
							>
								{{ data.length }}
							</unicloud-db>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore status="nomore" v-if="!hasMore" />
			<u-loadmore status="loading" v-else />
		</unicloud-db>
	</view>
</template>

<script lang="ts" setup>
const props = defineProps<{ where: string }>();
// 前往评论详情
const goCommentDetail = (id: string) => {
	uni.navigateTo({
		url: `/pages/NoteDetail/index?id=${id}`
	});
};
const udb = ref();
onReachBottom(() => {
	udb.value.loadMore();
});
const refresh = () => {
	udb.value.refresh();
};
defineExpose({
	refresh
});
</script>

<style lang="scss" scoped>
.list {
	padding-bottom: 50rpx;
}
.list-page {
	margin-left: 18rpx;
	margin-top: 50rpx;
	column-count: 2;
	column-gap: 10rpx;
	.item {
		margin-bottom: 20rpx;
		break-inside: avoid;
		border-radius: 20rpx;
		width: 345rpx;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		.image {
			border-top-right-radius: 20rpx;
			border-top-left-radius: 20rpx;
			width: 100%;
		}
		.headline {
			padding: 20rpx;
			font-weight: 900;
		}
		.footer {
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			.user-info {
				display: flex;
				align-items: center;
				.avatar {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
				}
				.nickname {
					font-size: 24rpx;
					margin-left: 10rpx;
				}
			}
			.praise {
				display: flex;
				align-items: center;
			}
		}
	}
}
</style>
