import { IAlgolia } from "./index.model";

export interface PropsInterface {
  customTitle: string;
  description?: string;
  image?: string;
  slug?: string;
  footer?: boolean;
  algolia?: IAlgolia;
  publishDate?: string;
}
