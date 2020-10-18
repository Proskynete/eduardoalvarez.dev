import { PrettyTagsEnum, TagsEnum } from 'models/blogtemplate.model';

const tagsMap = new Map<TagsEnum, PrettyTagsEnum>([
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

export const prettyTags = (tags: Array<TagsEnum>) => {
	return tags.map((tag) => (
		<span key={tag} className='tag' data-type={tag}>
			{tagsMap.get(tag)}
		</span>
	));
};
