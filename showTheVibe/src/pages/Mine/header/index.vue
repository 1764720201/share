<template>
	<view class="header" @click="goLoginOrPersonal">
		<view class="left">
			<image
				:src="
					userInfo.avatar_file?.url
						? userInfo.avatar_file.url
						: '/static/other/login.png'
				"
				mode="aspectFill"
				class="avatar"
			></image>
			<view class="user-info">
				<view class="nickname">
					{{ userInfo.nickname ? userInfo.nickname : '点击登录' }}
				</view>
				<view class="city">
					{{ userInfo.city ? userInfo.city : '登陆更精彩' }}
				</view>
			</view>
		</view>
		<view class="homepage">
			个人主页
			<uni-icons type="right" size="18"></uni-icons>
		</view>
	</view>
</template>
<script lang="ts" setup>
const { getUserInfo, userInfo, userId } = useStore('user');
const goLoginOrPersonal = () => {
	if (!userInfo.value._id) {
		uni.navigateTo({
			url:
				'/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin'
		});
	} else {
		uni.navigateTo({
			url: `/pages/Homepage/index?id=${userId.value}`
		});
	}
};

// 获取用户信息
onShow(() => {
	getUserInfo();
});
</script>
<style lang="scss" scoped>
.header {
	justify-content: space-between;
	padding: 10rpx;
	display: flex;
	align-items: center;
	.left {
		display: flex;
		align-items: center;
		.avatar {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
		}
		.user-info {
			margin-left: 20rpx;
			height: 90rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.nickname {
				font-weight: 900;
				font-size: 40rpx;
			}
			.city {
				font-size: 27rpx;
				color: $uni-color-grey;
			}
		}
	}
	.homepage {
		display: flex;
		align-items: center;
		color: $uni-color-grey;
		font-size: 27rpx;
	}
}
</style>
