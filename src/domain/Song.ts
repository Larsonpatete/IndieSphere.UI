import { Artist } from "./Artist";
import { Genre } from "./Genre";

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album?: string;          // Optional - might not always be available
  albumImageUrl?: string;  // Optional
  trackUrl?: string;       // Optional
  genres: Genre[];
  isExplicit: boolean;
  durationMs?: number;     // Optional - useful for player UI
  releaseDate?: string;    // Optional
}