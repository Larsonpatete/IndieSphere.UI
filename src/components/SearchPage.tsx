import React, { useState, useEffect } from 'react';
import { SpotifyService } from '../api/SpotifyService';
import { SearchBar } from './SearchBar';
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import Globe from '../Assets/globe.svg'
import '../styles/SearchPage.css';
import { useParams } from "react-router-dom";
import { SongItem } from './SongItem';

const spotifyService = new SpotifyService();


interface Song {
  title: string;
  artist: string;
  artistUrl?: string;
  trackUrl?: string;  
  albumImageUrl?: string;
  albumName?: string;
}

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
      const apiData = await spotifyService.search(searchQuery);
      //const apiData = await response.json();
      console.log('API response:', apiData);

      // Map API fields to Song interface
      const data: Song[] = apiData.map((item: any) => ({
        title: item.name,
        artist: item.artist,
        artistUrl: item.artistLink,
        trackUrl: item.songLink,
        albumImageUrl: item.coverArtLink,
        albumName: item.album
      }));

      setResults(data);
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
        <SongItem songs={results} />
      </div>
    </div>
  );
}