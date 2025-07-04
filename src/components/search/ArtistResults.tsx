// filepath: c:\Users\Larson Patete\source\repos\TypeScriptFun\IndieSphere.UI\src\components\search\ArtistResults.tsx
import React from 'react';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';
import { Pagination } from '../Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { Artist } from '../../domain/Artist';
import SpotifyLogo from '../../Assets/Full_Logo_Black_CMYK.svg';

export function ArtistResults() {
  const { state, performSearch } = useSearch();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  
  const resultsTextColor = isDarkMode ? 'text-white' : 'text-gray-700';
  
  // Extract featured artist and secondary artists
  const featuredArtist = state.results[0] as Artist | undefined;
  const secondaryArtists = state.results.slice(1) as Artist[];
  
  // Function to render genre badges
  const renderGenreBadges = (genres: string[] = []) => {
    return genres.slice(0, 3).map((genre, index) => (
      <span 
        key={index} 
        className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} mr-2 mb-2`}
      >
        {genre}
      </span>
    ));
  };
  
  // Get image URL from artist or use default
  const getArtistImage = (artist: Artist) => {
    return artist.images && artist.images.length > 0
      ? artist.images[0]
      : 'https://via.placeholder.com/150'; // Fallback image URL
  };
  
  const handleViewArtistDetails = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };
  
  return (
    <div className="w-full">
      {/* Results count */}
      <div className="text-center mb-4">
        <p className={`${resultsTextColor} opacity-80`}>
          Found {state.totalCount} artists • Page {state.currentPage} of {state.totalPages}
        </p>
      </div>
      
      {/* Featured artist */}
      {featuredArtist && (
        <div className={`mx-auto mb-8 rounded-xl overflow-hidden shadow-lg max-w-4xl relative ${isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row">
            {/* Artist image - larger size */}
            <div className="w-full md:w-64 h-64 flex-shrink-0">
              <img 
                src={getArtistImage(featuredArtist)} 
                alt={featuredArtist.name} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Artist details */}
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center mb-1">
                  <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    Top Result
                  </span>
                </div>
                <Link to={`/artist/${featuredArtist.id}`}>
                  <h2 className={`text-2xl font-bold mb-2 hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {featuredArtist.name}
                  </h2>
                </Link>
                
                {/* Genres */}
                <div className="flex flex-wrap mt-2">
                  {renderGenreBadges(featuredArtist.genres)}
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {/* Artist metadata */}
                {featuredArtist.followers !== undefined && (
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {featuredArtist.followers.toLocaleString()} followers
                  </div>
                )}
                
                {/* Popularity indicator - similar to the song component */}
                {featuredArtist.popularity !== undefined && (
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${featuredArtist.popularity}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {featuredArtist.popularity}% popularity
                    </span>
                  </div>
                )}
                
                {/* Details button - similar to song component */}
                <button 
                  onClick={() => handleViewArtistDetails(featuredArtist.id)}
                  className={`ml-auto px-5 py-2 rounded-full ${
                    isDarkMode 
                      ? 'bg-indie-purple text-white hover:bg-purple-700' 
                      : 'bg-indie-purple text-white hover:bg-purple-600'
                  } transition-colors`}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
          
          {/* Spotify logo positioned like in SongResults */}
          <img 
            src={SpotifyLogo} 
            alt="Spotify" 
            className={`w-24 h-24 absolute bottom-40 right-4 ${isDarkMode ? 'invert opacity-50' : 'opacity-80'} pointer-events-none`} 
          />
        </div>
      )}
      
      {/* Secondary artists grid - keeping this section the same */}
      <div className="px-6 mb-8">
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          More Artists
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {secondaryArtists.map((artist, index) => (
            <div 
              key={artist.id ? `artist-${artist.id}` : `artist-index-${index}`}
              className={`flex items-center p-3 rounded-lg relative ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors shadow-sm`}
            >
              {/* Artist image thumbnail */}
              <img 
                src={getArtistImage(artist)} 
                alt={artist.name} 
                className="w-12 h-12 object-cover rounded mr-3 flex-shrink-0"
              />
              <div className="min-w-0 flex-grow">
                <Link to={`/artist/${artist.id}`}>
                  <h4 className={`font-medium truncate hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {artist.name}
                  </h4>
                </Link>
                {/* First genre if available */}
                {artist.genres && artist.genres.length > 0 && (
                  <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {artist.genres[0]}
                  </p>
                )}
              </div>
              
              {/* Small popularity indicator for secondary artists */}
              {artist.popularity !== undefined && (
                <div className={`text-xs ml-2 mt-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {artist.popularity}%
                </div>
              )}
              
              {/* Spotify logo in the corner */}
              <img 
                src={SpotifyLogo} 
                alt="Spotify" 
                className={`w-16 h-16 absolute bottom-4 right-2 ${isDarkMode ? 'invert opacity-50' : 'opacity-80'} pointer-events-none`} 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination controls - keeping this section the same */}
      <div className="flex flex-row items-center mt-6 mb-28 px-4 md:px-32">
        {/* Empty div for left side balance */}
        <div className="hidden md:block w-48"></div>
        
        {/* Pagination controls - centered */}
        <div className="flex-grow flex justify-center">
          <Pagination 
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            pageLimit={7}
          />
        </div>
        
        {/* Items per page selector - right aligned */}
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