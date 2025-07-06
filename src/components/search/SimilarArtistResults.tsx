import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';
import { Pagination } from '../Pagination';
import { PopularitySlider } from '../PopularitySlider';
import SpotifyLogo from '../../Assets/Full_Logo_Black_CMYK.svg';

export function SimilarArtistResults() {
  const { state, performSearch } = useSearch();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  
  const resultsTextColor = isDarkMode ? 'text-white' : 'text-gray-700';

  return (
    <div className="w-full">
      {/* Popularity filter */}
      <PopularitySlider />
      
      {/* Results count */}
      <div className="text-center mb-4">
        <p className={`${resultsTextColor} opacity-80`}>
          Found {state.totalCount} similar artists • Page {state.currentPage} of {state.totalPages}
        </p>
      </div>
      
      {/* Results grid */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 px-6">
        {state.results.map(artist => (
          <div 
            key={artist.id || `artist-${artist.name}`}
            className={`relative p-4 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-800'} rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center max-w-xs cursor-pointer`}
            style={{ minHeight: '220px', width: '220px' }}
            onClick={() => navigate(`/artist/${artist.id}`)}
          >
            {/* Artist image - increased size */}
            <img 
              src={artist.images && artist.images[0] ? artist.images[0] : 'https://via.placeholder.com/150?text=No+Image'} 
              alt={artist.name} 
              className="h-40 w-40 object-cover mb-3"
            />
            
            {/* Similarity Match Badge - New addition */}
            {artist.similArtistMatch !== undefined && (
              <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                {(artist.similArtistMatch * 100).toFixed(0)}% Match
              </div>
            )}
            
            {/* Artist name */}
            <h3 className="text-lg font-semibold truncate w-full text-center mb-4">
              {artist.name}
            </h3>
            
            {/* Primary genre */}
            {artist.genres && artist.genres.length > 0 && (
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} truncate w-full text-center`}>
                {typeof artist.genres[0] === 'string' ? artist.genres[0] : artist.genres[0].name}
                {artist.genres.length > 1 && ` + ${artist.genres.length - 1} more`}
              </p>
            )}
            
            {/* Followers */}
            {artist.followers !== undefined && (
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {artist.followers.toLocaleString()} followers
              </p>
            )}
            
            {/* Popularity */}
            {artist.popularity !== undefined && (
              <div className="mt-2 w-full px-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Popularity</span>
                  <span className={
                    artist.popularity > 70 ? 'text-green-500' : 
                    artist.popularity > 40 ? 'text-yellow-500' : 'text-red-500'
                  }>{artist.popularity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`${
                      artist.popularity > 70 ? 'bg-green-500' : 
                      artist.popularity > 40 ? 'bg-yellow-500' : 'bg-red-500'
                    } h-1.5 rounded-full`}
                    style={{ width: `${artist.popularity}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Spotify logo */}
            <img
              src={SpotifyLogo}
              alt="Spotify"
              className={`w-12 h-12 absolute bottom-6 right-2 ${isDarkMode ? 'invert opacity-50' : 'opacity-80'} pointer-events-none`}
              style={{ zIndex: 1 }}
            />
          </div>
        ))}
      </div>
      
      {/* Pagination controls */}
      <div className="flex flex-row items-center mt-16 mb-28 px-4 md:px-32">
        <div className="hidden md:block w-48"></div>
        <div className="flex-grow flex justify-center">
          <Pagination 
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            pageLimit={7}
          />
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm rounded-xl p-3 shadow-lg`}>
          <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Artists per page:
            <select 
              value={state.itemsPerPage}
              onChange={(e) => performSearch(state.query, state.type, state.currentPage, parseInt(e.target.value), state.filters)}
              className={`ml-2 px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indie-purple`}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}