import axios from 'axios';
import { GET_ABOUTME_DATA } from '@Config/constants';
import getHeaders from '@Helpers/headers.helper';
import config from '@Config/config';

export const getAboutMeDataAction = dispatch => async () => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('about_me')}`;

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
			headers: getHeaders(),
		});

		return dispatch({
			type: GET_ABOUTME_DATA,
			payload: {
				status: response.data.status,
				content: response.data.content,
			},
		});
	} catch (error) {
		console.log(error);
	}
};
