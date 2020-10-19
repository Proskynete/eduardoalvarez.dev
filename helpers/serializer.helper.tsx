import { FrontMatterInterface } from 'models/blogtemplate.model';

export const dataSerialized = (data: FrontMatterInterface) =>
	JSON.parse(JSON.stringify(data));
