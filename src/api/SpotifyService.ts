import { ApiClient } from './ApiClient';
import { Song } from '../domain/Song';
import { Artist } from '../domain/Artist';
import { mapFromSpotifySong } from '../mappers/spotifyMappers';

export interface SpotifyUser {
  id: string;
  name: string; // maps to displayName
  email: string;
  profileUrl: string; // maps to externalUrls.spotify
  country?: string;
  images?: {height: number, width: number, url: string}[];
  product?: string; // "premium" or "free"
}

export interface TopStatsResponse {
  topTracks: Song[];
  topArtists: Artist[];
}

export class SpotifyService extends ApiClient {
  private readonly storageKey = 'spotify_auth_state';
  private readonly tokenKey = 'auth_token';
  
  constructor() {
    const apiUrl = process.env.REACT_APP_API_URL || 'https://ea91d212a707.ngrok-free.app/api';
    super(apiUrl);
  }
  
  async search(query: string) {
    return await this.get<any[]>(`/spotify/search?query=${encodeURIComponent(query)}`);
  }

  /*
   * Initiates the Spotify OAuth login flow
   * @param returnUrl Optional URL to return to after successful login
   */
  login(returnUrl: string = window.location.href) {
    // Store the current URL for post-login redirect
    localStorage.setItem(this.storageKey, JSON.stringify({ returnUrl }));
    console.log(`Redirecting to Spotify login: ${this.baseUrl}/spotify/login?returnUrl=${encodeURIComponent(returnUrl)}`);

    // Redirect to the backend login endpoint
    window.location.href = `${this.baseUrl}/spotify/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  }

  /**
   * Logs the user out of Spotify
   */
  logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey); // Remove the token on logout
    window.location.href = `${this.baseUrl}/spotify/logout`;
  }

  /**
   * Checks if the user is logged in by attempting to fetch their profile
   * @returns The user object if authenticated, null otherwise
   */
async getCurrentUser(): Promise<SpotifyUser | null> {
  try {
    // The API client already parses JSON
    return await this.get<SpotifyUser>('/spotify/me');
  } catch (error) {
    console.error('Auth request failed:', error);
    return null;
  }
}

  async getTopStats(): Promise<TopStatsResponse> {
    const response = await this.get<any>('/spotify/top-stats');
    return {
        topTracks: response.topTracks.map(mapFromSpotifySong),
        topArtists: response.topArtists
    };
  }

  /**
   * Handles storing the token and determining the redirect URL.
   * It NO LONGER performs the redirect itself.
   */
  handleLoginSuccess(token?: string): string {
    // Store the token if provided
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
    
    const storedState = localStorage.getItem(this.storageKey);
    if (storedState) {
      try {
        const { returnUrl } = JSON.parse(storedState);
        localStorage.removeItem(this.storageKey);
        // Return the URL for the component to handle navigation
        return returnUrl;
      } catch (e) {
        console.error('Error parsing stored auth state', e);
      }
    }
    // Return a default fallback URL
    return '/';
  }
}