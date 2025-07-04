import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { render, screen } from '../../../testUtils';
import { RegisterForm } from '../RegisterForm';

// Mock the auth store
const mockRegister = jest.fn();
const mockAuthStore = {
  register: mockRegister,
  isLoading: false,
  error: null,
};

jest.mock('../../../store/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render register form with all required fields', () => {
    render(<RegisterForm />);
    
    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^密码$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/确认密码/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(<RegisterForm />);
    
    const submitButton = screen.getByRole('button', { name: /注册/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入用户名/i)).toBeInTheDocument();
      expect(screen.getByText(/请输入邮箱/i)).toBeInTheDocument();
      expect(screen.getByText(/请输入密码/i)).toBeInTheDocument();
      expect(screen.getByText(/请确认密码/i)).toBeInTheDocument();
    });
  });

  it('should validate username length', async () => {
    render(<RegisterForm />);
    
    const usernameInput = screen.getByLabelText(/用户名/i);
    const submitButton = screen.getByRole('button', { name: /注册/i });
    
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/用户名至少需要3个字符/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText(/邮箱/i);
    const submitButton = screen.getByRole('button', { name: /注册/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument();
    });
  });

  it('should validate password strength', async () => {
    render(<RegisterForm />);
    
    const passwordInput = screen.getByLabelText(/^密码$/i);
    const submitButton = screen.getByRole('button', { name: /注册/i });
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/密码至少需要6个字符/i)).toBeInTheDocument();
    });
  });

  it('should validate password confirmation match', async () => {
    render(<RegisterForm />);
    
    const passwordInput = screen.getByLabelText(/^密码$/i);
    const confirmPasswordInput = screen.getByLabelText(/确认密码/i);
    const submitButton = screen.getByRole('button', { name: /注册/i });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/密码不匹配|两次输入的密码不匹配/i)).toBeInTheDocument();
    });
  });

  it('should show real-time validation for password confirmation', async () => {
    render(<RegisterForm />);
    
    const passwordInput = screen.getByLabelText(/^密码$/i);
    const confirmPasswordInput = screen.getByLabelText(/确认密码/i);
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/密码不匹配/i)).toBeInTheDocument();
    });
  });

  it('should call register function with correct data when form is valid', async () => {
    render(<RegisterForm />);
    
    const usernameInput = screen.getByLabelText(/用户名/i);
    const emailInput = screen.getByLabelText(/邮箱/i);
    const passwordInput = screen.getByLabelText(/^密码$/i);
    const confirmPasswordInput = screen.getByLabelText(/确认密码/i);
    const submitButton = screen.getByRole('button', { name: /注册/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show loading state during registration', () => {
    mockAuthStore.isLoading = true;
    render(<RegisterForm />);
    
    const submitButton = screen.getByRole('button', { name: /注册中/i });
    expect(submitButton).toBeDisabled();
  });

  it('should display error message when registration fails', () => {
    mockAuthStore.error = '用户名已存在';
    render(<RegisterForm />);
    
    expect(screen.getByText(/用户名已存在/i)).toBeInTheDocument();
  });

  it('should have correct form structure', () => {
    render(<RegisterForm />);
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    // Check that the form has proper structure without checking for specific CSS classes
    expect(form.querySelector('div')).toBeInTheDocument();
  });

  it('should support keyboard navigation', () => {
    render(<RegisterForm />);
    
    const usernameInput = screen.getByLabelText(/用户名/i);
    const emailInput = screen.getByLabelText(/邮箱/i);
    const passwordInput = screen.getByLabelText(/^密码$/i);
    const confirmPasswordInput = screen.getByLabelText(/确认密码/i);
    
    expect(usernameInput).toHaveAttribute('tabIndex', '1');
    expect(emailInput).toHaveAttribute('tabIndex', '2');
    expect(passwordInput).toHaveAttribute('tabIndex', '3');
    expect(confirmPasswordInput).toHaveAttribute('tabIndex', '4');
  });
}); 