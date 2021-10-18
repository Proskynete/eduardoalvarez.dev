import { DiscusInterface } from "components/DisqusComponent";

import { TagsEnum } from "./blogtemplate.model";

export interface InfoArticleIntereface {
  date: Date;
  readTime?: number;
  tags?: Array<TagsEnum>;
  horizontal?: boolean;
  disqus?: DiscusInterface;
}
