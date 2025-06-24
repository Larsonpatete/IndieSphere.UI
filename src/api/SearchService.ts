import { ApiClient } from './ApiClient';

export class SearchService extends ApiClient {
  async search(query: string, limit = 25, offset = 0) {
    return await this.get<any>(`/song/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
  }
}