import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import { Song } from '../domain/Song';
import { useTheme } from '../context/ThemeContext'; // Import after you've set up theme context

interface SongItemProps {
  song: Song;
}

export const SongItem: React.FC<SongItemProps> = ({ song }) => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Use this after you've set up theme context
  
  // Helper function to format duration from milliseconds
  const formatDuration = (milliseconds: number): string => {
    if (!milliseconds) return '';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // console.log('SongItem rendered:', song.durationMs);
  });

  // Add navigation to song details
  const handleClick = () => {
    navigate(`/song/${song.id}`);
  };

  // Define the card style based on theme (if theme context is set up)
  // If you haven't set up theme context yet, remove the conditional and just use the white style
  const cardStyle = theme === 'dark' 
    ? "bg-gray-800 hover:bg-gray-700 text-white"
    : "bg-white hover:bg-gray-100 text-gray-800";

  return (
    <div 
      className={`relative p-4 ${cardStyle} rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center max-h-lg max-w-xs cursor-pointer`}
      style={{ minHeight: '200px' }} onClick={handleClick}>
      {song.albumImageUrl && (
        <img src={song.albumImageUrl} alt={song.title} className="h-70 object-cover rounded mb-2" />
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
        <h4 className={`text-md ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} truncate w-full text-center`}>
          {song.album}
        </h4>
      )}
      
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} truncate w-full text-center`}>
        <a
          href={song.artist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {song.artist.name}
        </a>
      </p>

      {/* {song.trackUrl && (
        <a
          href={song.trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-green-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View Track in Spotify
        </a>
      )} */}
      
      {/* Add release date */}
      {song.releaseDate && (
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Released: {new Date(song.releaseDate).toLocaleDateString()}
        </p>
      )}

      {song.SimilarSongMatch !== undefined && (
        <p className={`text-s text-purple-500 mt-1`}>
          Similarity Score: {song.SimilarSongMatch.toFixed(2)}  {/* Display similarity score if available */}
        </p> 
      )} 
      
      {/* Add duration - fixed for milliseconds */}
      {song.durationMs !== 0 && (
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Duration: {formatDuration(song.durationMs)}
        </p>
      )}
      
      {/* Add Spotify logo - use white version for dark theme */}
      <img
        src={SpotifyLogo}
        alt="Spotify"
        className={`w-12 h-12 absolute bottom-2 right-2 ${theme === 'dark' ? 'invert opacity-50' : 'opacity-80'} pointer-events-none`}
        style={{ zIndex: 1 }}
      />
    </div>
  );
};