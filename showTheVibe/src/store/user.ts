import { Userinfo } from '@/types/user';
import amap from '../common/amap-wx.130.js';
export default defineStore({
	id: 'user',
	state: () => {
		return {
			userInfo: <Userinfo>{},
			currentCity: <{ cityName: string; cityCode: number }>{
				cityName: '北京',
				cityCode: 110100
			}
		};
	},
	getters: {
		userId(state) {
			return state.userInfo._id;
		}
	},
	actions: {
		async getUserInfo() {
			const db = uniCloud.database();
			await db
				.collection('uni-id-users')
				.where('_id==$cloudEnv_uid')
				.field('_id,nickname,avatar_file,city,signature')
				.get()
				.then(res => {
					Object.assign(this.userInfo, res.result.data[0]);
				});
		},
		async getCity() {
			const db = uniCloud.database();
			const amapPlugin = new amap.AMapWX({
				key: 'b675910771e04f68544a7cc6492f034f'
			});
			await amapPlugin.getRegeo({
				success: async (data: any) => {
					const addressComponent =
						data[0].regeocodeData.addressComponent;
					await db
						.collection('uni-id-users')
						.where(`_id=='${this.userId}'`)
						.update({
							city: addressComponent.city
						})
						.catch(() => {
							this.userInfo.city = '北京';
						});
					this.currentCity.cityCode = addressComponent.adcode;
					this.currentCity.cityName = addressComponent.city;
					this.getUserInfo();
				},
				fail: () => {
					this.currentCity.cityCode = 110100;
					this.currentCity.cityName = '北京';
				}
			});
		}
	}
});
