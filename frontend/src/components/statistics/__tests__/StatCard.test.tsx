import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  const defaultProps = {
    title: '今日专注时间',
    value: 120,
  };

  describe('基础渲染测试', () => {
    it('应该正确渲染标题和数值', () => {
      render(<StatCard {...defaultProps} />);

      expect(screen.getByText('今日专注时间')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
    });

    it('应该正确显示单位', () => {
      render(<StatCard {...defaultProps} unit='分钟' />);

      expect(screen.getByText('分钟')).toBeInTheDocument();
    });

    it('应该在没有单位时不显示单位', () => {
      render(<StatCard {...defaultProps} />);

      expect(screen.queryByText('分钟')).not.toBeInTheDocument();
    });
  });

  describe('数值格式化测试', () => {
    it('应该正确格式化小于1000的数值', () => {
      render(<StatCard {...defaultProps} value={999} />);

      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('应该正确格式化大于等于1000的数值', () => {
      render(<StatCard {...defaultProps} value={1500} />);

      expect(screen.getByText('1.5k')).toBeInTheDocument();
    });

    it('应该正确格式化更大的数值', () => {
      render(<StatCard {...defaultProps} value={12345} />);

      expect(screen.getByText('12.3k')).toBeInTheDocument();
    });

    it('应该处理边界值1000', () => {
      render(<StatCard {...defaultProps} value={1000} />);

      expect(screen.getByText('1.0k')).toBeInTheDocument();
    });
  });

  describe('趋势指示器测试', () => {
    it('应该显示上升趋势', () => {
      const trend = {
        value: 15,
        direction: 'up' as const,
        label: '比昨日',
      };
      render(<StatCard {...defaultProps} trend={trend} />);

      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.getByText('比昨日')).toBeInTheDocument();

      const trendContainer = screen.getByText('15%').parentElement;
      expect(trendContainer).toHaveClass('text-green-600');
    });

    it('应该显示下降趋势', () => {
      const trend = {
        value: -10,
        direction: 'down' as const,
        label: '比昨日',
      };
      render(<StatCard {...defaultProps} trend={trend} />);

      expect(screen.getByText('10%')).toBeInTheDocument();
      expect(screen.getByText('比昨日')).toBeInTheDocument();

      const trendContainer = screen.getByText('10%').parentElement;
      expect(trendContainer).toHaveClass('text-red-600');
    });

    it('应该显示无变化趋势', () => {
      const trend = {
        value: 0,
        direction: 'same' as const,
        label: '与昨日相同',
      };
      render(<StatCard {...defaultProps} trend={trend} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('与昨日相同')).toBeInTheDocument();

      const trendContainer = screen.getByText('0%').parentElement;
      expect(trendContainer).toHaveClass('text-gray-600');
    });

    it('应该在没有趋势数据时不显示趋势信息', () => {
      render(<StatCard {...defaultProps} />);

      expect(screen.queryByText('比昨日')).not.toBeInTheDocument();
    });
  });

  describe('图标测试', () => {
    it('应该显示时钟图标', () => {
      render(<StatCard {...defaultProps} icon='clock' />);

      const iconContainer = screen
        .getByText('今日专注时间')
        .parentElement?.querySelector('.text-gray-400');
      expect(iconContainer).toBeInTheDocument();
    });

    it('应该显示任务图标', () => {
      render(<StatCard {...defaultProps} icon='task' />);

      const iconContainer = screen
        .getByText('今日专注时间')
        .parentElement?.querySelector('.text-gray-400');
      expect(iconContainer).toBeInTheDocument();
    });

    it('应该显示目标图标', () => {
      render(<StatCard {...defaultProps} icon='target' />);

      const iconContainer = screen
        .getByText('今日专注时间')
        .parentElement?.querySelector('.text-gray-400');
      expect(iconContainer).toBeInTheDocument();
    });

    it('应该显示图表图标', () => {
      render(<StatCard {...defaultProps} icon='chart' />);

      const iconContainer = screen
        .getByText('今日专注时间')
        .parentElement?.querySelector('.text-gray-400');
      expect(iconContainer).toBeInTheDocument();
    });

    it('应该在没有图标时不显示图标容器', () => {
      render(<StatCard {...defaultProps} icon={undefined} />);

      const iconContainer = screen
        .getByText('今日专注时间')
        .parentElement?.querySelector('.text-gray-400');
      expect(iconContainer).not.toBeInTheDocument();
    });

    it('应该处理未知图标', () => {
      render(<StatCard {...defaultProps} icon='unknown' />);

      const iconContainer = screen
        .getByText('今日专注时间')
        .parentElement?.querySelector('.text-gray-400');
      expect(iconContainer).not.toBeInTheDocument();
    });
  });

  describe('样式测试', () => {
    it('应该应用默认背景色', () => {
      const { container } = render(<StatCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white');
    });

    it('应该应用自定义背景色', () => {
      const { container } = render(
        <StatCard {...defaultProps} bgColor='bg-blue-50' />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-blue-50');
      expect(card).toHaveClass('bg-white');
    });

    it('应该应用自定义类名', () => {
      const { container } = render(
        <StatCard {...defaultProps} className='custom-card' />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-card');
    });

    it('应该包含基础样式类', () => {
      const { container } = render(<StatCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(
        'rounded-lg',
        'shadow-sm',
        'border',
        'transition-all',
        'duration-200'
      );
      expect(card).toHaveClass('p-4', 'sm:p-6');
      expect(card).toHaveClass('border-gray-200');
    });
  });

  describe('复杂场景测试', () => {
    it('应该正确渲染完整的统计卡片', () => {
      const complexProps = {
        title: '本周完成任务',
        value: 2500,
        unit: '个',
        trend: {
          value: 25,
          direction: 'up' as const,
          label: '比上周',
        },
        icon: 'task',
        bgColor: 'bg-green-50',
        className: 'complex-card',
      };

      const { container } = render(<StatCard {...complexProps} />);

      expect(screen.getByText('本周完成任务')).toBeInTheDocument();
      expect(screen.getByText('2.5k')).toBeInTheDocument();
      expect(screen.getByText('个')).toBeInTheDocument();
      expect(screen.getByText('25%')).toBeInTheDocument();
      expect(screen.getByText('比上周')).toBeInTheDocument();

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-green-50', 'complex-card');
    });

    it('应该处理零值', () => {
      render(<StatCard {...defaultProps} value={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('应该处理负值', () => {
      render(<StatCard {...defaultProps} value={-100} />);

      expect(screen.getByText('-100')).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('应该有适当的语义结构', () => {
      render(<StatCard {...defaultProps} />);

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('今日专注时间');
    });

    it('应该有清晰的文本层次', () => {
      const trend = {
        value: 15,
        direction: 'up' as const,
        label: '比昨日',
      };
      render(<StatCard {...defaultProps} trend={trend} unit='分钟' />);

      const value = screen.getByText('120');
      expect(value).toHaveClass('font-bold', 'text-gray-900');
      expect(value).toHaveClass('text-2xl', 'sm:text-3xl');

      const trendValue = screen.getByText('15%');
      expect(trendValue.parentElement).toHaveClass('text-green-600');
    });
  });
});
