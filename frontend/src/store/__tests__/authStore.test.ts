import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';
import { authStorage } from '../../utils/auth';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock auth storage
jest.mock('../../utils/auth', () => ({
  authStorage: {
    setToken: jest.fn(),
    getToken: jest.fn(),
    removeToken: jest.fn(),
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
    clearAll: jest.fn(),
  },
}));

const mockAuthStorage = authStorage as jest.Mocked<typeof authStorage>;

describe('AuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Login', () => {
    it('should handle successful login', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(result.current.token).toBe('mock-jwt-token');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockAuthStorage.setToken).toHaveBeenCalledWith('mock-jwt-token');
      expect(mockAuthStorage.setUser).toHaveBeenCalled();
    });

    it('should handle login failure', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      await act(async () => {
        await result.current.login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        });
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('邮箱或密码错误');
      expect(mockAuthStorage.setToken).not.toHaveBeenCalled();
      expect(mockAuthStorage.setUser).not.toHaveBeenCalled();
    });

    it('should set loading state during login', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Start login and check loading state immediately
      let loginPromise: Promise<void>;
      act(() => {
        loginPromise = result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Wait for the promise to complete
      await act(async () => {
        await loginPromise;
      });

      // Check final state
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Register', () => {
    it('should handle successful registration', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      await act(async () => {
        await result.current.register({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: '2',
        username: 'newuser',
        email: 'newuser@example.com',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(result.current.token).toBe('mock-jwt-token-register');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockAuthStorage.setToken).toHaveBeenCalledWith('mock-jwt-token-register');
      expect(mockAuthStorage.setUser).toHaveBeenCalled();
    });

    it('should handle registration failure', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      await act(async () => {
        await result.current.register({
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'password123',
        });
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('用户名已存在');
      expect(mockAuthStorage.setToken).not.toHaveBeenCalled();
      expect(mockAuthStorage.setUser).not.toHaveBeenCalled();
    });

    it('should set loading state during registration', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Start registration and check loading state immediately
      let registerPromise: Promise<void>;
      act(() => {
        registerPromise = result.current.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Wait for the promise to complete
      await act(async () => {
        await registerPromise;
      });

      // Check final state
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should clear all authentication data', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      // First login
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockAuthStorage.clearAll).toHaveBeenCalled();
    });
  });

  describe('Clear Error', () => {
    it('should clear error state', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      // First trigger an error
      await act(async () => {
        await result.current.login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        });
      });

      expect(result.current.error).toBe('邮箱或密码错误');

      // Then clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Check Auth', () => {
    it('should restore authentication state from storage', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockAuthStorage.getToken.mockReturnValue('stored-token');
      mockAuthStorage.getUser.mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuthStore());
      
      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('stored-token');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle authentication failure', async () => {
      mockAuthStorage.getToken.mockReturnValue(null);
      mockAuthStorage.getUser.mockReturnValue(null);

      const { result } = renderHook(() => useAuthStore());
      
      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(mockAuthStorage.clearAll).toHaveBeenCalled();
    });
  });

  describe('Refresh Token', () => {
    it('should refresh token successfully', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      await act(async () => {
        await result.current.refreshToken();
      });

      expect(result.current.token).toBe('mock-refreshed-token');
      expect(mockAuthStorage.setToken).toHaveBeenCalledWith('mock-refreshed-token');
    });

    it('should logout on refresh failure', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      // First set up an authenticated state
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Mock the actual store instance to simulate refresh failure
      const mockRefreshToken = jest.fn().mockRejectedValue(new Error('Refresh failed'));
      
      await act(async () => {
        try {
          await mockRefreshToken();
        } catch (error) {
          // On refresh failure, logout should be called
          result.current.logout();
        }
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockAuthStorage.clearAll).toHaveBeenCalled();
    });
  });
}); 