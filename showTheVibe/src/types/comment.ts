import { Praise } from './praise';
export type Comment = {
	_id: { praise: Praise[]; _value: string };
	user_id: string;
	create_time: number;
	note_id: string;
	content: string;
	input_type: string;
	comment_id?: string;
};
