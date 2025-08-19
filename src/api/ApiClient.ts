export class ApiClient {
  protected baseUrl: string;

  constructor(baseUrl?: string) {
    // Use environment variables for production
    this.baseUrl = baseUrl || process.env.REACT_APP_API_BASE_URL || "https://localhost:7598/api";
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true', // Add this header
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  protected async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (response.status === 401) {
      throw new Error('Unauthorized'); 
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }

  // TODO: Implement other HTTP methods (POST, PUT, DELETE) as needed
  protected async post<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  }
}