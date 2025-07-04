import {
  convertStatisticsToChartData,
  formatDateLabel,
  formatWeekLabel,
  formatMonthLabel,
  timeUtils,
  statsUtils,
  colorUtils,
  filterUtils,
  mockDataGenerator,
} from '../chartHelpers';
import { StatisticsData, TimePeriod } from '../../types/statistics';

describe('chartHelpers 工具函数', () => {
  describe('convertStatisticsToChartData', () => {
    describe('dailyFocusToLine', () => {
      it('应该正确转换每日专注数据', () => {
        const dailyData = [
          {
            date: '2025-01-01',
            focusMinutes: 120,
            completedPomodoros: 5,
            completedTasks: 3,
          },
          {
            date: '2025-01-02',
            focusMinutes: 150,
            completedPomodoros: 6,
            completedTasks: 4,
          },
        ];

        const result = convertStatisticsToChartData.dailyFocusToLine(dailyData);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
          label: expect.any(String),
          value: 120,
          meta: {
            pomodoros: 5,
            tasks: 3,
            date: '2025-01-01',
          },
        });
      });
    });

    describe('taskCompletionToDoughnut', () => {
      it('应该正确转换任务完成数据', () => {
        const taskData = {
          totalTasks: 10,
          completedTasks: 6,
          inProgressTasks: 3,
          cancelledTasks: 1,
          completionRate: 60,
        };

        const result =
          convertStatisticsToChartData.taskCompletionToDoughnut(taskData);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({
          label: '已完成',
          value: 6,
          meta: { percentage: '60.0' },
        });
        expect(result[1]).toEqual({
          label: '进行中',
          value: 3,
          meta: { percentage: '30.0' },
        });
      });

      it('应该过滤掉值为0的项', () => {
        const taskData = {
          totalTasks: 6,
          completedTasks: 6,
          inProgressTasks: 0,
          cancelledTasks: 0,
          completionRate: 100,
        };

        const result =
          convertStatisticsToChartData.taskCompletionToDoughnut(taskData);

        expect(result).toHaveLength(1);
        expect(result[0].label).toBe('已完成');
      });
    });

    describe('hourlyFocusToBar', () => {
      it('应该正确转换时间分布数据', () => {
        const hourlyData = [
          { hour: 9, focusMinutes: 60, pomodoroCount: 2 },
          { hour: 14, focusMinutes: 90, pomodoroCount: 3 },
        ];

        const result =
          convertStatisticsToChartData.hourlyFocusToBar(hourlyData);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
          label: '9:00',
          value: 60,
          meta: { hour: 9, pomodoroCount: 2 },
        });
      });
    });
  });

  describe('日期格式化函数', () => {
    describe('formatDateLabel', () => {
      it('应该格式化今天的日期', () => {
        const today = new Date().toISOString().split('T')[0];
        expect(formatDateLabel(today)).toBe('今天');
      });

      it('应该格式化昨天的日期', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        expect(formatDateLabel(yesterdayStr)).toBe('昨天');
      });

      it('应该格式化前天的日期', () => {
        const dayBeforeYesterday = new Date();
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
        const dayStr = dayBeforeYesterday.toISOString().split('T')[0];
        expect(formatDateLabel(dayStr)).toBe('前天');
      });

      it('应该格式化一周前的日期为MM/DD格式', () => {
        const result = formatDateLabel('2025-01-01');
        expect(result).toMatch(/^\d{2}\/\d{2}$/);
      });
    });

    describe('formatWeekLabel', () => {
      it('应该正确格式化周标签', () => {
        expect(formatWeekLabel('2025-W01')).toBe('第01周');
        expect(formatWeekLabel('2025-W52')).toBe('第52周');
      });
    });

    describe('formatMonthLabel', () => {
      it('应该正确格式化月份标签', () => {
        expect(formatMonthLabel('2025-01')).toBe('1月');
        expect(formatMonthLabel('2025-12')).toBe('12月');
      });

      it('应该处理无效的月份格式', () => {
        expect(formatMonthLabel('invalid')).toBe('invalid');
      });
    });
  });

  describe('timeUtils', () => {
    describe('minutesToHoursMinutes', () => {
      it('应该正确转换小于60分钟的时间', () => {
        expect(timeUtils.minutesToHoursMinutes(30)).toBe('30分钟');
        expect(timeUtils.minutesToHoursMinutes(59)).toBe('59分钟');
      });

      it('应该正确转换整小时的时间', () => {
        expect(timeUtils.minutesToHoursMinutes(60)).toBe('1小时');
        expect(timeUtils.minutesToHoursMinutes(120)).toBe('2小时');
      });

      it('应该正确转换小时和分钟的时间', () => {
        expect(timeUtils.minutesToHoursMinutes(90)).toBe('1小时30分钟');
        expect(timeUtils.minutesToHoursMinutes(125)).toBe('2小时5分钟');
      });
    });

    describe('minutesToHours', () => {
      it('应该正确转换为小时格式', () => {
        expect(timeUtils.minutesToHours(60)).toBe('1.0小时');
        expect(timeUtils.minutesToHours(90)).toBe('1.5小时');
        expect(timeUtils.minutesToHours(30)).toBe('0.5小时');
      });
    });

    describe('formatFocusTime', () => {
      it('应该处理0分钟的情况', () => {
        expect(timeUtils.formatFocusTime(0)).toBe('0分钟');
      });

      it('应该正确格式化专注时间', () => {
        expect(timeUtils.formatFocusTime(45)).toBe('45分钟');
        expect(timeUtils.formatFocusTime(60)).toBe('1小时');
        expect(timeUtils.formatFocusTime(125)).toBe('2小时5分钟');
      });
    });
  });

  describe('statsUtils', () => {
    describe('average', () => {
      it('应该计算正确的平均值', () => {
        expect(statsUtils.average([1, 2, 3, 4, 5])).toBe(3);
        expect(statsUtils.average([10, 20])).toBe(15);
      });

      it('应该处理空数组', () => {
        expect(statsUtils.average([])).toBe(0);
      });
    });

    describe('max', () => {
      it('应该返回最大值', () => {
        expect(statsUtils.max([1, 5, 3, 9, 2])).toBe(9);
        expect(statsUtils.max([10])).toBe(10);
      });

      it('应该处理空数组', () => {
        expect(statsUtils.max([])).toBe(0);
      });
    });

    describe('min', () => {
      it('应该返回最小值', () => {
        expect(statsUtils.min([1, 5, 3, 9, 2])).toBe(1);
        expect(statsUtils.min([10])).toBe(10);
      });

      it('应该处理空数组', () => {
        expect(statsUtils.min([])).toBe(0);
      });
    });

    describe('sum', () => {
      it('应该计算正确的总和', () => {
        expect(statsUtils.sum([1, 2, 3, 4, 5])).toBe(15);
        expect(statsUtils.sum([10, -5])).toBe(5);
      });

      it('应该处理空数组', () => {
        expect(statsUtils.sum([])).toBe(0);
      });
    });

    describe('growthRate', () => {
      it('应该计算正确的增长率', () => {
        expect(statsUtils.growthRate(120, 100)).toBe(20);
        expect(statsUtils.growthRate(80, 100)).toBe(-20);
        expect(statsUtils.growthRate(100, 100)).toBe(0);
      });

      it('应该处理前值为0的情况', () => {
        expect(statsUtils.growthRate(100, 0)).toBe(100);
        expect(statsUtils.growthRate(0, 0)).toBe(0);
      });
    });

    describe('formatPercentage', () => {
      it('应该正确格式化百分比', () => {
        expect(statsUtils.formatPercentage(25.555)).toBe('25.6%');
        expect(statsUtils.formatPercentage(100)).toBe('100.0%');
      });
    });

    describe('formatGrowthRate', () => {
      it('应该正确格式化增长率', () => {
        expect(statsUtils.formatGrowthRate(15.5)).toEqual({
          text: '+15.5%',
          direction: 'up',
        });

        expect(statsUtils.formatGrowthRate(-10.2)).toEqual({
          text: '-10.2%',
          direction: 'down',
        });

        expect(statsUtils.formatGrowthRate(0.05)).toEqual({
          text: '持平',
          direction: 'same',
        });
      });
    });
  });

  describe('colorUtils', () => {
    describe('getValueColor', () => {
      it('应该根据数值比例返回对应颜色', () => {
        expect(colorUtils.getValueColor(80, 100)).toBe('#10b981'); // 绿色
        expect(colorUtils.getValueColor(60, 100)).toBe('#f59e0b'); // 黄色
        expect(colorUtils.getValueColor(40, 100)).toBe('#f97316'); // 橙色
        expect(colorUtils.getValueColor(20, 100)).toBe('#ef4444'); // 红色
      });
    });

    describe('getTrendColor', () => {
      it('应该根据趋势方向返回对应颜色', () => {
        expect(colorUtils.getTrendColor('up')).toBe('#10b981');
        expect(colorUtils.getTrendColor('down')).toBe('#ef4444');
        expect(colorUtils.getTrendColor('same')).toBe('#6b7280');
      });
    });

    describe('generateGradientColors', () => {
      it('应该生成指定数量的颜色数组', () => {
        const colors = colorUtils.generateGradientColors(
          '#000000',
          '#ffffff',
          5
        );
        expect(colors).toHaveLength(5);
        expect(colors.every(color => typeof color === 'string')).toBe(true);
      });
    });
  });

  describe('filterUtils', () => {
    const mockData = [
      { date: '2025-01-01', value: 100 },
      { date: '2025-01-02', value: 200 },
      { date: '2025-01-03', value: 300 },
    ];

    describe('filterByTimePeriod', () => {
      it('应该返回今天的数据', () => {
        const today = new Date().toISOString().split('T')[0];
        const todayData = [{ date: today, value: 100 }];

        const result = filterUtils.filterByTimePeriod(todayData, 'today');
        expect(result).toHaveLength(1);
      });

      it('应该处理无效的时间维度', () => {
        const result = filterUtils.filterByTimePeriod(
          mockData,
          'invalid' as TimePeriod
        );
        expect(result).toEqual(mockData);
      });
    });

    describe('getRecentDays', () => {
      it('应该返回最近几天的数据', () => {
        const result = filterUtils.getRecentDays(mockData, 1);
        expect(result.length).toBeLessThanOrEqual(mockData.length);
      });
    });
  });

  describe('mockDataGenerator', () => {
    describe('generateDailyFocusData', () => {
      it('应该生成指定天数的数据', () => {
        const data = mockDataGenerator.generateDailyFocusData(7);
        expect(data).toHaveLength(7);

        data.forEach(item => {
          expect(item).toHaveProperty('label');
          expect(item).toHaveProperty('value');
          expect(item.value).toBeGreaterThanOrEqual(60);
          expect(item.value).toBeLessThanOrEqual(360);
        });
      });

      it('应该使用默认值生成7天数据', () => {
        const data = mockDataGenerator.generateDailyFocusData();
        expect(data).toHaveLength(7);
      });
    });

    describe('generateTaskDistributionData', () => {
      it('应该生成任务分布数据', () => {
        const data = mockDataGenerator.generateTaskDistributionData();
        expect(data.length).toBeGreaterThan(0);
        expect(data.length).toBeLessThanOrEqual(3);

        data.forEach(item => {
          expect(item).toHaveProperty('label');
          expect(item).toHaveProperty('value');
          expect(item.value).toBeGreaterThan(0);
        });
      });
    });

    describe('generateHourlyFocusData', () => {
      it('应该生成24小时的数据', () => {
        const data = mockDataGenerator.generateHourlyFocusData();
        expect(data).toHaveLength(24);

        data.forEach((item, index) => {
          expect(item.label).toBe(`${index}:00`);
          expect(item.meta?.hour).toBe(index);
        });
      });
    });
  });
});
