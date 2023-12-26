interface Article {
  frontmatter: {
    date: string;
  };
}

export const articlesSort = (a: Article, b: Article) => {
  const dateA = new Date(a.frontmatter.date).getTime();
  const dateB = new Date(b.frontmatter.date).getTime();
  return dateB - dateA;
};
