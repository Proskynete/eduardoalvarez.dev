import { TagsEnum, PrettyTagsEnum } from "models/blogtemplate.model";

const tagsMap = new Map<TagsEnum, PrettyTagsEnum>([
  ["web-development", "Desarrollo web"],
  ["personal", "Personal"],
]);

export const prettyTags = (tags: Array<TagsEnum>) => {
  return (
    <>
      {tags.map((tag) => (
        <span key={tag} className="tag" data-type={tag}>
          {tagsMap.get(tag)}
        </span>
      ))}
    </>
  );
};
