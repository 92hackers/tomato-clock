/**
 * 图表工具函数
 * 提供数据转换、格式化和辅助功能
 */

import {
  ChartDataPoint,
  StatisticsData,
  TimePeriod,
} from '../types/statistics';

/**
 * 将统计数据转换为图表数据点格式
 */
export const convertStatisticsToChartData = {
  /**
   * 将每日专注数据转换为折线图数据
   */
  dailyFocusToLine: (
    dailyData: StatisticsData['dailyFocus']
  ): ChartDataPoint[] => {
    return dailyData.map(item => ({
      label: formatDateLabel(item.date),
      value: item.focusMinutes,
      meta: {
        pomodoros: item.completedPomodoros,
        tasks: item.completedTasks,
        date: item.date,
      },
    }));
  },

  /**
   * 将任务完成数据转换为环形图数据
   */
  taskCompletionToDoughnut: (
    taskData: StatisticsData['taskCompletion']
  ): ChartDataPoint[] => {
    return [
      {
        label: '已完成',
        value: taskData.completedTasks,
        meta: {
          percentage: (
            (taskData.completedTasks / taskData.totalTasks) *
            100
          ).toFixed(1),
        },
      },
      {
        label: '进行中',
        value: taskData.inProgressTasks,
        meta: {
          percentage: (
            (taskData.inProgressTasks / taskData.totalTasks) *
            100
          ).toFixed(1),
        },
      },
      {
        label: '已取消',
        value: taskData.cancelledTasks,
        meta: {
          percentage: (
            (taskData.cancelledTasks / taskData.totalTasks) *
            100
          ).toFixed(1),
        },
      },
    ].filter(item => item.value > 0); // 过滤掉值为0的项
  },

  /**
   * 将时间分布数据转换为柱状图数据
   */
  hourlyFocusToBar: (
    hourlyData: StatisticsData['hourlyFocus']
  ): ChartDataPoint[] => {
    return hourlyData.map(item => ({
      label: `${item.hour}:00`,
      value: item.focusMinutes,
      meta: {
        hour: item.hour,
        pomodoroCount: item.pomodoroCount,
      },
    }));
  },

  /**
   * 将周趋势数据转换为折线图数据
   */
  weeklyTrendToLine: (
    weeklyData: StatisticsData['weeklyTrend']
  ): ChartDataPoint[] => {
    return weeklyData.map(item => ({
      label: formatWeekLabel(item.week),
      value: item.totalFocusMinutes,
      meta: {
        pomodoros: item.totalPomodoros,
        tasks: item.totalTasks,
        avgDaily: item.avgDailyFocus,
        week: item.week,
      },
    }));
  },

  /**
   * 将月度数据转换为柱状图数据
   */
  monthlyStatsToBar: (
    monthlyData: StatisticsData['monthlyStats']
  ): ChartDataPoint[] => {
    return monthlyData.map(item => ({
      label: formatMonthLabel(item.month),
      value: item.totalFocusMinutes,
      meta: {
        pomodoros: item.totalPomodoros,
        tasks: item.totalTasks,
        maxDaily: item.maxDailyFocus,
        avgDaily: item.avgDailyFocus,
        month: item.month,
      },
    }));
  },
};

/**
 * 日期格式化函数
 */
export const formatDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.floor(
    (today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays === 2) return '前天';
  if (diffDays < 7) return `${diffDays}天前`;

  // 使用 MM/DD 格式
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * 周标签格式化
 */
export const formatWeekLabel = (weekString: string): string => {
  const [year, week] = weekString.split('-W');
  return `第${week}周`;
};

/**
 * 月份标签格式化
 */
export const formatMonthLabel = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  const monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];
  return monthNames[parseInt(month) - 1] || monthString;
};

/**
 * 时间转换工具
 */
export const timeUtils = {
  /**
   * 分钟转换为小时分钟格式
   */
  minutesToHoursMinutes: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}小时`;
    }
    return `${hours}小时${remainingMinutes}分钟`;
  },

  /**
   * 分钟转换为小时（保留小数）
   */
  minutesToHours: (minutes: number): string => {
    return (minutes / 60).toFixed(1) + '小时';
  },

  /**
   * 格式化专注时长显示
   */
  formatFocusTime: (minutes: number): string => {
    if (minutes === 0) return '0分钟';
    if (minutes < 60) return `${minutes}分钟`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}小时`;
    }

    return `${hours}小时${remainingMinutes}分钟`;
  },
};

/**
 * 数据统计工具
 */
export const statsUtils = {
  /**
   * 计算数组的平均值
   */
  average: (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  },

  /**
   * 计算数组的最大值
   */
  max: (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    return Math.max(...numbers);
  },

  /**
   * 计算数组的最小值
   */
  min: (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    return Math.min(...numbers);
  },

  /**
   * 计算数组的总和
   */
  sum: (numbers: number[]): number => {
    return numbers.reduce((sum, num) => sum + num, 0);
  },

  /**
   * 计算增长率
   */
  growthRate: (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  /**
   * 格式化百分比
   */
  formatPercentage: (value: number): string => {
    return value.toFixed(1) + '%';
  },

  /**
   * 格式化增长率显示
   */
  formatGrowthRate: (
    rate: number
  ): { text: string; direction: 'up' | 'down' | 'same' } => {
    if (Math.abs(rate) < 0.1) {
      return { text: '持平', direction: 'same' };
    }

    const absRate = Math.abs(rate);
    const text = `${absRate.toFixed(1)}%`;

    return {
      text: rate > 0 ? `+${text}` : `-${text}`,
      direction: rate > 0 ? 'up' : 'down',
    };
  },
};

/**
 * 颜色工具
 */
export const colorUtils = {
  /**
   * 根据数值生成颜色（绿色表示好，红色表示差）
   */
  getValueColor: (value: number, max: number): string => {
    const ratio = value / max;
    if (ratio >= 0.8) return '#10b981'; // 绿色
    if (ratio >= 0.6) return '#f59e0b'; // 黄色
    if (ratio >= 0.4) return '#f97316'; // 橙色
    return '#ef4444'; // 红色
  },

  /**
   * 根据趋势方向获取颜色
   */
  getTrendColor: (direction: 'up' | 'down' | 'same'): string => {
    switch (direction) {
      case 'up':
        return '#10b981'; // 绿色
      case 'down':
        return '#ef4444'; // 红色
      case 'same':
        return '#6b7280'; // 灰色
      default:
        return '#6b7280';
    }
  },

  /**
   * 生成渐变色数组
   */
  generateGradientColors: (
    startColor: string,
    endColor: string,
    steps: number
  ): string[] => {
    // 简单的颜色插值实现
    // 这里使用预定义的颜色数组作为示例
    const colors = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#06b6d4',
      '#84cc16',
      '#f97316',
    ];

    return Array.from(
      { length: steps },
      (_, index) => colors[index % colors.length]
    );
  },
};

/**
 * 数据过滤工具
 */
export const filterUtils = {
  /**
   * 根据时间维度过滤数据
   */
  filterByTimePeriod: (
    data: any[],
    period: TimePeriod,
    dateField: string = 'date'
  ): any[] => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return data;
    }

    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate;
    });
  },

  /**
   * 获取最近N天的数据
   */
  getRecentDays: (
    data: any[],
    days: number,
    dateField: string = 'date'
  ): any[] => {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate;
    });
  },
};

/**
 * Mock 数据生成器（用于开发和测试）
 */
export const mockDataGenerator = {
  /**
   * 生成模拟的每日专注数据
   */
  generateDailyFocusData: (days: number = 7): ChartDataPoint[] => {
    return Array.from({ length: days }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - index));

      return {
        label: formatDateLabel(date.toISOString().split('T')[0]),
        value: Math.floor(Math.random() * 300) + 60, // 60-360分钟
        meta: {
          pomodoros: Math.floor(Math.random() * 12) + 2,
          tasks: Math.floor(Math.random() * 8) + 1,
        },
      };
    });
  },

  /**
   * 生成模拟的任务分布数据
   */
  generateTaskDistributionData: (): ChartDataPoint[] => {
    const completed = Math.floor(Math.random() * 20) + 5;
    const inProgress = Math.floor(Math.random() * 8) + 1;
    const cancelled = Math.floor(Math.random() * 3);

    return [
      { label: '已完成', value: completed },
      { label: '进行中', value: inProgress },
      { label: '已取消', value: cancelled },
    ].filter(item => item.value > 0);
  },

  /**
   * 生成模拟的时间分布数据
   */
  generateHourlyFocusData: (): ChartDataPoint[] => {
    return Array.from({ length: 24 }, (_, hour) => ({
      label: `${hour}:00`,
      value:
        hour >= 8 && hour <= 22
          ? Math.floor(Math.random() * 60)
          : Math.floor(Math.random() * 10),
      meta: { hour },
    }));
  },
};
