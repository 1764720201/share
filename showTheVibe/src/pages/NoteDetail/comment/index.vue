<template>
	<view class="header">
		<view class="comment">评论</view>
		<view class="comment-num">({{ commentNum }})</view>
	</view>
	<view class="user-info">
		<image
			class="avatar"
			:src="userInfo.avatar_file?.url"
			mode="aspectFill"
		></image>
		<view class="input" @click="openInputPopup(0)">
			<view class="input-placeholder">快来写下你的评论吧~</view>
		</view>
	</view>
	<view class="comment-list">
		<view class="item" v-for="item in commentList" :key="item._id._value">
			<view class="header">
				<unicloud-db
					v-slot:default="{ data }"
					collection="uni-id-users"
					:where="`_id=='${item.user_id}'`"
					field="avatar_file,nickname,_id"
				>
					<view class="user-info">
						<image
							:src="data[0]?.avatar_file?.url"
							mode="aspectFill"
							class="avatar"
							@click="goHomepage(data[0]._id)"
						></image>
						<view class="right" @click="openInputPopup(1, item)">
							<view class="nickname">
								{{ data[0]?.nickname }}
							</view>
							<view class="time">
								<uni-dateformat
									:date="item.create_time"
									:threshold="[60000, 3600000]"
									format="yyyy-MM-dd"
								></uni-dateformat>
							</view>
						</view>
					</view>
				</unicloud-db>
				<view class="praise" @click="praise(item._id._value)">
					<uni-icons
						type="hand-up-filled"
						size="24"
						:color="
							item._id.praise
								.map((item: Praise) => item.user_id)
								.indexOf(userId) != -1
								? '#ec673a'
								: '#666'
						"
					></uni-icons>
					{{ item._id?.praise?.length }}
				</view>
			</view>
			<view class="content" @click="openInputPopup(1, item)">
				{{ item.content }}
				<view v-if="item?.comment_id">
					<unicloud-db
						v-slot:default="{ data }"
						collection="comment"
						:where="`_id=='${item.comment_id}'`"
						field="content,user_id,_id"
					>
						<view class="item" v-for="item in data" :key="item._id">
							<unicloud-db
								v-slot:default="{
									data
								}"
								collection="uni-id-users"
								:where="`_id=='${item.user_id}'`"
								field="nickname"
							>
								<view class="nickname">
									{{ data[0]?.nickname }}
								</view>
							</unicloud-db>
							<view class="reply">{{ item.content }}</view>
						</view>
					</unicloud-db>
				</view>
			</view>
		</view>
	</view>
	<uni-popup ref="inputPopup" type="bottom">
		<view class="input-popup">
			<view class="header">
				<view class="cancel" @click="cancel">取消</view>
				<view class="title">回复</view>
				<view class="confirm" @click="comfirmComment">确认</view>
			</view>
			<input
				type="text"
				class="input"
				:placeholder="placeholder"
				v-model="content"
			/>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
import { Praise } from '@/types/praise'
import { Comment } from '@/types/comment'
const { userInfo, userId } = useStore('user');
const { noteId, commentList, commentNum, getComment } = useStore('note');
const placeholder=ref<string>('')
const inputPopup = ref();
const inputType = ref<number>(0);
const content = ref<string>('');
const commentId=ref<string>('')
// 打开底部输入弹出层
const openInputPopup = (type: number,item?:Comment) => {
	inputType.value = type;
	if(!type){
		placeholder.value='快来写下你的评论吧'
	}else{
		commentId.value=item?._id._value!
		db.collection('uni-id-users')
		.where(`_id=='${item?.user_id}'`)
		.field('nickname')
		.get()
		.then((res)=>{
			placeholder.value=`@${res.result.data[0].nickname}`
		})
	}
	inputPopup.value.open();
};
// 取消评论
const cancel = () => {
	inputPopup.value.close();
};

// 监听打开输入
const instance=getCurrentInstance()

onLoad(()=>{
	instance?.proxy?.$Bus.on('openInputPopup',(type)=>{
		openInputPopup(type as number)
	})
})
// 关闭页面时卸载监听
onUnload(()=>{
	instance?.proxy?.$Bus.all.clear()
})
const db = uniCloud.database();
// 确认评论
const comfirmComment = async () => {
	if (!content.value) {
		uni.showToast({
			title: '输入评论不能为空',
			icon: 'none'
		});
		return;
	}
	if (!inputType.value) {
		await db.collection('comment').add({
			note_id: noteId.value,
			content: content.value,
			input_type: inputType.value
		});
		uni.showToast({
			title: '评论成功',
			icon: 'none'
		});
	} else {
		await db.collection('comment').add({
			note_id: noteId.value,
			content: content.value,
			input_type: inputType.value,
			comment_id:commentId.value
		});
	}
	await getComment()
	inputPopup.value.close();
	content.value=''
};

const praise = async (id: string) => {
	await db
		.collection('praise')
		.where(`user_id=='${userId.value}'&&comment_id=='${id}'`)
		.get()
		.then(res => {
			if (res.result.data.length > 0) {
				db.collection('praise')
					.where(`user_id=='${userId.value}'&&comment_id=='${id}'`)
					.remove();
			} else {
				db.collection('praise').add({
					comment_id: id,
					note_id: noteId.value,
					type: 1
				});
			}
		});
	getComment();
};

// 前往个人空间
const goHomepage=(id:string)=>{
	uni.navigateTo({
		url:`/pages/Homepage/index?id=${id}`
	})
}
</script>

<style lang="scss" scoped>
.header {
	padding: 20rpx 0;
	display: flex;
	align-items: center;
	.comment {
		font-size: 45rpx;
		font-weight: 900;
	}
	.comment-num {
		margin-left: 10rpx;
		color: #666;
	}
}
.user-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	.avatar {
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
	}
	.input {
		background-color: #dfdfdf;
		width: 83%;
		border-radius: 30rpx;
		&-placeholder {
			padding: 20rpx 40rpx;
		}
	}
}
.comment-list {
	.item {
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.user-info {
				display: flex;
				align-items: center;
				.right {
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 80rpx;
					.nickname {
						color: #506d85;
					}
					.time {
						font-size: 25rpx;
						color: #666;
					}
				}
			}
		}
		.content {
			margin-left: 108rpx;
			border-bottom: 3rpx solid #ccc;
			padding-bottom: 30rpx;
			.item {
				padding-left: 10rpx;
				margin-top: 20rpx;
				border-left: 5rpx solid #adadad;
				.nickname {
					color: #506d85;
				}
				.reply {
					margin-top: 10rpx;
				}
			}
		}
	}
}
.input-popup {
	height: 300rpx;
	padding: 15rpx 30rpx;
	background-color: #fff;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.confirm {
			color: $uni-color-theme;
		}
		.title {
			font-weight: 900;
			font-size: 35rpx;
		}
	}
	.input {
		padding: 15rpx 30rpx;
		background-color: #e4e4e4;
		border-radius: 30rpx;
	}
}
</style>
