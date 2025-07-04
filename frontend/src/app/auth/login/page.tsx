'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { LoginForm } from '../../../components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isAuthenticated,
    isLoading,
    error,
    clearAuthError,
    loginWithCredentials,
  } = useAuth();

  useEffect(() => {
    // Set page title
    document.title = '登录 - 应用名称';
  }, []);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      const returnUrl = searchParams?.get('returnUrl');
      const redirectUrl = returnUrl
        ? decodeURIComponent(returnUrl)
        : '/dashboard';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, searchParams, router]);

  const handleFormChange = () => {
    // Clear error when form is modified
    if (error) {
      clearAuthError();
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>登录</h1>
          <p className='mt-2 text-sm text-gray-600'>欢迎回来！请登录您的账户</p>
        </div>

        <div
          data-testid='login-container'
          className='ios-card-style bg-white p-8 rounded-2xl shadow-lg'
        >
          {error && (
            <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          <LoginForm
            onSubmit={loginWithCredentials}
            onChange={handleFormChange}
            isLoading={isLoading}
          />

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              还没有账户？{' '}
              <Link
                href='/auth/register'
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
