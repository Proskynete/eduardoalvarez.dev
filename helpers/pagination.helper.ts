import {
	CustomPaginatedInterface,
	CustomPaginatedResponseInterface,
} from 'models/pagination.model';

export const customPaginated = <P>({
	page,
	limit,
	elements,
}: CustomPaginatedInterface<P>): CustomPaginatedResponseInterface<P> => {
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const response: CustomPaginatedResponseInterface<P> = {
		paginate: {
			next: 0,
			previous: 0,
			limit,
			total: 0,
		},
		results: [],
	};

	if (endIndex < elements.length) response.paginate.next = page + 1;
	if (startIndex > 0) response.paginate.previous = page - 1;
	response.paginate.total = elements.length;
	response.results = elements.slice(startIndex, endIndex);

	return response;
};
