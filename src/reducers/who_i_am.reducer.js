import { GET_WHO_I_AM_DATA } from '@Config/constants';

const initialState = {
	content: [],
	status: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_WHO_I_AM_DATA:
			return {
				...state,
				status: action.payload.status,
				content: action.payload.content,
			};
		default:
			return state;
	}
};
