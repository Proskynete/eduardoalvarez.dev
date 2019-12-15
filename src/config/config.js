/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const handleGetEnvironment = () => {
	return ENVIRONMENT;
};

const handleGetUrl = () => {
	const url = {
		development: 'http://localhost:8882',
		integration: 'http://localhost:3000',
		production: 'production_url',
	};
	return url[handleGetEnvironment()];
};

const handleGetEntryPointApi = path => {
	return `${handleGetUrl()}/node/api/${path}`;
};

export default handleGetEntryPointApi;
