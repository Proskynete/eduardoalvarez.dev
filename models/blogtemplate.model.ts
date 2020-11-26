import { SayInterface } from './say.model';
import { SectionsInterface } from './sections.model';

export type TagsEnum =
	| 'web-development'
	| 'introduction'
	| 'personal'
	| 'traveling'
	| 'css'
	| 'html'
	| 'javascript'
	| 'react'
	| 'node'
	| 'mongo';

export type PrettyTagsEnum =
	| 'Desarrollo web'
	| 'Introducción'
	| 'Personal'
	| 'Viajes'
	| 'CSS'
	| 'HTML'
	| 'Javascript'
	| 'React'
	| 'Node'
	| 'MongoDB';

export interface FrontMatterInterface {
	title?: string;
	description?: string;
	date?: string;
	tags?: Array<TagsEnum>;
	read_time?: number;
	hero_image?: string;
	thumbnail_image?: string;
	introduction?: SayInterface;
	image_introduction?: string;
	sections?: Array<SectionsInterface>;
	slug?: string;
}

export interface BlogTemplatePropsInterface {
	frontmatter: FrontMatterInterface;
	markdownBody: string;
	slug: string | Array<string>;
	github_post_url: string;
	disqusShortName: string;
}

export interface GetStaticPropsReturnInterface {
	props: BlogTemplatePropsInterface;
}

export interface GetStaticPathsResponseInterface {
	paths: Array<string> | string;
	fallback: boolean;
}
