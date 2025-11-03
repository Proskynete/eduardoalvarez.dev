import { algoliasearch } from "algoliasearch";
import { useEffect, useRef, useState } from "react";

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
    // Cerrar el dropdown cuando se hace clic en un resultado
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
    // Dejar que el enlace navegue naturalmente
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

      {/* Buscador */}
      <div className="relative ml-4">
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
          className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 text-sm w-48 transition ease-in-out duration-300"
        />

        {/* Resultados/Hints */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-96 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            {searchResults.map((result, index) => {
              const articleUrl = getArticleUrl(result);
              return (
                <a
                  key={result.objectID}
                  href={articleUrl}
                  onClick={handleResultClick}
                  className={`block w-full text-left px-4 py-3 hover:bg-gray-800 transition ease-in-out duration-200 border-b border-gray-800 last:border-b-0 cursor-pointer ${
                    index === selectedIndex ? "bg-gray-800" : ""
                  }`}
                  aria-label={`Ir al artículo: ${result.title}`}
                >
                  <div className="font-medium text-gray-100 text-sm mb-1">{result.title}</div>
                  {result.description && <div className="text-xs text-gray-400 line-clamp-2">{result.description}</div>}
                  {result.categories && result.categories.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {result.categories.slice(0, 3).map((category) => (
                        <span key={category} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded">
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
