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

const containerClass =
  "absolute top-full right-7 mt-2 w-96 bg-surface border border-surface-border rounded-md shadow-lg z-50";

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
        <div ref={ref} id="search-results" className={containerClass} role="alert">
          <div className="px-4 py-3 border-l-2 border-error">
            <p className="text-sm text-error font-medium">Error de búsqueda</p>
            <p className="text-xs text-text-muted mt-1">{error}</p>
          </div>
        </div>
      );
    }

    if (isSearching) {
      return (
        <div ref={ref} id="search-results" className={containerClass} role="status" aria-live="polite">
          <div className="px-4 py-3 text-center">
            <p className="text-sm text-text-muted">Buscando...</p>
          </div>
        </div>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <div ref={ref} id="search-results" className={containerClass} role="status" aria-live="polite">
          <div className="px-4 py-3 border-l-2 border-warning">
            <p className="text-sm text-text-secondary font-medium">No se encontraron resultados</p>
            <p className="text-xs text-text-muted mt-1">
              No hay artículos que coincidan con &quot;{searchQuery}&quot;
            </p>
          </div>
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
                className={`block w-full text-left px-4 py-3 border-b border-surface-border last:border-b-0 cursor-pointer transition-colors duration-150 ${
                  isSelected ? "bg-surface-raised" : "hover:bg-surface-raised"
                }`}
                role="option"
                aria-selected={isSelected}
                aria-label={`Ir al artículo: ${result.title}`}
              >
                <div className="font-semibold text-text-primary text-sm mb-1">
                  {renderHighlightedText(result.title, searchQuery)}
                </div>
                {result.description && (
                  <div className="text-xs text-text-muted line-clamp-2">
                    {renderHighlightedText(result.description, searchQuery)}
                  </div>
                )}
                {result.categories && result.categories.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {result.categories.slice(0, 3).map((category) => (
                      <span
                        key={category}
                        className="text-xs px-2 py-0.5 bg-surface-raised border border-surface-border text-text-muted rounded"
                      >
                        {category}
                      </span>
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
