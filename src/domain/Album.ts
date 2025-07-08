import { Artist } from "./Artist";
import { Song } from "./Song";

export interface Album {
    id: string;
    title: string;
    artist?: Artist;
    releaseDate?: string;
    coverImageUrl?: string;
    genre?: string;
    trackCount?: number;
    songs?: Song[];
}