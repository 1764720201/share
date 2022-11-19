import { Order } from '@/types/order';
export default defineStore({
	id: 'order',
	state: () => ({
		currentOption: <number>0,
		orderDetail: <Order>{}
	}),
	getters: {
		scheduledTime: state => {
			switch (state.orderDetail.time) {
				case '现在取餐':
					return state.orderDetail.create_time;
				case '10分钟后到店':
					return state.orderDetail.create_time + 60 * 10 * 1000;
				case '20分钟后到店':
					return state.orderDetail.create_time + 60 * 1000 * 20;
				case '30分钟后到店':
					return state.orderDetail.create_time + 60 * 1000 * 30;
			}
		}
	},
	actions: {
		async getOrderDetail(id: string) {
			const db = uniCloud.database();
			await db
				.collection('order')
				.where(`_id=='${id}'`)
				.get()
				.then(res => {
					Object.assign(this.orderDetail, res.result.data[0]);
				});
		}
	}
});
