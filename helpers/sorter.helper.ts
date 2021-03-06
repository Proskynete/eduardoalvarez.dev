export const postsSortered = <T>(posts: T[]): T[] =>
	posts.sort((a, b) => {
		const _a = new Date(a['frontmatter']['date']);
		const _b = new Date(b['frontmatter']['date']);

		return _a > _b ? -1 : _a < _b ? 1 : 0;
	});
