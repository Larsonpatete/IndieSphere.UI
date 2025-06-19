import React from "react";
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';

export interface Song {
  title: string;
  artist: string;
  artistUrl?: string;
  trackUrl?: string;
  albumImageUrl?: string;
  albumName?: string;
}

interface SongItemProps {
  songs: Song[];
}

export const SongItem: React.FC<SongItemProps> = ({ songs }) => (
  <>
    {songs.map((song, idx) => {
      console.log('Rendering song:', song);
      return (
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
        <h4 className="text-md text-gray-600">{song.albumName}</h4>
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
    )})}
  </>
);