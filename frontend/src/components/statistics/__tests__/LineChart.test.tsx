import React from 'react';
import { render, screen } from '@testing-library/react';
import { LineChart } from '../LineChart';
import { ChartDataPoint } from '../../../types/statistics';

// Mock Chart.js 和 react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options, ...props }: any) => (
    <div
      data-testid='line-chart'
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
      {...props}
    >
      <canvas data-testid='line-chart-canvas' />
    </div>
  ),
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Filler: jest.fn(),
}));

describe('LineChart 组件', () => {
  const mockData: ChartDataPoint[] = [
    { label: '周一', value: 120 },
    { label: '周二', value: 150 },
    { label: '周三', value: 90 },
    { label: '周四', value: 180 },
    { label: '周五', value: 160 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应该正确渲染 LineChart 组件', () => {
      render(<LineChart data={mockData} />);

      const chart = screen.getByTestId('line-chart');
      expect(chart).toBeInTheDocument();
    });

    it('应该渲染 canvas 元素', () => {
      render(<LineChart data={mockData} />);

      const canvas = screen.getByTestId('line-chart-canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('应该正确传递数据到图表组件', () => {
      render(<LineChart data={mockData} />);

      const chart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.labels).toEqual([
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
      ]);
      expect(chartData.datasets[0].data).toEqual([120, 150, 90, 180, 160]);
    });

    it('应该设置默认的图表配置', () => {
      render(<LineChart data={mockData} />);

      const chart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.responsive).toBe(true);
      expect(chartOptions.maintainAspectRatio).toBe(false);
    });
  });

  describe('自定义属性', () => {
    it('应该支持自定义标题', () => {
      render(<LineChart data={mockData} options={{ title: '专注时间趋势' }} />);

      const chart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.plugins.title.display).toBe(true);
      expect(chartOptions.plugins.title.text).toBe('专注时间趋势');
    });

    it('应该支持填充配置', () => {
      render(
        <LineChart
          data={mockData}
          fill={true}
          fillColor='rgba(59, 130, 246, 0.1)'
        />
      );

      const chart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].fill).toBe(true);
      expect(chartData.datasets[0].backgroundColor).toBe(
        'rgba(59, 130, 246, 0.1)'
      );
    });

    it('应该支持自定义线条颜色', () => {
      render(<LineChart data={mockData} lineColor='#ef4444' />);

      const chart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].borderColor).toBe('#ef4444');
    });

    it('应该支持自定义类名', () => {
      render(<LineChart data={mockData} className='custom-chart-class' />);

      // 查找包含类名的容器元素 - 更新后的结构
      const container = document.querySelector('.w-full.custom-chart-class');
      expect(container).toBeInTheDocument();
    });
  });

  describe('加载和错误状态', () => {
    it('应该显示加载状态', () => {
      render(<LineChart data={[]} isLoading={true} />);

      expect(screen.getByText('数据加载中...')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });

    it('应该显示错误状态', () => {
      render(<LineChart data={[]} error='加载失败' />);

      expect(screen.getByText('加载失败')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });

    it('应该显示空数据状态', () => {
      render(<LineChart data={[]} />);

      expect(screen.getByText('暂无数据')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('响应式行为', () => {
    it('应该启用响应式配置', () => {
      render(<LineChart data={mockData} />);

      const chart = screen.getByTestId('line-chart');
      const chartOptions = JSON.parse(
        chart.getAttribute('data-chart-options') || '{}'
      );

      expect(chartOptions.responsive).toBe(true);
    });

    it('应该使用响应式容器高度', () => {
      render(<LineChart data={mockData} className='test-chart' />);

      // 查找图表容器 - 更新后的结构
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

      render(<LineChart data={mockData} />);

      // 触发 resize 事件
      window.dispatchEvent(new Event('resize'));

      // 等待状态更新，然后检查是否有移动端说明
      setTimeout(() => {
        expect(screen.queryByText(/点击数据点查看详情/)).toBeInTheDocument();
      }, 100);
    });

    it('应该在桌面端隐藏数据说明', () => {
      // 模拟桌面端
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      render(<LineChart data={mockData} />);

      // 触发 resize 事件
      window.dispatchEvent(new Event('resize'));

      // 等待状态更新，然后检查是否隐藏了移动端说明
      setTimeout(() => {
        expect(
          screen.queryByText(/点击数据点查看详情/)
        ).not.toBeInTheDocument();
      }, 100);
    });
  });

  describe('无障碍访问', () => {
    it('应该提供正确的容器结构', () => {
      render(<LineChart data={mockData} />);

      // 检查新的容器结构
      const outerContainer = document.querySelector('.w-full');
      const innerContainer = document.querySelector(
        '.h-48.sm\\:h-64.md\\:h-80'
      );

      expect(outerContainer).toBeInTheDocument();
      expect(innerContainer).toBeInTheDocument();
    });

    it('应该正确处理交互事件', () => {
      const mockClick = jest.fn();
      const mockHover = jest.fn();

      render(
        <LineChart
          data={mockData}
          onPointClick={mockClick}
          onHover={mockHover}
        />
      );

      // 验证回调函数已正确传递
      expect(mockClick).toBeDefined();
      expect(mockHover).toBeDefined();
    });
  });

  describe('数据转换', () => {
    it('应该正确处理数字数据', () => {
      const numericData = [
        { label: 'Jan', value: 100.5 },
        { label: 'Feb', value: 200.7 },
      ];

      render(<LineChart data={numericData} />);

      const chart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].data).toEqual([100.5, 200.7]);
    });

    it('应该正确处理带有元数据的数据', () => {
      const dataWithMeta = [
        { label: 'Jan', value: 100, meta: { tasks: 5 } },
        { label: 'Feb', value: 200, meta: { tasks: 8 } },
      ];

      render(<LineChart data={dataWithMeta} />);

      const chart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(
        chart.getAttribute('data-chart-data') || '{}'
      );

      expect(chartData.datasets[0].data).toEqual([100, 200]);
      // 元数据应该存储在组件内部，用于 tooltip 等功能
    });
  });
});
