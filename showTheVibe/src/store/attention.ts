import { Attention } from '@/types/attention';
export default defineStore({
	id: 'attention',
	state: () => ({
		attentionList: <string[]>[],
		ifAttention: <boolean>false
	}),
	getters: {
		userId: (): string => {
			// @ts-ignore 获取自己的id
			return uniCloud.getCurrentUserInfo().uid;
		}
	},
	actions: {
		async getAttention(id: string) {
			const db = uniCloud.database();
			await db
				.collection('attention')
				.where(`user_id=='${this.userId}'`)
				.field('attention_id')
				.get()
				.then(res => {
					if (res.result.data.length > 0) {
						this.attentionList = res.result.data.map(
							(item: Attention) => {
								return item.attention_id;
							}
						);
					}
				});
			this.ifAttention = this.attentionList.includes(id);
		},
		async addAttention(id: string) {
			const db = uniCloud.database();
			await db.collection('attention').add({
				attention_id: id
			});
		},
		async cancel(id: string) {
			const db = uniCloud.database();
			await db
				.collection('attention')
				.where(`attention_id=='${id}'`)
				.remove();
		}
	}
});
