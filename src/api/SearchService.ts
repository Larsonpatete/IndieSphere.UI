import { ApiClient } from './ApiClient';

export class SearchService extends ApiClient {
  async search(query: string, limit: number = 20, offset: number = 0, filters?: any): Promise<any> {
    // Build query parameters
    const params = new URLSearchParams({
      query: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    console.log(`Sending request to: ${this.baseUrl}/songs/search?${params.toString()}`); 

    // Call your backend API with these parameters
    return await this.get<any>(`/songs/search?${params.toString()}`);
  }

  async getSongDetails(id: string): Promise<any> {
    return await this.get<any>(`/songs/${id}`);
  }

  // Genre search doesn't need filters as requested
  async searchGenre(query: string, limit: number = 20, offset: number = 0): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    return await this.get<any>(`/search/genres?${params.toString()}`);
  }

  async searchSimilarSongs(query: string, limit: number = 20, filters?: any): Promise<any> {
    // Build query parameters
    const params = new URLSearchParams({
      query: query,
      limit: limit.toString()
    });
    
    // Add filter parameters if they exist
    if (filters?.minPopularity) {
      params.append('minpopularity', filters.minPopularity.toString());
    }
    if (filters?.maxPopularity) {
      params.append('maxpopularity', filters.maxPopularity.toString());
    }

    return await this.get<any>(`/songs/similar-songs?${params.toString()}`);
  }

  async getTopSongsByCountry(countryCode: string, limit: number = 10): Promise<any> {
    const params = new URLSearchParams({
      country: countryCode,
      limit: limit.toString(),
    });
    return await this.get<any>(`/songs/top-songs-by-country?${params.toString()}`);
  }
}