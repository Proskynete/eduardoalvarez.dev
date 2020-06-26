import axios from 'axios';
import { GET_USER_DATA } from '@Config/constants';
import getHeaders from '@Helpers/headers.helper';
import config from '@Config/config';

export const getUserInfoAction = (dispatch) => async () => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('users')}?alias=Proskynete`;

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
			headers: getHeaders(),
		});

		return dispatch({
			type: GET_USER_DATA,
			payload: {
				status: response.data.status,
				content: response.data.content,
			},
		});
	} catch (error) {
		console.log(error);
	}
};
