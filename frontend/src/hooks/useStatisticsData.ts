import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  StatisticsData,
  TimePeriod,
  DailyFocusData,
  WeeklyTrendData,
  MonthlyStatsData,
  HourlyFocusData,
} from '../types/statistics';

/**
 * 统计数据管理 Hook
 * 提供数据获取、缓存和状态管理功能
 */
export const useStatisticsData = (initialPeriod: TimePeriod = 'today') => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimePeriod>(initialPeriod);

  /**
   * 生成模拟数据
   * 在后端 API 完成前使用模拟数据进行开发
   */
  const generateMockData = useCallback(
    (_timePeriod: TimePeriod): StatisticsData => {
      const now = new Date();
      const mockData: StatisticsData = {
        dailyFocus: [],
        weeklyTrend: [],
        monthlyStats: [],
        taskCompletion: {
          totalTasks: 150,
          completedTasks: 120,
          inProgressTasks: 20,
          cancelledTasks: 10,
          completionRate: 80,
        },
        hourlyFocus: [],
      };

      // 生成每日专注数据
      const generateDailyData = (days: number): DailyFocusData[] => {
        return Array.from({ length: days }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - (days - 1 - i));

          return {
            date: date.toISOString().split('T')[0],
            focusMinutes: Math.floor(Math.random() * 360) + 60, // 60-420分钟
            completedPomodoros: Math.floor(Math.random() * 12) + 2, // 2-14个番茄钟
            completedTasks: Math.floor(Math.random() * 8) + 1, // 1-9个任务
          };
        });
      };

      // 生成周趋势数据
      const generateWeeklyData = (weeks: number): WeeklyTrendData[] => {
        return Array.from({ length: weeks }, (_, i) => {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (weeks - 1 - i) * 7);
          const year = weekStart.getFullYear();
          const week =
            Math.floor(
              (weekStart.getTime() - new Date(year, 0, 1).getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            ) + 1;

          const totalFocusMinutes = Math.floor(Math.random() * 2000) + 800; // 800-2800分钟

          return {
            week: `${year}-W${week.toString().padStart(2, '0')}`,
            totalFocusMinutes,
            totalPomodoros: Math.floor(totalFocusMinutes / 25), // 假设每个番茄钟25分钟
            totalTasks: Math.floor(Math.random() * 30) + 15, // 15-45个任务
            avgDailyFocus: Math.floor(totalFocusMinutes / 7),
          };
        });
      };

      // 生成月度统计数据
      const generateMonthlyData = (months: number): MonthlyStatsData[] => {
        return Array.from({ length: months }, (_, i) => {
          const monthDate = new Date(now);
          monthDate.setMonth(monthDate.getMonth() - (months - 1 - i));

          const totalFocusMinutes = Math.floor(Math.random() * 8000) + 3000; // 3000-11000分钟

          return {
            month: `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`,
            totalFocusMinutes,
            totalPomodoros: Math.floor(totalFocusMinutes / 25),
            totalTasks: Math.floor(Math.random() * 100) + 50, // 50-150个任务
            maxDailyFocus: Math.floor(Math.random() * 300) + 200, // 200-500分钟
            avgDailyFocus: Math.floor(totalFocusMinutes / 30),
          };
        });
      };

      // 生成时间分布数据
      const generateHourlyData = (): HourlyFocusData[] => {
        return Array.from({ length: 24 }, (_, hour) => {
          // 模拟工作时间的专注分布
          let focusMinutes = 0;
          if (hour >= 8 && hour <= 18) {
            focusMinutes = Math.floor(Math.random() * 60) + 10; // 工作时间10-70分钟
          } else if (hour >= 19 && hour <= 22) {
            focusMinutes = Math.floor(Math.random() * 40); // 晚上0-40分钟
          }

          return {
            hour,
            focusMinutes,
            pomodoroCount: Math.floor(focusMinutes / 25),
          };
        });
      };

      // 根据时间维度生成相应数据 - 总是生成全量数据，让过滤器处理
      mockData.dailyFocus = generateDailyData(30); // 总是生成30天数据
      mockData.weeklyTrend = generateWeeklyData(4); // 最近4周
      mockData.monthlyStats = generateMonthlyData(6); // 最近6个月
      mockData.hourlyFocus = generateHourlyData();

      return mockData;
    },
    []
  );

  /**
   * 获取统计数据
   * 目前使用模拟数据，后续替换为 API 调用
   */
  const fetchData = useCallback(
    async (timePeriod: TimePeriod) => {
      setLoading(true);
      setError(null);

      try {
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        // TODO: 替换为真实的 API 调用
        // const response = await fetch(`/api/statistics?period=${timePeriod}`);
        // const data = await response.json();

        const mockData = generateMockData(timePeriod);
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取统计数据失败');
      } finally {
        setLoading(false);
      }
    },
    [generateMockData]
  );

  /**
   * 刷新数据
   */
  const refetch = useCallback(() => {
    fetchData(period);
  }, [fetchData, period]);

  /**
   * 设置时间维度并自动获取数据
   */
  const handleSetPeriod = useCallback(
    (newPeriod: TimePeriod) => {
      setPeriod(newPeriod);
      fetchData(newPeriod);
    },
    [fetchData]
  );

  /**
   * 过滤和聚合数据的计算属性
   */
  const filteredData = useMemo(() => {
    if (!data) return null;

    // 根据时间维度返回相应的数据
    const now = new Date();

    switch (period) {
      case 'today': {
        const todayStr = now.toISOString().split('T')[0];
        return {
          ...data,
          dailyFocus: data.dailyFocus.filter(item => item.date === todayStr),
        };
      }

      case 'week': {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        return {
          ...data,
          dailyFocus: data.dailyFocus.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= weekStart && itemDate <= now;
          }),
        };
      }

      case 'month': {
        return {
          ...data,
          dailyFocus: data.dailyFocus.filter(item => {
            const itemDate = new Date(item.date);
            return (
              itemDate.getMonth() === now.getMonth() &&
              itemDate.getFullYear() === now.getFullYear()
            );
          }),
        };
      }

      default:
        return data;
    }
  }, [data, period]);

  // 初始化时获取数据
  useEffect(() => {
    fetchData(period);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data: filteredData,
    isLoading: loading,
    error,
    refetch,
    period,
    setPeriod: handleSetPeriod,
  };
};
