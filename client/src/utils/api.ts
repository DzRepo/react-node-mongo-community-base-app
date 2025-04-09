import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { UserProfile, AuthResponse } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.url?.includes('/auth/')) {
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, password }),
  register: (email: string, password: string, firstName: string, lastName: string) =>
    api.post<AuthResponse>('/api/auth/register', { email, password, firstName, lastName }),
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/api/auth/reset-password', { token, password }),
  verifyEmail: (token: string) =>
    api.post('/api/auth/verify-email', { token }),
  refreshToken: () =>
    api.post<{ token: string }>('/api/auth/refresh-token'),
  logout: () =>
    api.post('/api/auth/logout'),
};

export const userAPI = {
  getProfile: () =>
    api.get<UserProfile>('/users/profile'),
  updateProfile: (data: Partial<UserProfile>) =>
    api.put<UserProfile>('/users/profile', data),
  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put('/users/password', { currentPassword, newPassword }),
};

// New function to directly get all flat comments for a discussion ID
export const getAllFlatCommentsForDiscussion = async (discussionId: string) => {
  try {
    const response = await api.get(`/api/discussions/${discussionId}/comments/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flat comments:', error);
    throw error;
  }
};

// Create a type for our extended API
interface ExtendedAPI {
  getDiscussion: (id: string) => Promise<any>;
}

// Create the extended API object
const extendedApi: typeof api & ExtendedAPI = Object.assign(api, {
  getDiscussion: (id: string) => api.get(`/api/discussions/${id}`).then(res => res.data)
});

// Export the extended api instance
export default extendedApi; 