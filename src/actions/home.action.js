import axios from 'axios';
import { GET_HOME_DATA } from '@Config/constants';
import config from '@Config/config';

export const getHomeDataAction = (dispatch) => async () => {
	try {
		const url = config.handleGetUrl();
		const uri = `${config.handleGetEntryPointApi('home')}`;

		const response = await axios({
			url: `${url}${uri}`,
			method: 'GET',
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
