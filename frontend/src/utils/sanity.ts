import { useSanityClient, createImageBuilder } from "astro-sanity";
const builder = createImageBuilder(useSanityClient());

export const getSanityImageURL = (source: string) => {
  return builder.image(source);
};
