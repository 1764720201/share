<template>
	<view class="praise">
		<view class="praise-btn" @click="praise">
			<uni-icons
				type="hand-up"
				size="28"
				:color="ifPraise ? '#ec673a' : '#000'"
			></uni-icons>
			<view class="praise-num">{{ praiseNum }}</view>
		</view>
		<view class="praise-people">
			<view class="item" v-for="item in praiseList" :key="item._id">
				<unicloud-db
					v-slot:default="{ data }"
					collection="uni-id-users"
					field="nickname,avatar_file,_id"
					:where="`_id=='${item.user_id}'`"
				>
					<image
						class="avatar"
						:src="data[0]?.avatar_file.url"
						mode="aspectFill"
					></image>
				</unicloud-db>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
const { userId } = useStore('user');
const {
	praiseNum,
	ifPraise,
	praiseBtn,
	getPraise,
	getAllPraise,
	praiseList
} = useStore('note');
const praise = async () => {
	await praiseBtn(userId.value);
	getPraise(userId.value);
	getAllPraise();
};
</script>

<style lang="scss" scoped>
.praise {
	margin-top: 50rpx;
	padding: 15rpx 0;
	border-top: 1rpx solid #ccc;
	border-bottom: 1rpx solid #ccc;
	display: flex;
	&-btn {
		display: flex;
		align-items: center;
		flex-direction: column;
		font-size: 25rpx;
	}
	&-people {
		display: flex;
		align-items: center;
		.item {
			margin-left: 20rpx;
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}
		}
	}
}
</style>
