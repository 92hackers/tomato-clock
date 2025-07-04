import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { render, screen, mockUserEvent } from '../../../testUtils';
import { LoginForm } from '../LoginForm';

// Mock the auth store
const mockLogin = jest.fn();
const mockAuthStore = {
  login: mockLogin,
  isLoading: false,
  error: null,
};

jest.mock('../../../store/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form with email and password fields', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /登录/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入邮箱/i)).toBeInTheDocument();
      expect(screen.getByText(/请输入密码/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/邮箱/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument();
    });
  });

  it('should validate password minimum length', async () => {
    render(<LoginForm />);
    
    const passwordInput = screen.getByLabelText(/密码/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/密码至少需要6个字符/i)).toBeInTheDocument();
    });
  });

  it('should call login function with correct data when form is valid', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/邮箱/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const submitButton = screen.getByRole('button', { name: /登录/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show loading state during login', () => {
    mockAuthStore.isLoading = true;
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /登录中/i });
    expect(submitButton).toBeDisabled();
  });

  it('should display error message when login fails', () => {
    mockAuthStore.error = '邮箱或密码错误';
    render(<LoginForm />);
    
    expect(screen.getByText(/邮箱或密码错误/i)).toBeInTheDocument();
  });

  it('should have correct form structure', () => {
    render(<LoginForm />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    // Check that the form has proper structure without checking for specific CSS classes
    expect(form.querySelector('div')).toBeInTheDocument();
  });

  it('should support keyboard navigation', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/邮箱/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    
    expect(emailInput).toHaveAttribute('tabIndex', '1');
    expect(passwordInput).toHaveAttribute('tabIndex', '2');
  });
}); 