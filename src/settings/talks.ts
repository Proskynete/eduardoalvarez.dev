import { parseTalks } from "../utils/talks";

export type { Talk, TalkAttendance } from "../utils/talks";

/**
 * Talks live as data, one JSON per talk in `src/data/talks/`, so the content
 * manager can add or edit them with a PR instead of generating TypeScript.
 * Every talk is here, hidden ones included; consumers filter by `show`.
 */
const files = import.meta.glob<unknown>("../data/talks/*.json", { eager: true, import: "default" });

export const talks = parseTalks(files);
