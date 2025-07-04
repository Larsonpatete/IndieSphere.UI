import { Artist } from '../domain/Artist';

export function useArtistMapper() {

    const mapArtist = (data: any): Artist => {
        if (!data) return { id: '', name: '' };

        return {
            id: data.id || '',
            name: data.name || '',
            url: data.url || undefined,
            genres: data.genres?.map((genre: any) => genre.name) || [],
            images: data.images || [],
            followers: data.followers || undefined,
            popularity: data.popularity || undefined,

        };
    }

  return {
      mapArtist
  };
}
    