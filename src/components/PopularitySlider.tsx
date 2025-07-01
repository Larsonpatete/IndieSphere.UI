import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronDownIcon, ChevronUpIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// Update props interface to include min and max values
interface PopularitySliderProps {
  popularityFilter: [number, number];
  setPopularityFilter: (value: [number, number]) => void;
  onFilterChange: (minPopularity: number, maxPopularity: number) => void;
}

const PopularitySlider: React.FC<PopularitySliderProps> = ({ 
  popularityFilter, 
  setPopularityFilter, 
  onFilterChange 
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // State for collapse/expand
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Track both min and max values locally
  const [localMinValue, setLocalMinValue] = useState(popularityFilter[0]);
  const [localMaxValue, setLocalMaxValue] = useState(popularityFilter[1]);
  
  // Add debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Toggle panel expansion
  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Handle min value change
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    // Don't allow min to exceed max
    const newMin = Math.min(value, localMaxValue);
    
    // Update local state immediately for visual feedback
    setLocalMinValue(newMin);
    
    // Update the actual filter value (for visual display)
    setPopularityFilter([newMin, localMaxValue]);
    
    // Debounce the API call
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onFilterChange(newMin, localMaxValue);
    }, 500);
  };
  
  // Handle max value change
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    // Don't allow max to be less than min
    const newMax = Math.max(value, localMinValue);
    
    // Update local state immediately for visual feedback
    setLocalMaxValue(newMax);
    
    // Update the actual filter value (for visual display)
    setPopularityFilter([localMinValue, newMax]);
    
    // Debounce the API call
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onFilterChange(localMinValue, newMax);
    }, 500);
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Is the filter active (not at default values)?
  const isFilterActive = localMinValue > 0 || localMaxValue < 100;
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-blur-sm rounded-xl shadow-lg max-w-md mx-auto mb-6 transition-all duration-300`}>
      {/* Filter header - always visible */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={togglePanel}
      >
        <div className="flex items-center">
          <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-indie-purple" />
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Popularity Filter
          </h3>
          {/* Filter status indicator */}
          {isFilterActive && (
            <span className="ml-2 inline-block w-2 h-2 bg-indie-purple rounded-full"></span>
          )}
        </div>
        
        {/* Current values (only if filter is active) */}
        <div className="flex items-center">
          {isFilterActive && (
            <span className={`mr-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {localMinValue} - {localMaxValue}
            </span>
          )}
          
          {/* Toggle icon */}
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-indie-purple" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-indie-purple" />
          )}
        </div>
      </div>
      
      {/* Collapsible filter content */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-80 opacity-100 p-4 pt-0' : 'max-h-0 opacity-0 p-0'
      }`}>
        {/* Min value slider */}
        <div className="mb-4">
          <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex justify-between mb-1">
              <span>Minimum Popularity:</span>
              <span className="text-indie-purple font-semibold">{localMinValue}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={localMinValue}
              onChange={handleMinChange}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indie-purple"
            />
            <div className="flex justify-between text-xs mt-1">
              <span>Underground</span>
              <span>Popular</span>
            </div>
          </label>
        </div>
        
        {/* Max value slider */}
        <div>
          <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex justify-between mb-1">
              <span>Maximum Popularity:</span>
              <span className="text-indie-purple font-semibold">{localMaxValue}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={localMaxValue}
              onChange={handleMaxChange}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indie-purple"
            />
            <div className="flex justify-between text-xs mt-1">
              <span>Underground</span>
              <span>Popular</span>
            </div>
          </label>
        </div>
        
        {/* Reset button */}
        {isFilterActive && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent panel collapse
              setLocalMinValue(0);
              setLocalMaxValue(100);
              setPopularityFilter([0, 100]);
              onFilterChange(0, 100);
            }}
            className="mt-3 px-3 py-1 text-xs bg-indie-purple text-white rounded hover:bg-opacity-80 transition-colors"
          >
            Reset Filter
          </button>
        )}
      </div>
    </div>
  );
};

export default PopularitySlider;