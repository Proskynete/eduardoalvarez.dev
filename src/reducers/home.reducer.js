import { GET_HOME_DATA } from '@Config/constants';

const initialState = {
	homeContent: [],
	status: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_HOME_DATA:
			return {
				...state,
				status: action.payload.status,
				homeContent: action.payload.homeContent,
			};
		default:
			return state;
	}
};
