import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import LoginPage from '../page';
import { useAuth } from '../../../../hooks/useAuth';

// Mock Next.js router and search params
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock useAuth hook
jest.mock('../../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginPage', () => {
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
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    } as any);
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginWithCredentials: jest.fn(),
      clearAuthError: jest.fn(),
    } as any);
  });

  describe('Page Rendering', () => {
    it('should render login page with form', () => {
      render(<LoginPage />);

      expect(
        screen.getByRole('heading', { name: /登录/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
    });

    it('should render welcome message', () => {
      render(<LoginPage />);

      expect(screen.getByText(/欢迎回来/i)).toBeInTheDocument();
    });

    it('should render register link', () => {
      render(<LoginPage />);

      expect(screen.getByText(/还没有账户？/i)).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /立即注册/i })
      ).toBeInTheDocument();
    });

    it('should have proper iOS styling', () => {
      render(<LoginPage />);

      const container = screen.getByTestId('login-container');
      expect(container).toHaveClass('ios-card-style');
    });
  });

  describe('Form Interaction', () => {
    it('should handle form submission with valid credentials', async () => {
      const mockLogin = jest.fn().mockResolvedValue(undefined);
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        loginWithCredentials: mockLogin,
        clearAuthError: jest.fn(),
      } as any);

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/邮箱/i);
      const passwordInput = screen.getByLabelText(/密码/i);
      const loginButton = screen.getByRole('button', { name: /登录/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should show loading state during login', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        error: null,
        loginWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<LoginPage />);

      const loginButton = screen.getByRole('button', { name: /登录中.../i });
      expect(loginButton).toBeDisabled();
    });

    it('should display error message when login fails', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '邮箱或密码错误',
        loginWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<LoginPage />);

      expect(screen.getByText('邮箱或密码错误')).toBeInTheDocument();
    });

    it('should clear error when form is modified', async () => {
      const mockClearError = jest.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '邮箱或密码错误',
        loginWithCredentials: jest.fn(),
        clearAuthError: mockClearError,
      } as any);

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/邮箱/i);
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled();
      });
    });
  });

  describe('Authentication State Handling', () => {
    it('should redirect to dashboard when already authenticated', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<LoginPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should redirect to return URL after successful login', async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue('/protected-page'),
      } as any);

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<LoginPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/protected-page');
      });
    });

    it('should handle URL decoding for return URL', async () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn().mockReturnValue('%2Fprotected-page'),
      } as any);

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<LoginPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/protected-page');
      });
    });
  });

  describe('Page Metadata', () => {
    it('should have correct page title', () => {
      render(<LoginPage />);

      expect(document.title).toBe('登录 - 应用名称');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/邮箱/i);
      const passwordInput = screen.getByLabelText(/密码/i);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<LoginPage />);

      const heading = screen.getByRole('heading', { name: /登录/i });
      expect(heading).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/邮箱/i);
      const passwordInput = screen.getByLabelText(/密码/i);
      const loginButton = screen.getByRole('button', { name: /登录/i });

      // Check that fields have correct tabIndex
      expect(emailInput).toHaveAttribute('tabIndex', '1');
      expect(passwordInput).toHaveAttribute('tabIndex', '2');

      // Check that fields are focusable
      emailInput.focus();
      expect(document.activeElement).toBe(emailInput);

      passwordInput.focus();
      expect(document.activeElement).toBe(passwordInput);

      loginButton.focus();
      expect(document.activeElement).toBe(loginButton);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '网络连接失败',
        loginWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<LoginPage />);

      expect(screen.getByText('网络连接失败')).toBeInTheDocument();
    });

    it('should handle server errors gracefully', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '服务器错误',
        loginWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<LoginPage />);

      expect(screen.getByText('服务器错误')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should integrate with LoginForm validation', async () => {
      render(<LoginPage />);

      const loginButton = screen.getByRole('button', { name: /登录/i });
      fireEvent.click(loginButton);

      // LoginForm should handle validation
      await waitFor(() => {
        expect(screen.getByText(/请输入邮箱/i)).toBeInTheDocument();
      });
    });
  });
});
