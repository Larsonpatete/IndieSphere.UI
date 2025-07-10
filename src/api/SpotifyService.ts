import { ApiClient } from './ApiClient';

export interface SpotifyUser {
  id: string;
  name: string; // maps to displayName
  email: string;
  profileUrl: string; // maps to externalUrls.spotify
  accessToken: string;
  // You might want to add these:
  country?: string;
  images?: {height: number, width: number, url: string}[];
  product?: string; // "premium" or "free"
}

export class SpotifyService extends ApiClient {
  private readonly storageKey = 'spotify_auth_state';
  
  constructor() {
    super('https://5a9d20842cbb.ngrok-free.app/api');
  }
  
  async search(query: string) {
    return await this.get<any[]>(`/spotify/search?query=${encodeURIComponent(query)}`);
  }

  /**
   * Initiates the Spotify OAuth login flow
   * @param returnUrl Optional URL to return to after successful login
   */
  login(returnUrl: string = window.location.href) {
    // Store the current URL for post-login redirect
    localStorage.setItem(this.storageKey, JSON.stringify({ returnUrl }));
    
    // Redirect to the backend login endpoint
    window.location.href = `${this.baseUrl}/spotify/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  }

  /**
   * Logs the user out of Spotify
   */
  logout() {
    localStorage.removeItem(this.storageKey);
    window.location.href = `${this.baseUrl}/spotify/logout`;
  }

  /**
   * Checks if the user is logged in by attempting to fetch their profile
   * @returns The user object if authenticated, null otherwise
   */
  async getCurrentUser(): Promise<SpotifyUser | null> {
    try {
      // Use fetch directly for debugging
      const response = await fetch(`${this.baseUrl}/spotify/me`, {
        credentials: 'include'
      });
      
      console.log('Auth response status:', response.status);
      const text = await response.text();
      console.log('Auth response body:', text);
      
      // Try to parse as JSON if possible
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        return null;
      }
    } catch (error) {
      console.error('Auth request failed:', error);
      return null;
    }
  }

  /**
   * Handles the login success redirect
   * Useful to call on your login-success page
   */
  handleLoginSuccess() {
    const storedState = localStorage.getItem(this.storageKey);
    
    if (storedState) {
      try {
        const { returnUrl } = JSON.parse(storedState);
        localStorage.removeItem(this.storageKey);
        
        // Don't redirect if we're already on the return URL
        if (returnUrl && window.location.href !== returnUrl) {
          window.location.href = returnUrl;
        }
      } catch (e) {
        console.error('Error parsing stored auth state', e);
      }
    }
  }
}