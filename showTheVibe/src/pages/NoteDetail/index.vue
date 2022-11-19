<template>
	<view class="note-detail">
		<Publisher></Publisher>
		<content></content>
		<praise></praise>
		<comment></comment>
	</view>
	<tabbar></tabbar>
</template>

<script lang="ts" setup>
// 发布人
import Publisher from './publisher/index';
// 内容
import content from './content/index';
// 点赞
import praise from './praise/index';
// 底部栏
import tabbar from './tabbar/index';
// 评论
import comment from './comment/index';
const {
	getNoteDetail,
	getPublisher,
	getPraise,
	getAllPraise,
	getComment,
	publisher
} = useStore('note');
const { userId, getUserInfo } = useStore('user');
const { getAttention } = useStore('attention');
const { getCollect } = useStore('collect');
// 获取id
onLoad(async options => {
	// 获取用户信息
	await getUserInfo();
	// 获取笔记详情
	await getNoteDetail(options.id!);
	// 获取发布人的信息
	await getPublisher();
	// 获取所有关注
	getAttention(publisher.value._id);
	// 获取所有收藏
	getCollect(options.id!);
	// 获取所有点赞
	getAllPraise();
	// 获取评论
	getComment();
	// 获取本人点赞信息
	getPraise(userId.value);
});
</script>

<style lang="scss" scoped>
.note-detail {
	padding: 40rpx;
	padding-bottom: 150rpx;
}
</style>
