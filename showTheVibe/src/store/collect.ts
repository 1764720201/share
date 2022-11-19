import { Collect } from '@/types/collect';
export default defineStore({
	id: 'collect',
	state: () => ({
		collectList: <string[]>[],
		ifCollect: <boolean>false,
		currentOption: <number>0
	}),
	getters: {
		userId: () => {
			//@ts-ignore
			return uniCloud.getCurrentUserInfo().uid;
		}
	},
	actions: {
		async getCollect(id: string) {
			const db = uniCloud.database();
			await db
				.collection('collect')
				.where(`user_id=='${this.userId}'`)
				.get()
				.then(res => {
					this.collectList = res.result.data.map((item: Collect) => {
						return item.note_id || item.canteen_id;
					});
					this.ifCollect = this.collectList.includes(id);
				});
		},
		async collectNote(noteId: string) {
			const db = uniCloud.database();
			if (!this.ifCollect) {
				await db.collection('collect').add({
					note_id: noteId,
					type: 0
				});
			} else {
				await db
					.collection('collect')
					.where(`user_id=='${this.userId}'&&note_id=='${noteId}'`)
					.remove();
			}
		},
		async collectStore(storeId: string) {
			const db = uniCloud.database();
			if (!this.ifCollect) {
				await db.collection('collect').add({
					canteen_id: storeId,
					type: 1
				});
			} else {
				await db
					.collection('collect')
					.where(
						`user_id=='${this.userId}'&&canteen_id=='${storeId}'`
					)
					.remove();
			}
		}
	}
});
