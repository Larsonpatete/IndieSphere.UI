// src/components/search/SearchResults.tsx
import React from 'react';
import { useSearch } from '../../context/SearchContext';
import { SongResults } from './SongResults';
import { ArtistResults } from './ArtistResults';
import { GenreResults } from './GenreResults';
import { SimilarSongResults } from './SimilarSongResults';
import { SimilarArtistResults } from './SimilarArtistResults';

export function SearchResults() {
  const { state } = useSearch();
  
  // Return the appropriate component based on search type
  switch(state.type) {
    case 'artist':
      return <ArtistResults />;
    case 'genre':
      return <GenreResults />;
    case 'similar-song':
      return <SimilarSongResults />;
    case 'similar-artist':
      return <SimilarArtistResults />;
    case 'song':
    default:
      return <SongResults />;
  }
}