import { ApiClient } from './ApiClient';

export class SpotifyService extends ApiClient {
  async search(query: string) {
    return await this.get<any[]>(`/spotify/search?query=${encodeURIComponent(query)}`);
  }
}