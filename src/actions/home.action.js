import axios from 'axios';
import { GET_HOME_DATA } from '@Config/constants';
import getHeaders from '@Helpers/headers.helper';
import config from '@Config/config';

export const getHomeDataAction = dispatch => async () => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('home')}`;
		const token = JSON.parse(localStorage.getItem('token'));

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
			headers: getHeaders(token),
		});

		return dispatch({
			type: GET_HOME_DATA,
			payload: {
				status: response.data.status,
				homeContent: response.data.content,
			},
		});
	} catch (error) {
		console.log(error);
	}
};
