import { Userinfo } from '@/types/user';
import { Comment } from '@/types/comment';
import { Attention } from '@/types/attention';
export default defineStore({
	id: 'homepage',
	state: () => ({
		homepage: <Userinfo>{},
		allNote: <Comment[]>[],
		attentionNum: <number>0,
		fanNum: <number>0
	}),
	getters: {
		allPraise: state => {
			return state.allNote.reduce((pre, cur) => {
				return pre + cur._id.praise.length;
			}, 0);
		}
	},
	actions: {
		async getHomepage(id: string) {
			const db = uniCloud.database();
			await db
				.collection('uni-id-users')
				.where(`_id=='${id}'`)
				.field('nickname,avatar_file,city,_id,signature')
				.get()
				.then(res => {
					this.homepage = res.result.data[0];
				});
		},
		async getNotePraise() {
			const db = uniCloud.database();
			const praise = db
				.collection('praise')
				.where('type==0')
				.getTemp();
			await db
				.collection('notes', praise)
				.where(`user_id=='${this.homepage._id}'`)
				.get()
				.then(res => {
					this.allNote = res.result.data;
				});
		},
		async getAttention() {
			const db = uniCloud.database();
			await db
				.collection('attention')
				.where(`user_id=='${this.homepage._id}'`)
				.count()
				.then(res => {
					this.attentionNum = res.result.total;
				});
		},
		async getFans() {
			const db = uniCloud.database();
			await db
				.collection('attention')
				.where(`attention_id=='${this.homepage._id}'`)
				.count()
				.then(res => {
					this.fanNum = res.result.total;
				});
		}
	}
});
