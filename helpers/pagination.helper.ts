interface CustomPaginatedInterface<T> {
	page: number;
	limit: number;
	elements: T[];
}

interface PaginateResponseInterface {
	next: number;
	previous: number;
	limit: number;
	total: number;
}

interface CustomPaginatedResponseInterface<T> {
	results: T[];
	paginate: PaginateResponseInterface;
}

export const customPaginated = <T>({
	page,
	limit,
	elements,
}: CustomPaginatedInterface<T>): CustomPaginatedResponseInterface<T> => {
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const response: CustomPaginatedResponseInterface<T> = {
		results: [],
		paginate: {
			next: 0,
			previous: 0,
			total: 0,
			limit,
		},
	};

	if (endIndex < elements.length) response.paginate.next = page + 1;
	if (startIndex > 0) response.paginate.previous = page - 1;
	response.paginate.total = elements.length;
	response.results = elements.slice(startIndex, endIndex);

	return response;
};
