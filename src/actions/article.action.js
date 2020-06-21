import axios from 'axios';
import { GET_ARTICLE_DATA } from '@Config/constants';
import config from '@Config/config';

export const getArticleBySlugAction = (dispatch) => async (slug) => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('blog')}?slug=${slug}`;

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
		});

		return dispatch({
			type: GET_ARTICLE_DATA,
			payload: {
				status: response.data.status,
				content: response.data.content,
			},
		});
	} catch (error) {
		console.log(error);
	}
};
