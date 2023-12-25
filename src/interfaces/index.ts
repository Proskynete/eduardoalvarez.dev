export interface Article {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  with_introduction: boolean;
  hero_image: string;
  sections: string[];
}

export interface ArticleLayout {
  file: string;
  url: string;
  content: Article;
  frontmatter: Article;
  heading: any[];
}
