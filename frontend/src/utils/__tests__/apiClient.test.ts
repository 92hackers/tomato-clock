import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import apiClient, { authAPI } from '../apiClient';
import { authStorage } from '../auth';

// Mock auth storage
jest.mock('../auth', () => ({
  authStorage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    clearAll: jest.fn(),
  },
}));

const mockAuthStorage = authStorage as jest.Mocked<typeof authStorage>;

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('API Client', () => {
  let mock: MockAdapter;
  let globalMock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
    globalMock = new MockAdapter(axios);
    jest.clearAllMocks();
    mockLocation.href = '';
  });

  afterEach(() => {
    mock.restore();
    globalMock.restore();
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      mockAuthStorage.getToken.mockReturnValue('test-token');
      
      mock.onGet('/test').reply((config) => {
        expect(config.headers.Authorization).toBe('Bearer test-token');
        return [200, { success: true }];
      });

      await apiClient.get('/test');
    });

    it('should not add Authorization header when token does not exist', async () => {
      mockAuthStorage.getToken.mockReturnValue(null);
      
      mock.onGet('/test').reply((config) => {
        expect(config.headers.Authorization).toBeUndefined();
        return [200, { success: true }];
      });

      await apiClient.get('/test');
    });
  });

  describe('Response Interceptor', () => {
    it('should handle successful response', async () => {
      mock.onGet('/test').reply(200, { success: true });
      
      const response = await apiClient.get('/test');
      expect(response.data.success).toBe(true);
    });

    it('should handle 401 error and retry with new token', async () => {
      mockAuthStorage.getToken.mockReturnValue('expired-token');
      
      // First request fails with 401
      mock.onGet('/test').replyOnce(401);
      
      // Mock the refresh endpoint for global axios (used in interceptor)
      globalMock.onPost('http://localhost:3001/api/auth/refresh').reply(200, {
        success: true,
        data: { token: 'new-token' }
      });
      
      // Retry request succeeds
      mock.onGet('/test').reply(200, { success: true });
      
      const response = await apiClient.get('/test');
      
      expect(mockAuthStorage.setToken).toHaveBeenCalledWith('new-token');
      expect(response.data.success).toBe(true);
    });

    it('should clear auth and redirect on refresh failure', async () => {
      mockAuthStorage.getToken.mockReturnValue('expired-token');
      
      // First request fails with 401
      mock.onGet('/test').replyOnce(401);
      
      // Token refresh fails
      globalMock.onPost('http://localhost:3001/api/auth/refresh').reply(401);
      
      await expect(apiClient.get('/test')).rejects.toThrow();
      
      expect(mockAuthStorage.clearAll).toHaveBeenCalled();
      expect(mockLocation.href).toBe('/auth/login');
    });

    it('should handle network errors', async () => {
      mock.onGet('/test').networkError();
      
      await expect(apiClient.get('/test')).rejects.toThrow('Network Error');
    });

    it('should handle server errors', async () => {
      mock.onGet('/test').reply(500, { message: '服务器错误' });
      
      await expect(apiClient.get('/test')).rejects.toThrow('服务器错误');
    });
  });

  describe('Auth API', () => {
    describe('login', () => {
      it('should login successfully', async () => {
        const credentials = { email: 'test@example.com', password: 'password' };
        const mockResponse = {
          success: true,
          data: {
            user: { id: '1', username: 'testuser', email: 'test@example.com' },
            token: 'auth-token'
          }
        };
        
        mock.onPost('/auth/login').reply(200, mockResponse);
        
        const response = await authAPI.login(credentials);
        
        expect(response.success).toBe(true);
        expect(response.data?.user.email).toBe('test@example.com');
        expect(response.data?.token).toBe('auth-token');
      });

      it('should handle login failure', async () => {
        const credentials = { email: 'wrong@example.com', password: 'wrong' };
        
        mock.onPost('/auth/login').reply(400, { message: '邮箱或密码错误' });
        
        await expect(authAPI.login(credentials)).rejects.toThrow('邮箱或密码错误');
      });
    });

    describe('register', () => {
      it('should register successfully', async () => {
        const credentials = { 
          username: 'newuser', 
          email: 'new@example.com', 
          password: 'password' 
        };
        const mockResponse = {
          success: true,
          data: {
            user: { id: '2', username: 'newuser', email: 'new@example.com' },
            token: 'auth-token'
          }
        };
        
        mock.onPost('/auth/register').reply(200, mockResponse);
        
        const response = await authAPI.register(credentials);
        
        expect(response.success).toBe(true);
        expect(response.data?.user.username).toBe('newuser');
        expect(response.data?.token).toBe('auth-token');
      });

      it('should handle registration failure', async () => {
        const credentials = { 
          username: 'existinguser', 
          email: 'existing@example.com', 
          password: 'password' 
        };
        
        mock.onPost('/auth/register').reply(400, { message: '用户名已存在' });
        
        await expect(authAPI.register(credentials)).rejects.toThrow('用户名已存在');
      });
    });

    describe('checkAuth', () => {
      it('should check auth successfully', async () => {
        const mockResponse = {
          success: true,
          data: {
            user: { id: '1', username: 'testuser', email: 'test@example.com' },
            token: 'current-token'
          }
        };
        
        mock.onGet('/auth/me').reply(200, mockResponse);
        
        const response = await authAPI.checkAuth();
        
        expect(response.success).toBe(true);
        expect(response.data?.user.id).toBe('1');
      });

      it('should handle unauthorized check', async () => {
        // Disable interceptor for this test
        mock.onPost('http://localhost:3001/api/auth/refresh').reply(404);
        mock.onGet('/auth/me').reply(401, { message: '未授权' });
        
        await expect(authAPI.checkAuth()).rejects.toThrow();
      });
    });

    describe('logout', () => {
      it('should logout successfully', async () => {
        mock.onPost('/auth/logout').reply(200);
        
        await expect(authAPI.logout()).resolves.not.toThrow();
      });

      it('should handle logout failure', async () => {
        mock.onPost('/auth/logout').reply(500, { message: '登出失败' });
        
        await expect(authAPI.logout()).rejects.toThrow('登出失败');
      });
    });

    describe('refreshToken', () => {
      it('should refresh token successfully', async () => {
        const mockResponse = {
          success: true,
          data: { token: 'new-token' }
        };
        
        mock.onPost('/auth/refresh').reply(200, mockResponse);
        
        const response = await authAPI.refreshToken();
        
        expect(response.success).toBe(true);
        expect(response.data?.token).toBe('new-token');
      });

      it('should handle refresh failure', async () => {
        mock.onPost('/auth/refresh').reply(401, { message: 'Token已过期' });
        
        await expect(authAPI.refreshToken()).rejects.toThrow();
      });
    });
  });

  describe('Error Handling', () => {
    it('should extract error message from response data', async () => {
      mock.onGet('/test').reply(400, { message: '自定义错误消息' });
      
      await expect(apiClient.get('/test')).rejects.toThrow('自定义错误消息');
    });

    it('should extract error from response data', async () => {
      mock.onGet('/test').reply(400, { error: '另一个错误消息' });
      
      await expect(apiClient.get('/test')).rejects.toThrow('另一个错误消息');
    });

    it('should use default message for unknown response errors', async () => {
      mock.onGet('/test').reply(500, {});
      
      await expect(apiClient.get('/test')).rejects.toThrow('请求失败');
    });

    it('should handle timeout errors', async () => {
      mock.onGet('/test').timeout();
      
      await expect(apiClient.get('/test')).rejects.toThrow();
    });
  });
}); 