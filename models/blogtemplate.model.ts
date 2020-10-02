export interface SectionsInterface {
  title: string;
  anchor: string;
}

export interface FrontMatterInterface {
  title: string;
  description: string;
  date: string;
  read_time: number;
  hero_image: string;
  sections: Array<SectionsInterface>;
}

export interface PropsInterface {
  frontmatter: FrontMatterInterface;
  markdownBody: string;
  siteTitle: string;
  slug: string;
}

export interface ReturnInterface {
  props: PropsInterface;
}

export interface PathsResponseInterface {
  paths: Array<string> | string;
  fallback: boolean;
}
