import { GET_USER_DATA } from '@Config/constants';

const initialState = {
	content: {},
	status: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_USER_DATA:
			return {
				...state,
				status: action.payload.status,
				content: action.payload.content,
			};
		default:
			return state;
	}
};
