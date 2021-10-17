import {
  BlogTemplatePropsInterface,
  FrontMatterInterface,
} from "models/blogtemplate.model";

export interface ArticleContentInterface {
  markdownBody: string;
  frontmatter: FrontMatterInterface;
  slug: string;
}

export interface IAlgolia {
  app_id: string;
  api_key: string;
  index_name: string;
}

export interface HomePropsInterface {
  title: string;
  description: string;
  image: string;
  articles: Array<ArticleContentInterface | BlogTemplatePropsInterface>;
  algolia: IAlgolia;
}

export interface GetStaticPropsReturnInterface {
  props: HomePropsInterface;
}
