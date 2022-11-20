import { DiscusInterface } from "components/DisqusComponent";

import { TagsEnum } from "./blogtemplate.model";

export interface InfoArticleInterface {
  date: Date;
  readTime?: number;
  tags?: Array<TagsEnum>;
  horizontal?: boolean;
  disqus?: DiscusInterface;
  withIcons?: {
    date?: boolean;
    read?: boolean;
    tags?: boolean;
    comments?: boolean;
  };
}
