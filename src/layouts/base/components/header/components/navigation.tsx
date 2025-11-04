import { algoliasearch } from "algoliasearch";
import { useEffect, useRef, useState } from "react";

import { Icon } from "../../../../../assets/icons";
import { navItems } from "../constants";

interface NavigationProps {
  algolia?: {
    ALGOLIA_APPLICATION_ID?: string;
    ALGOLIA_INDEX_NAME?: string;
    ALGOLIA_ADMIN_API_KEY?: string;
  };
}

interface SearchResult {
  objectID: string;
  title: string;
  slug: string;
  description?: string;
  categories?: string[];
  link?: string;
  _highlightResult?: {
    title?: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
    description?: {
      value: string;
      matchLevel: string;
      matchedWords: string[];
    };
  };
}

export default function Navigation({ algolia }: NavigationProps) {
  const [pathname, setPathname] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchClientRef = useRef<ReturnType<typeof algoliasearch> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const getArticleUrl = (result: SearchResult): string => {
    if (result.link) {
      return result.link;
    }
    if (result.slug) {
      return `/articulos/${result.slug}`;
    }
    return "#";
  };

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    if (algolia?.ALGOLIA_ADMIN_API_KEY && algolia?.ALGOLIA_APPLICATION_ID && algolia?.ALGOLIA_INDEX_NAME) {
      searchClientRef.current = algoliasearch(algolia.ALGOLIA_APPLICATION_ID, algolia.ALGOLIA_ADMIN_API_KEY);
    }
  }, [algolia]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSearchOpen) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        event.preventDefault();
        const selectedResult = searchResults[selectedIndex];
        const url = getArticleUrl(selectedResult);
        if (url && url !== "#") {
          window.location.href = url;
          setIsSearchOpen(false);
          setSearchQuery("");
          setSearchResults([]);
          setSelectedIndex(-1);
        }
      } else if (event.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, searchResults, selectedIndex]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSelectedIndex(-1);

    if (!query.trim() || !searchClientRef.current || !algolia?.ALGOLIA_INDEX_NAME) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    try {
      const { results } = await searchClientRef.current.searchForHits<SearchResult>({
        requests: [
          {
            indexName: algolia.ALGOLIA_INDEX_NAME,
            query,
            hitsPerPage: 5,
            attributesToRetrieve: ["title", "slug", "description", "categories", "link"],
          },
        ],
      });

      const hits = results[0]?.hits || [];
      setSearchResults(hits);
      setIsSearchOpen(hits.length > 0);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    setSelectedIndex(-1);
  };

  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-400 text-gray-900 font-semibold">
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  return (
    <div className="hidden sm:flex gap-3 items-center relative" ref={searchContainerRef}>
      <p className="text-gray-100">cd</p>
      {navItems
        .filter((item) => item.show)
        .map((item) => (
          <a
            key={item.name}
            className={`font-medium sm:block transition ease-in-out duration-300 ${
              pathname === item.href
                ? "text-gray-100 cursor-default pointer-events-none"
                : "text-gray-300 hover:text-gray-100 focus:outline-none focus:text-gray-100"
            }`}
            href={item.href}
          >
            {item.name}
          </a>
        ))}

      <div className="relative ml-4 flex items-center pr-3 rounded-md bg-transparent border border-gray-700 focus-within:border-primary-600 transition-colors duration-300">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) {
                setIsSearchOpen(true);
              }
            }}
            className="w-full bg-transparent border-0 focus:ring-0"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-100 transition-colors duration-200"
              aria-label="Limpiar búsqueda"
            >
              <Icon.Close className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          className="ml-2 text-gray-300 hover:text-gray-100 transition-colors duration-200"
          aria-label="Buscar"
        >
          <Icon.Search className="h-6 w-6" />
        </button>

        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full right-7 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            {searchResults.map((result, index) => {
              const articleUrl = getArticleUrl(result);
              return (
                <a
                  key={result.objectID}
                  href={articleUrl}
                  onClick={handleResultClick}
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
        )}
      </div>
    </div>
  );
}
