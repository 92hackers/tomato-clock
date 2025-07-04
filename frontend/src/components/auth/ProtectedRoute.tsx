'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  loginPath?: string;
  redirectOnUnauth?: boolean;
  loadingComponent?: ReactNode;
  fallbackComponent?: ReactNode;
  errorComponent?: ReactNode;
  requiredRole?: string | string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  loginPath = '/auth/login',
  redirectOnUnauth = true,
  loadingComponent,
  fallbackComponent,
  errorComponent,
  requiredRole,
}) => {
  const router = useRouter();
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    error, 
    initializeAuth 
  } = useAuth();

  useEffect(() => {
    // Initialize authentication state on mount
    if (initializeAuth) {
      initializeAuth();
    }
  }, [initializeAuth]);

  useEffect(() => {
    // Redirect to login if not authenticated and redirect is enabled
    if (!isLoading && !isAuthenticated && redirectOnUnauth) {
      const currentPath = window.location.pathname;
      const returnUrl = encodeURIComponent(currentPath);
      const redirectUrl = currentPath === '/' || currentPath === loginPath 
        ? loginPath 
        : `${loginPath}?returnUrl=${returnUrl}`;
      
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, redirectOnUnauth, loginPath, router]);

  // Check if user has required role
  const hasRequiredRole = (userRole: string | undefined, required: string | string[]): boolean => {
    if (!required) return true;
    if (!userRole) return false;
    
    if (Array.isArray(required)) {
      return required.includes(userRole);
    }
    
    return userRole === required;
  };

  // Handle loading state
  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">验证身份中...</p>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (error) {
    return errorComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600">认证出错，请重新登录</p>
        </div>
      </div>
    );
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (redirectOnUnauth) {
      // Redirect will happen in useEffect
      return null;
    }
    
    return fallbackComponent || null;
  }

  // Handle role-based access control
  if (requiredRole && !hasRequiredRole(user?.role, requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">🚫</div>
          <p className="text-gray-600">您没有权限访问此页面</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute; 