import axios from 'axios';
import { GET_BLOG_DATA } from '@Config/constants';
import getHeaders from '@Helpers/headers.helper';
import config from '@Config/config';

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
			type: GET_BLOG_DATA,
			payload: {
				status: response.data.status,
				content: response.data.blog,
			},
		});
	} catch (error) {
		console.log(error);
	}
};
