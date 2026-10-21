import type { APIRoute, GetStaticPaths } from "astro";

import type { ArticleOgData } from "../../../utils/og";
import { readArticleOg } from "../../../utils/og-index";
import { renderArticleOg } from "../../../utils/og-render";

/**
 * The fallback OG image of every article, drawn with arrecife's
 * `articleTemplate` at build time. Only articles without their cover point here
 * (src/utils/og.ts), but every article gets one, so a missing cover never
 * leaves a broken link.
 */
export const prerender = true;

export const getStaticPaths = (() =>
  readArticleOg(process.cwd()).map(({ slug, data }) => ({ params: { slug }, props: { data } }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ data: ArticleOgData }> = async ({ props }) =>
  new Response(new Uint8Array(await renderArticleOg(props.data)), { headers: { "content-type": "image/png" } });
