import React from 'react';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageLimit?: number;
}

export function Pagination({ pageLimit = 7 }: PaginationProps) {
  const { state, performSearch } = useSearch();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const { currentPage, totalPages } = state;
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Calculate range to show
    let startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    let endPage = startPage + pageLimit - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pageLimit + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center gap-1">
      {/* First page button */}
      <button
        onClick={() => performSearch(state.query, state.type, 1, state.itemsPerPage, state.filters)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-indie-purple hover:text-white'
        } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        &laquo;
      </button>
      
      {/* Previous page button */}
      <button
        onClick={() => performSearch(state.query, state.type, currentPage - 1, state.itemsPerPage, state.filters)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-indie-purple hover:text-white'
        } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        &lt;
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          onClick={() => performSearch(state.query, state.type, pageNum, state.itemsPerPage, state.filters)}
          className={`px-3 py-1 rounded ${
            pageNum === currentPage
              ? 'bg-indie-purple text-white'
              : `${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} hover:bg-indie-purple hover:text-white`
          }`}
        >
          {pageNum}
        </button>
      ))}
      
      {/* Next page button */}
      <button
        onClick={() => performSearch(state.query, state.type, currentPage + 1, state.itemsPerPage, state.filters)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-indie-purple hover:text-white'
        } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        &gt;
      </button>
      
      {/* Last page button */}
      <button
        onClick={() => performSearch(state.query, state.type, totalPages, state.itemsPerPage, state.filters)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-indie-purple hover:text-white'
        } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        &raquo;
      </button>
    </div>
  );
}