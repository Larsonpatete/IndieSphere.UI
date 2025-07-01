import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './SearchBar';
import Globe from '../Assets/globe.svg'
import '../styles/SearchPage.css';
import { useParams, useLocation } from "react-router-dom";
import { SongItem } from './SongItem';
import { Song } from '../domain/Song';
import { SearchService } from '../api/SearchService';
import { useSongMapper } from '../hooks/useSongMapper';
import { useTheme } from '../context/ThemeContext';
import { Pagination } from './Pagination'; // Import the new Pagination component

const searchService = new SearchService();

export function SearchPage() {
  const { type, query } = useParams<{ type?: string; query?: string }>();
  const location = useLocation();
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mapSong } = useSongMapper();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Add state for items per page
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Check for clear results flag
  useEffect(() => {
    // If we navigated to root with clearResults flag, clear the results
    if (location.pathname === '/' && location.state && (location.state as any).clearResults) {
      setResults([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalCount(0);
      
      // Clear the state flag so it doesn't keep clearing on other navigations
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Modify your useEffect to handle search types and clear results when search type changes
  useEffect(() => {
    if (query && type) {
      // Clear results when search type changes
      setResults([]);
      setCurrentPage(1);
      handleSearch(query, 1, type);
    }
  }, [query, type]);

  // Create a stable search function with useCallback
  const performSearch = useCallback(async (
    searchQuery: string, 
    page: number = 1, 
    searchType: string = 'song',
    perPage: number = itemsPerPage // Default to current itemsPerPage
  ) => {
    if (!searchQuery || !searchType) return;
    
    // Clear results before loading new ones
    if (page === 1) {
      setResults([]);
    }
    
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * perPage;
      console.log(`Searching for: ${searchQuery} (Type: ${searchType}, Page: ${page}, Offset: ${offset}, Items: ${perPage})`);
      
      let apiData;
      
      // Call different endpoints based on search type
      switch(searchType) {
        case 'artist':
          apiData = await searchService.searchArtists(searchQuery, perPage, offset);
          break;
        case 'genre':
          apiData = await searchService.searchGenre(searchQuery, perPage, offset);
          break;
        case 'similar-song':
          apiData = await searchService.searchSimilarSongs(searchQuery, perPage);
          break;
        case 'similar-artist':
          apiData = await searchService.searchSimilarArtists(searchQuery, perPage);
          break;
        case 'song':
        default:
          apiData = await searchService.search(searchQuery, perPage, offset);
          break;
      }
      
      console.log('API response:', apiData);

      const songsData = apiData.results;
      const totalCount = apiData.totalCount || songsData.length;

      if (!Array.isArray(songsData)) {
        throw new Error("Invalid songs data format");
      }

      const songs = songsData.map((item: any) => mapSong(item));
      setResults(songs);
      setTotalCount(totalCount);
      
      setTotalPages(Math.ceil(totalCount / perPage));
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching results.');
    } finally {
      setLoading(false);
    }
  }, [mapSong]); // Only depend on mapSong, not on itemsPerPage which changes frequently

  // Simplified handleSearch that calls the stable performSearch
  const handleSearch = (searchQuery: string, page: number = 1, searchType: string = 'song') => {
    performSearch(searchQuery, page, searchType, itemsPerPage);
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (query && type) {
      handleSearch(query, page, type);
    }
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modified handler for items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    
    // Set the new items per page
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    
    // Call search directly with the new value
    if (query && type) {
      performSearch(query, 1, type, newItemsPerPage);
    }
  };

  // Theme-specific text colors
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const errorColor = 'text-red-500';
  const loadingColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const resultsTextColor = isDarkMode ? 'text-white' : 'text-gray-700';

  return (
    <div className="min-h-screen mb-16">
      <div className={`flex flex-col items-center mb-16 transition-all duration-500${results.length > 0 ? "" : " mt-32"}`}>
        <div className="relative flex justify-center items-center mb-16" style={{ height: '120px' }}>
          <img
            src={Globe}
            alt="Globe"
            className="absolute inset-0 w-40 h-40 mx-auto pointer-events-none"
            style={{ zIndex: 0 }}
          />
          <h1 className="text-7xl font-extrabold tracking-tight drop-shadow-lg text-indie-purple">
            Indie Sphere
          </h1>
        </div>
        <div className="flex justify-center w-full mb-4">
          <div className="w-full md:w-1/2">
            <SearchBar />
          </div>
        </div>
        {loading && <p className={`${loadingColor} mt-4`}>Loading...</p>}
        {error && <p className={`${errorColor} mt-4`}>{error}</p>}
      </div>
      
      {/* Results count */}
      {results.length > 0 && (
        <div className="text-center mb-4">
          <p className={`${resultsTextColor} opacity-80`}>
            Found {totalCount} results • Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
      
      {/* Results grid */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 px-6">
        {results.map(song => (
          <SongItem key={song.id || `song-${song.title}-${song.artist.name}`} song={song} />
        ))}
      </div>
      
      {/* Items per page dropdown and pagination controls */}
      {results.length > 0 && (
        <div className="flex flex-row items-center mt-16 mb-28 px-32">
          {/* Empty div for left side balance */}
          <div className="w-48"></div>
          
          {/* Pagination controls - centered */}
          <div className="flex-grow flex justify-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageLimit={7}
            />
          </div>
          
          {/* Items per page selector - right aligned */}
          <div className={`${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm rounded-xl p-3 shadow-lg`}>
            <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Items per page:
              <select 
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className={`ml-2 px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indie-purple`}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option> {/* This is the maximum Spotify allows */}
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}