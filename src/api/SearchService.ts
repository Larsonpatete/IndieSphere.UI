import { ApiClient } from './ApiClient';
import {Song} from '../domain/Song';

export class SearchService extends ApiClient {
  async search(query: string, limit = 25, offset = 0) {
    return await this.get<any>(`/song/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
  }

  async getSongDetails(id: string): Promise<any> {
    return await this.get<any>(`/song/${id}`);
  }
}