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
  renderHighlightedText: (text: string, query: string) => JSX.Element;
  error: string | null;
  isSearching: boolean;
  hasSearched: boolean;
}

export default function SearchResults({
  results,
  searchQuery,
  selectedIndex,
  onResultClick,
  getArticleUrl,
  renderHighlightedText,
  error,
  isSearching,
  hasSearched,
}: SearchResultsProps) {
  // Mostrar UI de error
  if (error) {
    return (
      <div className="absolute top-full right-7 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
        <div className="px-4 py-3 border-l-4 border-red-500">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-red-500 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-red-400 font-medium">Error de búsqueda</p>
              <p className="text-xs text-gray-400 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar loading
  if (isSearching) {
    return (
      <div className="absolute top-full right-7 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
        <div className="px-4 py-3 text-center">
          <p className="text-sm text-gray-400">Buscando...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje cuando no hay resultados después de una búsqueda
  if (hasSearched && results.length === 0) {
    return (
      <div className="absolute top-full right-7 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
        <div className="px-4 py-3 border-l-4 border-yellow-500">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-300 font-medium">No se encontraron resultados</p>
              <p className="text-xs text-gray-400 mt-1">
                No hay artículos que coincidan con &quot;{searchQuery}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No mostrar nada si no se ha buscado aún
  if (results.length === 0) return null;

  return (
    <div className="absolute top-full right-7 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
      {results.map((result, index) => {
        const articleUrl = getArticleUrl(result);
        return (
          <a
            key={result.objectID}
            href={articleUrl}
            onClick={onResultClick}
            className={`block w-full text-left px-4 py-3 hover:bg-gray-700 transition ease-in-out duration-200 border-b border-gray-700 last:border-b-0 cursor-pointer ${
              index === selectedIndex ? "bg-gray-700" : ""
            }`}
            aria-label={`Ir al artículo: ${result.title}`}
          >
            <div className="font-semibold text-gray-100 text-sm mb-1">
              {renderHighlightedText(result.title, searchQuery)}
            </div>
            {result.description && (
              <div className="text-xs text-gray-400 line-clamp-2">
                {renderHighlightedText(result.description, searchQuery)}
              </div>
            )}
            {result.categories && result.categories.length > 0 && (
              <div className="flex gap-2 mt-2">
                {result.categories.slice(0, 3).map((category) => (
                  <span key={category} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded">
                    {category}
                  </span>
                ))}
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}

