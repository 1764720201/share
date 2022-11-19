<template>
	<view class="content">
		<view class="text">
			{{ noteDetail.headline }}
			<br />
			{{ noteDetail.content }}
		</view>
		<view class="image-list">
			<view class="item" v-for="item in noteDetail.file">
				<image class="image" :src="item.url" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
const { noteDetail } = useStore('note');
</script>

<style lang="scss" scoped>
.content {
	.text {
		margin-top: 30rpx;
	}
	.image-list {
		margin-top: 30rpx;
		display: flex;
		flex-wrap: wrap;
		border-radius: 20rpx;
		overflow: hidden;
		justify-content: space-between;
		align-content: space-between;
		margin-bottom: -10rpx;
		&::after {
			content: ' ';
			width: 30%;
		}
		.item {
			margin-bottom: 10rpx;
			height: 218rpx;
			width: 218rpx;
			.image {
				width: 100%;
				height: 100%;
			}
			&:nth-last-of-type(-n + 3) {
				margin-bottom: -10rpx;
			}
		}
	}
}
</style>
