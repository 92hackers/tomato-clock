'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useStatisticsData } from '@/hooks/useStatisticsData';
import {
  PeriodSelector,
  StatCard,
  LineChart,
  BarChart,
  DoughnutChart,
} from '@/components/statistics';
import { ChartDataPoint } from '@/types/statistics';

/**
 * 统计页面组件 - 移动端优化版本
 * 展示用户的专注数据统计和可视化图表
 * 针对移动端和响应式设计进行了全面优化
 */
const StatisticsPage: React.FC = () => {
  const { data, isLoading, error, period, setPeriod } = useStatisticsData();
  const [isMobile, setIsMobile] = useState(false);

  // 状态管理
  const [selectedDataPoint, setSelectedDataPoint] = useState<{
    type: 'focus' | 'task' | 'hourly';
    dataPoint: ChartDataPoint;
    index: number;
  } | null>(null);
  const [hoveredDataPoint, setHoveredDataPoint] =
    useState<ChartDataPoint | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 转换数据为图表格式 - 使用 useMemo 优化
  const convertToChartData = useCallback(
    (dailyData: any[]): ChartDataPoint[] => {
      return dailyData.map(item => ({
        label: new Date(item.date).toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        }),
        value: item.focusMinutes,
        meta: {
          pomodoros: item.completedPomodoros,
          tasks: item.completedTasks,
        },
      }));
    },
    []
  );

  // 获取统计卡片数据 - 使用 useMemo 优化
  const getStatCardData = useMemo(() => {
    if (!data) return [];

    const dailyFocus = data.dailyFocus;
    const totalFocusMinutes = dailyFocus.reduce(
      (sum, item) => sum + item.focusMinutes,
      0
    );
    const totalPomodoros = dailyFocus.reduce(
      (sum, item) => sum + item.completedPomodoros,
      0
    );
    const totalTasks = dailyFocus.reduce(
      (sum, item) => sum + item.completedTasks,
      0
    );
    const completionRate = data.taskCompletion.completionRate;

    const periodLabels = {
      today: '今日',
      week: '本周',
      month: '本月',
    };

    return [
      {
        title: `${periodLabels[period]}专注时间`,
        value: totalFocusMinutes,
        unit: '分钟',
        icon: 'clock',
        trend: {
          value: 15,
          direction: 'up' as const,
          label: '比上期',
        },
      },
      {
        title: `${periodLabels[period]}番茄钟`,
        value: totalPomodoros,
        unit: '个',
        icon: 'target',
        trend: {
          value: 8,
          direction: 'up' as const,
          label: '比上期',
        },
      },
      {
        title: `${periodLabels[period]}完成任务`,
        value: totalTasks,
        unit: '个',
        icon: 'task',
        trend: {
          value: 2,
          direction: 'down' as const,
          label: '比上期',
        },
      },
      {
        title: '任务完成率',
        value: completionRate,
        unit: '%',
        icon: 'chart',
        trend: {
          value: 5,
          direction: 'up' as const,
          label: '比上期',
        },
      },
    ];
  }, [data, period]);

  // 获取任务完成率数据（环形图） - 使用 useMemo 优化
  const getTaskCompletionData = useMemo((): ChartDataPoint[] => {
    if (!data) return [];

    const { completedTasks, inProgressTasks, cancelledTasks } =
      data.taskCompletion;

    return [
      { label: '已完成', value: completedTasks },
      { label: '进行中', value: inProgressTasks },
      { label: '已取消', value: cancelledTasks },
    ];
  }, [data]);

  // 处理图表点击事件 - 触摸优化，使用 useCallback
  const handleChartClick = useCallback(
    (type: 'focus' | 'task' | 'hourly') =>
      (dataPoint: ChartDataPoint, pointIndex: number) => {
        setSelectedDataPoint({ type, dataPoint, index: pointIndex });
        setShowDetailModal(true);
      },
    []
  );

  // 处理图表悬停事件 - 移动端友好，添加防抖和状态比较
  const handleChartHover = useCallback(
    (dataPoint: ChartDataPoint | null) => {
      // 移动端不显示悬停信息
      if (isMobile) return;

      // 防止无意义的状态更新 - 检查是否真的发生了变化
      setHoveredDataPoint(prev => {
        // 如果新旧数据相同，不更新状态
        if (prev === dataPoint) return prev;
        if (
          prev &&
          dataPoint &&
          prev.label === dataPoint.label &&
          prev.value === dataPoint.value
        ) {
          return prev;
        }
        return dataPoint;
      });
    },
    [isMobile]
  );

  // 关闭详情模态框 - 使用 useCallback 优化
  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedDataPoint(null);
  }, []);

  // 获取详情模态框内容
  const getDetailModalContent = () => {
    if (!selectedDataPoint) return null;

    const { type, dataPoint } = selectedDataPoint;

    switch (type) {
      case 'focus':
        return (
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              专注时间详情
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div className='bg-blue-50 p-3 sm:p-4 rounded-lg'>
                <div className='text-xs sm:text-sm text-blue-600'>日期</div>
                <div className='text-base sm:text-lg font-bold text-blue-900'>
                  {dataPoint.label}
                </div>
              </div>
              <div className='bg-green-50 p-3 sm:p-4 rounded-lg'>
                <div className='text-xs sm:text-sm text-green-600'>
                  专注时长
                </div>
                <div className='text-base sm:text-lg font-bold text-green-900'>
                  {dataPoint.value} 分钟
                </div>
              </div>
              {dataPoint.meta?.pomodoros && (
                <div className='bg-orange-50 p-3 sm:p-4 rounded-lg'>
                  <div className='text-xs sm:text-sm text-orange-600'>
                    番茄钟
                  </div>
                  <div className='text-base sm:text-lg font-bold text-orange-900'>
                    {dataPoint.meta.pomodoros} 个
                  </div>
                </div>
              )}
              {dataPoint.meta?.tasks && (
                <div className='bg-purple-50 p-3 sm:p-4 rounded-lg'>
                  <div className='text-xs sm:text-sm text-purple-600'>
                    完成任务
                  </div>
                  <div className='text-base sm:text-lg font-bold text-purple-900'>
                    {dataPoint.meta.tasks} 个
                  </div>
                </div>
              )}
            </div>
            {dataPoint.value > 0 && (
              <div className='text-xs sm:text-sm text-gray-600'>
                <p>🎉 这天的专注表现很棒！继续保持这样的节奏。</p>
              </div>
            )}
          </div>
        );

      case 'task':
        return (
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              任务状态详情
            </h3>
            <div className='bg-gray-50 p-3 sm:p-4 rounded-lg'>
              <div className='text-xs sm:text-sm text-gray-600'>状态类型</div>
              <div className='text-base sm:text-lg font-bold text-gray-900'>
                {dataPoint.label}
              </div>
              <div className='text-xs sm:text-sm text-gray-600 mt-2'>
                任务数量: {dataPoint.value} 个
              </div>
            </div>
            {data && (
              <div className='text-xs sm:text-sm text-gray-600 space-y-2'>
                <p>📊 任务分布分析：</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                  <li>已完成：{data.taskCompletion.completedTasks} 个</li>
                  <li>进行中：{data.taskCompletion.inProgressTasks} 个</li>
                  <li>已取消：{data.taskCompletion.cancelledTasks} 个</li>
                  <li>完成率：{data.taskCompletion.completionRate}%</li>
                </ul>
              </div>
            )}
          </div>
        );

      case 'hourly':
        return (
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              时段专注详情
            </h3>
            <div className='bg-blue-50 p-3 sm:p-4 rounded-lg'>
              <div className='text-xs sm:text-sm text-blue-600'>时间段</div>
              <div className='text-base sm:text-lg font-bold text-blue-900'>
                {dataPoint.label}
              </div>
              <div className='text-xs sm:text-sm text-blue-600 mt-2'>
                专注时长: {dataPoint.value} 分钟
              </div>
            </div>
            {dataPoint.meta?.pomodoros && (
              <div className='text-xs sm:text-sm text-gray-600'>
                <p>🍅 这个时段完成了 {dataPoint.meta.pomodoros} 个番茄钟</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // 缓存转换后的图表数据
  const chartData = useMemo(() => {
    if (!data?.dailyFocus) return [];
    return convertToChartData(data.dailyFocus);
  }, [data?.dailyFocus, convertToChartData]);

  // 缓存统计卡片数据
  const statCards = useMemo(() => getStatCardData, [getStatCardData]);

  // 缓存任务完成数据
  const taskCompletionData = useMemo(
    () => getTaskCompletionData,
    [getTaskCompletionData]
  );

  // 处理加载状态 - 响应式
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 text-sm sm:text-base'>数据加载中...</p>
        </div>
      </div>
    );
  }

  // 处理错误状态 - 响应式
  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='text-center'>
          <div className='text-red-400 text-2xl sm:text-4xl mb-4'>❌</div>
          <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2'>
            加载失败
          </h2>
          <p className='text-gray-600 text-sm sm:text-base'>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='text-center'>
          <div className='text-gray-400 text-3xl sm:text-5xl mb-4'>📈</div>
          <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2'>
            暂无数据
          </h2>
          <p className='text-gray-600 text-sm sm:text-base'>
            开始使用番茄时钟来生成统计数据吧！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-4 sm:py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* 页面标题和时间选择器 - 响应式布局 */}
        <div className='flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
              数据统计
            </h1>
            <p className='mt-1 sm:mt-2 text-sm sm:text-base text-gray-600'>
              查看你的专注数据和趋势分析
            </p>
          </div>
          <div className='flex-shrink-0'>
            <PeriodSelector
              period={period}
              onChange={setPeriod}
              className='shadow-sm w-full sm:w-auto'
            />
          </div>
        </div>

        {/* 统计卡片 - 响应式网格 */}
        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8'>
          {statCards.map((card, index) => (
            <StatCard
              key={card.title}
              {...card}
              className='transform transition-transform active:scale-95 sm:hover:scale-105'
            />
          ))}
        </div>

        {/* 图表区域 - 响应式布局 */}
        <div className='space-y-6 sm:space-y-8 mb-6 sm:mb-8'>
          {/* 专注时间趋势 */}
          <div className='bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-0'>
                专注时间趋势
              </h3>
              {!isMobile && hoveredDataPoint && (
                <div className='text-sm text-gray-500'>
                  悬停：{hoveredDataPoint.label} - {hoveredDataPoint.value}分钟
                </div>
              )}
            </div>
            {chartData.length > 0 ? (
              <LineChart
                data={chartData}
                options={{
                  title: isMobile ? undefined : '每日专注时间',
                  showLegend: false,
                  showGrid: true,
                  animate: true,
                  responsive: true,
                }}
                onPointClick={handleChartClick('focus')}
                onHover={handleChartHover}
                className='w-full'
              />
            ) : (
              <div className='flex items-center justify-center h-48 sm:h-64 text-gray-500'>
                <div className='text-center'>
                  <div className='text-2xl sm:text-4xl mb-2'>📊</div>
                  <p className='text-sm sm:text-base'>暂无趋势数据</p>
                  <p className='text-xs sm:text-sm mt-1'>
                    开始使用番茄时钟来生成数据
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 响应式双列布局 */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
            {/* 任务完成情况 */}
            <div className='bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-4'>
                任务完成情况
              </h3>
              <DoughnutChart
                data={taskCompletionData}
                options={{
                  title: isMobile ? undefined : '任务状态分布',
                  showLegend: true,
                  animate: true,
                  responsive: true,
                }}
                cutout={0.6}
                showPercentage={true}
                onPointClick={handleChartClick('task')}
                onHover={handleChartHover}
                className='w-full'
              />
            </div>

            {/* 专注时间分布（如果是今日视图） */}
            {period === 'today' &&
              data.hourlyFocus &&
              data.hourlyFocus.length > 0 && (
                <div className='bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow'>
                  <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-4'>
                    今日专注时间分布
                  </h3>
                  <BarChart
                    data={data.hourlyFocus.map(item => ({
                      label: `${item.hour}:00`,
                      value: item.focusMinutes,
                      meta: { pomodoros: item.pomodoroCount },
                    }))}
                    options={{
                      title: isMobile ? undefined : '小时专注分布',
                      showLegend: false,
                      showGrid: true,
                      animate: true,
                      responsive: true,
                    }}
                    orientation='vertical'
                    onPointClick={handleChartClick('hourly')}
                    onHover={handleChartHover}
                    className='w-full'
                  />
                </div>
              )}
          </div>
        </div>

        {/* 数据洞察卡片 - 响应式设计 */}
        {data && (
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 shadow-sm'>
            <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-4'>
              📈 数据洞察
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
              <div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm'>
                <div className='text-xs sm:text-sm text-gray-600'>
                  最佳专注时段
                </div>
                <div className='text-base sm:text-lg font-bold text-blue-600'>
                  {data.hourlyFocus && data.hourlyFocus.length > 0
                    ? `${
                        data.hourlyFocus.reduce((max, current) =>
                          current.focusMinutes > max.focusMinutes
                            ? current
                            : max
                        ).hour
                      }:00`
                    : '暂无数据'}
                </div>
              </div>
              <div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm'>
                <div className='text-xs sm:text-sm text-gray-600'>
                  平均专注时长
                </div>
                <div className='text-base sm:text-lg font-bold text-green-600'>
                  {data.dailyFocus.length > 0
                    ? Math.round(
                        data.dailyFocus.reduce(
                          (sum, item) => sum + item.focusMinutes,
                          0
                        ) / data.dailyFocus.length
                      )
                    : 0}{' '}
                  分钟/天
                </div>
              </div>
              <div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:col-span-2 lg:col-span-1'>
                <div className='text-xs sm:text-sm text-gray-600'>效率指数</div>
                <div className='text-base sm:text-lg font-bold text-purple-600'>
                  {data.taskCompletion.completionRate}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 详情模态框 - 移动端优化 */}
      {showDetailModal && selectedDataPoint && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
            {/* 模态框头部 */}
            <div className='flex justify-between items-center p-4 sm:p-6 border-b border-gray-200'>
              <h2 className='text-lg sm:text-xl font-bold text-gray-900'>
                数据详情
              </h2>
              <button
                onClick={closeDetailModal}
                className='text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1 touch-manipulation'
                aria-label='关闭'
              >
                <svg
                  className='w-5 h-5 sm:w-6 sm:h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* 模态框内容 */}
            <div className='p-4 sm:p-6'>{getDetailModalContent()}</div>

            {/* 模态框底部 */}
            <div className='p-4 sm:p-6 border-t border-gray-200'>
              <button
                onClick={closeDetailModal}
                className='w-full px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium touch-manipulation'
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;
