export const articlesSort = (a, b) => {
  const dateA = new Date(a.frontmatter.date);
  const dateB = new Date(b.frontmatter.date);
  return dateB.getTime() - dateA.getTime();
};
