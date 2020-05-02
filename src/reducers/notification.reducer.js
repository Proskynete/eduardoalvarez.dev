/* eslint-disable import/no-unresolved */
import { SHOW_NOTIFICATION, CLEAN_NOTIFICATION } from '@Config/constants';

const initialState = {
	show: false,
	text: '',
	type: '',
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SHOW_NOTIFICATION:
			return {
				...state,
				show: action.payload.data.show,
				text: action.payload.data.text,
				type: action.payload.data.type,
			};
		case CLEAN_NOTIFICATION:
			return {
				...state,
				show: action.payload.show,
				text: action.payload.text,
				type: action.payload.type,
			};
		default:
			return state;
	}
};
