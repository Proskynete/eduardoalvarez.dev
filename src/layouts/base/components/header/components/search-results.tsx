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
}

export default function SearchResults({
  results,
  searchQuery,
  selectedIndex,
  onResultClick,
  getArticleUrl,
  renderHighlightedText,
}: SearchResultsProps) {
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

