import { useSanityClient, createImageBuilder } from "astro-sanity";

import type { Post } from "../interfaces";

const builder = createImageBuilder(useSanityClient());

export const getSanityImageURL = (source: string) => {
  return builder.image(source);
};

export const getFiveLatestPosts = async (): Promise<
  [Post[], hasNext: boolean]
> => {
  const posts = await useSanityClient().fetch(
    `*[_type == "post"] | order(publishedAt desc)`
  );
  const hasNext = posts.length >= 5;

  return [posts, hasNext];
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  return await useSanityClient().fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug }
  );
};

interface PaginatedPosts {
  limit: number;
  current: number;
}

export const getPaginatedPosts = async ({
  limit,
  current,
}): Promise<[Post[], total: number]> => {
  const start = current === 1 ? current - 1 : limit * current - limit + 1;
  const end = limit * current;

  const posts = await useSanityClient().fetch(
    `*[_type == "post"] | order(publishedAt desc) [$start...$end]`,
    {
      start,
      end,
    }
  );

  return [posts, posts.length];
};
