import { useSanityClient, createImageBuilder } from "astro-sanity";

import type { Post } from "../interfaces";

const builder = createImageBuilder(useSanityClient());

export const getSanityImageURL = (source: string) => {
  return builder.image(source);
};

export const getAllPosts = async (): Promise<Post[]> =>
  await useSanityClient().fetch(`*[_type == "post"]`);

interface PaginatedPosts {
  limit: number;
  current: number;
}

export const getPaginatedPosts = async ({
  limit,
  current,
}: PaginatedPosts): Promise<[Post[], hasNextPage: boolean]> => {
  const start = current === 1 ? current - 1 : limit * current - limit + 1;
  const end = limit * current;

  const posts = await useSanityClient().fetch(
    `*[_type == "post"] | order(publishedAt desc) [$start...$end]`,
    {
      start,
      end,
    }
  );

  const total = await useSanityClient().fetch(`count(*[_type == "post"])`);
  const hasNextPage = total > end;
  return [posts, hasNextPage];
};
