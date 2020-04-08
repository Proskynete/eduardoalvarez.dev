import axios from 'axios';
import { GET_LAST_BLOG_DATA, GET_ARTICLE_DATA } from '@Config/constants';
import getHeaders from '@Helpers/headers.helper';
import config from '@Config/config';

export const getLastBlogDataAction = dispatch => async () => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('blog')}?last_articles=3`;
		const token = JSON.parse(localStorage.getItem('token'));

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
			headers: getHeaders(token),
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
		const token = JSON.parse(localStorage.getItem('token'));

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
			headers: getHeaders(token),
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

export const getArticleBySlugAction = dispatch => async slug => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('blog')}?slug=${slug}`;
		const token = JSON.parse(localStorage.getItem('token'));

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
			headers: getHeaders(token),
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
