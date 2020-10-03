export interface SectionsInterface {
  title: string;
  anchor: string;
}

interface IntroductionInterface {
  title: string;
  content: string;
}

export type TagsEnum =
  | "web-development"
  | "personal"
  | "traveling"
  | "css"
  | "html"
  | "javascript"
  | "react"
  | "node";

export type PrettyTagsEnum =
  | "Desarrollo web"
  | "Personal"
  | "Viajes"
  | "CSS"
  | "HTML"
  | "JavaScript"
  | "React"
  | "Node";

export interface FrontMatterInterface {
  title: string;
  description: string;
  date: string;
  tags: Array<TagsEnum>;
  read_time: number;
  hero_image: string;
  introduction: IntroductionInterface;
  image_introduction: string;
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
