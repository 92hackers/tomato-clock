'use client';

import React, { useState } from 'react';
import { StatCardProps } from '@/types/statistics';

/**
 * 统计卡片组件 - 响应式优化版本
 * 用于展示单个统计指标，包含数值、趋势和图标
 * 针对移动端和触摸设备进行了优化
 */
const StatCard: React.FC<
  StatCardProps & {
    isLoading?: boolean;
    onClick?: () => void;
    showDetailButton?: boolean;
  }
> = ({
  title,
  value,
  unit = '',
  trend,
  icon = 'chart',
  bgColor = 'bg-white',
  className = '',
  isLoading = false,
  onClick,
  showDetailButton = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatValue = (val: number): string => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val.toString();
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'same') => {
    switch (direction) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'same':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'same') => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'same':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCardIcon = () => {
    if (!icon) return null;

    // 默认图标映射 - 响应式尺寸
    const iconMap: Record<string, JSX.Element> = {
      clock: (
        <svg
          className='w-5 h-5 sm:w-6 sm:h-6'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.414L11 9.586V6z'
            clipRule='evenodd'
          />
        </svg>
      ),
      task: (
        <svg
          className='w-5 h-5 sm:w-6 sm:h-6'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
            clipRule='evenodd'
          />
        </svg>
      ),
      target: (
        <svg
          className='w-5 h-5 sm:w-6 sm:h-6'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
            clipRule='evenodd'
          />
        </svg>
      ),
      chart: (
        <svg
          className='w-5 h-5 sm:w-6 sm:h-6'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
        </svg>
      ),
    };

    return iconMap[icon] || null;
  };

  // 处理卡片点击 - 触摸友好
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (showDetailButton) {
      setIsExpanded(!isExpanded);
    }
  };

  // 自定义背景色处理
  const finalBgColor = bgColor === 'bg-white' || !bgColor ? '' : bgColor;

  // 加载状态 - 响应式优化
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 ${className}`}
      >
        <div className='animate-pulse'>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <div className='h-3 sm:h-4 bg-gray-200 rounded w-2/3'></div>
            <div className='h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded-full'></div>
          </div>
          <div className='space-y-2 sm:space-y-3'>
            <div className='h-6 sm:h-8 bg-gray-200 rounded w-1/2'></div>
            <div className='h-2 sm:h-3 bg-gray-200 rounded w-3/4'></div>
          </div>
        </div>
      </div>
    );
  }

  const cardClasses = `
    bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200
    transition-all duration-200 ease-in-out
    ${onClick || showDetailButton ? 'cursor-pointer hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation' : ''}
    ${finalBgColor}
    ${className}
  `.trim();

  return (
    <div className={cardClasses} onClick={handleCardClick}>
      {/* 卡片头部 - 响应式间距 */}
      <div className='flex items-center justify-between mb-3 sm:mb-4'>
        <h3 className='text-xs sm:text-sm font-medium text-gray-600 truncate pr-2'>
          {title}
        </h3>
        {getCardIcon() && (
          <div className='text-gray-400 flex-shrink-0'>{getCardIcon()}</div>
        )}
      </div>

      {/* 主要数值 - 响应式字体 */}
      <div className='space-y-1 sm:space-y-2'>
        <div className='flex items-baseline space-x-1 sm:space-x-2'>
          <span className='text-2xl sm:text-3xl font-bold text-gray-900 leading-none'>
            {typeof value === 'number' ? formatValue(value) : value}
          </span>
          {unit && (
            <span className='text-xs sm:text-sm font-medium text-gray-500 flex-shrink-0'>
              {unit}
            </span>
          )}
        </div>

        {/* 趋势信息 - 响应式文字 */}
        {trend && (
          <div
            className={`flex items-center space-x-1 text-xs sm:text-sm ${getTrendColor(trend.direction)}`}
          >
            <span className='text-sm sm:text-base'>
              {getTrendIcon(trend.direction)}
            </span>
            <span className='font-medium'>{Math.abs(trend.value)}%</span>
            <span className='text-gray-500 truncate'>{trend.label}</span>
          </div>
        )}

        {/* 展开详情按钮 - 触摸友好 */}
        {showDetailButton && (
          <button
            className='text-xs text-blue-600 hover:text-blue-800 active:text-blue-900 transition-colors mt-2 py-1 px-2 -mx-2 rounded touch-manipulation'
            onClick={e => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? '收起详情' : '查看详情'}
          </button>
        )}
      </div>

      {/* 展开的详情内容 - 响应式布局 */}
      {isExpanded && showDetailButton && (
        <div className='mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 space-y-2 sm:space-y-3 animate-fadeIn'>
          <div className='text-xs text-gray-600'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1'>
              <span>数据说明：</span>
              <span className='text-blue-600 text-xs'>点击卡片查看更多</span>
            </div>
            <div className='bg-gray-50 p-2 sm:p-3 rounded text-xs space-y-1'>
              <p>• 此数据基于您的专注记录生成</p>
              <p>• 趋势对比基于前一个相同时期</p>
              {trend && (
                <p className='break-words'>
                  • 当前趋势：
                  <span className={getTrendColor(trend.direction)}>
                    {trend.direction === 'up'
                      ? '上升'
                      : trend.direction === 'down'
                        ? '下降'
                        : '保持稳定'}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 悬停效果指示器 - 隐藏在移动设备 */}
      {(onClick || showDetailButton) && (
        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block'>
          <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
