import { Song } from "../domain/Song";

export const mapFromSpotifySong = (spotifyTrack: any): Song => {
    return {
        id: spotifyTrack.id,
        title: spotifyTrack.title,
        artist: spotifyTrack.artist ? {
            id: spotifyTrack.artist.id,
            name: spotifyTrack.artist.name,
        } : { id: '', name: 'Unknown Artist' },
        album: {
            id: spotifyTrack.album.id,
            title: spotifyTrack.album.title,
            coverImageUrl: spotifyTrack.album.images?.[0]?.url,
        },
        albumImageUrl: spotifyTrack.albumImageUrl,
        trackUrl: spotifyTrack.external_urls?.spotify,
        genres: [], // Spotify API for tracks doesn't directly provide genres
        isExplicit: spotifyTrack.explicit,
        durationMs: spotifyTrack.duration_ms,
        releaseDate: spotifyTrack.album.release_date,
        releaseDatePrecision: spotifyTrack.album.release_date_precision,
        popularity: spotifyTrack.popularity,
        previewUrl: spotifyTrack.preview_url,
    };
};
