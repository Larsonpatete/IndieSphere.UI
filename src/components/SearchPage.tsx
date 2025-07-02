import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './SearchBar';
import Globe from '../Assets/globe.svg'
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';
import { SearchResults } from './search/SearchResults';

export function SearchPage() {
  const { state } = useSearch();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Theme-specific text colors
  const loadingColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const errorColor = 'text-red-500';

  return (
    <div className="min-h-screen mb-16">
      <div className={`flex flex-col items-center mb-16 transition-all duration-500${state.results.length > 0 ? "" : " mt-32"}`}>
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
        {state.loading && <p className={`${loadingColor} mt-4`}>Loading...</p>}
        {state.error && <p className={`${errorColor} mt-4`}>{state.error}</p>}
      </div>
      
      {/* Show results only when we have them */}
      {state.results.length > 0 && <SearchResults />}
    </div>
  );
}