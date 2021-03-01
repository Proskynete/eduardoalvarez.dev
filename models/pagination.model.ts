export interface CustomPaginatedInterface<T> {
	page: number;
	limit: number;
	elements: T[];
}

export interface PaginateResponseInterface {
	next: number;
	previous: number;
	limit: number;
	total: number;
}

export interface CustomPaginatedResponseInterface<T> {
	results: T[];
	paginate: PaginateResponseInterface;
}
