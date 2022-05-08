const uniquePosts = <T>(posts: T[], key: string): T[] =>
  posts.reduce((acc, curr) => {
    if (!acc.find((post) => post.slug === curr[key])) {
      acc.push(curr);
    }
    return acc;
  }, []);

export const postsSortied = <T>(posts: T[], key: string): T[] =>
  uniquePosts<T>(posts, key).sort((a, b) => {
    const _a = new Date(a["frontmatter"]["date"]);
    const _b = new Date(b["frontmatter"]["date"]);

    return _a > _b ? -1 : _a < _b ? 1 : 0;
  });
