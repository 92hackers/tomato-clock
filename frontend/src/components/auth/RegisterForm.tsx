import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { validateRegisterForm, getDefaultRegisterFormData, validateAuthField } from '../../utils/auth';
import { RegisterFormData, RegisterCredentials } from '../../types/auth';

interface RegisterFormProps {
  onSubmit?: (credentials: RegisterCredentials) => Promise<void>;
  onChange?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onChange, isLoading, disabled }) => {
  const { register, isLoading: authStoreLoading, error } = useAuthStore();
  const [formData, setFormData] = useState<RegisterFormData>(getDefaultRegisterFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time password confirmation validation
    if (name === 'confirmPassword' && value !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: '密码不匹配' }));
    } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '密码不匹配' }));
    } else if ((name === 'password' || name === 'confirmPassword') && value === formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
    
    // Call onChange callback if provided
    if (onChange) {
      onChange();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationResult = validateRegisterForm(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    try {
      // Use provided onSubmit or default to store register
      if (onSubmit) {
        await onSubmit({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (error) {
      // Error handling is done in the store
      console.error('Registration failed:', error);
    }
  };

  const formIsLoading = isLoading || authStoreLoading;
  const formIsDisabled = disabled || formIsLoading;

  return (
    <form onSubmit={handleSubmit} role="form" noValidate>
      <div className="space-y-4">
        {/* 错误提示 */}
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        
        {/* 用户名输入 */}
        <div>
          <label htmlFor="username">
            用户名
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            tabIndex={1}
          />
          {errors.username && (
            <div className="text-red-500">
              {errors.username}
            </div>
          )}
        </div>

        {/* 邮箱输入 */}
        <div>
          <label htmlFor="email">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            tabIndex={2}
          />
          {errors.email && (
            <div className="text-red-500">
              {errors.email}
            </div>
          )}
        </div>

        {/* 密码输入 */}
        <div>
          <label htmlFor="password">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            tabIndex={3}
          />
          {errors.password && (
            <div className="text-red-500">
              {errors.password}
            </div>
          )}
        </div>

        {/* 确认密码输入 */}
        <div>
          <label htmlFor="confirmPassword">
            确认密码
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            tabIndex={4}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={formIsDisabled}
        >
          {formIsLoading ? '注册中...' : '注册'}
        </button>
      </div>
    </form>
  );
};