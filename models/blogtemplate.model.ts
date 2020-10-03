export interface SectionsInterface {
  title: string;
  anchor: string;
}

interface IntroductionInterface {
  title: string;
  content: string;
}

export interface FrontMatterInterface {
  title: string;
  description: string;
  date: string;
  read_time: number;
  hero_image: string;
  introduction: IntroductionInterface;
  sections: Array<SectionsInterface>;
}

export interface PropsInterface {
  frontmatter: FrontMatterInterface;
  markdownBody: string;
  slug: string;
}

export interface ReturnInterface {
  props: PropsInterface;
}

export interface PathsResponseInterface {
  paths: Array<string> | string;
  fallback: boolean;
}
