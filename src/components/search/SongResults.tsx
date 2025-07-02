import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';
import { Pagination } from '../Pagination';
import { Link, useNavigate } from 'react-router-dom';
import defaultAlbumImageUrl from '../../Assets/defaultAlbum.svg';
import SpotifyLogo from '../../Assets/Full_Logo_Black_CMYK.svg';

export function SongResults() {
  const { state, performSearch } = useSearch();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  
  const resultsTextColor = isDarkMode ? 'text-white' : 'text-gray-700';
  
  // Format duration from milliseconds
  const formatDuration = (ms: number): string => {
    if (!ms) return '--:--';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (songId: string) => {
    navigate(`/song/${songId}`);
  }

  // Check if we have results
  const hasResults = state.results.length > 0;
  const featuredSong = hasResults ? state.results[0] : null;
  const secondarySongs = hasResults ? state.results.slice(1) : [];
  
  return (
    <div className="w-full">
      {/* Results count */}
      <div className="text-center mb-4">
        <p className={`${resultsTextColor} opacity-80`}>
          Found {state.totalCount} songs • Page {state.currentPage} of {state.totalPages}
        </p>
      </div>
      
      {/* Featured result */}
      {featuredSong && (
        <div className={`mx-auto mb-8 rounded-xl overflow-hidden shadow-lg max-w-4xl relative ${isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row">
            {/* Album artwork - larger size */}
            <div className="w-full md:w-64 h-64 flex-shrink-0">
              <img src={featuredSong.albumImageUrl || defaultAlbumImageUrl} alt={featuredSong.album || featuredSong.title} className="w-full h-full object-cover" />
            </div>

            {/* Song details */}
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center mb-1">
                  <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    Top Result
                  </span>
                </div>
                <Link to={`/song/${featuredSong.id}`}>
                  <h2 className={`text-2xl font-bold mb-2 hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {featuredSong.title}
                  </h2>
                </Link>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {featuredSong.artist?.name || 'Unknown Artist'}
                </p>
                {featuredSong.album && (
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Album: {featuredSong.album || 'Unknown Album'}
                  </p>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {/* Song metadata */}
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDuration(featuredSong.durationMs)} • {featuredSong.releaseDate?.substring(0, 4) || 'Unknown Year'}
                </div>
                
                {/* Popularity indicator */}
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${featuredSong.popularity || 0}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {featuredSong.popularity || 0}% popularity
                  </span>
                </div>
                
                {/* Play button placeholder */}
                <button onClick={() => handlePlaySong(featuredSong.id)}
                  className={`ml-auto px-5 py-2 rounded-full ${isDarkMode ? 'bg-indie-purple text-white hover:bg-purple-700' : 'bg-indie-purple text-white hover:bg-purple-600'} transition-colors`}>
                  Details
                </button>
              </div>
            </div>
          </div>
          
          {/* Spotify logo in the bottom-right corner of the card */}
          <img 
            src={SpotifyLogo} 
            alt="Spotify" 
            className={`w-24 h-24 absolute bottom-40 right-4 ${isDarkMode ? 'invert opacity-50' : 'opacity-80'} pointer-events-none`} 
          />
        </div>
      )}
      
      {/* Secondary results grid */}
      <div className="px-6 mb-8">
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          More Songs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {secondarySongs.map(song => (
            <div 
              key={song.id || `song-${song.title}-${song.artist?.name}`}
              className={`flex items-center p-3 rounded-lg relative ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors shadow-sm`}
            >
              {/* Compact song card */}
              <img 
                src={song.albumImageUrl || defaultAlbumImageUrl} 
                alt={song.album || song.title} 
                className="w-12 h-12 object-cover rounded mr-3 flex-shrink-0"
              />
              <div className="min-w-0 flex-grow">
                <Link to={`/song/${song.id}`}>
                  <h4 className={`font-medium truncate hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {song.title}
                  </h4>
                </Link>
                <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {song.artist?.name || 'Unknown Artist'}
                </p>
              </div>
              <div className={`text-xs ml-2 mt-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatDuration(song.durationMs)}
              </div>
              
              {/* Spotify logo in the bottom-right corner of the card */}
              <img 
                src={SpotifyLogo} 
                alt="Spotify" 
                className={`w-16 h-16 absolute bottom-4 right-2 ${isDarkMode ? 'invert opacity-50' : 'opacity-80'} pointer-events-none`} 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination controls */}
      <div className="flex flex-row items-center mt-6 mb-28 px-4 md:px-32">
        {/* Empty div for left side balance */}
        <div className="hidden md:block w-48"></div>
        
        {/* Pagination controls - centered */}
        <div className="flex-grow flex justify-center">
          <Pagination currentPage={state.currentPage} totalPages={state.totalPages} pageLimit={7} />
        </div>
        
        {/* Items per page selector - right aligned */}
        <div className={`${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm rounded-xl p-3 shadow-lg`}>
          <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Songs per page:
            <select value={state.itemsPerPage} onChange={(e) => performSearch(state.query, state.type, state.currentPage, parseInt(e.target.value), state.filters)} className={`ml-2 px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indie-purple`}>
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