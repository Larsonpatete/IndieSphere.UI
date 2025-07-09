import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { useTheme } from '../context/ThemeContext';
import { SearchService } from '../api/SearchService';
import { Song } from '../domain/Song';
import { useSongMapper } from '../hooks/useSongMapper';
import { Link } from 'react-router-dom';
import SpotifyLogo from '../Assets/Full_Logo_Black_CMYK.svg';
import defaultAlbumImageUrl from '../Assets/defaultAlbum.svg';
import GlobeContainer, { GlobeContainerRef } from '../components/GlobeContainer';

// Memoize the Globe component
const MemoizedGlobe = memo(Globe);

const searchService = new SearchService();

export const DiscoverPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const globeContainerRef = useRef<GlobeContainerRef | null>(null);
  
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { mapSong } = useSongMapper();
  
  // Handle country selection
  const handleCountryClick = useCallback(async (polygon: any) => {
    const countryName = polygon.properties.NAME;
    const countryCode = polygon.properties.ISO_A2;
    
    // Highlight the country using the globe container's methods
    if (globeContainerRef.current) {
      globeContainerRef.current.highlightCountry(polygon);
    }
    
    setSelectedCountry({ name: countryName, code: countryCode });
    setIsLoading(true);
    setError(null);
    setTopSongs([]);
    
    try {
      const response = await searchService.getTopSongsByCountry(countryName);
      const mappedSongs = response.results.map(mapSong);
      setTopSongs(mappedSongs);
    } catch (err) {
      console.error(`Failed to fetch songs for ${countryName}`, err);
      setError(`Could not find top songs for ${countryName}. Please try another country.`);
    } finally {
      setIsLoading(false);
    }
  }, [mapSong]);
  
  // UI theming
  const panelBg = isDark ? 'bg-gray-900 bg-opacity-70' : 'bg-white bg-opacity-80';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const headingColor = isDark ? 'text-blue-400' : 'text-blue-600';
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* The globe is now completely isolated from state changes */}
      <div className="absolute inset-0">
        <GlobeContainer 
          ref={globeContainerRef}
          onCountryClick={handleCountryClick}
        />
      </div>
      
      {/* Your sidebar remains the same */}
      <div className={`absolute top-0 right-0 h-full w-[90%] sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 backdrop-blur-md overflow-y-auto ${panelBg}`}>
        <h1 className={`text-2xl font-bold mb-4 ${headingColor}`}>Discover Music</h1>
        
        {!selectedCountry && (
          <p className={textColor}>Click on a country on the globe to see its top songs.</p>
        )}

        {selectedCountry && (
          <div>
            <h2 className={`text-xl font-semibold mb-3 ${textColor}`}>
              Top Songs in {selectedCountry.name}
            </h2>

            {isLoading && <p className={textColor}>Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}

            {topSongs.length > 0 && (
              <ul className="space-y-2">
                {topSongs.map((song, index) => (
                  <li key={song.id}>
                    <Link to={`/song/${song.id}`} className={`flex items-center p-2 rounded-md transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <span className={`mr-3 font-bold text-lg w-6 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{index + 1}</span>
                      <img 
                        src={song.albumImageUrl || defaultAlbumImageUrl} 
                        alt={song.title}
                        className="w-12 h-12 object-cover rounded-md mr-3 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${textColor}`}>{song.title}</p>
                        <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{song.artist?.name}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 flex items-center">
           <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
            Data provided by
          </span>
          <img 
            src={SpotifyLogo} 
            alt="Spotify" 
            className={`h-6 ${isDark ? '' : 'invert'}`} 
          />
        </div>
      </div>
    </div>
  );
};