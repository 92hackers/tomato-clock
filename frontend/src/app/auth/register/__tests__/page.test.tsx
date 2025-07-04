import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RegisterPage from '../page';
import { useAuth } from '../../../../hooks/useAuth';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useAuth hook
jest.mock('../../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('RegisterPage', () => {
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
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registerWithCredentials: jest.fn(),
      clearAuthError: jest.fn(),
    } as any);
  });

  describe('Page Rendering', () => {
    it('should render register page with form', () => {
      render(<RegisterPage />);
      
      expect(screen.getByRole('heading', { name: /注册/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^密码$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/确认密码/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument();
    });

    it('should render welcome message', () => {
      render(<RegisterPage />);
      
      expect(screen.getByText(/创建新账户/i)).toBeInTheDocument();
      expect(screen.getByText(/开始您的旅程/i)).toBeInTheDocument();
    });

    it('should render login link', () => {
      render(<RegisterPage />);
      
      expect(screen.getByText(/已有账户？/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /立即登录/i })).toBeInTheDocument();
    });

    it('should have proper iOS styling', () => {
      render(<RegisterPage />);
      
      const container = screen.getByTestId('register-container');
      expect(container).toHaveClass('ios-card-style');
    });
  });

  describe('Form Interaction', () => {
    it('should handle form submission with valid credentials', async () => {
      const mockRegister = jest.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        registerWithCredentials: mockRegister,
        clearAuthError: jest.fn(),
      } as any);

      render(<RegisterPage />);
      
      const usernameInput = screen.getByLabelText(/用户名/i);
      const emailInput = screen.getByLabelText(/邮箱/i);
      const passwordInput = screen.getByLabelText(/^密码$/i);
      const confirmPasswordInput = screen.getByLabelText(/确认密码/i);
      const termsCheckbox = screen.getByRole('checkbox', { name: /我同意/i });
      const registerButton = screen.getByRole('button', { name: /注册/i });
      
      // Fill form with valid data
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      // Accept terms
      fireEvent.click(termsCheckbox);
      
      // Submit form
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should show loading state during registration', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        error: null,
        registerWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<RegisterPage />);
      
      const registerButton = screen.getByRole('button', { name: /注册中.../i });
      expect(registerButton).toBeDisabled();
    });

    it('should display error message when registration fails', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '用户名已存在',
        registerWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<RegisterPage />);
      
      expect(screen.getByText('用户名已存在')).toBeInTheDocument();
    });

    it('should clear error when form is modified', async () => {
      const mockClearError = jest.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '用户名已存在',
        registerWithCredentials: jest.fn(),
        clearAuthError: mockClearError,
      } as any);

      render(<RegisterPage />);
      
      const usernameInput = screen.getByLabelText(/用户名/i);
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });

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
        registerWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<RegisterPage />);
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should redirect to dashboard after successful registration', async () => {
      // First render as unauthenticated
      const { rerender } = render(<RegisterPage />);
      
      // Then simulate successful registration
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        registerWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      rerender(<RegisterPage />);
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('Page Metadata', () => {
    it('should have correct page title', () => {
      render(<RegisterPage />);
      
      expect(document.title).toBe('注册 - 应用名称');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<RegisterPage />);
      
      const usernameInput = screen.getByLabelText(/用户名/i);
      const emailInput = screen.getByLabelText(/邮箱/i);
      const passwordInput = screen.getByLabelText(/^密码$/i);
      const confirmPasswordInput = screen.getByLabelText(/确认密码/i);
      
      expect(usernameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<RegisterPage />);
      
      const heading = screen.getByRole('heading', { name: /注册/i });
      expect(heading).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<RegisterPage />);
      
      const usernameInput = screen.getByLabelText(/用户名/i);
      const emailInput = screen.getByLabelText(/邮箱/i);
      const passwordInput = screen.getByLabelText(/^密码$/i);
      const confirmPasswordInput = screen.getByLabelText(/确认密码/i);
      const termsCheckbox = screen.getByRole('checkbox', { name: /我同意/i });
      const registerButton = screen.getByRole('button', { name: /注册/i });
      
      // Accept terms to enable register button
      fireEvent.click(termsCheckbox);
      
      // Check that fields have correct tabIndex
      expect(usernameInput).toHaveAttribute('tabIndex', '1');
      expect(emailInput).toHaveAttribute('tabIndex', '2');
      expect(passwordInput).toHaveAttribute('tabIndex', '3');
      expect(confirmPasswordInput).toHaveAttribute('tabIndex', '4');
      
      // Check that fields are focusable
      usernameInput.focus();
      expect(document.activeElement).toBe(usernameInput);
      
      emailInput.focus();
      expect(document.activeElement).toBe(emailInput);
      
      passwordInput.focus();
      expect(document.activeElement).toBe(passwordInput);
      
      confirmPasswordInput.focus();
      expect(document.activeElement).toBe(confirmPasswordInput);
      
      registerButton.focus();
      expect(document.activeElement).toBe(registerButton);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '网络连接失败',
        registerWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<RegisterPage />);
      
      expect(screen.getByText('网络连接失败')).toBeInTheDocument();
    });

    it('should handle server errors gracefully', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '服务器错误',
        registerWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<RegisterPage />);
      
      expect(screen.getByText('服务器错误')).toBeInTheDocument();
    });

    it('should handle validation errors', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        error: '密码强度不够',
        registerWithCredentials: jest.fn(),
        clearAuthError: jest.fn(),
      } as any);

      render(<RegisterPage />);
      
      expect(screen.getByText('密码强度不够')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should integrate with RegisterForm validation', async () => {
      render(<RegisterPage />);
      
      // Accept terms to enable register button
      const termsCheckbox = screen.getByRole('checkbox', { name: /我同意/i });
      fireEvent.click(termsCheckbox);
      
      const registerButton = screen.getByRole('button', { name: /注册/i });
      fireEvent.click(registerButton);

      // RegisterForm should handle validation
      await waitFor(() => {
        expect(screen.getByText(/请输入用户名/i)).toBeInTheDocument();
      });
    });

    it('should show password mismatch error', async () => {
      render(<RegisterPage />);
      
      const passwordInput = screen.getByLabelText(/^密码$/i);
      const confirmPasswordInput = screen.getByLabelText(/确认密码/i);
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(screen.getByText(/密码不匹配/i)).toBeInTheDocument();
      });
    });
  });

  describe('Terms and Conditions', () => {
    it('should show terms acceptance checkbox', () => {
      render(<RegisterPage />);
      
      expect(screen.getByRole('checkbox', { name: /我同意/i })).toBeInTheDocument();
      expect(screen.getByText(/服务条款/i)).toBeInTheDocument();
      expect(screen.getByText(/隐私政策/i)).toBeInTheDocument();
    });

    it('should disable register button when terms not accepted', () => {
      render(<RegisterPage />);
      
      const registerButton = screen.getByRole('button', { name: /注册/i });
      const termsCheckbox = screen.getByRole('checkbox', { name: /我同意/i });
      
      // Initially unchecked
      expect(termsCheckbox).not.toBeChecked();
      expect(registerButton).toBeDisabled();
    });

    it('should enable register button when terms accepted', () => {
      render(<RegisterPage />);
      
      const registerButton = screen.getByRole('button', { name: /注册/i });
      const termsCheckbox = screen.getByRole('checkbox', { name: /我同意/i });
      
      fireEvent.click(termsCheckbox);
      
      expect(termsCheckbox).toBeChecked();
      expect(registerButton).not.toBeDisabled();
    });
  });
}); 