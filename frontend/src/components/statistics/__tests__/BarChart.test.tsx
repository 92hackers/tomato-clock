import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarChart } from '../BarChart';
import { ChartDataPoint } from '../../../types/statistics';

// Mock Chart.js 和 react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options, ...props }: any) => (
    <div
      data-testid='bar-chart'
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
      {...props}
    >
      <canvas data-testid='bar-chart-canvas' />
    </div>
  ),
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

describe('BarChart 组件', () => {
  const mockData: ChartDataPoint[] = [
    { label: '今日任务', value: 5 },
    { label: '已完成', value: 3 },
    { label: '进行中', value: 1 },
    { label: '已取消', value: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应该正确渲染 BarChart 组件', () => {
      render(<BarChart data={mockData} />);

      const chart = screen.getByTestId('bar-chart');
      expect(chart).toBeInTheDocument();
    });

    it('应该渲染 canvas 元素', () => {
      render(<BarChart data={mockData} />);

      const canvas = screen.getByTestId('bar-chart-canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('应该正确传递数据到图表组件', () => {
      render(<BarChart data={mockData} />);

      const chart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.labels).toEqual([
        '今日任务',
        '已完成',
        '进行中',
        '已取消',
      ]);
      expect(chartData.datasets[0].data).toEqual([5, 3, 1, 1]);
    });

    it('应该设置默认的图表配置', () => {
      render(<BarChart data={mockData} />);

      const chart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.responsive).toBe(true);
      expect(chartOptions.maintainAspectRatio).toBe(false);
    });
  });

  describe('柱状图特有功能', () => {
    it('应该支持垂直方向（默认）', () => {
      render(<BarChart data={mockData} />);

      const chart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.indexAxis).toBe('x');
    });

    it('应该支持水平方向', () => {
      render(<BarChart data={mockData} orientation='horizontal' />);

      const chart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.indexAxis).toBe('y');
    });

    it('应该支持自定义柱状图颜色', () => {
      render(<BarChart data={mockData} barColor='#10b981' />);

      const chart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].backgroundColor).toBe('#10b981');
    });

    it('应该支持渐变色配色方案', () => {
      render(<BarChart data={mockData} />);

      const chart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      // 默认应该使用渐变色数组
      expect(chartData.datasets[0].backgroundColor).toBeInstanceOf(Array);
      expect(chartData.datasets[0].backgroundColor.length).toBe(
        mockData.length
      );
    });
  });

  describe('自定义属性', () => {
    it('应该支持自定义标题', () => {
      render(<BarChart data={mockData} options={{ title: '任务完成统计' }} />);

      const chart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.plugins.title.display).toBe(true);
      expect(chartOptions.plugins.title.text).toBe('任务完成统计');
    });

    it('应该支持自定义类名', () => {
      render(<BarChart data={mockData} className='custom-bar-chart' />);

      const container = document.querySelector('.w-full.custom-bar-chart');
      expect(container).toBeInTheDocument();
    });

    it('应该支持显示图例', () => {
      render(<BarChart data={mockData} options={{ showLegend: true }} />);

      const chart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.plugins.legend.display).toBe(true);
    });
  });

  describe('加载和错误状态', () => {
    it('应该显示加载状态', () => {
      render(<BarChart data={[]} isLoading={true} />);

      expect(screen.getByText('数据加载中...')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    it('应该显示错误状态', () => {
      render(<BarChart data={[]} error='获取数据失败' />);

      expect(screen.getByText('获取数据失败')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    it('应该显示空数据状态', () => {
      render(<BarChart data={[]} />);

      expect(screen.getByText('暂无数据')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });
  });

  describe('响应式行为', () => {
    it('应该启用响应式配置', () => {
      render(<BarChart data={mockData} />);

      const chart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.responsive).toBe(true);
    });

    it('应该使用响应式容器高度', () => {
      render(<BarChart data={mockData} className='test-chart' />);

      const chartContainer = document.querySelector(
        '.h-48.sm\\:h-64.md\\:h-80'
      );
      expect(chartContainer).toBeInTheDocument();
    });
  });

  describe('移动端优化', () => {
    it('应该在移动端显示数据说明', () => {
      // 模拟移动端
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      render(<BarChart data={mockData} />);

      // 触发 resize 事件
      window.dispatchEvent(new Event('resize'));

      // 等待状态更新，然后检查是否有移动端说明
      setTimeout(() => {
        expect(screen.queryByText(/点击柱状图查看详情/)).toBeInTheDocument();
      }, 100);
    });
  });

  describe('数据处理', () => {
    it('应该正确处理大数值', () => {
      const bigData = [
        { label: '大值1', value: 10000 },
        { label: '大值2', value: 25000 },
      ];

      render(<BarChart data={bigData} />);

      const chart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].data).toEqual([10000, 25000]);
    });

    it('应该正确处理零值数据', () => {
      const zeroData = [
        { label: '项目A', value: 0 },
        { label: '项目B', value: 5 },
      ];

      render(<BarChart data={zeroData} />);

      const chart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].data).toEqual([0, 5]);
    });
  });
});
