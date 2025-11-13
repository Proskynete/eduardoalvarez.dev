import { act, renderHook, waitFor } from '@testing-library/react';
import { algoliasearch } from 'algoliasearch';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AlgoliaConfig } from './types';
import { useAlgoliaSearch } from './use-algolia-search';

// Mock algoliasearch
vi.mock('algoliasearch', () => ({
  algoliasearch: vi.fn(),
}));

describe('useAlgoliaSearch', () => {
  const mockAlgoliaConfig: AlgoliaConfig = {
    ALGOLIA_APPLICATION_ID: 'test-app-id',
    ALGOLIA_INDEX_NAME: 'test-index',
    ALGOLIA_SEARCH_API_KEY: 'test-search-key',
  };

  const mockSearchResults = [
    {
      objectID: '1',
      title: 'Test Article 1',
      slug: 'test-article-1',
      description: 'Description 1',
      categories: ['javascript'],
      link: '/articulos/test-article-1',
    },
    {
      objectID: '2',
      title: 'Test Article 2',
      slug: 'test-article-2',
      description: 'Description 2',
      categories: ['react'],
      link: '/articulos/test-article-2',
    },
  ];

  let mockSearchForHits: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock searchForHits method
    mockSearchForHits = vi.fn().mockResolvedValue({
      results: [{ hits: mockSearchResults }],
    });

    // Mock algoliasearch client
    (algoliasearch as ReturnType<typeof vi.fn>).mockReturnValue({
      searchForHits: mockSearchForHits,
    });
  });

  describe('Inicialización', () => {
    it('debe inicializar con valores por defecto', () => {
      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasSearched).toBe(false);
    });

    it('debe inicializar el cliente de Algolia con la configuración correcta', () => {
      renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      expect(algoliasearch).toHaveBeenCalledWith(
        mockAlgoliaConfig.ALGOLIA_APPLICATION_ID,
        mockAlgoliaConfig.ALGOLIA_SEARCH_API_KEY,
      );
    });

    it('no debe inicializar el cliente si falta configuración', () => {
      const { result } = renderHook(() => useAlgoliaSearch(undefined));

      expect(algoliasearch).not.toHaveBeenCalled();
      expect(result.current.searchResults).toEqual([]);
    });

    it('no debe inicializar el cliente si falta ALGOLIA_SEARCH_API_KEY', () => {
      const incompleteConfig = {
        ALGOLIA_APPLICATION_ID: 'test-app-id',
        ALGOLIA_INDEX_NAME: 'test-index',
      };

      renderHook(() => useAlgoliaSearch(incompleteConfig));

      expect(algoliasearch).not.toHaveBeenCalled();
    });
  });

  describe('Funcionalidad de búsqueda', () => {
    it('debe realizar búsqueda exitosa y actualizar resultados', async () => {
      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('test query');
      });

      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });

      expect(mockSearchForHits).toHaveBeenCalledWith({
        requests: [
          {
            indexName: mockAlgoliaConfig.ALGOLIA_INDEX_NAME,
            query: 'test query',
            hitsPerPage: 5,
            attributesToRetrieve: ['title', 'slug', 'description', 'categories', 'link'],
          },
        ],
      });

      expect(result.current.searchResults).toEqual(mockSearchResults);
      expect(result.current.hasSearched).toBe(true);
      expect(result.current.error).toBeNull();
      expect(searchResult).toBe(true);
    });

    it('debe establecer isSearching a true durante la búsqueda', async () => {
      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      // Mock a slow search
      mockSearchForHits.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ results: [{ hits: mockSearchResults }] }), 100),
          ),
      );

      act(() => {
        result.current.search('test query');
      });

      // Should be searching immediately
      expect(result.current.isSearching).toBe(true);

      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });
    });

    it('debe retornar false cuando no hay resultados', async () => {
      mockSearchForHits.mockResolvedValue({
        results: [{ hits: [] }],
      });

      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('no results query');
      });

      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.hasSearched).toBe(true);
      expect(searchResult).toBe(false);
    });

    it('debe limpiar resultados si la query está vacía', async () => {
      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('');
      });

      expect(mockSearchForHits).not.toHaveBeenCalled();
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.hasSearched).toBe(false);
      expect(searchResult).toBe(false);
    });

    it('debe limpiar resultados si la query solo tiene espacios', async () => {
      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('   ');
      });

      expect(mockSearchForHits).not.toHaveBeenCalled();
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.hasSearched).toBe(false);
      expect(searchResult).toBe(false);
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar errores de búsqueda y establecer mensaje de error', async () => {
      const searchError = new Error('Search failed');
      mockSearchForHits.mockRejectedValue(searchError);

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('error query');
      });

      await waitFor(() => {
        expect(result.current.isSearching).toBe(false);
      });

      expect(result.current.error).toBe('Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente.');
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.hasSearched).toBe(true);
      expect(searchResult).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error searching:', searchError);

      consoleErrorSpy.mockRestore();
    });

    it('debe establecer error si falta ALGOLIA_APPLICATION_ID', async () => {
      const incompleteConfig = {
        ALGOLIA_INDEX_NAME: 'test-index',
        ALGOLIA_SEARCH_API_KEY: 'test-key',
      };

      const { result } = renderHook(() => useAlgoliaSearch(incompleteConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('test query');
      });

      expect(result.current.error).toBe('La configuración de búsqueda no está disponible.');
      expect(mockSearchForHits).not.toHaveBeenCalled();
      expect(searchResult).toBe(false);
    });

    it('debe establecer error si falta ALGOLIA_INDEX_NAME', async () => {
      const incompleteConfig = {
        ALGOLIA_APPLICATION_ID: 'test-app-id',
        ALGOLIA_SEARCH_API_KEY: 'test-key',
      };

      const { result } = renderHook(() => useAlgoliaSearch(incompleteConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('test query');
      });

      expect(result.current.error).toBe('La configuración de búsqueda no está disponible.');
      expect(mockSearchForHits).not.toHaveBeenCalled();
      expect(searchResult).toBe(false);
    });

    it('debe establecer error si falta ALGOLIA_SEARCH_API_KEY', async () => {
      const incompleteConfig = {
        ALGOLIA_APPLICATION_ID: 'test-app-id',
        ALGOLIA_INDEX_NAME: 'test-index',
      };

      const { result } = renderHook(() => useAlgoliaSearch(incompleteConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('test query');
      });

      expect(result.current.error).toBe('La configuración de búsqueda no está disponible.');
      expect(mockSearchForHits).not.toHaveBeenCalled();
      expect(searchResult).toBe(false);
    });

    it('debe resetear error al iniciar nueva búsqueda', async () => {
      // First search with error
      mockSearchForHits.mockRejectedValueOnce(new Error('Search failed'));
      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      await act(async () => {
        await result.current.search('error query');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente.');
      });

      // Second search successful
      mockSearchForHits.mockResolvedValueOnce({
        results: [{ hits: mockSearchResults }],
      });

      await act(async () => {
        await result.current.search('successful query');
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });

      expect(result.current.searchResults).toEqual(mockSearchResults);
    });
  });

  describe('clearSearch', () => {
    it('debe limpiar todos los estados', async () => {
      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      // First, perform a search
      await act(async () => {
        await result.current.search('test query');
      });

      await waitFor(() => {
        expect(result.current.searchResults.length).toBeGreaterThan(0);
        expect(result.current.hasSearched).toBe(true);
      });

      // Now clear
      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.isSearching).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasSearched).toBe(false);
    });

    it('debe limpiar error si existe', async () => {
      mockSearchForHits.mockRejectedValueOnce(new Error('Search failed'));
      const { result } = renderHook(() => useAlgoliaSearch(mockAlgoliaConfig));

      await act(async () => {
        await result.current.search('error query');
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Validación de configuración', () => {
    it('debe manejar configuración undefined', async () => {
      const { result } = renderHook(() => useAlgoliaSearch(undefined));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('test query');
      });

      expect(result.current.error).toBe('La configuración de búsqueda no está disponible.');
      expect(searchResult).toBe(false);
    });

    it('debe manejar configuración parcial', async () => {
      const partialConfig = {
        ALGOLIA_APPLICATION_ID: 'test-app-id',
      };

      const { result } = renderHook(() => useAlgoliaSearch(partialConfig));

      let searchResult: boolean | undefined;

      await act(async () => {
        searchResult = await result.current.search('test query');
      });

      expect(result.current.error).toBe('La configuración de búsqueda no está disponible.');
      expect(searchResult).toBe(false);
    });
  });
});
