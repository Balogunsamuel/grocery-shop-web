const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.success && data.data.access_token) {
      this.setToken(data.data.access_token);
    }
    
    return data;
  }

  async getProfile() {
    return this.request('/api/auth/me');
  }

  // Dashboard methods
  async getDashboard() {
    return this.request('/api/admin/dashboard');
  }

  // Product methods
  async getProducts(page: number = 1, size: number = 10, includeInactive: boolean = false) {
    return this.request(`/api/admin/products?page=${page}&size=${size}&include_inactive=${includeInactive}`);
  }

  async getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request('/api/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async getCategories() {
    return this.request('/api/categories/');
  }

  async createCategory(categoryData: any) {
    return this.request('/api/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Order methods
  async getOrders(page: number = 1, size: number = 10, status?: string) {
    const statusParam = status ? `&status=${status}` : '';
    return this.request(`/api/admin/orders?page=${page}&size=${size}${statusParam}`);
  }

  async updateOrderStatus(id: string, status: string, notes?: string) {
    return this.request(`/api/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // User methods
  async getUsers(page: number = 1, size: number = 10, role?: string) {
    const roleParam = role ? `&role=${role}` : '';
    return this.request(`/api/admin/users?page=${page}&size=${size}${roleParam}`);
  }

  // Payment methods
  async getPayments(page: number = 1, size: number = 10) {
    return this.request(`/api/admin/payments?page=${page}&size=${size}`);
  }

  // Admin registration
  async registerAdmin(adminData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) {
    return this.request('/api/admin/register', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }
}

export const apiClient = new ApiClient(API_URL);