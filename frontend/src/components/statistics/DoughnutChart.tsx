'use client';

import React, {
  useRef,
  useCallback,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions as ChartJSOptions,
  ActiveElement,
  ChartEvent,
} from 'chart.js';
import { DoughnutChartProps } from '../../types/statistics';

// 注册 Chart.js 组件
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * 环形图组件 - 移动端优化版本
 * 用于显示数据的比例关系
 * 针对触摸设备和小屏幕进行了优化
 */
const DoughnutChart = forwardRef<ChartJS, DoughnutChartProps>(
  (
    {
      data,
      options = {},
      isLoading = false,
      error = null,
      className = '',
      colors = [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#06b6d4',
      ],
      cutout = 0.5,
      showPercentage = false,
      onPointClick,
      onHover,
    },
    ref
  ) => {
    const chartRef = useRef<ChartJS | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // 检测移动设备
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 处理点击事件 - 触摸优化
    const handlePointClick = useCallback(
      (event: ChartEvent, elements: ActiveElement[]) => {
        if (elements.length > 0 && onPointClick) {
          const pointIndex = elements[0].index;
          const dataPoint = data[pointIndex];
          onPointClick(dataPoint, pointIndex);
        }
      },
      [data, onPointClick]
    );

    // 处理悬停事件 - 触摸优化，添加防抖
    const handleHover = useCallback(
      (event: ChartEvent, elements: ActiveElement[]) => {
        const chart = chartRef.current;
        if (!chart) return;

        // 移动端不处理悬停事件，避免性能问题
        if (isMobile) return;

        if (elements.length > 0) {
          // 只有在需要时才更改光标样式
          if (chart.canvas.style.cursor !== 'pointer') {
            chart.canvas.style.cursor = 'pointer';
          }
          if (onHover) {
            const pointIndex = elements[0].index;
            const dataPoint = data[pointIndex];
            // 使用 requestAnimationFrame 优化性能
            requestAnimationFrame(() => {
              onHover(dataPoint);
            });
          }
        } else {
          // 只有在需要时才更改光标样式
          if (chart.canvas.style.cursor !== 'default') {
            chart.canvas.style.cursor = 'default';
          }
          if (onHover) {
            // 使用 requestAnimationFrame 优化性能
            requestAnimationFrame(() => {
              onHover(null);
            });
          }
        }
      },
      [data, onHover, isMobile] // 添加 isMobile 依赖
    );

    // 处理加载状态 - 响应式
    if (isLoading) {
      return (
        <div className='flex items-center justify-center h-48 sm:h-64'>
          <div className='text-gray-500 text-sm sm:text-base'>
            数据加载中...
          </div>
        </div>
      );
    }

    // 处理错误状态 - 响应式
    if (error) {
      return (
        <div className='flex items-center justify-center h-48 sm:h-64'>
          <div className='text-red-500 text-sm sm:text-base text-center px-4'>
            {error}
          </div>
        </div>
      );
    }

    // 处理空数据状态 - 响应式
    if (!data || data.length === 0) {
      return (
        <div className='flex items-center justify-center h-48 sm:h-64'>
          <div className='text-gray-500 text-center'>
            <div className='text-2xl sm:text-4xl mb-2'>📊</div>
            <div className='text-sm sm:text-base'>暂无数据</div>
            <div className='text-xs sm:text-sm text-gray-400 mt-1'>
              开始使用番茄时钟来生成数据
            </div>
          </div>
        </div>
      );
    }

    // 计算总值和百分比
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    const dataWithPercentage = data.map(item => ({
      ...item,
      percentage:
        totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0,
    }));

    // 转换数据格式为 Chart.js 格式
    const chartData = {
      labels: data.map(item => {
        // 移动端使用更短的标签
        if (isMobile && item.label.length > 8) {
          return item.label.slice(0, 6) + '..';
        }
        return item.label;
      }),
      datasets: [
        {
          data: data.map(item => item.value),
          backgroundColor: colors.slice(0, data.length),
          borderColor: colors.slice(0, data.length),
          borderWidth: isMobile ? 1 : 2,
          hoverBackgroundColor: colors.slice(0, data.length),
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: isMobile ? 2 : 3,
        },
      ],
    };

    // 移动端优化的 Chart.js 配置
    const chartOptions: ChartJSOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: window.devicePixelRatio || 1,
      layout: {
        padding: {
          top: isMobile ? 10 : 20,
          right: isMobile ? 10 : 20,
          bottom: isMobile ? 10 : 20,
          left: isMobile ? 10 : 20,
        },
      },
      interaction: {
        intersect: false,
        mode: 'point',
        // 移动端增加触摸区域
        includeInvisible: isMobile,
      },
      onHover: handleHover,
      onClick: handlePointClick,
      cutout: typeof cutout === 'number' ? `${cutout * 100}%` : cutout,
      plugins: {
        legend: {
          display: options.showLegend ?? true,
          position: isMobile ? 'bottom' : 'right', // 移动端图例在底部
          labels: {
            usePointStyle: true,
            padding: isMobile ? 8 : 20,
            font: {
              size: isMobile ? 10 : 12,
            },
            generateLabels: function (chart) {
              const data = chart.data;
              if (data.labels && data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const dataset = data.datasets[0];
                  const value = dataset.data[i] as number;
                  const percentage = dataWithPercentage[i]?.percentage || 0;

                  return {
                    text: showPercentage
                      ? `${label} (${percentage}%)`
                      : `${label} (${value})`,
                    fillStyle: Array.isArray(dataset.backgroundColor)
                      ? dataset.backgroundColor[i]
                      : dataset.backgroundColor || '#3b82f6',
                    strokeStyle: Array.isArray(dataset.borderColor)
                      ? dataset.borderColor[i]
                      : dataset.borderColor || '#3b82f6',
                    lineWidth: 2,
                    hidden: false,
                    index: i,
                  };
                });
              }
              return [];
            },
          },
        },
        tooltip: {
          enabled: true,
          position: 'nearest',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#ffffff',
          borderWidth: 1,
          cornerRadius: 6,
          displayColors: true,
          padding: isMobile ? 8 : 12,
          titleFont: {
            size: isMobile ? 12 : 14,
            weight: 'bold',
          },
          bodyFont: {
            size: isMobile ? 11 : 13,
          },
          callbacks: {
            title: context => {
              const dataPoint = data[context[0].dataIndex];
              return dataPoint.label;
            },
            label: context => {
              const dataPoint = data[context.dataIndex];
              const percentage =
                dataWithPercentage[context.dataIndex]?.percentage || 0;
              const lines = [
                `数量: ${dataPoint.value}`,
                `占比: ${percentage}%`,
              ];

              if (dataPoint.meta?.description) {
                lines.push(`说明: ${dataPoint.meta.description}`);
              }

              return lines;
            },
          },
          // 移动端触摸优化
          filter: tooltipItem => tooltipItem.datasetIndex === 0,
        },
        title: {
          display: !!options.title && !isMobile, // 移动端隐藏标题以节省空间
          text: options.title,
          font: {
            size: isMobile ? 14 : 16,
            weight: 'bold',
          },
          padding: {
            bottom: isMobile ? 10 : 20,
          },
        },
      },
      // 移动端性能优化
      animation: {
        duration: isMobile ? 500 : 1000, // 移动端减少动画时间
        animateRotate: true,
        animateScale: false,
      },
      // 移动端手势支持
      events: isMobile
        ? ['touchstart', 'touchmove', 'touchend', 'click']
        : [
            'mousemove',
            'mouseout',
            'click',
            'touchstart',
            'touchmove',
            'touchend',
          ],
      ...options,
    };

    return (
      <div className={`w-full ${className}`}>
        {/* 移动端顶部标题 */}
        {isMobile && options.title && (
          <div className='text-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {options.title}
            </h3>
          </div>
        )}

        <div className='h-48 sm:h-64 md:h-80'>
          <Doughnut
            ref={chart => {
              if (chart) {
                chartRef.current = chart;
              }
              if (ref && chart) {
                if (typeof ref === 'function') {
                  ref(chart);
                } else {
                  ref.current = chart;
                }
              }
            }}
            data={chartData}
            options={chartOptions}
          />
        </div>

        {/* 移动端数据统计信息 */}
        {isMobile && data.length > 0 && (
          <div className='mt-4 space-y-2'>
            <div className='text-center text-xs text-gray-500'>
              <p>点击扇形区域查看详情</p>
            </div>

            {/* 移动端简化数据展示 */}
            <div className='grid grid-cols-2 gap-2 text-xs'>
              {dataWithPercentage.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 p-2 bg-gray-50 rounded'
                >
                  <div
                    className='w-3 h-3 rounded-full flex-shrink-0'
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <div className='flex-1 min-w-0'>
                    <div className='truncate font-medium'>{item.label}</div>
                    <div className='text-gray-500'>{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>

            {data.length > 4 && (
              <div className='text-center text-xs text-gray-400'>
                还有 {data.length - 4} 个项目...
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

DoughnutChart.displayName = 'DoughnutChart';

export default DoughnutChart;
