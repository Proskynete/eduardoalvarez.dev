import Router from 'next/router';

export const nextPagination = ({ path, query, page }) => {
	Router.push({
		pathname: path,
		query: { [query]: page },
	});
};

export const previousPagination = ({ path, query, previous, router }) => {
	if (+router.query[query] !== 2) {
		Router.push({
			pathname: path,
			query: { [query]: previous },
		});
	} else {
		Router.push({
			pathname: path,
		});
	}
};
