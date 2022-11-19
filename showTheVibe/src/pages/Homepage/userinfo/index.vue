<template>
	<view class="user-info">
		<view class="header">
			<image
				class="avatar"
				:src="homepage.avatar_file?.url"
				mode="aspectFill"
			></image>
			<view class="right">
				<view class="nickname">{{ homepage.nickname }}</view>
				<view class="city">{{ homepage.city }}</view>
				<view class="introduce">
					{{
						homepage.signature
							? homepage.signature
							: '还没有简介哦~'
					}}
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="fans">
				<view class="fans-num">{{ fanNum }}</view>
				粉丝
			</view>
			<view class="attention">
				<view class="attention-num">{{ attentionNum }}</view>
				关注
			</view>
			<view class="praise">
				<view class="praise-num">{{ allPraise }}</view>
				获赞
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
const { homepage, allPraise, attentionNum, fanNum } = useStore('homepage');
</script>

<style lang="scss" scoped>
.user-info {
	background-color: #fff;
	border-bottom-left-radius: 40rpx;
	border-bottom-right-radius: 40rpx;
	padding: 30rpx;
	.header {
		display: flex;
		align-items: center;
		.avatar {
			width: 180rpx;
			height: 180rpx;
			border-radius: 50%;
			box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.2);
		}
		.right {
			margin-left: 20rpx;
			height: 150rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.nickname {
				font-weight: 900;
			}
		}
	}
	.footer {
		display: flex;
		margin-left: -30rpx;
		margin-top: 70rpx;
		.fans,
		.attention,
		.praise {
			margin-left: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 23rpx;
			color: #666;
			&-num {
				font-size: 40rpx;
				font-weight: 900;
			}
		}
	}
}
</style>
