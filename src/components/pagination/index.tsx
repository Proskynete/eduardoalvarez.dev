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
 * Compuesta en React y no en el `.astro` porque las piezas de `Pagination` son
 * componentes de la librería anidados unos dentro de otros, y desde Astro solo
 * cruza `children`: cualquier marcado escrito en un `.astro` llega como
 * resultado de plantilla y React lo rechaza.
 *
 * No se hidrata: Astro la renderiza a HTML estático y el bundle no se toca.
 */
export interface Props {
  /** Página actual, empezando en 1. */
  actual: number;
  total: number;
  /** `/articles` o `/articles/categoria/x`. La página 1 no lleva sufijo. */
  base: string;
}

const url = (base: string, n: number) => (n === 1 ? base : `${base}/${n}`);

/**
 * Ventana de páginas alrededor de la actual. Con pocas páginas se ven todas;
 * cuando crezcan, los extremos siempre están y el resto se resume con puntos.
 */
function ventana(actual: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const cerca = [actual - 1, actual, actual + 1].filter((n) => n > 1 && n < total);
  const paginas = [1, ...cerca, total];
  const salida: (number | "…")[] = [];
  for (let i = 0; i < paginas.length; i++) {
    if (i > 0 && paginas[i] - paginas[i - 1] > 1) salida.push("…");
    salida.push(paginas[i]);
  }
  return salida;
}

export default function Paginacion({ actual, total, base }: Props) {
  if (total <= 1) return null;

  return (
    <Pagination className="mt-step-xl">
      <PaginationContent>
        {actual > 1 && (
          <PaginationItem>
            <PaginationPrevious href={url(base, actual - 1)} />
          </PaginationItem>
        )}

        {ventana(actual, total).map((n, i) =>
          n === "…" ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={n}>
              <PaginationLink href={url(base, n)} isActive={n === actual}>
                {n}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {actual < total && (
          <PaginationItem>
            <PaginationNext href={url(base, actual + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
