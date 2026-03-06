export interface SearchResult {
  objectID: string;
  title: string;
  slug: string;
  description?: string;
  categories?: string[];
  link?: string;
}

export interface AlgoliaConfig {
  ALGOLIA_APPLICATION_ID?: string;
  ALGOLIA_INDEX_NAME?: string;
  ALGOLIA_SEARCH_API_KEY?: string;
}

export interface SearchHookResult {
  searchResults: SearchResult[];
  search: (query: string) => Promise<boolean>;
  isSearching: boolean;
  error: string | null;
  hasSearched: boolean;
  clearSearch: () => void;
}
