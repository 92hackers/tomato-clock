'use client';

import React, { ReactNode } from 'react';
import { PageTransition } from './PageTransition';

interface PageLayoutProps {
  children: ReactNode;
  'data-testid'?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  'data-testid': testId,
}) => {
  const containerStyle: React.CSSProperties = {
    height: '100vh',
    width: '100%',
    backgroundColor: '#f3f4f6', // bg-gray-100
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem', // py-8 px-4
    boxSizing: 'border-box',
    overflow: 'hidden', // 防止水平滚动
  };

  const contentStyle: React.CSSProperties = {
    // 统一的白色背景和阴影样式
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    // 尺寸和布局
    width: '100%',
    maxWidth: '350px', // 固定为350px，与原来的卡片宽度一致
    height: '774px',
    padding: '30px', // 统一的内边距
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto', // 允许垂直滚动
    overflowX: 'hidden', // 防止水平滚动
    boxSizing: 'border-box',
    position: 'relative', // 为了确保PageTransition正常工作
  };

  return (
    <main style={containerStyle} data-testid={testId}>
      <div style={contentStyle}>
        <PageTransition data-testid='page-transition'>
          {children}
        </PageTransition>
      </div>
    </main>
  );
};
