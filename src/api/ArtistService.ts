import { ApiClient } from './ApiClient';

export class ArtistService extends ApiClient {
  async search(query: string, limit: number = 20, offset: number = 0, filters?: any): Promise<any> {
    const params = new URLSearchParams({
      query: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    return await this.get<any>(`/artists/search?${params.toString()}`);
  }
  
  async getDetails(id: string): Promise<any> {
    return await this.get<any>(`/artists/${id}`);
  }
  
  async getSimilar(query: string, limit: number = 20, filters?: any): Promise<any> {
    const params = new URLSearchParams({
      query: query,
      limit: limit.toString()
    });
    
    if (filters?.minPopularity) {
      params.append('min_popularity', filters.minPopularity.toString());
    }
    if (filters?.maxPopularity) {
      params.append('max_popularity', filters.maxPopularity.toString());
    }
    
    return await this.get<any>(`/artists/similar?${params.toString()}`);
  }
}