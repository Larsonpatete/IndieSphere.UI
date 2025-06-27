import React, { useState, useEffect } from 'react';
import { SpotifyService } from '../api/SpotifyService';
import { SearchBar } from './SearchBar';
import Globe from '../Assets/globe.svg'
import '../styles/SearchPage.css';
import { useParams, useLocation } from "react-router-dom";
import { SongItem } from './SongItem';
import { Song } from '../domain/Song';
import { SearchService } from '../api/SearchService';
import defaultAlbumImageUrl from '../Assets/defaultAlbum.svg';
import { useSongMapper } from '../hooks/useSongMapper';

const searchService = new SearchService();
const ITEMS_PER_PAGE = 20; // Number of songs to show per page

export function SearchPage() {
  const { type, query } = useParams<{ type?: string; query?: string }>();
  const location = useLocation();
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mapSong } = useSongMapper();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

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

  // Modify your useEffect to handle search types
  useEffect(() => {
    if (query && type) {
      handleSearch(query, 1, type);
    }
  }, [query, type]);

  // Reset to page 1 when new search is performed
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // Update your handleSearch function
  const handleSearch = async (searchQuery: string, page: number = 1, searchType: string = 'song') => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      console.log(`Searching for: ${searchQuery} (Type: ${searchType}, Page: ${page}, Offset: ${offset})`);
      
      let apiData;
      
      // Call different endpoints based on search type
      switch(searchType) {
        case 'artist':
          apiData = await searchService.searchArtists(searchQuery, ITEMS_PER_PAGE, offset);
          break;
        case 'genre':
          apiData = await searchService.searchGenre(searchQuery, ITEMS_PER_PAGE, offset);
          break;
        case 'similar-song':
          apiData = await searchService.searchSimilarSongs(searchQuery, ITEMS_PER_PAGE, offset);
          break;
        case 'similar-artist':
          apiData = await searchService.searchSimilarArtists(searchQuery, ITEMS_PER_PAGE, offset);
          break;
        case 'song':
        default:
          apiData = await searchService.search(searchQuery, ITEMS_PER_PAGE, offset);
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
      
      setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching results.');
    } finally {
      setLoading(false);
    }
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

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 mb-24">
        <div className="flex items-center space-x-2">
          {/* Previous page button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700'
            }`}
          >
            ←
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber:  number;
            
            // Show pages around current page
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNumber
                    ? 'bg-blue-500 text-white'
                    : 'text-purple-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next page button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700'
            }`}
          >
            →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className={`flex flex-col items-center mb-16 transition-all duration-500${results.length > 0 ? "" : " mt-32"}`}>
        <div className="relative flex justify-center items-center mb-16" style={{ height: '120px' }}>
          <img
            src={Globe}
            alt="Globe"
            className="absolute inset-0 w-40 h-40 mx-auto pointer-events-none"
            style={{ zIndex: 0 }}
          />
          <h1 className="text-7xl font-extrabold tracking-tight drop-shadow-lg">
            Indie Sphere
          </h1>
        </div>
        <div className="flex justify-center w-full mb-4">
          <div className="w-full md:w-1/2">
            <SearchBar />
          </div>
        </div>
        {loading && <p className="text-blue-500 mt-4">Loading...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      
      {/* Results count */}
      {results.length > 0 && (
        <div className="text-center mb-4">
          <p className="text-white opacity-80">
            Found {totalCount} results • Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
      
      {/* Results grid */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 px-6">
        {results.map(song => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>
      
      {/* Pagination controls */}
      {results.length > 0 && <Pagination />}
    </div>
  );
}