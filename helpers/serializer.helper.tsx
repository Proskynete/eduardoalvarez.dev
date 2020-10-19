import { FrontMatterInterface } from 'models/blogtemplate.model';

export const dataSerialized = (data: FrontMatterInterface | string) =>
	JSON.parse(JSON.stringify(data));
