import { algoliasearch } from 'algoliasearch';
import { useEffect, useRef, useState } from 'react';

import type { AlgoliaConfig, SearchHookResult, SearchResult } from './types';

export function useAlgoliaSearch(algolia?: AlgoliaConfig): SearchHookResult {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const searchClientRef = useRef<ReturnType<typeof algoliasearch> | null>(null);

  useEffect(() => {
    if (algolia?.ALGOLIA_SEARCH_API_KEY && algolia?.ALGOLIA_APPLICATION_ID && algolia?.ALGOLIA_INDEX_NAME) {
      // Usar Search-Only API Key (solo lectura) para el cliente
      searchClientRef.current = algoliasearch(algolia.ALGOLIA_APPLICATION_ID, algolia.ALGOLIA_SEARCH_API_KEY);
    }
  }, [algolia]);

  const search = async (query: string) => {
    // Resetear error al iniciar nueva búsqueda
    setError(null);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return false;
    }

    // Validar configuración antes de buscar
    if (!algolia?.ALGOLIA_APPLICATION_ID || !algolia?.ALGOLIA_INDEX_NAME || !algolia?.ALGOLIA_SEARCH_API_KEY) {
      setError("La configuración de búsqueda no está disponible.");
      setIsSearching(false);
      return false;
    }

    if (!searchClientRef.current) {
      setError("El servicio de búsqueda no está inicializado.");
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
      setHasSearched(true);
      return hits.length > 0;
    } catch (error) {
      console.error("Error searching:", error);
      setError("Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente.");
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(true);
      return false;
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
    setHasSearched(false);
  };

  return { searchResults, search, isSearching, error, hasSearched, clearSearch };
}

