import { Artist } from "./Artist";
import { Genre } from "./Genre";

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: string;
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

  isIndieLabelRelease?: boolean; // New field for indie label release
}