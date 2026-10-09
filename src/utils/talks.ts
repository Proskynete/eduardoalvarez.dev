import { z } from "zod";

/**
 * A talk is one JSON file in `src/data/talks/`, named after its slug. The
 * content manager writes these files through a PR, so this schema is the
 * contract between both repos: change it here and in the content manager's
 * copy (blog-content-manager/src/lib/talks/contract.ts) together.
 */
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const publicPath = z.string().startsWith("/");
const link = z.object({ label: z.string().min(1), url: z.string().min(1) });

export const talkSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  show: z.boolean(),
  date: z.tuple([z.iso.datetime()], z.iso.datetime()).check(z.maxLength(2)),
  attendance: z.enum(["in-person", "online", "hybrid"]).default("in-person"),
  image: publicPath.optional(),
  location: z.object({ name: z.string().min(1), url: z.url() }),
  organizations: z.array(z.object({ name: z.string().min(1), url: z.url(), logo: publicPath.optional() })),
  options: z
    .object({
      repo: z.url().optional(),
      presentation: z.url().optional(),
      resources: z.array(link).optional(),
    })
    .optional(),
});

export type Talk = z.infer<typeof talkSchema> & { slug: string };
export type TalkAttendance = Talk["attendance"];

/**
 * Validates every talk file and returns them newest first. Throws on the first
 * invalid file, naming it, so a bad file stops the build instead of a talk
 * silently disappearing from the site.
 */
export function parseTalks(files: Record<string, unknown>): Talk[] {
  return Object.entries(files)
    .map(([path, data]) => {
      const file = path.split("/").pop() ?? path;
      const slug = file.replace(/\.json$/, "");
      if (!SLUG.test(slug)) {
        throw new Error(`src/data/talks/${file}: the file name must be a kebab-case slug`);
      }

      const result = talkSchema.safeParse(data);
      if (!result.success) {
        const issue = result.error.issues[0];
        throw new Error(`src/data/talks/${file}: ${issue.path.join(".") || "(root)"} ${issue.message}`);
      }
      return { ...result.data, slug };
    })
    .sort((a, b) => new Date(b.date[0]).getTime() - new Date(a.date[0]).getTime());
}
