// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Algolia - Public (client-side)
  readonly PUBLIC_ALGOLIA_APPLICATION_ID: string;
  readonly PUBLIC_ALGOLIA_SEARCH_API_KEY: string;
  readonly PUBLIC_ALGOLIA_INDEX_NAME: string;

  // Algolia - Private (server-side)
  readonly ALGOLIA_ADMIN_API_KEY: string;

  // Giscus - Public (client-side)
  readonly PUBLIC_GISCUS_REPO: string;
  readonly PUBLIC_GISCUS_REPO_ID: string;
  readonly PUBLIC_GISCUS_CATEGORY_ID: string;

  // Newsletter (blog-content-manager) - Private (server-side)
  readonly NEWSLETTER_API_URL: string;
  readonly NEWSLETTER_SUBSCRIBE_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
