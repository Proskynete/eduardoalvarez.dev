import { FrontMatterInterface } from 'models/blogtemplate.model';

export interface ArticleContentInterface {
	markdownBody: string;
	frontmatter: FrontMatterInterface;
	slug: string;
}

export interface PropsInterface {
	title: string;
	description: string;
	image: string;
	articles: Array<ArticleContentInterface>;
}

export interface ReturnInterface {
	props: PropsInterface;
}
