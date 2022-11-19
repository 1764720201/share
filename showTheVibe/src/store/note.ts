import { Note } from '@/types/notes';
import { Userinfo } from '@/types/user';
import { Praise } from '@/types/praise';
import { Comment } from '@/types/comment'
export default defineStore({
	id: 'note',
	state: () => ({
		noteDetail: <Note>{},
		publisher: <Userinfo>{},
		praise: <Praise>{},
		praiseList: <Praise[]>[],
		commentList:<Comment[]>[]
	}),
	actions: {
		async getNoteDetail(id: string) {
			const db = uniCloud.database();
			await db
				.collection('notes')
				.where(`_id=='${id}'`)
				.get()
				.then(res => {
					Object.assign(this.noteDetail, res.result.data[0]);
				});
		},
		async getPublisher() {
			const db = uniCloud.database();
			await db
				.collection('uni-id-users')
				.where(`_id=='${this.noteDetail.user_id}'`)
				.field('_id,nickname,avatar_file')
				.get()
				.then(res => {
					console.log(res.result.data[0]);
					Object.assign(this.publisher,res.result.data[0])
					
				});
		},
		async praiseBtn(userId: string) {
			const db = uniCloud.database();
			if (this.ifPraise) {
				await db
					.collection('praise')
					.where(`note_id=='${this.noteId}'&&user_id=='${userId}'&&type==0`)
					.remove();
			} else {
				await db.collection('praise').add({
					note_id: this.noteId,
					type:0
				});
			}
		},
		async getPraise(userId: string) {
			const db = uniCloud.database();
			await db
				.collection('praise')
				.where(`user_id=='${userId}'&&note_id=='${this.noteId}'&&type==0`)
				.get()
				.then(res => {
					this.praise = res.result.data[0];
				});
		},
		async getAllPraise() {
			const db = uniCloud.database();
			await db
				.collection('praise')
				.where(`note_id=='${this.noteId}'&&type==0`)
				.get()
				.then(res => {
					this.praiseList = res.result.data;
				});
		},
		async getComment() {
			const db=uniCloud.database()
			const praise = db.collection('praise').getTemp();
			await db
				.collection('comment', praise)
				.where(`note_id=='${this.noteId}'`)
				.orderBy('create_time','desc')
				.get()
				.then(res => {				
					this.commentList=res.result.data
				}).catch(e=>{
					console.log(e);
				});
		}
	},
	getters: {
		ifPraise: state => state.praise?._id ? true : false,
		noteId: state => state.noteDetail._id || '',
		praiseNum: state =>state.praiseList.length || 0,
		commentNum:state=>state.commentList.length || 0,
	}
});
