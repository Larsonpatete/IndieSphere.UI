import React, { useState } from 'react';
import { SpotifyService } from '../api/SpotifyService';
import { SearchBar } from './SearchBar';
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import Globe from '../Assets/globe.svg'
import '../styles/SearchPage.css';
// import bg from '../Assets/starry-sky.jpg'

const spotifyService = new SpotifyService();


interface Song {
  title: string;
  artist: string;
  artistUrl?: string;
  trackUrl?: string;  
  albumImageUrl?: string;
}

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex flex-col items-center mt-32 mb-16">
        <div className="relative flex justify-center items-center mb-16" style={{ height: '120px' }}>
          <img
            src={Globe}
            alt="Globe"
            className="absolute inset-0 w-40 h-40 mx-auto pointer-events-none"
            style={{ zIndex: 0 }}
          />
          <h1 className="text-7xl font-extrabold text-[rgb(211,0,247)] tracking-tight drop-shadow-lg">
            Indie Sphere
          </h1>
        </div>
        <div className="flex justify-center w-full mb-4">
          <div className="w-full md:w-1/2">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        {loading && <p className="text-blue-500 mt-4">Loading...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-2 px-6">
        {results.map((song, idx) => (
          <div
            key={idx}
            className="relative p-4 bg-gray-300 hover:bg-gray-400 rounded shadow hover:shadow-lg transition flex flex-col items-center max-h-lg max-w-xs"
            style={{ minHeight: '200px' }}
          >
            {song.albumImageUrl && (
              <img
                src={song.albumImageUrl}
                alt={song.title}
                className="h-70 object-cover rounded mb-2" 
              />
            )}
            <h3 className="text-lg font-semibold">{song.title}</h3>
            <p className="text-sm text-gray-700">
              <a
                href={song.artistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {song.artist}
              </a>
            </p>
            {song.trackUrl && (
              <a
                href={song.trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-sm text-green-600 hover:underline"
              >
                Listen on Spotify
              </a>
            )}
            <img
              src={SpotifyLogo}
              alt="Logo"
              className="w-12 h-12 absolute bottom-2 right-2 opacity-80 pointer-events-none"
              style={{ zIndex: 1 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}