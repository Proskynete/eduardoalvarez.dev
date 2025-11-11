import { algoliasearch } from "algoliasearch";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  objectID: string;
  title: string;
  slug: string;
  description?: string;
  categories?: string[];
  link?: string;
}

interface AlgoliaConfig {
  ALGOLIA_APPLICATION_ID?: string;
  ALGOLIA_INDEX_NAME?: string;
  ALGOLIA_SEARCH_API_KEY?: string; // Search-Only API Key (read-only)
}

export function useAlgoliaSearch(algolia?: AlgoliaConfig) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchClientRef = useRef<ReturnType<typeof algoliasearch> | null>(null);

  useEffect(() => {
    if (algolia?.ALGOLIA_SEARCH_API_KEY && algolia?.ALGOLIA_APPLICATION_ID && algolia?.ALGOLIA_INDEX_NAME) {
      // Usar Search-Only API Key (solo lectura) para el cliente
      searchClientRef.current = algoliasearch(algolia.ALGOLIA_APPLICATION_ID, algolia.ALGOLIA_SEARCH_API_KEY);
    }
  }, [algolia]);

  const search = async (query: string) => {
    if (!query.trim() || !searchClientRef.current || !algolia?.ALGOLIA_INDEX_NAME) {
      setSearchResults([]);
      setIsSearching(false);
      return false;
    }

    setIsSearching(true);

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
      setIsSearching(false);
      return hits.length > 0;
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
      setIsSearching(false);
      return false;
    }
  };

  return { searchResults, search, isSearching };
}

