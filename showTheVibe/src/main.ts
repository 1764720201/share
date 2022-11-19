import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';

import uView from './uni_modules/vk-uview-ui';
import App from './App.vue';
import mitt from 'mitt';
const Mitt = mitt();
declare module 'vue' {
	export interface ComponentCustomProperties {
		$Bus: typeof Mitt;
	}
}
export function createApp() {
	const app = createSSRApp(App);
	app.use(Pinia.createPinia());
	app.use(uView);
	app.config.globalProperties.$Bus = Mitt;
	return {
		app,
		Pinia
	};
}
