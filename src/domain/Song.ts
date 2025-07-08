import { Album } from "./Album";
import { Artist } from "./Artist";
import { Genre } from "./Genre";

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  albumImageUrl?: string;
  trackUrl?: string;
  genres: Genre[];
  isExplicit: boolean;
  durationMs: number;
  releaseDate?: string;
  releaseDatePrecision?: string;
  popularity: number;
  previewUrl?: string;
  
  // Last.fm data
  playCount?: number;
  listenerCount?: number;
  description?: string;
  userTags?: string[];
  SimilarSongMatch?: number; // Similarity score with another song
  
  // Audio features
  energy?: number;
  danceability?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  tempo?: number;
  key?: number;
  
  // Derived data
  obscurityRating?: number;
  moodCategory?: string;
  similarSongs?: Song[]; // List of similar songs based on Last.fm or other sources

  isIndieLabelRelease?: boolean; // New field for indie label release
}