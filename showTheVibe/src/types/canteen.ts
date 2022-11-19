export interface Kind {
	name: string;
	id: number;
	goods: Food[];
}
export interface Food {
	value: number;
	price: number;
	image: string;
	name: string;
}
export type Canteen = {
	_id: string;
	name: string;
	brand: string;
	kind: Kind[];
};
export interface ShoppingCart extends Food {
	num: number;
}
export type Option = {
	value: number;
	text: string;
};
