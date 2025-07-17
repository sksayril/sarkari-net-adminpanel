// API Configuration
// export const API_BASE_URL = 'https://7cvccltb-3110.inc1.devtunnels.ms';
export const API_BASE_URL = 'https://api.dhanlaxmii.com';

// Types for API responses
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  userId: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  userId: string;
  password: string;
}

export interface CreateEmployeeResponse {
  message: string;
  employee: {
    id: string;
    name: string;
    email: string;
    userId: string;
  };
}

export interface GetEmployeesResponse {
  employees: Employee[];
}

// Main Category Types
export interface MainCategory {
  _id: string;
  title: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMainCategoryRequest {
  title: string;
}

export interface CreateMainCategoryResponse {
  message: string;
  category: {
    id: string;
    title: string;
  };
}

export interface GetMainCategoriesResponse {
  categories: MainCategory[];
}

// Sub Category Types
export interface SubCategory {
  _id: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  contentTitle: string;
  contentDescription: string;
  mainCategory: {
    _id: string;
    title: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubCategoryRequest {
  mainCategory: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  contentTitle: string;
  contentDescription: string;
}

export interface UpdateSubCategoryRequest {
  metaTitle?: string;
  contentTitle?: string;
  contentDescription?: string;
  keywords?: string[];
  tags?: string[];
  isActive?: boolean;
}

export interface CreateSubCategoryResponse {
  message: string;
  subCategory: {
    id: string;
    metaTitle: string;
    contentTitle: string;
  };
}

export interface GetSubCategoriesResponse {
  subCategories: SubCategory[];
}

export interface ApiError {
  message: string;
  status?: number;
}

// Top Data Types
export interface TopData {
  _id: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  contentTitle: string;
  contentDescription: string;
  colorCode: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTopDataRequest {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  contentTitle: string;
  contentDescription: string;
  colorCode: string;
}

export interface UpdateTopDataRequest {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  tags?: string[];
  contentTitle?: string;
  contentDescription?: string;
  colorCode?: string;
  isActive?: boolean;
}

export interface CreateTopDataResponse {
  message: string;
  topData: {
    id: string;
    metaTitle: string;
    contentTitle: string;
    colorCode: string;
  };
}

export interface GetTopDataListResponse {
  topDataList: TopData[];
}

export interface GetTopDataResponse {
  success: boolean;
  data: TopData;
}

export interface UpdateTopDataResponse {
  success: boolean;
  message: string;
  data: TopData;
}

export interface DeleteTopDataResponse {
  success: boolean;
  message: string;
}

// System Prompt Types
export interface SystemPrompt {
  _id: string;
  systemPrompt: string;
  description: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSystemPromptRequest {
  systemPrompt: string;
  description: string;
}

export interface UpdateSystemPromptRequest {
  systemPrompt?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateSystemPromptResponse {
  success: boolean;
  message: string;
  data: SystemPrompt;
}

export interface GetSystemPromptResponse {
  success: boolean;
  data: SystemPrompt;
}

export interface UpdateSystemPromptResponse {
  success: boolean;
  message: string;
  data: SystemPrompt;
}

export interface DeleteSystemPromptResponse {
  success: boolean;
  message: string;
}

// Home Content Types
export interface FAQ {
  question: string;
  answer: string;
}

export interface HomeContent {
  _id: string;
  title: string;
  description: string;
  telegramLink: string;
  whatsappLink: string;
  faqs: FAQ[];
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHomeContentRequest {
  title: string;
  description: string;
  telegramLink: string;
  whatsappLink: string;
  faqs: FAQ[];
}

export interface UpdateHomeContentRequest {
  title?: string;
  description?: string;
  telegramLink?: string;
  whatsappLink?: string;
  faqs?: FAQ[];
  isActive?: boolean;
}

export interface CreateHomeContentResponse {
  success: boolean;
  message: string;
  data: HomeContent;
}

export interface GetHomeContentListResponse {
  success: boolean;
  data: HomeContent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface GetHomeContentResponse {
  success: boolean;
  data: HomeContent;
}

export interface UpdateHomeContentResponse {
  success: boolean;
  message: string;
  data: HomeContent;
}

export interface DeleteHomeContentResponse {
  success: boolean;
  message: string;
}

// API Functions
export class ApiService {
  private static baseURL = API_BASE_URL;

  // Generic API request function
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('adminToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Admin Login
  static async adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    return this.request<AdminLoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Get admin profile (example of authenticated request)
  static async getAdminProfile(): Promise<AdminLoginResponse['admin']> {
    return this.request<AdminLoginResponse['admin']>('/admin/profile', {
      method: 'GET',
    });
  }

  // Employee Management
  static async createEmployee(employeeData: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    return this.request<CreateEmployeeResponse>('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  static async getEmployees(): Promise<GetEmployeesResponse> {
    return this.request<GetEmployeesResponse>('/admin/employees', {
      method: 'GET',
    });
  }

  // Main Category Management
  static async createMainCategory(categoryData: CreateMainCategoryRequest): Promise<CreateMainCategoryResponse> {
    return this.request<CreateMainCategoryResponse>('/admin/categories/main', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  static async getMainCategories(): Promise<GetMainCategoriesResponse> {
    return this.request<GetMainCategoriesResponse>('/admin/categories/main', {
      method: 'GET',
    });
  }

  // Sub Category Management
  static async createSubCategory(categoryData: CreateSubCategoryRequest): Promise<CreateSubCategoryResponse> {
    return this.request<CreateSubCategoryResponse>('/admin/categories/sub', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  static async getSubCategories(): Promise<GetSubCategoriesResponse> {
    return this.request<GetSubCategoriesResponse>('/admin/categories/sub', {
      method: 'GET',
    });
  }

  static async updateSubCategory(id: string, categoryData: UpdateSubCategoryRequest): Promise<CreateSubCategoryResponse> {
    return this.request<CreateSubCategoryResponse>(`/admin/categories/sub/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  // Top Data APIs
  static async getTopDataList(): Promise<GetTopDataListResponse> {
    return this.request<GetTopDataListResponse>('/admin/topdata', {
      method: 'GET',
    });
  }

  static async createTopData(data: CreateTopDataRequest): Promise<CreateTopDataResponse> {
    return this.request<CreateTopDataResponse>('/admin/topdata', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateTopData(id: string, data: UpdateTopDataRequest): Promise<UpdateTopDataResponse> {
    return this.request<UpdateTopDataResponse>(`/admin/topdata/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteTopData(id: string): Promise<DeleteTopDataResponse> {
    return this.request<DeleteTopDataResponse>(`/admin/topdata/${id}`, {
      method: 'DELETE',
    });
  }

  // System Prompt APIs
  static async getSystemPrompt(): Promise<GetSystemPromptResponse> {
    return this.request<GetSystemPromptResponse>('/admin/system-prompt', {
      method: 'GET',
    });
  }

  static async createSystemPrompt(data: CreateSystemPromptRequest): Promise<CreateSystemPromptResponse> {
    return this.request<CreateSystemPromptResponse>('/admin/system-prompt', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateSystemPrompt(id: string, data: UpdateSystemPromptRequest): Promise<UpdateSystemPromptResponse> {
    return this.request<UpdateSystemPromptResponse>(`/admin/system-prompt/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteSystemPrompt(id: string): Promise<DeleteSystemPromptResponse> {
    return this.request<DeleteSystemPromptResponse>(`/admin/system-prompt/${id}`, {
      method: 'DELETE',
    });
  }

  // Home Content APIs
  static async getHomeContentList(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<GetHomeContentListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = `/home-content/admin/all${queryString ? `?${queryString}` : ''}`;
    
    return this.request<GetHomeContentListResponse>(url, {
      method: 'GET',
    });
  }

  static async getHomeContent(id: string): Promise<GetHomeContentResponse> {
    return this.request<GetHomeContentResponse>(`/home-content/admin/${id}`, {
      method: 'GET',
    });
  }

  static async createHomeContent(data: CreateHomeContentRequest): Promise<CreateHomeContentResponse> {
    return this.request<CreateHomeContentResponse>('/home-content/admin/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateHomeContent(id: string, data: UpdateHomeContentRequest): Promise<UpdateHomeContentResponse> {
    return this.request<UpdateHomeContentResponse>(`/home-content/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteHomeContent(id: string): Promise<DeleteHomeContentResponse> {
    return this.request<DeleteHomeContentResponse>(`/home-content/admin/${id}`, {
      method: 'DELETE',
    });
  }

  // Logout (clear token)
  static logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  // Get stored admin data
  static getStoredAdminData(): AdminLoginResponse['admin'] | null {
    const data = localStorage.getItem('adminData');
    return data ? JSON.parse(data) : null;
  }

  // Store admin data after successful login
  static storeAdminData(token: string, adminData: AdminLoginResponse['admin']): void {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
  }
}

// Export default instance
export default ApiService; 