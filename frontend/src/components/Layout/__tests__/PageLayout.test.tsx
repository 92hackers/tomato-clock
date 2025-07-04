import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { PageLayout } from '../PageLayout';

describe('PageLayout', () => {
  describe('Rendering', () => {
    it('should render children inside layout container', () => {
      render(
        <PageLayout data-testid='test-layout'>
          <div data-testid='test-content'>Test Content</div>
        </PageLayout>
      );

      expect(screen.getByTestId('test-layout')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply consistent layout styles', () => {
      render(
        <PageLayout data-testid='layout-container'>
          <div>Content</div>
        </PageLayout>
      );

      const container = screen.getByTestId('layout-container');

      // 验证外层容器样式
      expect(container).toHaveStyle({
        height: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
    });

    it('should apply white background and shadow to content area', () => {
      render(
        <PageLayout data-testid='layout-container'>
          <div data-testid='content'>Content</div>
        </PageLayout>
      );

      // 获取内容区域（白色背景的div）
      const container = screen.getByTestId('layout-container');
      const contentArea = container.querySelector('div');

      expect(contentArea).toHaveStyle({
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '350px',
        height: '774px',
        padding: '30px',
      });
    });

    it('should handle multiple children', () => {
      render(
        <PageLayout>
          <div data-testid='child-1'>Child 1</div>
          <div data-testid='child-2'>Child 2</div>
        </PageLayout>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });

  describe('Layout Consistency', () => {
    it('should provide consistent height for all pages', () => {
      const { rerender } = render(
        <PageLayout data-testid='layout'>
          <div style={{ height: '100px' }}>Short Content</div>
        </PageLayout>
      );

      const container = screen.getByTestId('layout');
      expect(container).toHaveStyle('height: 100vh');

      // 重新渲染不同高度的内容
      rerender(
        <PageLayout data-testid='layout'>
          <div style={{ height: '1000px' }}>Tall Content</div>
        </PageLayout>
      );

      expect(container).toHaveStyle('height: 100vh');
    });

    it('should prevent horizontal overflow', () => {
      render(
        <PageLayout data-testid='layout'>
          <div>Content</div>
        </PageLayout>
      );

      const container = screen.getByTestId('layout');
      expect(container).toHaveStyle('overflow: hidden');
    });

    it('should provide consistent width and styling for content area', () => {
      render(
        <PageLayout data-testid='layout'>
          <div>Content</div>
        </PageLayout>
      );

      const container = screen.getByTestId('layout');
      const contentArea = container.querySelector('div');

      expect(contentArea).toHaveStyle({
        maxWidth: '350px',
        height: '774px',
        backgroundColor: 'white',
        borderRadius: '20px',
      });
    });
  });
});
