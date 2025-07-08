import { Song } from '../domain/Song';
import { Artist } from '../domain/Artist';
import { Genre } from '../domain/Genre';
import defaultAlbumImageUrl from '../Assets/defaultAlbum.svg';

export function useSongMapper() {
  /**
   * Maps API response to a strongly typed Song object
   * with proper defaults and type safety
   */
  const mapSong = (data: any): Song => {
    if (!data) {
      return createEmptySong();
    }
    
    const song: Song = {
      id: data.id || '',
      title: data.title || '',
      artist: {
        id: data.artist?.id || '',
        name: data.artist?.name || 'Unknown Artist',
      },
      album: {
        id: data.album?.id || '',
        title: data.album?.title || 'Unknown Album',
        artist: {
          id: data.album?.artist?.id || '',
          name: data.album?.artist?.name || 'Unknown Artist',
        },
        releaseDate: data.album?.releaseDate || '',
        coverImageUrl: data.album?.coverImageUrl || defaultAlbumImageUrl,
        genre: data.album?.genre || 'Unknown Genre',
        trackCount: data.album?.trackCount || 0,
        songs: data.album?.songs || []
      },
      albumImageUrl: data.albumImageUrl || defaultAlbumImageUrl,
      trackUrl: data.trackUrl,
      genres: Array.isArray(data.genres) 
        ? data.genres.map((g: any) => ({ name: g.name }))
        : [],
      isExplicit: Boolean(data.isExplicit),
      durationMs: Number(data.durationMs) || 0,
      releaseDate: data.releaseDate,
      releaseDatePrecision: data.releaseDatePrecision,
      popularity: typeof data.popularity === 'number' ? data.popularity : 0,
      previewUrl: data.previewUrl,
      
      // Last.fm data - all optional
      playCount: typeof data.playCount === 'number' ? data.playCount : undefined,
      listenerCount: typeof data.listenerCount === 'number' ? data.listenerCount : undefined,
      description: data.description,
      SimilarSongMatch: typeof data.similarSongMatch === 'number' ? data.similarSongMatch : undefined,
      
      // Audio features - all optional
      energy: typeof data.energy === 'number' ? data.energy : undefined,
      danceability: typeof data.danceability === 'number' ? data.danceability : undefined,
      acousticness: typeof data.acousticness === 'number' ? data.acousticness : undefined,
      instrumentalness: typeof data.instrumentalness === 'number' ? data.instrumentalness : undefined,
      liveness: typeof data.liveness === 'number' ? data.liveness : undefined,
      tempo: typeof data.tempo === 'number' ? data.tempo : undefined,
      key: typeof data.key === 'number' ? data.key : undefined,
      
      // Derived data - optional
      obscurityRating: typeof data.obscurityRating === 'number' ? data.obscurityRating : undefined,
      moodCategory: data.moodCategory,
      similarSongs: Array.isArray(data.similarSongs) 
        ? data.similarSongs.map((s: any) => ({
            id: s.id || '',
            title: s.title || '',
            artist: {
              id: s.artist?.id || '',
              name: s.artist?.name || 'Unknown Artist'
            },
            album: {
              id: s.album?.id || '',
              title: s.album?.title || 'Unknown Album'
            },
            albumImageUrl: s.albumImageUrl || defaultAlbumImageUrl,
            trackUrl: s.trackUrl,
            genres: Array.isArray(s.genres) ? s.genres.map((g: any) => ({ name: g.name })) : [],
            isExplicit: Boolean(s.isExplicit),
            durationMs: Number(s.durationMs) || 0,
            popularity: typeof s.popularity === 'number' ? s.popularity : 0
          }))
        : [],
      
      // Indie-specific
      isIndieLabelRelease: Boolean(data.isIndieLabelRelease)
    };

    return song;
  };

  /**
   * Creates an empty song object
   */
  const createEmptySong = (): Song => ({
    id: '',
    title: '',
    artist: { 
      id: '', 
      name: 'Unknown Artist'
    },
    album: {
      id: '',
      title: 'Unknown Album',
    },
    albumImageUrl: defaultAlbumImageUrl,
    trackUrl: undefined,
    genres: [],
    isExplicit: false,
    durationMs: 0,
    popularity: 0
  });

  return {
    mapSong,
    createEmptySong
  };
}