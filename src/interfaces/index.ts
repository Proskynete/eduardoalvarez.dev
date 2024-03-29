interface Section {
  title: string;
  anchor: string;
}

export type CategoryAllowed =
  | "web-development"
  | "javascript"
  | "react"
  | "vue"
  | "astro"
  | "node"
  | "express"
  | "sql"
  | "no-sql";

export interface Article {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: CategoryAllowed[];
  seo_image: string;
  sections: Section[];
}

export interface ArticleLayout {
  file: string;
  url: string;
  content: Article;
  frontmatter: Article;
  heading: any[];
}
