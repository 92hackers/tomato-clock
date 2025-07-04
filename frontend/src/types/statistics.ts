// 统计数据类型定义文件
// 为数据可视化组件提供完整的类型支持

/**
 * 时间维度类型
 * 支持今日、本周、本月三种统计维度
 */
export type TimePeriod = 'today' | 'week' | 'month';

/**
 * 每日专注数据
 */
export interface DailyFocusData {
  /** 日期 (YYYY-MM-DD 格式) */
  date: string;
  /** 专注时长（分钟） */
  focusMinutes: number;
  /** 完成的番茄钟数量 */
  completedPomodoros: number;
  /** 完成的任务数量 */
  completedTasks: number;
}

/**
 * 周趋势数据
 */
export interface WeeklyTrendData {
  /** 周标识 (例如: "2025-W01") */
  week: string;
  /** 本周总专注时长（分钟） */
  totalFocusMinutes: number;
  /** 本周完成的番茄钟数量 */
  totalPomodoros: number;
  /** 本周完成的任务数量 */
  totalTasks: number;
  /** 平均每日专注时长（分钟） */
  avgDailyFocus: number;
}

/**
 * 月度统计数据
 */
export interface MonthlyStatsData {
  /** 月份标识 (例如: "2025-01") */
  month: string;
  /** 本月总专注时长（分钟） */
  totalFocusMinutes: number;
  /** 本月完成的番茄钟数量 */
  totalPomodoros: number;
  /** 本月完成的任务数量 */
  totalTasks: number;
  /** 本月最高单日专注时长（分钟） */
  maxDailyFocus: number;
  /** 本月平均每日专注时长（分钟） */
  avgDailyFocus: number;
}

/**
 * 任务完成率数据
 */
export interface TaskCompletionData {
  /** 总任务数 */
  totalTasks: number;
  /** 已完成任务数 */
  completedTasks: number;
  /** 进行中任务数 */
  inProgressTasks: number;
  /** 已取消任务数 */
  cancelledTasks: number;
  /** 完成率百分比 */
  completionRate: number;
}

/**
 * 专注时间分布数据（按小时）
 */
export interface HourlyFocusData {
  /** 小时 (0-23) */
  hour: number;
  /** 该小时的专注时长（分钟） */
  focusMinutes: number;
  /** 该小时的番茄钟数量 */
  pomodoroCount: number;
}

/**
 * 完整的统计数据结构
 */
export interface StatisticsData {
  /** 每日专注数据 */
  dailyFocus: DailyFocusData[];
  /** 周趋势数据 */
  weeklyTrend: WeeklyTrendData[];
  /** 月度统计数据 */
  monthlyStats: MonthlyStatsData[];
  /** 任务完成率数据 */
  taskCompletion: TaskCompletionData;
  /** 时间分布数据 */
  hourlyFocus: HourlyFocusData[];
}

/**
 * 图表数据点接口
 */
export interface ChartDataPoint {
  /** X轴标签 */
  label: string;
  /** Y轴数值 */
  value: number;
  /** 附加数据（可选） */
  meta?: Record<string, any>;
}

/**
 * 图表配置选项
 */
export interface ChartOptions {
  /** 图表标题 */
  title?: string;
  /** 是否显示图例 */
  showLegend?: boolean;
  /** 是否显示网格线 */
  showGrid?: boolean;
  /** 图表高度 */
  height?: number;
  /** 是否启用动画 */
  animate?: boolean;
  /** 响应式配置 */
  responsive?: boolean;
}

/**
 * 通用图表属性接口
 */
export interface BaseChartProps {
  /** 图表数据 */
  data: ChartDataPoint[];
  /** 图表配置选项 */
  options?: ChartOptions;
  /** 加载状态 */
  isLoading?: boolean;
  /** 错误信息 */
  error?: string | null;
  /** 图表类名 */
  className?: string;
}

/**
 * 折线图特有属性
 */
export interface LineChartProps extends BaseChartProps {
  /** 是否填充区域 */
  fill?: boolean;
  /** 线条颜色 */
  lineColor?: string;
  /** 填充颜色 */
  fillColor?: string;
  /** 点击事件回调 */
  onPointClick?: (dataPoint: ChartDataPoint, pointIndex: number) => void;
  /** 悬停事件回调 */
  onHover?: (dataPoint: ChartDataPoint | null) => void;
}

/**
 * 柱状图特有属性
 */
export interface BarChartProps extends BaseChartProps {
  /** 柱状图方向 */
  orientation?: 'vertical' | 'horizontal';
  /** 柱状图颜色 */
  barColor?: string;
  /** 点击事件回调 */
  onPointClick?: (dataPoint: ChartDataPoint, pointIndex: number) => void;
  /** 悬停事件回调 */
  onHover?: (dataPoint: ChartDataPoint | null) => void;
}

/**
 * 环形图特有属性
 */
export interface DoughnutChartProps extends BaseChartProps {
  /** 内环半径比例 (0-1) */
  cutout?: number;
  /** 是否显示百分比标签 */
  showPercentage?: boolean;
  /** 自定义颜色数组 */
  colors?: string[];
  /** 点击事件回调 */
  onPointClick?: (dataPoint: ChartDataPoint, pointIndex: number) => void;
  /** 悬停事件回调 */
  onHover?: (dataPoint: ChartDataPoint | null) => void;
}

/**
 * 时间选择器属性
 */
export interface PeriodSelectorProps {
  /** 当前选择的时间维度 */
  period: TimePeriod;
  /** 时间维度变化回调 */
  onChange: (period: TimePeriod) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 统计卡片属性
 */
export interface StatCardProps {
  /** 卡片标题 */
  title: string;
  /** 主要数值 */
  value: string | number;
  /** 数值单位 */
  unit?: string;
  /** 变化趋势（相比上期） */
  trend?: {
    /** 变化值 */
    value: number;
    /** 变化方向 */
    direction: 'up' | 'down' | 'same';
    /** 变化描述 */
    label: string;
  };
  /** 图标名称 */
  icon?: string;
  /** 卡片背景色 */
  bgColor?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 统计数据 Hook 返回值
 */
export interface UseStatisticsDataReturn {
  /** 统计数据 */
  data: StatisticsData | null;
  /** 加载状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据方法 */
  refetch: () => void;
  /** 当前时间维度 */
  period: TimePeriod;
  /** 设置时间维度 */
  setPeriod: (period: TimePeriod) => void;
}
