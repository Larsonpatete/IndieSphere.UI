import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';
import { SongItem } from '../SongItem';
import { Pagination } from '../Pagination';
import { PopularitySlider } from '../PopularitySlider';

export function SimilarSongResults() {
  const { state, performSearch } = useSearch();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const resultsTextColor = isDarkMode ? 'text-white' : 'text-gray-700';
  
  return (
    <div className="w-full">
      {/* Popularity filter */}
      <PopularitySlider />
      
      {/* Results count */}
      <div className="text-center mb-4">
        <p className={`${resultsTextColor} opacity-80`}>
          Found {state.totalCount} similar songs • Page {state.currentPage} of {state.totalPages}
        </p>
      </div>
      
      {/* Results grid */}
      <div className="flex flex-wrap justify-center gap-4 mt-2 px-6">
        {state.results.map(song => (
          <SongItem key={song.id || `song-${song.title}-${song.artist?.name}`} song={song} />
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
            Songs per page:
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