import {
	BlogTemplatePropsInterface,
	FrontMatterInterface,
} from 'models/blogtemplate.model';

export interface ArticleContentInterface {
	markdownBody: string;
	frontmatter: FrontMatterInterface;
	slug: string;
}

export interface HomePropsInterface {
	title: string;
	description: string;
	image: string;
	articles: Array<ArticleContentInterface | BlogTemplatePropsInterface>;
}

export interface GetStaticPropsReturnInterface {
	props: HomePropsInterface;
}
