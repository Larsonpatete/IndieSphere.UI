import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import { Song } from '../domain/Song';
import { useTheme } from '../context/ThemeContext';

interface SongItemProps {
  song: Song;
}

export const SongItem: React.FC<SongItemProps> = ({ song }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
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
    navigate(`/song/${song.id}`);
  };

  // Define the card style based on theme
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
      
      {/* Similarity Match Badge - Added floating badge */}
      {song.SimilarSongMatch !== undefined && (
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          {(song.SimilarSongMatch * 100).toFixed(0)}% Match
        </div>
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
        {/* Artist link with improved click handling */}
        {song.artist?.id ? (
          <Link
            to={`/artist/${song.artist.id}`}
            className="text-blue-500 hover:underline"
            onClick={(e) => {
              e.stopPropagation();  // Stop click event from bubbling up to parent
              e.preventDefault();   // Prevent default link behavior
              navigate(`/artist/${song.artist.id}`); // Explicitly navigate to artist page
            }}
          >
            {song.artist.name || 'Unknown Artist'}
          </Link>
        ) : (
          song.artist?.name || 'Unknown Artist'
        )}
      </p>

      {/* Popularity meter - new addition */}
      {song.popularity !== undefined && (
        <div className="mt-2 w-full px-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Popularity</span>
            <span className={
              song.popularity > 70 ? 'text-green-500' : 
              song.popularity > 40 ? 'text-yellow-500' : 'text-red-500'
            }>{song.popularity}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`${
                song.popularity > 70 ? 'bg-green-500' : 
                song.popularity > 40 ? 'bg-yellow-500' : 'bg-red-500'
              } h-1.5 rounded-full`}
              style={{ width: `${song.popularity}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Add release date */}
      {song.releaseDate && (
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Released: {new Date(song.releaseDate).toLocaleDateString()}
        </p>
      )}
      
      {/* Add duration - fixed for milliseconds */}
      {/* {song.durationMs !== 0 && (
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Duration: {formatDuration(song.durationMs)}
        </p>
      )} */}
      
      {/* Add Spotify logo - use white version for dark theme */}
      <img
        src={SpotifyLogo}
        alt="Spotify"
        className={`w-12 h-12 absolute bottom-8 right-2 ${theme === 'dark' ? 'invert opacity-50' : 'opacity-80'} pointer-events-none`}
        style={{ zIndex: 1 }}
      />
    </div>
  );
};