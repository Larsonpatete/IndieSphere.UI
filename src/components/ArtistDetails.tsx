import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import { Artist } from '../domain/Artist';
import { ArtistService } from '../api/ArtistService';
import { useArtistMapper } from '../hooks/useArtistMapper';

// Extended artist interface with Last.fm data
interface ExtendedArtist extends Artist {
  biography?: string;
  followers?: number;
  popularity?: number;
  similarArtists?: Artist[];
  topTracks?: any[];
  lastFmTags?: string[];
}

export function ArtistDetails() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { mapArtist } = useArtistMapper();
  const navigate = useNavigate();
  
  const [artist, setArtist] = useState<ExtendedArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const artistService = new ArtistService();
  
  useEffect(() => {
    async function fetchArtistDetails() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await artistService.getDetails(id ?? '');
        console.log('Raw artist details:', data);
        
        // Use the mapper to transform the API response
        const mappedArtist = mapArtist(data) as ExtendedArtist;
        console.log('Mapped artist details:', mappedArtist);
        
        setArtist(mappedArtist);
      } catch (err) {
        console.error('Error fetching artist details:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchArtistDetails();
    }
  }, [id]);
  
  // Loading, error, and not found states with theme support
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className={`animate-pulse text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Loading artist details...
        </div>
      </div>
    );
  }
  
  if (error || !artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {error || 'Artist not found'}
        </h2>
        <Link 
          to="/search/artist" 
          className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white hover:opacity-90`}
        >
          Return to Search
        </Link>
      </div>
    );
  }
  
  // Get primary artist image
  const artistImage = artist.images && artist.images.length > 0 
    ? artist.images[0] 
    : 'https://via.placeholder.com/300?text=No+Image';
  
  // Color variables for theme support - matching SongDetails
  const cardBgColor = isDarkMode ? 'bg-gray-900 bg-opacity-50' : 'bg-white bg-opacity-90';
  const headingColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const textColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const subheadingColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const featureBgColor = isDarkMode ? 'bg-gray-700 bg-opacity-60' : 'bg-gray-100';
  const featureTextColor = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const progressBgColor = isDarkMode ? 'bg-gray-600' : 'bg-gray-300';
  const spotifyLogoClass = isDarkMode ? '' : 'invert';
  
  return (
    <div className="min-h-screen py-8 px-4">
      {/* Semi-transparent card that lets the background show through */}
      <div className={`max-w-5xl mx-auto ${cardBgColor} backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden p-6`}>
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          ← Back
        </button>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Artist image */}
          <div className="md:w-1/3">
            <img 
              src={artistImage} 
              alt={artist.name} 
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
          
          {/* Basic Info */}
          <div className="md:w-2/3">
            <h1 className={`text-3xl font-bold mb-2 ${headingColor}`}>
              {artist.name}
            </h1>
            
            {/* Genres */}
            <div className="flex flex-wrap mb-4">
              {artist.genres?.map((genre, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 text-sm rounded-full mr-2 mb-2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  {genre}
                </span>
              ))}
            </div>
            
            {/* Spotify Listen Button */}
            {artist.url && (
              <a
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                View on Spotify
                <img src={SpotifyLogo} alt="Spotify" className={`ml-2 h-5 ${spotifyLogoClass}`} />
              </a>
            )}
          </div>
        </div>
        
        {/* Stats Section - Community Stats style */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>Artist Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {artist.followers !== undefined && (
              <div className={`${featureBgColor} p-4 rounded-lg`}>
                <h4 className={`font-medium text-sm ${textColor} mb-1`}>Followers</h4>
                <p className={`text-2xl font-bold ${featureTextColor}`}>
                  {artist.followers.toLocaleString()}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  From Spotify
                </p>
              </div>
            )}
            
            {artist.popularity !== undefined && (
              <div className={`${featureBgColor} p-4 rounded-lg`}>
                <h4 className={`font-medium text-sm ${textColor} mb-1`}>Popularity</h4>
                <div className="flex flex-col">
                  <p className={`text-2xl font-bold ${featureTextColor}`}>
                    {artist.popularity}<span className="text-sm font-normal">/100</span>
                  </p>
                  <div className={`w-full ${progressBgColor} rounded-full h-2.5 mt-2`}>
                    <div 
                      className={`${
                        artist.popularity > 70 ? 'bg-green-600' :
                        artist.popularity > 40 ? 'bg-yellow-600' : 'bg-red-600'
                      } h-2.5 rounded-full`}
                      style={{ width: `${artist.popularity}%` }}
                    ></div>
                  </div>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  From Spotify
                </p>
              </div>
            )}
            
            {/* You could add more stats here in the future */}
          </div>
        </div>
        
        {/* Last.fm tags */}
        {artist.lastFmTags && artist.lastFmTags.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>Tags</h3>
            <div className="flex flex-wrap gap-2">
              {artist.lastFmTags.map((tag, index) => (
                <span 
                  key={index} 
                  className={`${isDarkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'} px-3 py-1 rounded-full text-sm`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Biography section */}
        {artist.biography && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>Biography</h3>
            <div 
              className={`prose max-w-none ${featureBgColor} p-6 rounded-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
              dangerouslySetInnerHTML={{ __html: artist.biography }}
            />
          </div>
        )}
        
        {/* Similar artists section */}
        {artist.similarArtists && artist.similarArtists.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>Similar Artists</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {artist.similarArtists.map((similarArtist, index) => (
                <Link 
                  key={similarArtist.id || `similar-artist-${index}`} 
                  to={`/artist/${similarArtist.id}`}
                  className={`${featureBgColor} p-3 rounded-lg transition-colors hover:opacity-90`}
                >
                  <div className="flex items-center">
                    <img 
                      src={(similarArtist.images && similarArtist.images.length > 0) ? similarArtist.images[0] : 'https://via.placeholder.com/50'} 
                      alt={similarArtist.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <span className={`font-medium truncate ${featureTextColor}`}>{similarArtist.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Top tracks section */}
        {artist.topTracks && artist.topTracks.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${headingColor}`}>Top Tracks</h3>
            <div className="space-y-2">
              {artist.topTracks.map((track, index) => (
                <Link 
                  key={track.id || `track-${index}`}
                  to={`/song/${track.id}`}
                  className={`flex items-center p-3 rounded-lg transition-colors ${featureBgColor} hover:opacity-90`}
                >
                  <div className={`w-8 text-center font-medium ${textColor}`}>{index + 1}</div>
                  <div className="ml-2 flex-grow">
                    <div className={`font-medium ${featureTextColor}`}>{track.title}</div>
                    <div className={`text-sm ${subheadingColor}`}>
                      {track.album}
                    </div>
                  </div>
                  {track.popularity && (
                    <div className={`text-sm flex items-center ${textColor}`}>
                      <div className={`w-16 ${progressBgColor} rounded-full h-1.5 mr-2`}>
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${track.popularity}%` }}
                        ></div>
                      </div>
                      <span>{track.popularity}/100</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Spotify attribution at the bottom */}
        <div className="flex justify-end items-center mt-8 pt-4 border-t border-gray-700 border-opacity-30">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
            Data provided by
          </span>
          <img 
            src={SpotifyLogo} 
            alt="Spotify" 
            className={`h-6 ${spotifyLogoClass}`} 
          />
        </div>
      </div>
    </div>
  );
}