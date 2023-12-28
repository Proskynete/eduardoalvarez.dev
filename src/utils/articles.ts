import config from "../settings";

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

export const githubArticlePath = (path: string) =>
  `${config.repo_url}/edit/main/src/pages/articulos/${path}.mdx`;
