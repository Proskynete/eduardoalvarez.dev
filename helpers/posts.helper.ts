/* eslint-disable @typescript-eslint/no-explicit-any */
import matter from 'gray-matter';
import { FrontMatterInterface } from 'models/blogtemplate.model';

import { calculateReadingTime } from './calculate-reading-time.helper';
import { dataSerialized } from './serializer.helper';

export const getPosts = (context: any) => {
	const nameFiles = context.keys();
	const contentFile = nameFiles.map(context);

	const data = nameFiles.map((nameFile: string, index: number) => {
		const slug = nameFile
			.replace(/^.*[\\/]/, '')
			.split('.')
			.slice(0, -1)
			.join('.');

		const content = contentFile[index];
		const document = matter(content.default);
		document.data['read_time'] = calculateReadingTime(document.content);

		return {
			frontmatter: dataSerialized(document.data as FrontMatterInterface),
			markdownBody: document.content,
			slug,
		};
	});

	return data;
};
