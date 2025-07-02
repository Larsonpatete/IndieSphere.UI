// filepath: c:\Users\Larson Patete\source\repos\TypeScriptFun\IndieSphere.UI\src\components\search\GenreResults.tsx
import React from 'react';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';
import { Pagination } from '../Pagination';

export function GenreResults() {
  const { state, performSearch } = useSearch();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const resultsTextColor = isDarkMode ? 'text-white' : 'text-gray-700';
  
  return (
    <div className="w-full">
      {/* Results count */}
      <div className="text-center mb-4">
        <p className={`${resultsTextColor} opacity-80`}>
          Found {state.totalCount} genres • Page {state.currentPage} of {state.totalPages}
        </p>
      </div>
      
      {/* Results grid - simple genre cards
      <div className="flex flex-wrap justify-center gap-4 mt-2 px-6">
        {state.results.map((genre, index) => (
          <div 
            key={genre.id || `genre-${index}`} 
            className={`w-64 p-6 rounded-xl shadow-lg text-center ${isDarkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white'}`}
          >
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {genre.name || genre.title}
            </h3>
          </div>
        ))}
      </div> */}
      
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
            Genres per page:
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