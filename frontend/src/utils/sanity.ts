import { useSanityClient, createImageBuilder } from "astro-sanity";

import type { Post } from "../interfaces";

const builder = createImageBuilder(useSanityClient());

export const getSanityImageURL = (source: string) => {
  return builder.image(source);
};

export const getAllPosts = async (): Promise<Post[]> => {
  return await useSanityClient().fetch(`*[_type == "post"]`);
};
