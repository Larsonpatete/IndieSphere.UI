import React from "react";
import { useNavigate } from "react-router-dom";
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import { Song } from '../domain/Song';

interface SongItemProps {
  song: Song;
}

export const SongItem: React.FC<SongItemProps> = ({ song }) => {
  const navigate = useNavigate();
  
  // Helper function to format duration from milliseconds
  const formatDuration = (milliseconds: number): string => {
    if (!milliseconds) return '';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add navigation to song details
  const handleClick = () => {
    navigate(`/songdetails/${song.id}`);
  };

  return (
    <div 
      className="relative p-4 bg-gray-300 hover:bg-gray-400 rounded shadow hover:shadow-lg transition flex flex-col items-center max-h-lg max-w-xs cursor-pointer"
      style={{ minHeight: '200px' }}
      onClick={handleClick}
    >
      {song.albumImageUrl && (
        <img
          src={song.albumImageUrl}
          alt={song.title}
          className="h-70 object-cover rounded mb-2"
        />
      )}
      
      <h3 className="text-lg font-semibold truncate w-full text-center">
        {song.title}
        {song.isExplicit && (
          <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
            E
          </span>
        )}
      </h3>
      
      {song.album && (
        <h4 className="text-md text-gray-600 truncate w-full text-center">
          {song.album}
        </h4>
      )}
      
      <p className="text-sm text-gray-700 truncate w-full text-center">
        <a
          href={song.artist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {song.artist.name}
        </a>
      </p>

        {song.trackUrl && (
        <a
          href={song.trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-green-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View Track in Spotify
        </a>
      )}
      
      {/* Add release date */}
      {song.releaseDate && (
        <p className="text-xs text-gray-600 mt-1">
          Released: {new Date(song.releaseDate).toLocaleDateString()}
        </p>
      )}
      
      {/* Add duration - fixed for milliseconds */}
      {song.durationMs && (
        <p className="text-xs text-gray-600">
          Duration: {formatDuration(song.durationMs)}
        </p>
      )}
      
      {/* {song.genres.length > 0 && ( // dont really need this
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {song.genres.map(genre => (
            <span 
              key={genre.id} 
              className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )} */}
    
      
      {/* Add Spotify logo */}
      <img
        src={SpotifyLogo}
        alt="Spotify"
        className="w-12 h-12 absolute bottom-2 right-2 opacity-80 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};