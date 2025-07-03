'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
  'data-testid'?: string;
}

// 定义页面路径和它们的层级
const PAGE_LEVELS = {
  '/': 0,
  '/settings': 1,
} as const;

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  'data-testid': testId 
}) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back' | null>(null);
  const [prevPathname, setPrevPathname] = useState<string | null>(null);

  useEffect(() => {
    if (prevPathname && prevPathname !== pathname) {
      const prevLevel = PAGE_LEVELS[prevPathname as keyof typeof PAGE_LEVELS] || 0;
      const currentLevel = PAGE_LEVELS[pathname as keyof typeof PAGE_LEVELS] || 0;
      
      // 确定滑动方向
      const direction = currentLevel > prevLevel ? 'forward' : 'back';
      setTransitionDirection(direction);
      setIsTransitioning(true);
      
      // 动画持续时间后重置状态
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300); // 与CSS动画时间一致

      return () => clearTimeout(timer);
    }
    
    setPrevPathname(pathname);
  }, [pathname, prevPathname]);

  // 动态生成CSS样式
  const transitionStyles = `
    .page-transition-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .page-transition-content {
      width: 100%;
      height: 100%;
      transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      transform: translateX(0);
    }

    .page-transition-content.transitioning-forward {
      animation: slideInFromRight 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
    }

    .page-transition-content.transitioning-back {
      animation: slideInFromLeft 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
    }

    @keyframes slideInFromRight {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes slideInFromLeft {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    /* 优化动画性能 */
    .page-transition-content {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
      will-change: transform;
    }

    /* 确保在动画期间保持层级 */
    .page-transition-container.transitioning {
      z-index: 1000;
    }
  `;

  const getTransitionClass = () => {
    if (!isTransitioning || !transitionDirection) return '';
    return `transitioning-${transitionDirection}`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: transitionStyles }} />
      <div 
        className={`page-transition-container ${isTransitioning ? 'transitioning' : ''}`}
        data-testid={testId}
      >
        <div 
          className={`page-transition-content ${getTransitionClass()}`}
          key={pathname} // 强制重新渲染以触发动画
        >
          {children}
        </div>
      </div>
    </>
  );
}; 