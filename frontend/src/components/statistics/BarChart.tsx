'use client';

import React, {
  useRef,
  useCallback,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions as ChartJSOptions,
  ActiveElement,
  ChartEvent,
} from 'chart.js';
import { BarChartProps } from '../../types/statistics';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * 柱状图组件 - 移动端优化版本
 * 用于显示分类数据的对比
 * 针对触摸设备和小屏幕进行了优化
 */
const BarChart = forwardRef<ChartJS, BarChartProps>(
  (
    {
      data,
      options = {},
      isLoading = false,
      error = null,
      className = '',
      barColor = '#3b82f6',
      orientation = 'vertical',
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

    // 转换数据格式为 Chart.js 格式
    const chartData = {
      labels: data.map(item => {
        // 移动端使用更短的标签
        if (isMobile && item.label.length > 6) {
          return item.label.slice(0, 4) + '..';
        }
        return item.label;
      }),
      datasets: [
        {
          label: '专注时间',
          data: data.map(item => item.value),
          backgroundColor: barColor,
          borderColor: barColor,
          borderWidth: 0,
          borderRadius: isMobile ? 4 : 6,
          borderSkipped: false,
          hoverBackgroundColor: barColor,
          hoverBorderColor: barColor,
          hoverBorderWidth: 0,
        },
      ],
    };

    // 移动端优化的 Chart.js 配置
    const chartOptions: ChartJSOptions<'bar'> = {
      indexAxis: orientation === 'horizontal' ? 'y' : 'x',
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
        mode: 'index',
        // 移动端增加触摸区域
        includeInvisible: isMobile,
      },
      onHover: handleHover,
      onClick: handlePointClick,
      plugins: {
        legend: {
          display: options.showLegend ?? !isMobile, // 移动端默认隐藏图例
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: isMobile ? 10 : 20,
            font: {
              size: isMobile ? 10 : 12,
            },
          },
        },
        tooltip: {
          enabled: true,
          position: 'nearest',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: barColor,
          borderWidth: 1,
          cornerRadius: 6,
          displayColors: false,
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
              const lines = [`专注时间: ${dataPoint.value} 分钟`];

              if (dataPoint.meta?.pomodoros) {
                lines.push(`番茄钟: ${dataPoint.meta.pomodoros} 个`);
              }
              if (dataPoint.meta?.tasks) {
                lines.push(`完成任务: ${dataPoint.meta.tasks} 个`);
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
      scales: {
        x: {
          display: true,
          grid: {
            display: options.showGrid ?? true,
            color: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1,
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12,
            },
            maxTicksLimit: isMobile ? 5 : 8, // 移动端减少标签数量
            maxRotation: isMobile ? 45 : 0, // 移动端允许旋转标签
          },
          border: {
            display: false,
          },
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            display: options.showGrid ?? true,
            color: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1,
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12,
            },
            maxTicksLimit: isMobile ? 4 : 6, // 移动端减少标签数量
            callback: function (value) {
              return value + '分';
            },
          },
          border: {
            display: false,
          },
        },
      },
      // 移动端性能优化
      animation: {
        duration: isMobile ? 500 : 1000, // 移动端减少动画时间
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
        <div className='h-48 sm:h-64 md:h-80'>
          <Bar
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

        {/* 移动端下方的数据说明 */}
        {isMobile && data.length > 0 && (
          <div className='mt-3 text-xs text-gray-500 text-center'>
            <p>点击柱状图查看详情 · 左右滑动查看更多</p>
          </div>
        )}
      </div>
    );
  }
);

BarChart.displayName = 'BarChart';

export default BarChart;
