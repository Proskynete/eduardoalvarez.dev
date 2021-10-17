import { FrontMatterInterface } from "./blogtemplate.model";
import { IAlgolia } from "./index.model";

export interface AuthorPropsInterface {
  github_post_url: string;
  markdownBody: string;
  frontmatter: FrontMatterInterface;
  algolia: IAlgolia;
}

export interface AuthorGSPInterface {
  props: AuthorPropsInterface;
}
