import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// 设置MSW服务器，使用定义的处理器
export const server = setupServer(...handlers); 