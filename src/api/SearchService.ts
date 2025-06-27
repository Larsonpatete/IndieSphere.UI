import { ApiClient } from './ApiClient';
import {Song} from '../domain/Song';

export class SearchService extends ApiClient {
  async search(query: string, limit = 25, offset = 0) {
    return await this.get<any>(`/search/songs?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
  }

  async getSongDetails(id: string): Promise<any> {
    return await this.get<any>(`/search/${id}`);
  }

    async searchArtists(query: string, limit: number = 20, offset: number = 0): Promise<any> {
    const response = await fetch(`${this.baseUrl}/search/artists?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Artist search failed');
    }
    return response.json();
  }

  async searchGenre(query: string, limit: number = 20, offset: number = 0): Promise<any> {
    const response = await fetch(`${this.baseUrl}/search/genres?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Genre search failed');
    }
    return response.json();
  }

  async searchSimilarSongs(query: string, limit: number = 20, offset: number = 0): Promise<any> {
    const response = await fetch(`${this.baseUrl}/search/similar-songs?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Similar songs search failed');
    }
    return response.json();
  }

  async searchSimilarArtists(query: string, limit: number = 20, offset: number = 0): Promise<any> {
    const response = await fetch(`${this.baseUrl}/search/similar-artists?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Similar artists search failed');
    }
    return response.json();
  }
}