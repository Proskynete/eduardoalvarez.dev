import { DiscusInterface } from 'components/DisqusComponent';

import { TagsEnum } from './blogtemplate.model';

export interface InfoArticleIntereface {
	date: string;
	readTime?: number;
	tags?: Array<TagsEnum>;
	horizontal?: boolean;
	disqus?: DiscusInterface;
}
