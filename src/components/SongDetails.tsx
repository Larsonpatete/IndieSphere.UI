import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Song } from '../domain/Song';
import { SearchService } from '../api/SearchService';
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import defaultAlbumImageUrl from '../Assets/defaultAlbum.svg';
import { useSongMapper } from '../hooks/useSongMapper';
import { useTheme } from '../context/ThemeContext';

const searchService = new SearchService();

export const SongDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { mapSong } = useSongMapper();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchSongDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await searchService.getSongDetails(id);
        console.log('Song details response:', response.song);
        
        // Use the mapper to convert API response to a properly typed Song object
        const mappedSong = mapSong(response.song);
        console.log('Mapped song:', mappedSong);
        
        setSong(mappedSong);
      } catch (err) {
        console.error('Error fetching song details:', err);
        setError('Failed to load song details');
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [id]);

  // Format duration from milliseconds
  const formatDuration = (ms: number): string => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Loading, error, and not found states with theme support
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`text-center p-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 text-red-400">{error}</div>
    </div>
  );
  
  if (!song) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`text-center p-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>Song not found</div>
    </div>
  );

  // Color variables for theme support
  const cardBgColor = isDark ? 'bg-gray-900 bg-opacity-50' : 'bg-white bg-opacity-90';
  const headingColor = isDark ? 'text-blue-400' : 'text-blue-600';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const subheadingColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const featureBgColor = isDark ? 'bg-gray-700 bg-opacity-60' : 'bg-gray-100';
  const featureTextColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const progressBgColor = isDark ? 'bg-gray-600' : 'bg-gray-300';
  const spotifyLogoClass = isDark ? '' : 'invert';

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Semi-transparent card that lets the background show through */}
      <div className={`max-w-5xl mx-auto ${cardBgColor} backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden p-6`}>
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          ← Back
        </button>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Album Art */}
          <div className="md:w-1/3">
            <img 
              src={song.albumImageUrl || defaultAlbumImageUrl} 
              alt={song.album} 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          
          {/* Basic Info */}
          <div className="md:w-2/3">
            <h1 className={`text-3xl font-bold mb-2 flex items-center ${headingColor}`}>
              {song.title}
              {song.isExplicit && (
                <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded">
                  EXPLICIT
                </span>
              )}
            </h1>
            
            <h2 className={`text-xl ${subheadingColor} mb-4`}>
              By {(song.artist.name || 'Unknown Artist')}
            </h2>
            
            <p className={`mb-2 ${textColor}`}>
              <span className="font-semibold">Album:</span> {song.album}
            </p>
            
            {song.releaseDate && (
              <p className={`mb-2 ${textColor}`}>
                <span className="font-semibold">Released:</span>{' '}
                {new Date(song.releaseDate)?.toLocaleDateString() || "Unknown"}
              </p>
            )}
            
            <p className={`mb-2 ${textColor}`}>
              <span className="font-semibold">Duration:</span>{' '}
              {formatDuration(song.durationMs)}
            </p>
            
            {/* Spotify Listen Button */}
            {song.trackUrl && (
              <a
                href={song.trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Listen on Spotify
                <img src={SpotifyLogo} alt="Spotify" className={`ml-2 h-5 ${spotifyLogoClass}`} />
              </a>
            )}
            
            {/* Preview Player */}
            {song.previewUrl && (
              <div className="mt-4">
                <p className={`font-semibold mb-1 ${textColor}`}>Preview:</p>
                <audio controls src={song.previewUrl} className="w-full" />
              </div>
            )}
          </div>
        </div>
        
        {/* Genres/Tags Section */}
        {song.genres && song.genres.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>Genres & Tags</h3>
            <div className="flex flex-wrap gap-2">
              {song.genres.map((genre, index) => (
                <span 
                  key={genre.id || index} 
                  className={`${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} px-3 py-1 rounded-full text-sm`}
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Audio Features Section - only show if we have at least one feature */}
        {(song.energy !== undefined || song.danceability !== undefined || 
          song.acousticness !== undefined || song.tempo !== undefined) && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>Audio Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {song.energy !== undefined && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Energy</h4>
                  <div className={`w-full ${progressBgColor} rounded-full h-2.5`}>
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${song.energy * 100}%` }}
                    ></div>
                  </div>
                  <p className={`text-right text-xs mt-1 ${textColor}`}>{Math.round(song.energy * 100)}%</p>
                </div>
              )}
              
              {song.danceability !== undefined && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Danceability</h4>
                  <div className={`w-full ${progressBgColor} rounded-full h-2.5`}>
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${song.danceability * 100}%` }}
                    ></div>
                  </div>
                  <p className={`text-right text-xs mt-1 ${textColor}`}>{Math.round(song.danceability * 100)}%</p>
                </div>
              )}
              
              {song.acousticness !== undefined && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Acousticness</h4>
                  <div className={`w-full ${progressBgColor} rounded-full h-2.5`}>
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${song.acousticness * 100}%` }}
                    ></div>
                  </div>
                  <p className={`text-right text-xs mt-1 ${textColor}`}>{Math.round(song.acousticness * 100)}%</p>
                </div>
              )}
              
              {song.tempo !== undefined && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Tempo</h4>
                  <p className={`text-lg font-bold ${featureTextColor}`}>{Math.round(song.tempo)} BPM</p>
                </div>
              )}
              
              {song.moodCategory && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Mood</h4>
                  <p className={`text-lg font-bold ${featureTextColor}`}>{song.moodCategory}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Community Stats Section - only show if we have at least one stat */}
        {(song.popularity !== undefined || song.playCount !== undefined || 
          song.listenerCount !== undefined || song.obscurityRating !== undefined) && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>Community Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {song.popularity !== undefined && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Popularity</h4>
                  <p className={`text-2xl font-bold ${featureTextColor}`}>{song.popularity}<span className="text-sm font-normal">/100</span></p>
                </div>
              )}
              
              {song.obscurityRating !== undefined && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Obscurity</h4>
                  <p className={`text-2xl font-bold ${featureTextColor}`}>{Math.round(song.obscurityRating)}<span className="text-sm font-normal">/100</span></p>
                </div>
              )}
              
              {song.playCount !== undefined && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Play Count</h4>
                  <p className={`text-2xl font-bold ${featureTextColor}`}>{song.playCount.toLocaleString()}</p>
                   <span className="block text-xs font-normal text-gray-400 mt-1">from Last.fm</span>
                </div>
              )}
              
              {song.listenerCount !== undefined && (
                <div className={`${featureBgColor} p-4 rounded-lg`}>
                  <h4 className={`font-medium text-sm ${textColor} mb-1`}>Listeners</h4>
                  <p className={`text-2xl font-bold ${featureTextColor}`}>{song.listenerCount.toLocaleString()}</p>
                   <span className="block text-xs font-normal text-gray-400 mt-1">from Last.fm</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Description Section */}
        {song.description && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>About This Track</h3>
            <div 
              className={`prose max-w-none ${featureBgColor} p-6 rounded-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`} 
              dangerouslySetInnerHTML={{ __html: song.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
};