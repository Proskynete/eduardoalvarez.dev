import { GET_ARTICLE_DATA } from '@Config/constants';

const initialState = {
	status: 0,
	articleContent: {},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_ARTICLE_DATA:
			return {
				...state,
				status: action.payload.status,
				articleContent: action.payload.content,
			};
		default:
			return state;
	}
};
