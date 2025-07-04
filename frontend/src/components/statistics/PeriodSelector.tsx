import React from 'react';
import { PeriodSelectorProps, TimePeriod } from '@/types/statistics';

/**
 * 时间维度选择器组件
 * 提供今日、本周、本月三种时间维度的切换功能
 */
const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  period,
  onChange,
  disabled = false,
  className = '',
}) => {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'today', label: '今日' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
  ];

  return (
    <div
      className={`inline-flex p-1 bg-gray-100 rounded-lg shadow-sm ${className}`}
      role='tablist'
      aria-label='时间维度选择'
    >
      {periods.map(({ value, label }) => (
        <button
          key={value}
          type='button'
          role='tab'
          aria-selected={period === value}
          disabled={disabled}
          onClick={() => onChange(value)}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              period === value
                ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
