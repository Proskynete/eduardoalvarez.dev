import { PrettyTagsEnum, TagsEnum } from './blogtemplate.model';

export const tagsMap = new Map<TagsEnum, PrettyTagsEnum>([
	['web-development', 'Desarrollo web'],
	['introduction', 'Introducción'],
	['personal', 'Personal'],
	['traveling', 'Viajes'],
	['css', 'CSS'],
	['html', 'HTML'],
	['javascript', 'Javascript'],
	['react', 'React'],
	['node', 'Node'],
	['mongo', 'MongoDB'],
]);

export const variantMap = new Map<TagsEnum, string>([
	['web-development', 'desarrollo-web'],
	['introduction', 'introduccion'],
	['personal', 'personal'],
	['traveling', 'viajes'],
	['css', 'css'],
	['html', 'html'],
	['javascript', 'javascript'],
	['react', 'react'],
	['node', 'node'],
	['mongo', 'mongoDB'],
]);
