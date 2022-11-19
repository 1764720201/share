export type Note = {
	_id?: string;
	headline: string;
	content: string;
	create_time?: number;
	user_id?: string;
	file: { url: string }[];
	city: string;
};
