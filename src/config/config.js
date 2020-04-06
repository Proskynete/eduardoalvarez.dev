export default {
	handleGetUrl() {
		const url = {
			development: 'http://localhost:8882',
			integration: 'http://localhost:3000',
			production: 'https://api.eduardoalvarez.cl',
		};
		return url[this.handleGetEnvironment()];
	},
	handleGetEnvironment() {
		return ENVIRONMENT;
	},
	handleGetEntryPointApi(path) {
		return `/node/api/${path}`;
	},
};
