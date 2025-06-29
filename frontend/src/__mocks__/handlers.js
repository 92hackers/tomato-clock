import { http, HttpResponse } from 'msw';

export const handlers = [
  // 健康检查端点
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // 获取任务列表
  http.get('/api/tasks', () => {
    return HttpResponse.json({
      tasks: [
        {
          id: 1,
          title: 'Test Task 1',
          description: 'This is a test task',
          completed: false,
          createdAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 2,
          title: 'Test Task 2',
          description: 'Another test task',
          completed: true,
          createdAt: '2025-01-01T01:00:00Z',
        },
      ],
    });
  }),

  // 创建新任务
  http.post('/api/tasks', async ({ request }) => {
    const newTask = await request.json();
    return HttpResponse.json({
      id: Date.now(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  // 更新任务
  http.put('/api/tasks/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedTask = await request.json();
    return HttpResponse.json({
      id: parseInt(id),
      ...updatedTask,
      updatedAt: new Date().toISOString(),
    });
  }),

  // 删除任务
  http.delete('/api/tasks/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ 
      message: `Task ${id} deleted successfully` 
    });
  }),

  // 番茄钟相关API
  http.get('/api/pomodoro/status', () => {
    return HttpResponse.json({
      isRunning: false,
      timeRemaining: 1500, // 25分钟
      currentSession: 'focus',
      sessionCount: 0,
    });
  }),

  http.post('/api/pomodoro/start', () => {
    return HttpResponse.json({
      isRunning: true,
      timeRemaining: 1500,
      currentSession: 'focus',
      sessionCount: 1,
    });
  }),

  http.post('/api/pomodoro/pause', () => {
    return HttpResponse.json({
      isRunning: false,
      timeRemaining: 1200, // 剩余20分钟
      currentSession: 'focus',
      sessionCount: 1,
    });
  }),

  http.post('/api/pomodoro/reset', () => {
    return HttpResponse.json({
      isRunning: false,
      timeRemaining: 1500,
      currentSession: 'focus',
      sessionCount: 0,
    });
  }),

  // 错误处理示例
  http.get('/api/error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),
]; 