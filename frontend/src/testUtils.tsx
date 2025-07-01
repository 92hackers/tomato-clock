import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// 自定义测试Provider组件
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid='test-wrapper'>{children}</div>;
};

// 自定义render函数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// 重新导出所有testing-library的内容
export * from '@testing-library/react';

// 覆盖render函数
export { customRender as render };

// 测试助手函数

/**
 * 等待指定时间
 */
export const waitFor = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 创建测试用的任务数据
 */
export const createMockTask = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  title: 'Test Task',
  description: 'This is a test task',
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

/**
 * 创建测试用的番茄钟状态数据
 */
export const createMockPomodoroState = (overrides = {}) => ({
  isRunning: false,
  timeRemaining: 1500, // 25分钟
  currentSession: 'focus' as const,
  sessionCount: 0,
  ...overrides,
});

/**
 * 模拟用户交互的助手函数
 */
export const mockUserEvent = {
  click: async (element: HTMLElement) => {
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.click(element);
  },

  type: async (element: HTMLElement, text: string) => {
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.change(element, { target: { value: text } });
  },

  submit: async (form: HTMLElement) => {
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.submit(form);
  },
};

/**
 * 断言助手函数
 */
export const expectElement = {
  toBeInDocument: (element: HTMLElement | null) => {
    expect(element).toBeInTheDocument();
  },

  toHaveText: (element: HTMLElement | null, text: string) => {
    expect(element).toHaveTextContent(text);
  },

  toBeVisible: (element: HTMLElement | null) => {
    expect(element).toBeVisible();
  },

  toBeDisabled: (element: HTMLElement | null) => {
    expect(element).toBeDisabled();
  },
};

/**
 * Console mock助手
 */
export const mockConsole = () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  return originalConsole;
};
