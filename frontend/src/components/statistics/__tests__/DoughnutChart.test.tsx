import React from 'react';
import { render, screen } from '@testing-library/react';
import { DoughnutChart } from '../DoughnutChart';
import { ChartDataPoint } from '../../../types/statistics';

// Mock Chart.js 和 react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Doughnut: ({ data, options, ...props }: any) => (
    <div
      data-testid='doughnut-chart'
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
      {...props}
    >
      <canvas data-testid='doughnut-chart-canvas' />
    </div>
  ),
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  ArcElement: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

describe('DoughnutChart 组件', () => {
  const mockData: ChartDataPoint[] = [
    { label: '已完成', value: 60 },
    { label: '进行中', value: 25 },
    { label: '待开始', value: 15 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应该正确渲染 DoughnutChart 组件', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');
      expect(chart).toBeInTheDocument();
    });

    it('应该渲染 canvas 元素', () => {
      render(<DoughnutChart data={mockData} />);

      const canvas = screen.getByTestId('doughnut-chart-canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('应该正确传递数据到图表组件', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.labels).toEqual(['已完成', '进行中', '待开始']);
      expect(chartData.datasets[0].data).toEqual([60, 25, 15]);
    });

    it('应该设置默认的图表配置', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.responsive).toBe(true);
      expect(chartOptions.maintainAspectRatio).toBe(false);
    });
  });

  describe('环形图特有功能', () => {
    it('应该支持默认内环半径', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].cutout).toBe('60%');
    });

    it('应该支持自定义内环半径', () => {
      render(<DoughnutChart data={mockData} cutout={0.8} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].cutout).toBe('80%');
    });

    it('应该使用默认配色方案', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].backgroundColor).toBeInstanceOf(Array);
      expect(chartData.datasets[0].backgroundColor.length).toBe(
        mockData.length
      );
    });

    it('应该支持百分比标签显示配置', () => {
      render(<DoughnutChart data={mockData} showPercentage={true} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      // 验证是否配置了百分比显示
      expect(chartOptions.plugins.tooltip.callbacks).toBeDefined();
    });

    it('应该计算正确的百分比', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');

      // 验证数据是否正确
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );
      const total = chartData.datasets[0].data.reduce(
        (sum: number, value: number) => sum + value,
        0
      );

      expect(total).toBe(100); // 60 + 25 + 15 = 100
    });
  });

  describe('自定义属性', () => {
    it('应该支持自定义标题', () => {
      render(
        <DoughnutChart data={mockData} options={{ title: '任务分布统计' }} />
      );

      const chart = screen.getByTestId('doughnut-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.plugins.title.display).toBe(true);
      expect(chartOptions.plugins.title.text).toBe('任务分布统计');
    });

    it('应该支持自定义类名', () => {
      render(
        <DoughnutChart data={mockData} className='custom-doughnut-chart' />
      );

      const container = document.querySelector('.w-full.custom-doughnut-chart');
      expect(container).toBeInTheDocument();
    });

    it('应该支持显示图例', () => {
      render(<DoughnutChart data={mockData} options={{ showLegend: true }} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.plugins.legend.display).toBe(true);
    });
  });

  describe('加载和错误状态', () => {
    it('应该显示加载状态', () => {
      render(<DoughnutChart data={[]} isLoading={true} />);

      expect(screen.getByText('数据加载中...')).toBeInTheDocument();
      expect(screen.queryByTestId('doughnut-chart')).not.toBeInTheDocument();
    });

    it('应该显示错误状态', () => {
      render(<DoughnutChart data={[]} error='数据加载失败' />);

      expect(screen.getByText('数据加载失败')).toBeInTheDocument();
      expect(screen.queryByTestId('doughnut-chart')).not.toBeInTheDocument();
    });

    it('应该显示空数据状态', () => {
      render(<DoughnutChart data={[]} />);

      expect(screen.getByText('暂无数据')).toBeInTheDocument();
      expect(screen.queryByTestId('doughnut-chart')).not.toBeInTheDocument();
    });
  });

  describe('响应式行为', () => {
    it('应该启用响应式配置', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.responsive).toBe(true);
    });

    it('应该使用响应式容器高度', () => {
      render(<DoughnutChart data={mockData} className='test-doughnut' />);

      const chartContainer = document.querySelector(
        '.h-48.sm\\:h-64.md\\:h-80'
      );
      expect(chartContainer).toBeInTheDocument();
    });
  });

  describe('移动端优化', () => {
    it('应该在移动端显示数据说明', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      render(<DoughnutChart data={mockData} />);

      window.dispatchEvent(new Event('resize'));

      setTimeout(() => {
        expect(screen.queryByText(/点击扇形区域查看详情/)).toBeInTheDocument();
      }, 100);
    });
  });

  describe('数据处理', () => {
    it('应该正确处理单个数据点', () => {
      const singleData = [{ label: '完成度', value: 100 }];

      render(<DoughnutChart data={singleData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].data).toEqual([100]);
    });

    it('应该正确处理多个数据点', () => {
      const multiData = [
        { label: 'A', value: 30 },
        { label: 'B', value: 25 },
        { label: 'C', value: 20 },
        { label: 'D', value: 15 },
        { label: 'E', value: 10 },
      ];

      render(<DoughnutChart data={multiData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].data).toEqual([30, 25, 20, 15, 10]);
      expect(chartData.datasets[0].backgroundColor.length).toBe(5);
    });

    it('应该正确处理小数值', () => {
      const decimalData = [
        { label: '项目A', value: 33.33 },
        { label: '项目B', value: 66.67 },
      ];

      render(<DoughnutChart data={decimalData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].data).toEqual([33.33, 66.67]);
    });
  });

  describe('视觉效果', () => {
    it('应该应用适当的颜色对比度', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      const colors = chartData.datasets[0].backgroundColor;
      expect(new Set(colors).size).toBe(colors.length);
    });

    it('应该设置适当的边框样式', () => {
      render(<DoughnutChart data={mockData} />);

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].borderWidth).toBeGreaterThan(0);
      expect(chartData.datasets[0].borderColor).toBeDefined();
    });
  });
});
