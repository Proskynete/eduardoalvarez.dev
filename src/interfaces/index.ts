export interface Section {
  title: string;
  anchor: string;
}

export type CategoryAllowed =
  | 'web-development'
  | 'javascript'
  | 'react'
  | 'vue'
  | 'astro'
  | 'node'
  | 'express'
  | 'sql'
  | 'no-sql';

export interface Article {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: CategoryAllowed[];
  seo_image: string;
  sections: Section[];
}

export type HeadingDepth = 1 | 2 | 3 | 4 | 5 | 6;

export interface Heading {
  depth: HeadingDepth;
  slug: string;
  text: string;
}

export interface ArticleLayout {
  file: string;
  url: string;
  content: Article;
  frontmatter: Article;
  heading: Heading[];
}
