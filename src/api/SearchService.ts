import { ApiClient } from './ApiClient';
import { Song } from '../domain/Song';

export class SearchService extends ApiClient {
  async search(query: string, limit: number = 20, offset: number = 0, filters?: any): Promise<any> {
    // Build query parameters
    const params = new URLSearchParams({
      query: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    console.log(`Sending request to: ${this.baseUrl}/search?${params.toString()}`); 

    // Call your backend API with these parameters
    const response = await fetch(`${this.baseUrl}/search/songs?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    return response.json();
  }

  async getSongDetails(id: string): Promise<any> {
    return await this.get<any>(`/search/${id}`);
  }

  async searchArtists(query: string, limit: number = 20, offset: number = 0, filters?: any): Promise<any> {
    // Build query parameters
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    // Add filter parameters if they exist
    if (filters?.minPopularity) {
      params.append('min_popularity', filters.minPopularity.toString());
    }
    if (filters?.maxPopularity) {
      params.append('max_popularity', filters.maxPopularity.toString());
    }
    
    const response = await fetch(`${this.baseUrl}/search/artists?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Artist search failed');
    }
    return response.json();
  }

  // Genre search doesn't need filters as requested
  async searchGenre(query: string, limit: number = 20, offset: number = 0): Promise<any> {
    const response = await fetch(`${this.baseUrl}/search/genres?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Genre search failed');
    }
    return response.json();
  }

  async searchSimilarSongs(query: string, limit: number = 20, filters?: any): Promise<any> {
    // Build query parameters
    const params = new URLSearchParams({
      query: query,
      limit: limit.toString()
    });
    
    // Add filter parameters if they exist
    if (filters?.minPopularity) {
      params.append('min_popularity', filters.minPopularity.toString());
    }
    if (filters?.maxPopularity) {
      params.append('max_popularity', filters.maxPopularity.toString());
    }
    
    const response = await fetch(`${this.baseUrl}/search/similar-songs?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Similar songs search failed, please follow format "song by artist"');
    }
    return response.json();
  }

  async searchSimilarArtists(query: string, limit: number = 20, filters?: any): Promise<any> {
    // Build query parameters
    const params = new URLSearchParams({
      query: query,
      limit: limit.toString()
    });
    
    // Add filter parameters if they exist
    if (filters?.minPopularity) {
      params.append('min_popularity', filters.minPopularity.toString());
    }
    if (filters?.maxPopularity) {
      params.append('max_popularity', filters.maxPopularity.toString());
    }
    
    const response = await fetch(`${this.baseUrl}/search/similar-artists?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Similar artists search failed');
    }
    return response.json();
  }
}