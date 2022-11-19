<template>
	<view class="personage">
		<view class="title">个人资料</view>
		<view class="list">
			<view class="item" @click="goAvatar">
				<view class="t-icon t-icon-xiugaitouxiang"></view>
				修改头像
			</view>
			<view class="item" @click="openPopup(0)">
				<view class="t-icon t-icon-nicheng"></view>
				修改昵称
			</view>
			<view class="item" @click="openPopup(1)">
				<view class="t-icon t-icon-ditudingwei"></view>
				修改个签
			</view>
			<view class="item" @click="mutations.logout()">
				<view class="t-icon t-icon-tuichudenglu"></view>
				退出登录
			</view>
		</view>
	</view>
	<uni-popup ref="popup" type="center">
		<view class="modification-nickname">
			<view class="confirm" @click="confirm">确认</view>
			<input
				type="text"
				:placeholder="placeholder"
				class="input"
				v-model="content"
			/>
		</view>
	</uni-popup>
</template>
<script lang="ts" setup>
import { mutations } from '@/uni_modules/uni-id-pages/common/store.js';
const { getUserInfo } = useStore('user');
const placeholder = ref<string>('');
// 前往修改头像
const goAvatar = () => {
	uni.navigateTo({
		url: '/uni_modules/uni-id-pages/pages/userinfo/avatar/index'
	});
};
const popup = ref();
const modifyType = ref<number>(0);
// 打开修改的弹出层
const openPopup = (type: number) => {
	modifyType.value = type;
	if (!type) {
		placeholder.value = '请输入要修改的昵称';
	} else {
		placeholder.value = '请输入要修改的个签';
	}
	popup.value.open();
};
const db = uniCloud.database();
const content = ref<string>('');
// 确认修改
const confirm = async () => {
	const title = ref('');
	if (!modifyType.value) {
		title.value = '请输入昵称';
	} else {
		title.value = '请输入个签';
	}
	if (!content.value) {
		uni.showToast({
			title: title.value,
			icon: 'error'
		});
	} else {
		if (!modifyType.value) {
			await db
				.collection('uni-id-users')
				.where('_id==$cloudEnv_uid')
				.update({
					nickname: content.value
				});
		} else {
			await db
				.collection('uni-id-users')
				.where('_id==$cloudEnv_uid')
				.update({
					signature: content.value
				});
		}
		getUserInfo();
		content.value = '';
		popup.value.close();
		uni.showToast({
			title: '修改成功'
		});
	}
};
</script>
<style lang="scss" scoped>
.personage {
	margin-top: 100rpx;
	.title {
		font-size: 32rpx;
		font-weight: 900;
	}
	.list {
		display: flex;
		align-items: center;
		margin-top: 50rpx;
		.item {
			width: 25%;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: space-between;
			.t-icon {
				width: 50rpx;
				height: 50rpx;
				margin-bottom: 10rpx;
			}
		}
	}
}
.modification-nickname {
	padding: 30rpx;
	background-color: #fff;
	height: 250rpx;
	border-radius: 30rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.input {
		padding: 30rpx;
		border-radius: 30rpx;
		width: 500rpx;
		height: 60rpx;
		background-color: #ededed;
		font-size: 30rpx;
	}
	.confirm {
		align-self: flex-end;
		border: 1rpx solid $uni-color-theme;
		color: $uni-color-theme;
		padding: 5rpx 10rpx;
		border-radius: 20rpx;
	}
}
</style>
