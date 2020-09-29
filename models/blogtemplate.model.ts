export interface FrontMatterInterface {
  title: string;
  description: string;
  date: string;
  read_time: number;
  hero_image: string;
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
