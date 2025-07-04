import { useCallback, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

export interface UseAuthReturn {
  // 基础状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 计算属性
  isLoggedIn: boolean;
  hasError: boolean;
  isAuthenticating: boolean;
  currentUser: User | null;
  userDisplayName: string | null;

  // 基础操作
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;

  // 便捷方法
  loginWithCredentials: (credentials: LoginCredentials) => Promise<void>;
  registerWithCredentials: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => void;
  clearAuthError: () => void;
  initializeAuth: () => Promise<void>;
  renewToken: () => Promise<void>;
}

/**
 * 用户认证相关的自定义 Hook
 * 提供统一的认证接口和便捷的计算属性
 */
export const useAuth = (): UseAuthReturn => {
  const authStore = useAuthStore();

  // 计算属性
  const isLoggedIn = useMemo(() => {
    return authStore.isAuthenticated && authStore.user !== null;
  }, [authStore.isAuthenticated, authStore.user]);

  const hasError = useMemo(() => {
    return authStore.error !== null;
  }, [authStore.error]);

  const isAuthenticating = useMemo(() => {
    return authStore.isLoading;
  }, [authStore.isLoading]);

  const currentUser = useMemo(() => {
    return authStore.user;
  }, [authStore.user]);

  const userDisplayName = useMemo(() => {
    return authStore.user?.username || null;
  }, [authStore.user]);

  // 便捷方法
  const loginWithCredentials = useCallback(
    async (credentials: LoginCredentials) => {
      await authStore.login(credentials);
    },
    [authStore.login]
  );

  const registerWithCredentials = useCallback(
    async (credentials: RegisterCredentials) => {
      await authStore.register(credentials);
    },
    [authStore.register]
  );

  const signOut = useCallback(() => {
    authStore.logout();
  }, [authStore.logout]);

  const clearAuthError = useCallback(() => {
    authStore.clearError();
  }, [authStore.clearError]);

  const initializeAuth = useCallback(async () => {
    await authStore.checkAuth();
  }, [authStore.checkAuth]);

  const renewToken = useCallback(async () => {
    await authStore.refreshToken();
  }, [authStore.refreshToken]);

  return {
    // 基础状态
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,

    // 计算属性
    isLoggedIn,
    hasError,
    isAuthenticating,
    currentUser,
    userDisplayName,

    // 基础操作
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    clearError: authStore.clearError,
    checkAuth: authStore.checkAuth,
    refreshToken: authStore.refreshToken,

    // 便捷方法
    loginWithCredentials,
    registerWithCredentials,
    signOut,
    clearAuthError,
    initializeAuth,
    renewToken,
  };
};
