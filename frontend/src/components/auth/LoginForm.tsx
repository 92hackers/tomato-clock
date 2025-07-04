import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { validateLoginForm, getDefaultLoginFormData } from '../../utils/auth';
import { LoginFormData, LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => Promise<void>;
  onChange?: () => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onChange,
  isLoading,
}) => {
  const { login, isLoading: authStoreLoading, error } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>(
    getDefaultLoginFormData()
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Call onChange callback if provided
    if (onChange) {
      onChange();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationResult = validateLoginForm(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    try {
      // Use provided onSubmit or default to store login
      if (onSubmit) {
        await onSubmit({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (error) {
      // Error handling is done in the store
      console.error('Login failed:', error);
    }
  };

  const formIsLoading = isLoading || authStoreLoading;

  return (
    <form onSubmit={handleSubmit} role='form' noValidate>
      <div className='space-y-4'>
        {/* 错误提示 */}
        {error && <div className='text-red-500 text-sm'>{error}</div>}

        {/* 邮箱输入 */}
        <div>
          <label htmlFor='email'>邮箱</label>
          <input
            id='email'
            name='email'
            type='text'
            value={formData.email}
            onChange={handleChange}
            tabIndex={1}
          />
          {errors.email && <div className='text-red-500'>{errors.email}</div>}
        </div>

        {/* 密码输入 */}
        <div>
          <label htmlFor='password'>密码</label>
          <input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            tabIndex={2}
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password}</div>
          )}
        </div>

        {/* 提交按钮 */}
        <button type='submit' disabled={formIsLoading}>
          {formIsLoading ? '登录中...' : '登录'}
        </button>
      </div>
    </form>
  );
};
