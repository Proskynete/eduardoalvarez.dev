import axios from 'axios';
import { GET_LAST_BLOG_DATA, GET_ARTICLE_DATA } from '@Config/constants';
import config from '@Config/config';

export const getLastBlogDataAction = dispatch => async () => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('blog')}?last_articles=3`;

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
		});

		return dispatch({
			type: GET_LAST_BLOG_DATA,
			payload: {
				status: response.data.status,
				content: response.data.content,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

export const getBlogDataAction = dispatch => async () => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('blog')}`;

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
		});

		return dispatch({
			type: GET_LAST_BLOG_DATA,
			payload: {
				status: response.data.status,
				content: response.data.content,
			},
		});
	} catch (error) {
		console.log(error);
	}
};
