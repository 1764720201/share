<template>
	<view class="tabbar">
		<view class="praise" @click="praise">
			<uni-icons
				type="hand-up"
				size="30"
				:color="ifPraise ? '#ec673a' : '#000'"
			></uni-icons>
			<view class="praise-num" v-if="praiseNum > 0">{{ praiseNum }}</view>
		</view>
		<view class="comment" @click="comment">
			<uni-icons type="chat" size="30"></uni-icons>
			<view class="comment-num" v-if="commentNum > 0">
				{{ commentNum }}
			</view>
		</view>
		<uni-icons
			@click="collect"
			type="star"
			size="30"
			:color="ifCollect ? '#ec673a' : '#000'"
		/>
	</view>
</template>

<script lang="ts" setup>
const {
	praiseBtn,
	getPraise,
	ifPraise,
	getAllPraise,
	praiseNum,
	commentNum,
	noteId
} = useStore('note');
const { userId } = useStore('user');

const {ifCollect,collectNote,getCollect}=useStore('collect')

// 点赞
const praise = async () => {
	await praiseBtn(userId.value);
	await getPraise(userId.value);
	getAllPraise();
};
const instance=getCurrentInstance()
// 评论
const comment=()=>{
	instance?.proxy?.$Bus.emit('openInputPopup',0)
}

// 收藏
const collect=async()=>{
	await collectNote(noteId.value)
	getCollect(noteId.value)
}
</script>

<style lang="scss" scoped>
.tabbar {
	width: 100%;
	position: fixed;
	bottom: 0;
	padding: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	box-shadow: 0 0 10rpx #ccc;
	height: 120rpx;
	background-color: #ebeaeb;
	.praise,
	.comment {
		position: relative;
		&-num {
			position: absolute;
			top: 0%;
			left: 50rpx;
			font-size: 20rpx;
		}
	}
}
</style>
