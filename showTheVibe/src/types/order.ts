import { ShoppingCart } from './canteen';
export type Order = {
	_id: string;
	goods: ShoppingCart[];
	time: string;
	create_time: number;
	status: number;
	store_name: string;
	total: number;
	pay_mode: string;
	tableware: string;
};
