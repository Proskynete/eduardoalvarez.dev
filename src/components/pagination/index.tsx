import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@eduardoalvarez/arrecife";

/**
 * Composed in React rather than in the `.astro` file because `Pagination` is
 * built from library components nested inside one another, and only `children`
 * crosses the Astro boundary: markup written in a `.astro` file arrives as a
 * template result and React rejects it.
 *
 * Nothing hydrates — Astro renders this to static HTML and the bundle is
 * untouched.
 */
export interface Props {
  /** Current page, starting at 1. */
  current: number;
  total: number;
  /** `/articles`. Page 1 carries no suffix. */
  base: string;
}

const url = (base: string, n: number) => (n === 1 ? base : `${base}/${n}`);

/**
 * A window of pages around the current one. With few pages they all show; once
 * there are many, the ends are always present and the middle collapses to an
 * ellipsis.
 */
function window_(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const near = [current - 1, current, current + 1].filter((n) => n > 1 && n < total);
  const pages = [1, ...near, total];
  const out: (number | "…")[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) out.push("…");
    out.push(pages[i]);
  }
  return out;
}

export default function Pager({ current, total, base }: Props) {
  if (total <= 1) return null;

  return (
    <Pagination className="mt-step-xl">
      <PaginationContent>
        {current > 1 && (
          <PaginationItem>
            <PaginationPrevious href={url(base, current - 1)} />
          </PaginationItem>
        )}

        {window_(current, total).map((n, i) =>
          n === "…" ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={n}>
              <PaginationLink href={url(base, n)} isActive={n === current}>
                {n}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {current < total && (
          <PaginationItem>
            <PaginationNext href={url(base, current + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
