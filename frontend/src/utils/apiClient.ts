import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { authStorage } from './auth';
import { AuthResponse, RefreshTokenResponse } from '../types/auth';

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证 token
apiClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理认证错误和自动刷新 token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 处理 401 错误 - 未授权
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 尝试刷新 token
        const refreshResponse = await refreshToken();
        
        if (refreshResponse.success && refreshResponse.data?.token) {
          const newToken = refreshResponse.data.token;
          authStorage.setToken(newToken);
          
          // 重新发送原始请求
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 刷新失败，清除存储并跳转到登录页
        authStorage.clearAll();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // 处理其他错误
    const errorMessage = getErrorMessage(error);
    return Promise.reject(new Error(errorMessage));
  }
);

// 错误消息提取函数
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as any;
    return data.message || data.error || '请求失败';
  }
  
  if (error.request) {
    return '网络连接失败，请检查网络设置';
  }
  
  return error.message || '未知错误';
}

// 认证相关 API 函数
export const authAPI = {
  // 用户登录
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // 用户注册
  register: async (credentials: { 
    username: string; 
    email: string; 
    password: string; 
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  // 验证当前用户
  checkAuth: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<AuthResponse>('/auth/me');
    return response.data;
  },

  // 用户登出
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // 刷新 token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh');
    return response.data;
  },
};

// 独立的 token 刷新函数（用于拦截器）
async function refreshToken(): Promise<RefreshTokenResponse> {
  const response = await axios.post<RefreshTokenResponse>(
    `${API_BASE_URL}/auth/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authStorage.getToken()}`,
      },
    }
  );
  return response.data;
}

export default apiClient; 