import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AuthStore, 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials, 
  User,
  AUTH_STORAGE_KEYS 
} from '../types/auth';
import { authStorage } from '../utils/auth';

// 初始状态
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// 模拟 API 调用（后续会被真实的 API 调用替换）
const mockAuthAPI = {
  login: async (credentials: LoginCredentials) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟登录验证
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      return {
        success: true,
        data: {
          user: {
            id: '1',
            username: 'testuser',
            email: credentials.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token',
        },
      };
    } else {
      throw new Error('邮箱或密码错误');
    }
  },

  register: async (credentials: RegisterCredentials) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟注册验证
    if (credentials.username === 'existinguser') {
      throw new Error('用户名已存在');
    }
    
    return {
      success: true,
      data: {
        user: {
          id: '2',
          username: credentials.username,
          email: credentials.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-register',
      },
    };
  },

  refreshToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        token: 'mock-refreshed-token',
      },
    };
  },

  checkAuth: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    
    if (token && user) {
      return {
        success: true,
        data: { user, token },
      };
    } else {
      throw new Error('未授权');
    }
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 登录操作
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await mockAuthAPI.login(credentials);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // 存储到 localStorage
            authStorage.setToken(token);
            authStorage.setUser(user);
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '登录失败',
          });
        }
      },

      // 注册操作
      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await mockAuthAPI.register(credentials);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // 存储到 localStorage
            authStorage.setToken(token);
            authStorage.setUser(user);
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '注册失败',
          });
        }
      },

      // 登出操作
      logout: () => {
        authStorage.clearAll();
        set({
          ...initialState,
        });
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },

      // 检查认证状态
      checkAuth: async () => {
        set({ isLoading: true });
        
        try {
          const response = await mockAuthAPI.checkAuth();
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          // 认证失败，清除本地存储
          authStorage.clearAll();
          set({
            ...initialState,
            isLoading: false,
          });
        }
      },

      // 刷新 token
      refreshToken: async () => {
        try {
          const response = await mockAuthAPI.refreshToken();
          
          if (response.success && response.data) {
            const { token } = response.data;
            authStorage.setToken(token);
            
            set({ token });
          }
        } catch (error) {
          // 刷新失败，登出用户
          get().logout();
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 