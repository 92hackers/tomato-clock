import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '../../../hooks/useAuth';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Test component
const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  describe('Authentication States', () => {
    it('should render children when user is authenticated', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
        error: null,
      } as any);

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      } as any);

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login');
      });
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should show loading state while checking authentication', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        error: null,
      } as any);

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('验证身份中...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Redirect Behavior', () => {
    it('should redirect to custom login path when specified', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      } as any);

      render(
        <ProtectedRoute loginPath="/custom-login">
          <TestComponent />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/custom-login');
      });
    });

    it('should preserve current path as return url', async () => {
      // Mock current pathname
      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard' },
        writable: true,
      });

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      } as any);

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login?returnUrl=%2Fdashboard');
      });
    });

    it('should not redirect when redirectOnUnauth is false', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      } as any);

      render(
        <ProtectedRoute redirectOnUnauth={false}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Custom Components', () => {
    it('should render custom loading component', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        error: null,
      } as any);

      const CustomLoading = () => <div>Custom Loading...</div>;

      render(
        <ProtectedRoute loadingComponent={<CustomLoading />}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    it('should render custom fallback component for unauthenticated users', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      } as any);

      const CustomFallback = () => <div>Please Login</div>;

      render(
        <ProtectedRoute 
          redirectOnUnauth={false} 
          fallbackComponent={<CustomFallback />}
        >
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Please Login')).toBeInTheDocument();
    });
  });

  describe('Role-based Access', () => {
    it('should render content when user has required role', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { 
          id: '1', 
          username: 'admin', 
          email: 'admin@example.com',
          role: 'admin' 
        },
        error: null,
      } as any);

      render(
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should show unauthorized message when user lacks required role', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { 
          id: '1', 
          username: 'user', 
          email: 'user@example.com',
          role: 'user' 
        },
        error: null,
      } as any);

      render(
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('您没有权限访问此页面')).toBeInTheDocument();
    });

    it('should accept multiple required roles', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { 
          id: '1', 
          username: 'moderator', 
          email: 'mod@example.com',
          role: 'moderator' 
        },
        error: null,
      } as any);

      render(
        <ProtectedRoute requiredRole={['admin', 'moderator']}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: '认证失败',
      } as any);

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('认证出错，请重新登录')).toBeInTheDocument();
    });

    it('should render error component when authentication fails', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: '认证失败',
      } as any);

      const CustomError = () => <div>Authentication Error</div>;

      render(
        <ProtectedRoute errorComponent={<CustomError />}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    });
  });

  describe('Auth State Initialization', () => {
    it('should initialize auth state on mount', () => {
      const mockInitializeAuth = jest.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        error: null,
        initializeAuth: mockInitializeAuth,
      } as any);

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockInitializeAuth).toHaveBeenCalled();
    });
  });
}); 