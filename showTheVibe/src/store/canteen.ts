import { Canteen, ShoppingCart } from '@/types/canteen';
export default defineStore({
	id: 'canteen',
	state: () => ({
		storeDetail: <Canteen>{},
		storeDetailCopy: <Canteen>{},
		allGoods: <{ name: string; image: string }[]>[],
		currentGood: <string>'',
		shoppingCart: <ShoppingCart[]>[],
		recommend: <ShoppingCart[]>[],
		currentTime: '现在取餐',
		currentTableware: '不需要'
	}),
	getters: {
		shoppingCartName: state => {
			return state.shoppingCart.map(item => {
				return item.name;
			});
		},
		total: state => {
			return state.shoppingCart.reduce((pre, cur) => {
				return pre + cur.price * cur.num;
			}, 0);
		},
		totalNum: state => {
			return state.shoppingCart.reduce((pre, cur) => {
				return pre + cur.num;
			}, 0);
		}
	},
	actions: {
		async getStoreDetail(id: string) {
			const db = uniCloud.database();
			await db
				.collection('canteen')
				.where(`_id=='${id}'`)
				.get()
				.then(res => {
					// Objeact如果拷贝引用值是浅拷贝
					Object.assign(this.storeDetail, res.result.data[0]);
					// 深拷贝
					this.storeDetailCopy = JSON.parse(
						JSON.stringify(this.storeDetail)
					);
				});
		},
		async getAllGoods() {
			this.storeDetail.kind.forEach(item => {
				this.allGoods.push(
					...item.goods.map(i => {
						return { name: i.name, image: i.image };
					})
				);
			});
		},
		async getRecommend() {
			this.recommend.length = 0;
			this.recommend.push(
				...this.storeDetailCopy.kind.map(item => {
					return Object.assign(item.goods[0], { num: 1 });
				})
			);
			this.recommend.forEach((item, index) => {
				if (this.shoppingCartName.includes(item.name)) {
					this.recommend.splice(index, 1);
				}
			});
		}
	}
});
