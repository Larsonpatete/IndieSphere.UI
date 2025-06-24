import React, { useState, useEffect } from 'react';
import { SpotifyService } from '../api/SpotifyService';
import { SearchBar } from './SearchBar';
import Globe from '../Assets/globe.svg'
import '../styles/SearchPage.css';
import { useParams } from "react-router-dom";
import { SongItem } from './SongItem';
import { Song } from '../domain/Song';
import { SearchService } from '../api/SearchService';
import defaultAlbumImageUrl from '../Assets/defaultAlbum.svg';

const searchService = new SearchService();


export function SearchPage() {
  const { query } = useParams<{ query?: string }>();
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiData = await searchService.search(searchQuery);
      //const apiData = await response.json();
      console.log('API response:', apiData);

      const songsData = apiData.results; // Access the "result" property

      if (!Array.isArray(songsData)) {
        throw new Error("Invalid songs data format");
      }

      // Map API response to Song domain model
      const songs: Song[] = songsData.map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        artist: {
          id: item.artist.id,
          name: item.artist.name,
          url: item.artist.url,
          genres: item.artist.genres || []  // Use artist's genres if available
        },
        album: item.album,
        albumImageUrl: item.albumImageUrl || defaultAlbumImageUrl,
        trackUrl: item.trackUrl,
        genres: item.genres || [],  // Use song-level genres
        isExplicit: item.isExplicit,
        // Add durationMs if available in your actual response
        durationMs: item.durationMs || 0  // Default to 0 if missing
      }));

      setResults(songs);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen background">
      <div className={`flex flex-col items-center mb-16 transition-all duration-500${results.length > 0 ? "" : " mt-32"}`}>
        <div className="relative flex justify-center items-center mb-16" style={{ height: '120px' }}>
          <img
            src={Globe}
            alt="Globe"
            className="absolute inset-0 w-40 h-40 mx-auto pointer-events-none"
            style={{ zIndex: 0 }}
          />
          <h1 className="text-7xl font-extrabold tracking-tight drop-shadow-lg"> {/* text-[rgb(211,0,247)] */}
            Indie Sphere
          </h1>
        </div>
        <div className="flex justify-center w-full mb-4">
          <div className="w-full md:w-1/2">
            <SearchBar />
          </div>
        </div>
        {loading && <p className="text-blue-500 mt-4">Loading...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-2 px-6">
          {results.map(song => (
            <SongItem key={song.id} song={song} />
          ))}
      </div>
    </div>
);
}