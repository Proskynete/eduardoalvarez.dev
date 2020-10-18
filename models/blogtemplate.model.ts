import { SectionsInterface } from './sections.model';

interface IntroductionInterface {
	title: string;
	content: string;
	anchor: string;
}

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
	title: string;
	description: string;
	date: string;
	tags: Array<TagsEnum>;
	read_time: number;
	hero_image: string;
	introduction: IntroductionInterface;
	image_introduction: string;
	sections: Array<SectionsInterface>;
	slug?: string;
}

export interface PropsInterface {
	frontmatter: FrontMatterInterface;
	markdownBody: string;
	slug: string | Array<string>;
	github_post_url: string;
}

export interface ReturnInterface {
	props: PropsInterface;
}

export interface PathsResponseInterface {
	paths: Array<string> | string;
	fallback: boolean;
}
