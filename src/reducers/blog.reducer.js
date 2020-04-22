import { GET_LAST_BLOG_DATA, GET_ALL_BLOG_DATA } from '@Config/constants';

const initialState = {
	status: 0,
	blogContent: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_LAST_BLOG_DATA:
			return {
				...state,
				status: action.payload.status,
				blogContent: action.payload.content,
			};
		case GET_ALL_BLOG_DATA:
			return {
				...state,
				status: action.payload.status,
				blogContent: action.payload.content,
			};
		default:
			return state;
	}
};
