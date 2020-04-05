const getHeaders = (token = '') => {
	let HEADER = {};
	if (token) {
		HEADER = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};
	} else {
		HEADER = {
			'Content-Type': 'application/json',
		};
	}
	return HEADER;
};

export default getHeaders;
