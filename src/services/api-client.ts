export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export class ApiClient {
  private static getHeaders(role = 'SUPER_ADMIN'): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-user-role': role,
      'x-user-id': 'usr-admin-1',
      'x-user-email': 'admin@makeit.com',
      'x-user-name': 'Platform Operations Admin'
    };
  }

  static async get<T>(url: string, role?: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(role),
        cache: 'no-store'
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message || 'Network request failed', code: 'NETWORK_ERROR' };
    }
  }

  static async post<T>(url: string, body: any, role?: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(role),
        body: JSON.stringify(body)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message || 'Network request failed', code: 'NETWORK_ERROR' };
    }
  }

  static async put<T>(url: string, body: any, role?: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(role),
        body: JSON.stringify(body)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message || 'Network request failed', code: 'NETWORK_ERROR' };
    }
  }
}
