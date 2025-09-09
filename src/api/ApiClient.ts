const getBaseUrl = () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isProd = window.location.hostname === 'indiesphere.tech'; 

  if (isProd) {
    return 'https://indiesphere-api-bse9b6bff9c4fugw.eastus-01.azurewebsites.net/api';
  }

  return 'https://localhost:7598/api';
};

export class ApiClient {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
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