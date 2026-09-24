/**
 * Where a request under `/podcasts` goes while the section is switched off.
 *
 * The section used to answer 404, which is right for a URL that never existed
 * but not for these: the index and its five episodes were live and in the
 * sitemap, so the 404 would have been handed to every link and search result
 * pointing at them. They go home instead.
 *
 * The redirect is 302 and not 301 on purpose. The section comes back when
 * there is a real episode, and a permanent redirect is cached by browsers — a
 * visitor who hit it once would keep landing on `/` after the switch flips.
 *
 * It lives here, next to the switch, and not in `vercel.json`: Vercel applies
 * those before Astro runs, so they would outlive `podcastsEnabled = true` and
 * nobody would remember to remove them. They also don't run under `astro dev`,
 * where the e2e suite does.
 */
export const PODCASTS_REDIRECT_STATUS = 302;

export function podcastsRedirect(pathname: string, enabled: boolean): string | null {
  if (enabled) return null;
  return /^\/podcasts(\/|$)/.test(pathname) ? "/" : null;
}
