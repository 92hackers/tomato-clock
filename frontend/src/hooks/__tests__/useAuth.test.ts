import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useAuthStore } from '../../store/authStore';

// Mock the auth store
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLogout = jest.fn();
const mockClearError = jest.fn();
const mockCheckAuth = jest.fn();
const mockRefreshToken = jest.fn();

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
      clearError: mockClearError,
      checkAuth: mockCheckAuth,
      refreshToken: mockRefreshToken,
    });
  });

  describe('Initial State', () => {
    it('should return auth state from store', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Authentication Actions', () => {
    it('should provide login function', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(typeof result.current.login).toBe('function');
    });

    it('should provide register function', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(typeof result.current.register).toBe('function');
    });

    it('should provide logout function', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(typeof result.current.logout).toBe('function');
    });

    it('should provide clearError function', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(typeof result.current.clearError).toBe('function');
    });

    it('should provide checkAuth function', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(typeof result.current.checkAuth).toBe('function');
    });

    it('should provide refreshToken function', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(typeof result.current.refreshToken).toBe('function');
    });
  });

  describe('Computed Properties', () => {
    it('should provide isLoggedIn computed property', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.isLoggedIn).toBe(false);
    });

    it('should return true for isLoggedIn when authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: mockLogin,
        register: mockRegister,
        logout: mockLogout,
        clearError: mockClearError,
        checkAuth: mockCheckAuth,
        refreshToken: mockRefreshToken,
      });

      const { result } = renderHook(() => useAuth());
      
      expect(result.current.isLoggedIn).toBe(true);
    });

    it('should provide hasError computed property', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.hasError).toBe(false);
    });

    it('should return true for hasError when error exists', () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: '登录失败',
        login: mockLogin,
        register: mockRegister,
        logout: mockLogout,
        clearError: mockClearError,
        checkAuth: mockCheckAuth,
        refreshToken: mockRefreshToken,
      });

      const { result } = renderHook(() => useAuth());
      
      expect(result.current.hasError).toBe(true);
    });
  });

  describe('Helper Functions', () => {
    it('should provide loginWithCredentials function', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.loginWithCredentials({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should provide registerWithCredentials function', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.registerWithCredentials({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
        });
      });

      expect(mockRegister).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      });
    });

    it('should provide signOut function', () => {
      const { result } = renderHook(() => useAuth());
      
      act(() => {
        result.current.signOut();
      });

      expect(mockLogout).toHaveBeenCalled();
    });

    it('should provide clearAuthError function', () => {
      const { result } = renderHook(() => useAuth());
      
      act(() => {
        result.current.clearAuthError();
      });

      expect(mockClearError).toHaveBeenCalled();
    });

    it('should provide initializeAuth function', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.initializeAuth();
      });

      expect(mockCheckAuth).toHaveBeenCalled();
    });

    it('should provide renewToken function', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.renewToken();
      });

      expect(mockRefreshToken).toHaveBeenCalled();
    });
  });

  describe('User Information', () => {
    it('should provide currentUser property', () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: mockLogin,
        register: mockRegister,
        logout: mockLogout,
        clearError: mockClearError,
        checkAuth: mockCheckAuth,
        refreshToken: mockRefreshToken,
      });

      const { result } = renderHook(() => useAuth());
      
      expect(result.current.currentUser).toEqual(mockUser);
    });

    it('should provide userDisplayName property', () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        login: mockLogin,
        register: mockRegister,
        logout: mockLogout,
        clearError: mockClearError,
        checkAuth: mockCheckAuth,
        refreshToken: mockRefreshToken,
      });

      const { result } = renderHook(() => useAuth());
      
      expect(result.current.userDisplayName).toBe('testuser');
    });

    it('should return null for userDisplayName when no user', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.userDisplayName).toBeNull();
    });
  });

  describe('Loading States', () => {
    it('should provide isAuthenticating property', () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        login: mockLogin,
        register: mockRegister,
        logout: mockLogout,
        clearError: mockClearError,
        checkAuth: mockCheckAuth,
        refreshToken: mockRefreshToken,
      });

      const { result } = renderHook(() => useAuth());
      
      expect(result.current.isAuthenticating).toBe(true);
    });
  });
}); 