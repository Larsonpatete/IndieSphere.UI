export class ApiClient {
  protected baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.REACT_APP_API_BASE_URL || "https://localhost:7598/api";
  }

  protected async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      // This is the critical part - include cookies with the request
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  }

  // TODO: Implement other HTTP methods (POST, PUT, DELETE) as needed
}