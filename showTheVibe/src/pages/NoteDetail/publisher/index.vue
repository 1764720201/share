<template>
	<view class="publisher">
		<view class="user-info">
			<image
				class="avatar"
				:src="publisher?.avatar_file?.url"
				mode="aspectFill"
				@click="goHomepage"
			></image>
			<view class="right">
				<view class="name">{{ publisher?.nickname }}</view>
				<view class="time">
					<uni-dateformat
						:date="noteDetail.create_time"
						format="MM月dd日 hh:mm"
					></uni-dateformat>
					<text class="publish">发布笔记</text>
				</view>
			</view>
		</view>
		<view class="attention" v-if="!ifAttention" @click="attention">
			关注
		</view>
		<view class="cancel-attention" v-else @click="cancelAttention">
			已关注
		</view>
	</view>
</template>

<script lang="ts" setup>
const { publisher, noteDetail } = useStore('note');
const { getAttention, ifAttention, addAttention, cancel } = useStore(
	'attention'
);

// 前往个人空间
const goHomepage = () => {
	uni.navigateTo({
		url: `/pages/Homepage/index?id=${publisher.value._id}`
	});
};
// 关注
const attention = async () => {
	await addAttention(publisher.value._id);
	getAttention(publisher.value._id);
};
// 取消关注
const cancelAttention = async () => {
	await cancel(publisher.value._id);
	getAttention(publisher.value._id);
};
</script>

<style lang="scss" scoped>
.publisher {
	display: flex;
	align-items: center;
	justify-content: space-between;
	.user-info {
		display: flex;
		align-items: center;
		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
		}
		.right {
			margin-left: 20rpx;
			.name {
				color: #506d85;
			}
			.time {
				font-size: 25rpx;
				color: #666;
				.publish {
					margin-left: 10rpx;
					color: #000;
				}
			}
		}
	}
	.attention {
		border: $uni-color-theme 3rpx solid;
		color: $uni-color-theme;
		padding: 6rpx 30rpx;
		border-radius: 30rpx;
	}
	.cancel-attention {
		border: 1rpx solid #ccc;
		padding: 6rpx 25rpx;
		border-radius: 30rpx;
	}
}
</style>
