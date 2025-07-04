/**
 * 统计组件模块索引
 * 导出所有图表组件和相关类型
 */

// 统计组件入口文件
export { default as LineChart } from './LineChart';
export { default as BarChart } from './BarChart';
export { default as DoughnutChart } from './DoughnutChart';
export { default as StatCard } from './StatCard';
export { default as PeriodSelector } from './PeriodSelector';
export { default as StatisticsPage } from './StatisticsPage';

// 类型定义
export type {
  ChartDataPoint,
  ChartOptions,
  BaseChartProps,
  LineChartProps,
  BarChartProps,
  DoughnutChartProps,
  TimePeriod,
  StatisticsData,
  DailyFocusData,
  WeeklyTrendData,
  MonthlyStatsData,
  TaskCompletionData,
  HourlyFocusData,
  PeriodSelectorProps,
  StatCardProps,
} from '../../types/statistics';

// 导出 hooks
export { useStatisticsData } from '@/hooks/useStatisticsData';

// 工具函数
export {
  convertStatisticsToChartData,
  formatDateLabel,
  formatWeekLabel,
  formatMonthLabel,
  timeUtils,
  statsUtils,
  colorUtils,
  filterUtils,
  mockDataGenerator,
} from '../../utils/chartHelpers';
