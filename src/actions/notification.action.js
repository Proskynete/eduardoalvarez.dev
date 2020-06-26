import { SHOW_NOTIFICATION, CLEAN_NOTIFICATION } from '@Config/constants';

export const notificationAction = (dispatch) => (data) => {
	return dispatch({
		type: SHOW_NOTIFICATION,
		payload: {
			data,
		},
	});
};

export const notificationCleanAction = (dispatch) => () => {
	return dispatch({
		type: CLEAN_NOTIFICATION,
		payload: {
			show: false,
			text: '',
			type: '',
		},
	});
};
