// src/context/SearchContext.tsx
import React, { createContext, useState, useContext, useCallback, useReducer, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Song } from '../domain/Song';
import { SearchService } from '../api/SearchService';
import { ArtistService } from '../api/ArtistService';
import { useSongMapper } from '../hooks/useSongMapper';
import { useArtistMapper } from '../hooks/useArtistMapper';

const searchService = new SearchService();
const artistService = new ArtistService();


// Define the state shape
interface SearchState {
  query: string;
  type: string; // TODO: change to SearchType
  results: any[]; // could be a Song[], Artist[], etc. depending on the type
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  filters: {
    popularityFilter: [number, number];
    // Add more filters here as needed
  };
}

// Define action types
type SearchAction =
  | { type: 'SET_QUERY', payload: string }
  | { type: 'SET_TYPE', payload: string }
  | { type: 'SET_RESULTS', payload: Song[] }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'SET_PAGINATION', payload: { currentPage: number, totalPages: number, totalCount: number } }
  | { type: 'SET_ITEMS_PER_PAGE', payload: number }
  | { type: 'SET_POPULARITY_FILTER', payload: [number, number] }
  | { type: 'RESET_SEARCH_STATE' };

// Create the reducer
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PAGINATION':
      return { 
        ...state, 
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalCount: action.payload.totalCount
      };
    case 'SET_ITEMS_PER_PAGE':
      return { ...state, itemsPerPage: action.payload };
    case 'SET_POPULARITY_FILTER':
      return { 
        ...state, 
        filters: { 
          ...state.filters, 
          popularityFilter: action.payload 
        } 
      };
    case 'RESET_SEARCH_STATE':
        return initialState;
    default:
      return state;
  }
}

// Define context type
interface SearchContextType {
  state: SearchState;
  performSearch: (query: string, type: string, page?: number, itemsPerPage?: number, filters?: any) => void;
  updateUrlWithState: () => void;
  resetSearchState: () => void;
}

// Create context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Initial state
const initialState: SearchState = {
  query: '',
  type: 'song',
  results: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  itemsPerPage: 20,
  filters: {
    popularityFilter: [0, 100]
  }
};

// Create provider component
export const SearchProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const { mapSong } = useSongMapper();
  const { mapArtist } = useArtistMapper();
  
  // Extract URL parameters
  const params = useParams<{ type?: string; query?: string }>();
  const searchParams = new URLSearchParams(location.search);
  const initializedRef = useRef(false);
  
  // Initialize state from URL
  useEffect(() => {
  // Skip if we've already initialized
  if (initializedRef.current) return;
  
  // Get the current URL path directly
  const currentPath = window.location.pathname;
  console.log('Current path:', currentPath);
  
  // Check if we're on a search page
  const searchPattern = /\/search\/([^\/]+)\/([^?]+)/;
  const match = currentPath.match(searchPattern);
  
  if (match) {
    // We have a search URL - extract type and query
    const type = match[1];
    const query = decodeURIComponent(match[2]);
    
    console.log('Found search parameters in URL:', { type, query });
    
    // Get any query string parameters
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page') || '1');
    const perPage = parseInt(urlParams.get('perPage') || '20');
    
    // Mark as initialized to prevent running again
    initializedRef.current = true;
    
    // Update state
    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'SET_TYPE', payload: type });
    dispatch({ 
      type: 'SET_PAGINATION', 
      payload: { 
        currentPage: page,
        totalPages: 1,
        totalCount: 0
      } 
    });
    
    // Show loading state
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Perform search with slight delay to ensure state is updated
    setTimeout(() => {
      performSearch(query, type, page, perPage);
    }, 10);
  }
}, []); // Empty dependency array - only runs once on mount
  
  // Perform search without filters
  const performSearch = useCallback(async (
    searchQuery: string, 
    searchType: string, 
    page: number = 1, 
    itemsPerPage: number = 20,
    filters?: any
  ) => {
    // 1. Update state all at once
    dispatch({ type: 'SET_QUERY', payload: searchQuery });
    dispatch({ type: 'SET_TYPE', payload: searchType });
    dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: itemsPerPage });
    dispatch({ 
      type: 'SET_PAGINATION', 
      payload: { 
        currentPage: page,
        totalPages: state.totalPages,
        totalCount: state.totalCount
      } 
    });
    
    // If filters provided, update those too
    if (filters) {
      dispatch({ 
        type: 'SET_POPULARITY_FILTER', 
        payload: [
          filters.minPopularity ?? state.filters.popularityFilter[0],
          filters.maxPopularity ?? state.filters.popularityFilter[1]
        ] 
      });
    }
    // 2. Update URL
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (itemsPerPage !== 20) params.set('perPage', itemsPerPage.toString());
    
    // Add filter parameters
    const minPopularity = filters?.minPopularity ?? state.filters.popularityFilter[0];
    const maxPopularity = filters?.maxPopularity ?? state.filters.popularityFilter[1];
    
    if (minPopularity > 0) params.set('minPopularity', minPopularity.toString());
    if (maxPopularity < 100) params.set('maxPopularity', maxPopularity.toString());
    
    // Build URL
    const searchUrl = `/search/${searchType}/${encodeURIComponent(searchQuery)}${
      params.toString() ? `?${params.toString()}` : ''
    }`;
    
    // Navigate without triggering a reload
    navigate(searchUrl, { replace: true });
    
    // 3. Actually perform the search
    dispatch({ type: 'SET_RESULTS', payload: [] });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const offset = (page - 1) * itemsPerPage;
      const apiFilters = {
        minPopularity: minPopularity,
        maxPopularity: maxPopularity
      };

      console.log(`Searching for: ${searchQuery} (Type: ${searchType}, Page: ${page}, Offset: ${offset}, Items: ${itemsPerPage}, Filters: ${JSON.stringify(apiFilters)})`);
      
      let response;
      let itemList = [];
      switch (searchType) {
        case 'song':
          response = await searchService.search(searchQuery, itemsPerPage, offset, apiFilters);
          itemList = response.results.map((item: any) => mapSong(item));
          break;
        case 'artist':
          response = await artistService.search(searchQuery, itemsPerPage, offset, apiFilters);
          itemList = response.results.map((item: any) => mapArtist(item));
          break;
        case 'genre':
          response = await searchService.searchGenre(searchQuery, itemsPerPage, offset);
          break;
        case 'similar-song':
          response = await searchService.searchSimilarSongs(searchQuery, itemsPerPage, apiFilters);
          itemList = response.results.map((item: any) => mapSong(item));
          break;
        case 'similar-artist':
          response = await artistService.getSimilar(searchQuery, itemsPerPage, apiFilters);
          itemList = response.results.map((item: any) => mapArtist(item));
          break;
        default:
          throw new Error(`Unknown search type: ${searchType}`);
      }
      
      // Update state with results
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          currentPage: page,
          totalPages: Math.ceil(response.totalCount / itemsPerPage),
          totalCount: response.totalCount
        } 
      });

      console.log('API response:', response);
      console.log('Mapped items:', itemList);


      dispatch({ type: 'SET_RESULTS', payload: itemList });
    } catch (err) {
      console.error('Search error:', err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [navigate, mapSong, state.filters.popularityFilter, state.totalPages, state.totalCount]);
    

  const resetSearchState = useCallback(() => {
    dispatch({ type: 'RESET_SEARCH_STATE' });
    navigate('/', { replace: true });
  }, [navigate]);

  const isSearchPage = useCallback(() => {
    return location.pathname.startsWith('/search/');
  }, [location.pathname]);

  // Update URL based on state - fix infinite loop
  const updateUrlWithState = useCallback(() => {
    if (!isSearchPage() || !state.query || !state.type) return;
    
    console.log('Updating URL with state:', state);
    const params = new URLSearchParams();
    
    // Add pagination parameters
    if (state.currentPage > 1) {
      params.set('page', state.currentPage.toString());
    }
    if (state.itemsPerPage !== 20) {
      params.set('perPage', state.itemsPerPage.toString());
    }
    
    // Add filter parameters
    if (state.filters.popularityFilter[0] > 0) {
      params.set('minPopularity', state.filters.popularityFilter[0].toString());
    }
    if (state.filters.popularityFilter[1] < 100) {
      params.set('maxPopularity', state.filters.popularityFilter[1].toString());
    }
    
    // Build the new URL
    // const newUrl = `/search/${state.type}/${encodeURIComponent(state.query)}${
    //   params.toString() ? `?${params.toString()}` : ''
    // }`;
    
    // // Only update URL if it's different from the current URL to prevent loops
    // const currentSearch = searchParams.toString();
    // const newSearch = params.toString();
    // const currentPathname = location.pathname;
    // const newPathname = `/search/${state.type}/${encodeURIComponent(state.query)}`;
    
    // if (currentPathname !== newPathname || currentSearch !== newSearch) {
    //   console.log('URL changed, updating to:', newUrl);
    //   // Update URL without triggering a navigation
    //   navigate(newUrl, { replace: true });
    // } else {
    //   console.log('URL unchanged, skipping update');
    // }
    
    // Do NOT perform a search here - this will cause infinite loops!
    // The search should be triggered elsewhere (e.g., by the initial URL load or user actions)
  }, [state, navigate, isSearchPage, location.pathname, searchParams]);

  // Update URL when state changes
  useEffect(() => {
    updateUrlWithState();
  }, [
    state.query, 
    state.type, 
    state.currentPage, 
    state.itemsPerPage, 
    state.filters.popularityFilter,
    updateUrlWithState
  ]);

  return (
    <SearchContext.Provider 
      value={{
        state,
        performSearch,
        updateUrlWithState,
        resetSearchState
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};