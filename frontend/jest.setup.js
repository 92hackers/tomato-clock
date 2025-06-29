import 'whatwg-fetch';
import '@testing-library/jest-dom';

// MSW (Mock Service Worker) 设置 - 临时禁用
// import { server } from './src/__mocks__/server';

// 在所有测试之前启动MSW服务器
// beforeAll(() => {
//   server.listen();
// });

// 在每个测试之后重置handlers
// afterEach(() => {
//   server.resetHandlers();
// });

// 在所有测试完成后关闭MSW服务器
// afterAll(() => {
//   server.close();
// });

// 全局测试助手
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 设置测试超时时间
jest.setTimeout(10000); 