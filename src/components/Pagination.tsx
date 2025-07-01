import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageLimit?: number; // Optional parameter to control number of page buttons shown
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  pageLimit = 5 // Default to 5 pages shown
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center">
      {/* Theme-based styling for the pagination card */}
      <div className={`${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm rounded-xl p-4 shadow-lg`}>
        <div className="flex items-center space-x-3">
          {/* Previous page button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-2xl font-medium transition-colors ${
              currentPage === 1
                ? `text-gray-400 ${isDarkMode ? 'text-gray-500' : ''} cursor-not-allowed`
                : `text-indie-purple hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-opacity-70 hover:shadow-md`
            }`}
          >
            ←
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(pageLimit, totalPages) }, (_, i) => {
            let pageNumber: number;
            
            if (totalPages <= pageLimit) {
              pageNumber = i + 1;
            } else if (currentPage <= Math.ceil(pageLimit / 2)) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - Math.floor(pageLimit / 2)) {
              pageNumber = totalPages - pageLimit + i + 1;
            } else {
              pageNumber = currentPage - Math.floor(pageLimit / 2) + i;
            }
            
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNumber
                    ? 'bg-indie-purple text-white'
                    : `text-indie-purple hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-opacity-70`
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next page button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-2xl font-medium transition-colors ${
              currentPage === totalPages
                ? `text-gray-400 ${isDarkMode ? 'text-gray-500' : ''} cursor-not-allowed`
                : `text-indie-purple hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-opacity-70 hover:shadow-md`
            }`}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};