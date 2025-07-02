import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';

type SearchType = 'song' | 'artist' | 'genre' | 'similar-song' | 'similar-artist';

interface SearchBarProps {
  height?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ height = 'h-14' }) => {
  const { state, performSearch } = useSearch();
  const { type, query } = useParams<{ type?: string; query?: string }>();
  const [searchQuery, setSearchQueryState] = useState(query ? decodeURIComponent(query) : '');
  const [searchType, setSearchTypeState] = useState<SearchType>(type as SearchType || 'song');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get current theme
  const isDark = theme === 'dark';

  // Update local state when context state changes
  useEffect(() => {
    setSearchQueryState(state.query);
    setSearchTypeState(state.type as SearchType);
  }, [state.query, state.type]);

  // Update the handleSubmit function to not clear the search query
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Update context state
        const searchUrl = `/search/${searchType}/${encodeURIComponent(searchQuery)}`;
        navigate(searchUrl);

        // Perform search with page 1
        performSearch(searchQuery, searchType, 1);
      }
    },
    [searchQuery, searchType, performSearch]
  );

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchTypeState(type);
    setIsDropdownOpen(false);
  };

  // Get search button color based on search type
  const getSearchButtonColor = () => {
    switch (searchType) {
      case 'song': return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'artist': return 'bg-indie-purple hover:bg-purple-700 focus:ring-purple-500';
      case 'genre': return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'similar-song': return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
      case 'similar-artist': return 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500';
      default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  // Map search types to display labels and colors
  const searchTypeInfo: Record<SearchType, { label: string, textColor: string, bgColor: string }> = {
    'song': {
      label: 'Song',
      textColor: isDark ? 'text-blue-300' : 'text-blue-600',
      bgColor: isDark ? 'bg-blue-900' : 'bg-blue-100'
    },
    'artist': {
      label: 'Artist',
      textColor: 'text-indie-purple',
      bgColor: isDark ? 'bg-purple-900' : 'bg-purple-100'
    },
    'genre': {
      label: 'Genre',
      textColor: isDark ? 'text-green-300' : 'text-green-600',
      bgColor: isDark ? 'bg-green-900' : 'bg-green-100'
    },
    'similar-song': {
      label: 'Similar Song',
      textColor: isDark ? 'text-indigo-300' : 'text-indigo-600',
      bgColor: isDark ? 'bg-indigo-900' : 'bg-indigo-100'
    },
    'similar-artist': {
      label: 'Similar Artist',
      textColor: isDark ? 'text-pink-300' : 'text-pink-600',
      bgColor: isDark ? 'bg-pink-900' : 'bg-pink-100'
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        {/* Search Type Dropdown Button */}
        <div className="relative">
          <button 
            type="button" 
            className={`${height} px-4 ${isDark ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-100'} rounded-l-lg border-r focus:outline-none ${searchTypeInfo[searchType].textColor}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {searchTypeInfo[searchType].label}
            <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu - Keeping the exact same structure */}
          {isDropdownOpen && (
            <div className={`absolute z-10 mt-1 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-md shadow-lg w-48`}>
              {Object.entries(searchTypeInfo).map(([type, info]) => (
                <button
                  key={type}
                  type="button"
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    searchType === type 
                      ? `${info.bgColor} ${info.textColor}` 
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleSearchTypeChange(type as SearchType)}
                >
                  {info.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Search Input */}
        <input
          type="text"
          placeholder={`Search for a ${searchType.replace('-', ' ')}...`}
          value={searchQuery}
          onChange={(e) => setSearchQueryState(e.target.value)}
          className={`flex-grow ${height} px-4 py-2 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-${
            searchType === 'song' ? 'blue' : 
            searchType === 'artist' ? 'indie-purple' : 
            searchType === 'genre' ? 'green' : 
            searchType === 'similar-song' ? 'indigo' : 'pink'
          }-500`}
        />
        
        {/* Search Button - No changes */}
        <button
          type="submit"
          className={`${height} px-4 ${getSearchButtonColor()} text-white rounded-r-lg focus:outline-none focus:ring-2`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};
