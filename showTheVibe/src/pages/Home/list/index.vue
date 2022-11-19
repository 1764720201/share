<template>
	<view class="list">
		<view class="header">
			<view class="publish" @click="publish">发布</view>
		</view>
	</view>
	<List :where="`city=='${currentCity.cityName}'`" ref="list"></List>
	<uni-popup ref="publishPopup" type="bottom">
		<view class="publish-popup">
			<view class="header">
				<view class="cancel" @click="cancelPublish">取消</view>
				<view class="title">发笔记</view>
				<view class="disclose">我要吐槽</view>
			</view>
			<view class="content">
				<uni-file-picker
					v-model="note.file"
					fileMediatype="image"
					mode="grid"
					:imageStyles="imageStyles"
				>
					<view class="upload">
						<view class="t-icon t-icon-paizhao"></view>
						<view class="text">上传图片</view>
					</view>
				</uni-file-picker>
				<view class="headline">
					<input
						type="text"
						class="headline-input"
						placeholder="填写标题更容易上首页哦~"
						placeholder-style="color:#ccc;"
						v-model="note.headline"
					/>
				</view>
				<view class="detail">
					<textarea
						class="detail-textarea"
						placeholder="吃喝玩乐宝藏第都可以用笔记分享哦~"
						placeholder-style="color:#ccc;"
						v-model="note.content"
					></textarea>
				</view>
			</view>
			<view class="tabbar">
				<view class="publish" @click="confirmPublish">发布</view>
			</view>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
import type {Note} from '@/types/notes'
const {userInfo,currentCity}=useStore('user')

// 点击发布按钮,打开底部弹出层
const publishPopup = ref();
const publish = () => {
	publishPopup.value.open();
};
// 取消发布
const cancelPublish = () => {
	publishPopup.value.close();
};
// 发布样式
const imageStyles = reactive({
	width: 90,
	height: 90,
	border: {
		style: 'dashed',
		color: '#666'
	}
});
const note = reactive<Note>({
	headline: '',
	content:'',
	file:[],
	city:''
});

const next=ref<boolean>(false)
const remind=(foo:string|{url:string}[],title:string)=>{
	if(next.value){
		if(!foo||foo.length==0){
			uni.showToast({
				title
			})
			next.value=false
		}else{
			next.value=true
		}
	}
}
const list=ref()
const db=uniCloud.database()
// 确认发布
const confirmPublish = async() => {
	next.value=true
	remind(note.file,'请上传图片')
	remind(note.headline,'请输入标题!')
	remind(note.content,'请输入内容')
	note.city=userInfo.value.city
	if(next.value){
		await db.collection('notes').add(note)
		list.value.refresh()
		publishPopup.value.close();
	}
};
</script>

<style lang="scss" scoped>
.list {
	padding: 20rpx;
	.header {
		display: flex;
		justify-content: flex-end;
		.publish {
			background-color: $uni-color-theme;
			color: #fff;
			width: 100rpx;
			height: 60rpx;
			border-radius: 30rpx;
			line-height: 60rpx;
			text-align: center;
		}
	}
}
.publish-popup {
	height: 1200rpx;
	background-color: #fff;
	border-top-right-radius: 30rpx;
	border-top-left-radius: 30rpx;
	padding: 30rpx;
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title {
			font-size: 35rpx;
		}
		.cancel {
			font-weight: 900;
			font-size: 30rpx;
		}
	}
	.content {
		margin-top: 50rpx;
		.upload {
			background-color: #efefef;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 30rpx 0;
			margin-left: 4rpx;
			.t-icon {
				width: 70rpx;
				height: 70rpx;
			}
			.text {
				margin-top: 10rpx;
				text-align: center;
				width: 153rpx;
				font-size: 23rpx;
				color: #666;
			}
		}
		.headline {
			border-bottom: 1rpx solid #ccc;
			padding: 30rpx 0;
			&-input {
				font-size: 35rpx;
				font-weight: 900;
			}
		}
		.detail {
			padding: 20rpx 0;
			&-textarea {
				font-size: 30rpx;
				width: 100%;
			}
		}
	}
	.tabbar {
		position: fixed;
		bottom: 70rpx;
		left: 0;
		display: flex;
		justify-content: center;
		width: 100%;
		align-items: center;
		height: 130rpx;
		box-shadow: 0 0 5rpx #ccc;
		.publish {
			background-color: $uni-color-theme;
			color: #fff;
			width: 90%;
			height: 80rpx;
			border-radius: 50rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 30rpx;
		}
	}
}
</style>
