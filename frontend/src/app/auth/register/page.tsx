'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { RegisterForm } from '../../../components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, clearAuthError, registerWithCredentials } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = '注册 - 应用名称';
  }, []);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleFormChange = () => {
    // Clear error when form is modified
    if (error) {
      clearAuthError();
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">注册</h1>
          <p className="mt-2 text-sm text-gray-600">创建新账户</p>
          <p className="text-sm text-gray-500">开始您的旅程</p>
        </div>

        <div 
          data-testid="register-container"
          className="ios-card-style bg-white p-8 rounded-2xl shadow-lg"
        >
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <RegisterForm 
            onSubmit={registerWithCredentials} 
            onChange={handleFormChange}
            isLoading={isLoading}
            disabled={!termsAccepted}
          />

          {/* Terms and Conditions */}
          <div className="mt-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="我同意服务条款和隐私政策"
              />
              <span className="ml-2 text-sm text-gray-600">
                我同意{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  服务条款
                </Link>
                {' '}和{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  隐私政策
                </Link>
              </span>
            </label>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              已有账户？{' '}
              <Link 
                href="/auth/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 