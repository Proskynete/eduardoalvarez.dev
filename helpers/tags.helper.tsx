import Label from 'components/Label';
import { TagsEnum } from 'models/blogtemplate.model';
import { tagsMap, variantMap } from 'models/tags.model';

export const prettyTags = (tags: Array<TagsEnum>) => {
	return tags.map((tag) => (
		<Label
			key={tag}
			data-type={tag}
			text={tagsMap.get(tag)}
			variant={variantMap.get(tag)}
		/>
	));
};
