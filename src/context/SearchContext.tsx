// Create a new file: src/context/SearchContext.tsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchContextType {
  query: string;
  type: string;
  setQuery: (query: string) => void;
  setType: (type: string) => void;
  performSearch: (query: string, type: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('song');
  const navigate = useNavigate();

  const performSearch = useCallback((newQuery: string, newType: string) => {
    setQuery(newQuery);
    setType(newType);
    navigate(`/search/${newType}/${encodeURIComponent(newQuery)}`);
  }, [navigate]);

  return (
    <SearchContext.Provider value={{ query, type, setQuery, setType, performSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};