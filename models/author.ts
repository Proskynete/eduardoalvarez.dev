import { FrontMatterInterface } from './blogtemplate.model';

export interface AuthorPropsInterface {
	github_post_url: string;
	markdownBody: string;
	frontmatter: FrontMatterInterface;
}

export interface AuthorGSPInterface {
	props: AuthorPropsInterface;
}
