import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import FullLogo from '../Assets/Full_Logo_Black_CMYK.svg'; // Adjust path as needed

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
      const response = await fetch(`https://localhost:7598/api/spotify/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results.');
      }
      const apiData = await response.json();
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight drop-shadow-lg">
          Indie Sphere
        </h1>
        {/* Center the search bar horizontally */}
        <div className="flex justify-center w-full mb-4">
          <div className="w-full md:w-1/2">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        {loading && <p className="text-blue-500 mt-4">Loading...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 px-6">
        {results.map((song, idx) => (
          <div
            key={idx}
            className="relative p-4 bg-white rounded shadow hover:shadow-lg transition flex flex-col items-center"
            style={{ minHeight: '200px' }} // Increase card height as needed
          >
            {song.albumImageUrl && (
              <img
                src={song.albumImageUrl}
                alt={song.title}
                className="w-full h-70 object-cover rounded mb-2" // Increased height
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
              src={FullLogo}
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