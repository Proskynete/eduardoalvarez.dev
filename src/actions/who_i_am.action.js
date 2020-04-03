import axios from 'axios';
import { GET_WHO_I_AM_DATA } from '@Config/constants';
import getHeaders from '@Helpers/headers.helper';
import config from '@Config/config';

export const getWhoIAmDataAction = dispatch => async () => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('whoiam')}`;
		const token = JSON.parse(localStorage.getItem('token'));

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
			headers: getHeaders(token),
		});

		return dispatch({
			type: GET_WHO_I_AM_DATA,
			payload: {
				status: response.data.status,
				content: response.data.content,
			},
		});
	} catch (error) {
		console.log(error);
	}
};
