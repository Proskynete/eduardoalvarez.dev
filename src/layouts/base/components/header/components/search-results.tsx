import { Alert, CategoryBadge, EmptyState, Skeleton, Text } from "@eduardoalvarez/arrecife";
import { forwardRef, type ReactNode, useEffect, useRef } from "react";

interface SearchResult {
  objectID: string;
  title: string;
  slug: string;
  description?: string;
  categories?: string[];
  link?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  selectedIndex: number;
  onResultClick: () => void;
  getArticleUrl: (result: SearchResult) => string;
  renderHighlightedText: (text: string, query: string) => ReactNode;
  error: string | null;
  isSearching: boolean;
  hasSearched: boolean;
}

/**
 * The panel keeps its own shell — `rounded-panel`, `surface-raised`, the standard
 * shadow — because a combobox listbox is not a `Popover`: Radix's popover owns
 * focus, and here focus has to stay in the input while `aria-activedescendant`
 * moves through the options. What DID come from the library is everything
 * painted inside it: the error notice, the loading placeholder, the empty state
 * and the category pills, all of which were hand-drawn.
 */
const containerClass =
  "absolute top-full right-7 mt-step-xs w-96 rounded-panel border border-border bg-surface-raised shadow-standard z-50";

const SearchResults = forwardRef<HTMLDivElement, SearchResultsProps>(
  (
    {
      results,
      searchQuery,
      selectedIndex,
      onResultClick,
      getArticleUrl,
      renderHighlightedText,
      error,
      isSearching,
      hasSearched,
    },
    ref,
  ) => {
    const resultsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (selectedIndex >= 0 && resultsContainerRef.current) {
        const selectedElement = resultsContainerRef.current.querySelector(`#result-${selectedIndex}`) as HTMLElement;
        selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }, [selectedIndex]);

    if (error) {
      return (
        <div ref={ref} id="search-results" className={containerClass}>
          {/* `Alert variant="error"` instead of the hand-drawn left bar. The tint
              stays on the border and the glyph; the text comes from a text
              token, which is rule 8 of the system.
              The `role="alert"` is the component's own — `Alert` sets it for the
              error variant, and repeating it on this wrapper published two alert
              landmarks for one message. */}
          <Alert variant="error" title="Error de búsqueda" className="border-0">
            {error}
          </Alert>
        </div>
      );
    }

    if (isSearching) {
      return (
        <div ref={ref} id="search-results" className={containerClass} role="status" aria-live="polite">
          {/* Three placeholders instead of the word «Buscando…»: the panel keeps
              the height it will have, so the results do not shove the page. */}
          <div className="p-step-md gap-step-sm flex flex-col">
            <span className="sr-only">Buscando…</span>
            {[0, 1, 2].map((i) => (
              <div key={i} className="gap-step-xs flex flex-col">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <div ref={ref} id="search-results" className={containerClass} role="status" aria-live="polite">
          {/* `EmptyState variant="page"` is the one that carries the face, and a
              search with nothing in it is one of the places the humour contract
              allows one. The panel already paints a surface, so the component's
              own card is turned off rather than stacked on top of it. */}
          <EmptyState
            variant="page"
            expression="waiting"
            title="Sin resultados"
            description={`No encontré nada con "${searchQuery}". Prueba con menos palabras.`}
            className="border-0 bg-transparent"
          />
        </div>
      );
    }

    if (results.length === 0) return null;

    return (
      <div
        ref={ref}
        id="search-results"
        className={`${containerClass} max-h-96 overflow-y-auto`}
        role="listbox"
        aria-label="Resultados de búsqueda"
      >
        <div ref={resultsContainerRef}>
          {results.map((result, index) => {
            const articleUrl = getArticleUrl(result);
            const isSelected = index === selectedIndex;
            return (
              <a
                key={result.objectID}
                id={`result-${index}`}
                href={articleUrl}
                onClick={onResultClick}
                className={`border-hairline px-step-md py-step-sm transition-standard block w-full cursor-pointer border-b text-left last:border-b-0 ${
                  isSelected ? "bg-surface" : "hover:bg-surface"
                }`}
                role="option"
                aria-selected={isSelected}
                aria-label={`Ir al artículo: ${result.title}`}
              >
                <Text variant="ui" as="p" className="font-medium">
                  {renderHighlightedText(result.title, searchQuery)}
                </Text>
                {result.description && (
                  <Text variant="label" tone="secondary" as="p" className="mt-step-xs line-clamp-2 font-normal">
                    {renderHighlightedText(result.description, searchQuery)}
                  </Text>
                )}
                {result.categories && result.categories.length > 0 && (
                  <div className="gap-step-xs mt-step-xs flex flex-wrap">
                    {result.categories.slice(0, 3).map((category) => (
                      <CategoryBadge key={category}>{category}</CategoryBadge>
                    ))}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    );
  },
);

SearchResults.displayName = "SearchResults";

export default SearchResults;
