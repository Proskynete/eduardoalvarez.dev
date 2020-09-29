export interface FrontMatterInterface {
  title: string;
  date: string;
  author: string;
}

export interface PropsInterface {
  frontmatter: FrontMatterInterface;
  markdownBody: string;
  siteTitle: string;
}

export interface ReturnInterface {
  props: PropsInterface;
}

export interface PathsResponseInterface {
  paths: Array<string> | string;
  fallback: boolean;
}
