export interface Artist {
  id: string;
  name: string;
  url?: string;
  genres?: string[];
  images?: string[]; 
  followers?: number;
  popularity?: number;
  similArtistMatch?: number; // Similarity score with another artist
}