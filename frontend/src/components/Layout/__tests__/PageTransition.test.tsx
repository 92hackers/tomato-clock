import React from 'react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { PageTransition } from '../PageTransition';

// Mock usePathname hook
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('PageTransition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render children with transition container', () => {
      mockPathname.mockReturnValue('/');

      render(
        <PageTransition data-testid='transition-wrapper'>
          <div data-testid='child-content'>Test Content</div>
        </PageTransition>
      );

      expect(screen.getByTestId('transition-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply transition container classes', () => {
      mockPathname.mockReturnValue('/');

      render(
        <PageTransition data-testid='transition-wrapper'>
          <div>Content</div>
        </PageTransition>
      );

      const container = screen.getByTestId('transition-wrapper');
      expect(container).toHaveClass('page-transition-container');
    });

    it('should render content with transition class', () => {
      mockPathname.mockReturnValue('/');

      render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      );

      const content = document.querySelector('.page-transition-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Navigation Simulation', () => {
    it('should handle pathname changes without throwing errors', () => {
      mockPathname.mockReturnValue('/');
      const { rerender } = render(
        <PageTransition data-testid='transition-container'>
          <div>Home Content</div>
        </PageTransition>
      );

      // Change to settings page
      mockPathname.mockReturnValue('/settings');
      expect(() => {
        rerender(
          <PageTransition data-testid='transition-container'>
            <div>Settings Content</div>
          </PageTransition>
        );
      }).not.toThrow();

      // Component should still render properly
      expect(screen.getByTestId('transition-container')).toBeInTheDocument();
      expect(screen.getByText('Settings Content')).toBeInTheDocument();
    });

    it('should handle navigation back to home', () => {
      mockPathname.mockReturnValue('/settings');
      const { rerender } = render(
        <PageTransition data-testid='transition-container'>
          <div>Settings Content</div>
        </PageTransition>
      );

      // Navigate back to home
      mockPathname.mockReturnValue('/');
      expect(() => {
        rerender(
          <PageTransition data-testid='transition-container'>
            <div>Home Content</div>
          </PageTransition>
        );
      }).not.toThrow();

      expect(screen.getByTestId('transition-container')).toBeInTheDocument();
      expect(screen.getByText('Home Content')).toBeInTheDocument();
    });
  });

  describe('CSS Styles', () => {
    it('should inject transition styles into document', () => {
      mockPathname.mockReturnValue('/');

      render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      );

      // Look for inline styles in the component (styles are injected via dangerouslySetInnerHTML)
      const styleElements = document.querySelectorAll('style');
      expect(styleElements.length).toBeGreaterThan(0);
    });

    it('should have proper CSS class structure', () => {
      mockPathname.mockReturnValue('/');

      render(
        <PageTransition data-testid='transition-wrapper'>
          <div>Content</div>
        </PageTransition>
      );

      const container = screen.getByTestId('transition-wrapper');
      expect(container).toHaveClass('page-transition-container');

      const content = container.querySelector('.page-transition-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Page Level Handling', () => {
    it('should handle unknown pages gracefully', () => {
      mockPathname.mockReturnValue('/unknown-page');

      expect(() => {
        render(
          <PageTransition>
            <div>Unknown Page</div>
          </PageTransition>
        );
      }).not.toThrow();
    });

    it('should handle undefined pathname', () => {
      mockPathname.mockReturnValue(undefined);

      expect(() => {
        render(
          <PageTransition>
            <div>Content</div>
          </PageTransition>
        );
      }).not.toThrow();
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up timers on unmount', () => {
      mockPathname.mockReturnValue('/');
      const { unmount } = render(
        <PageTransition>
          <div>Content</div>
        </PageTransition>
      );

      // Should not throw when unmounting
      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid pathname changes', () => {
      mockPathname.mockReturnValue('/');
      const { rerender } = render(
        <PageTransition data-testid='transition-container'>
          <div>Home</div>
        </PageTransition>
      );

      // Rapid changes should not break the component
      mockPathname.mockReturnValue('/settings');
      rerender(
        <PageTransition data-testid='transition-container'>
          <div>Settings</div>
        </PageTransition>
      );

      mockPathname.mockReturnValue('/');
      rerender(
        <PageTransition data-testid='transition-container'>
          <div>Home Again</div>
        </PageTransition>
      );

      expect(screen.getByTestId('transition-container')).toBeInTheDocument();
      expect(screen.getByText('Home Again')).toBeInTheDocument();
    });
  });
});
