# 番茄时钟技术实现

本文档详细描述了番茄时钟应用的技术实现方案，包括前后端分离架构、数据库设计、API接口设计和部署方案等方面。

## 1. 技术架构概览

番茄时钟应用采用现代化的前后端分离架构，具备高性能、可扩展性和良好的开发体验。

### 1.1 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户界面层     │    │   API 网关层    │    │   数据存储层     │
│                │    │                │    │                │
│   Next.js      │◄──►│   Gin Router   │◄──►│  PostgreSQL    │
│   React 18     │    │   Middleware   │    │  Redis         │
│   TypeScript   │    │   Session Auth │    │  File Storage  │
│   Tailwind CSS │    │   Validation   │    │                │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 技术选择理由

- **Next.js**: 提供 SSR/SSG、路由优化、性能优化等开箱即用功能
- **Gin**: 高性能 Go Web 框架，简洁易用，性能优秀
- **PostgreSQL**: 可靠的关系型数据库，支持复杂查询和事务
- **Redis**: 高性能缓存，支持会话存储和实时数据
- **TypeScript**: 类型安全，提升开发效率和代码质量

## 2. 项目结构设计

### 2.1 前端结构 (Next.js)

```
frontend/
├── src/
│   ├── app/                    # App Router 路由
│   │   ├── (auth)/            # 认证相关页面
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # 主仪表盘
│   │   ├── tasks/             # 任务管理
│   │   ├── statistics/        # 统计分析
│   │   ├── settings/          # 设置页面
│   │   ├── achievements/      # 成就系统
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx          # 首页
│   │   ├── loading.tsx       # 加载组件
│   │   ├── error.tsx         # 错误页面
│   │   └── globals.css       # 全局样式
│   │
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   ├── Timer/            # 计时器组件
│   │   │   ├── TimerDisplay.tsx
│   │   │   ├── TimerControls.tsx
│   │   │   └── ModeSelector.tsx
│   │   ├── Task/             # 任务组件
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   └── AddTaskForm.tsx
│   │   ├── Statistics/       # 统计组件
│   │   │   ├── StatsCard.tsx
│   │   │   ├── Chart.tsx
│   │   │   └── TimeHeatmap.tsx
│   │   └── Layout/           # 布局组件
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useTimer.ts       # 计时器逻辑
│   │   ├── useTasks.ts       # 任务管理
│   │   ├── useAuth.ts        # 身份认证
│   │   ├── useLocalStorage.ts # 本地存储
│   │   ├── useSocket.ts      # Socket.IO 连接管理
│   │   └── useRealtimeSync.ts # 实时数据同步
│   │
│   ├── store/                # 状态管理 (Zustand)
│   │   ├── timerStore.ts     # 计时器状态
│   │   ├── taskStore.ts      # 任务状态
│   │   ├── authStore.ts      # 认证状态
│   │   ├── socketStore.ts    # Socket.IO 连接状态
│   │   └── settingsStore.ts  # 设置状态
│   │
│   ├── lib/                  # 工具库和配置
│   │   ├── api.ts           # API 客户端
│   │   ├── auth.ts          # 认证工具
│   │   ├── socket.ts        # Socket.IO 客户端配置
│   │   ├── utils.ts         # 通用工具函数
│   │   ├── constants.ts     # 常量定义
│   │   ├── validations.ts   # 表单验证
│   │   └── db.ts           # 客户端数据库操作
│   │
│   └── types/               # TypeScript 类型定义
│       ├── timer.ts
│       ├── task.ts
│       ├── user.ts
│       ├── socket.ts        # Socket.IO 事件类型定义
│       ├── api.ts
│       └── index.ts
│
├── __tests__/               # 测试文件
│   ├── components/          # 组件测试
│   │   ├── ui/             # UI 组件测试
│   │   ├── Timer/          # 计时器组件测试
│   │   ├── Task/           # 任务组件测试
│   │   └── Statistics/     # 统计组件测试
│   ├── hooks/              # Hook 测试
│   ├── store/              # 状态管理测试
│   ├── lib/                # 工具函数测试
│   └── integration/        # 集成测试
│
├── public/                  # 静态资源
│   ├── icons/              # 图标文件
│   ├── sounds/             # 提醒音效
│   ├── images/             # 图片资源
│   └── favicon.ico
│
├── jest.config.js          # Jest 测试配置
├── jest.setup.js           # Jest 测试环境设置
├── tailwind.config.js      # Tailwind CSS 配置
├── next.config.js          # Next.js 配置
├── tsconfig.json           # TypeScript 配置
├── package.json
└── README.md
```

### 2.2 后端结构 (Gin + Go)

```
backend/
├── cmd/
│   └── server/
│       └── main.go         # 应用入口点
│
├── internal/               # 内部代码包
│   ├── handlers/          # HTTP 处理器
│   │   ├── auth.go        # 认证相关处理器
│   │   ├── timer.go       # 计时器处理器
│   │   ├── task.go        # 任务处理器
│   │   ├── user.go        # 用户处理器
│   │   ├── statistics.go  # 统计处理器
│   │   ├── achievement.go # 成就处理器
│   │   └── socket.go      # Socket.IO 处理器
│   │
│   ├── middleware/        # 中间件
│   │   ├── auth.go        # Session 认证中间件
│   │   ├── cors.go        # CORS 中间件
│   │   ├── logger.go      # 日志中间件
│   │   ├── ratelimit.go   # 限流中间件
│   │   ├── recovery.go    # 恢复中间件
│   │   └── socket.go      # Socket.IO 认证中间件
│   │
│   ├── models/            # 数据模型
│   │   ├── user.go        # 用户模型
│   │   ├── task.go        # 任务模型
│   │   ├── timer_session.go # 计时会话模型
│   │   ├── achievement.go # 成就模型
│   │   ├── socket_event.go # Socket.IO 事件模型
│   │   └── base.go        # 基础模型
│   │
│   ├── services/          # 业务逻辑层
│   │   ├── auth_service.go    # 认证服务
│   │   ├── timer_service.go   # 计时器服务
│   │   ├── task_service.go    # 任务服务
│   │   ├── stats_service.go   # 统计服务
│   │   ├── achievement_service.go # 成就服务
│   │   └── socket_service.go  # Socket.IO 服务
│   │
│   ├── socket/            # Socket.IO 相关代码
│   │   ├── server.go      # Socket.IO 服务器配置
│   │   ├── events.go      # 事件处理器
│   │   ├── rooms.go       # 房间管理
│   │   └── middleware.go  # Socket.IO 中间件
│   │
│   ├── repository/        # 数据访问层
│   │   ├── user_repo.go   # 用户数据访问
│   │   ├── task_repo.go   # 任务数据访问
│   │   ├── timer_repo.go  # 计时器数据访问
│   │   └── interfaces.go  # 接口定义
│   │
│   ├── config/            # 配置管理
│   │   ├── config.go      # 配置结构
│   │   ├── database.go    # 数据库配置
│   │   ├── redis.go       # Redis 配置
│   │   ├── socket.go      # Socket.IO 配置
│   │   └── session.go     # Session 配置
│   │
│   └── utils/             # 工具函数
│       ├── response.go    # 响应格式化
│       ├── validation.go  # 数据验证
│       ├── crypto.go      # 加密解密
│       └── time.go        # 时间处理
│
├── tests/                 # 测试文件
│   ├── unit/             # 单元测试
│   │   ├── handlers/     # 处理器测试
│   │   ├── services/     # 服务测试
│   │   ├── models/       # 模型测试
│   │   └── utils/        # 工具函数测试
│   ├── integration/      # 集成测试
│   │   ├── api/          # API 集成测试
│   │   ├── database/     # 数据库集成测试
│   │   └── socket/       # Socket.IO 集成测试
│   └── fixtures/         # 测试数据
│       ├── users.json
│       ├── tasks.json
│       └── timer_sessions.json
│
├── migrations/            # 数据库迁移文件
│   ├── 001_create_users.sql
│   ├── 002_create_tasks.sql
│   ├── 003_create_timer_sessions.sql
│   └── 004_create_achievements.sql
│
├── docs/                  # API 文档
│   └── swagger.yaml
│
├── scripts/               # 部署脚本
│   ├── build.sh
│   ├── deploy.sh
│   └── test.sh
│
├── go.mod                 # Go 模块定义
└── go.sum                 # Go 模块校验文件
```

### 2.3 测试架构设计

#### 2.3.1 测试分层策略

本项目采用标准的测试金字塔结构，确保全面的测试覆盖：

```
           E2E Tests (10%)
         ↗               ↖
    Integration Tests (20%)
  ↗                       ↖
Unit Tests (70%)
```

#### 2.3.2 前端测试架构

**测试工具栈**
- **Jest**: 测试运行器和断言库
- **Testing Library**: React 组件测试
- **MSW (Mock Service Worker)**: API 模拟
- **Playwright**: E2E 测试

**测试结构**
```
frontend/__tests__/
├── __mocks__/              # 模拟数据和函数
│   ├── api.ts             # API 模拟
│   ├── localStorage.ts    # localStorage 模拟
│   └── socket.ts          # Socket.IO 模拟
│
├── components/            # 组件测试
│   ├── Timer/
│   │   ├── TimerDisplay.test.tsx
│   │   ├── TimerControls.test.tsx
│   │   └── ModeSelector.test.tsx
│   ├── Task/
│   │   ├── TaskList.test.tsx
│   │   ├── TaskItem.test.tsx
│   │   └── AddTaskForm.test.tsx
│   └── ui/
│       ├── Button.test.tsx
│       ├── Input.test.tsx
│       └── Modal.test.tsx
│
├── hooks/                 # Hook 测试
│   ├── useTimer.test.ts
│   ├── useTasks.test.ts
│   ├── useAuth.test.ts
│   └── useSocket.test.ts
│
├── store/                 # 状态管理测试
│   ├── timerStore.test.ts
│   ├── taskStore.test.ts
│   └── authStore.test.ts
│
├── lib/                   # 工具函数测试
│   ├── api.test.ts
│   ├── utils.test.ts
│   └── validations.test.ts
│
├── integration/           # 集成测试
│   ├── timer-task-flow.test.tsx
│   ├── auth-flow.test.tsx
│   └── socket-sync.test.tsx
│
└── e2e/                   # E2E 测试
    ├── timer-workflow.spec.ts
    ├── task-management.spec.ts
    └── user-auth.spec.ts
```

#### 2.3.3 后端测试架构

**测试工具栈**
- **Testify**: 断言库和测试套件
- **Ginkgo**: BDD 风格测试框架
- **GoMock**: 接口模拟
- **Testcontainers**: 集成测试容器化

**测试结构**
```
backend/tests/
├── unit/                  # 单元测试
│   ├── handlers/
│   │   ├── auth_test.go
│   │   ├── timer_test.go
│   │   ├── task_test.go
│   │   └── user_test.go
│   ├── services/
│   │   ├── auth_service_test.go
│   │   ├── timer_service_test.go
│   │   ├── task_service_test.go
│   │   └── stats_service_test.go
│   ├── models/
│   │   ├── user_test.go
│   │   ├── task_test.go
│   │   └── timer_session_test.go
│   └── utils/
│       ├── response_test.go
│       ├── validation_test.go
│       └── crypto_test.go
│
├── integration/           # 集成测试
│   ├── api/
│   │   ├── auth_api_test.go
│   │   ├── timer_api_test.go
│   │   └── task_api_test.go
│   ├── database/
│   │   ├── user_repo_test.go
│   │   ├── task_repo_test.go
│   │   └── migration_test.go
│   └── socket/
│       ├── connection_test.go
│       ├── events_test.go
│       └── rooms_test.go
│
├── fixtures/              # 测试数据
│   ├── users.json
│   ├── tasks.json
│   └── timer_sessions.json
│
├── mocks/                 # 生成的模拟对象
│   ├── service_mocks.go
│   ├── repository_mocks.go
│   └── socket_mocks.go
│
└── helpers/               # 测试辅助函数
    ├── database.go        # 测试数据库设置
    ├── server.go          # 测试服务器设置
    └── fixtures.go        # 测试数据加载
```

#### 2.3.4 TDD 开发流程

**Red-Green-Refactor 循环**

1. **🔴 Red 阶段**: 编写失败的测试
```go
// 示例：后端单元测试
func TestCreateTimer(t *testing.T) {
    // Given
    userID := uint(1)
    duration := 25 * 60 // 25 minutes
    
    // When
    timer, err := timerService.CreateTimer(userID, duration)
    
    // Then
    assert.NoError(t, err)
    assert.Equal(t, duration, timer.Duration)
    assert.Equal(t, models.TimerStatusPending, timer.Status)
}
```

```typescript
// 示例：前端组件测试
describe('TimerDisplay', () => {
  it('should display timer in MM:SS format', () => {
    // Given
    const timeLeft = 1500; // 25:00
    
    // When
    render(<TimerDisplay timeLeft={timeLeft} />);
    
    // Then
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });
});
```

2. **🟢 Green 阶段**: 编写最小代码使测试通过
3. **🔄 Refactor 阶段**: 重构代码提高质量

#### 2.3.5 测试覆盖率要求

- **后端代码**: 最低 85% 覆盖率，关键业务逻辑 95%+
- **前端组件**: 最低 80% 覆盖率，核心组件 90%+
- **API 接口**: 100% 覆盖率（包括错误场景）
- **关键业务流程**: 100% 覆盖率（端到端测试）

#### 2.3.6 测试自动化

**持续集成流程**
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: 安装依赖
        run: cd frontend && pnpm ci
      - name: 运行前端单元测试
        run: cd frontend && pnpm run test:unit
      - name: 运行前端集成测试
        run: cd frontend && pnpm run test:integration
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:6
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - name: Setup Go
        uses: actions/setup-go@v3
        with:
          go-version: '1.21'
      - name: Run unit tests
        run: cd backend && go test ./... -v
      - name: Run integration tests
        run: cd backend && go test -tags=integration ./... -v
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [frontend-tests, backend-tests]
    steps:
      - uses: actions/checkout@v3
      - name: Setup Docker Compose
        run: docker-compose up -d
      - name: Run E2E tests
        run: cd frontend && pnpm run test:e2e
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: e2e-results
          path: frontend/test-results
```

## 3. 数据库设计

### 3.1 PostgreSQL 表结构

#### 用户表 (users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

#### 任务表 (tasks)
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_pomodoros INTEGER DEFAULT 1,
    completed_pomodoros INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, archived
    priority INTEGER DEFAULT 0,
    tags TEXT[],
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

#### 计时会话表 (timer_sessions)
```sql
CREATE TABLE timer_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
    session_type VARCHAR(20) NOT NULL, -- focus, short_break, long_break
    duration INTEGER NOT NULL, -- 秒数
    completed_duration INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, paused, completed, cancelled
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 成就表 (achievements)
```sql
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    type VARCHAR(50), -- daily, weekly, milestone
    requirement JSONB, -- 成就要求的JSON配置
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);
```

#### 用户设置表 (user_settings)
```sql
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    focus_duration INTEGER DEFAULT 1500, -- 25分钟
    short_break_duration INTEGER DEFAULT 300, -- 5分钟
    long_break_duration INTEGER DEFAULT 900, -- 15分钟
    long_break_interval INTEGER DEFAULT 4, -- 每4个番茄后长休息
    auto_start_breaks BOOLEAN DEFAULT false,
    auto_start_focus BOOLEAN DEFAULT false,
    sound_enabled BOOLEAN DEFAULT true,
    sound_volume INTEGER DEFAULT 80,
    notifications_enabled BOOLEAN DEFAULT true,
    theme VARCHAR(20) DEFAULT 'light', -- light, dark, auto
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 Redis 数据结构

#### 会话存储
```
session:{user_id} -> {
    "user_id": 123,
    "username": "user",
    "expires_at": "2024-01-01T00:00:00Z"
}
```

#### 活跃计时器缓存
```
timer:{user_id} -> {
    "session_id": 456,
    "type": "focus",
    "start_time": 1703123456,
    "duration": 1500,
    "paused_at": null
}
```

#### 实时统计缓存
```
stats:{user_id}:{date} -> {
    "date": "2024-01-01",
    "completed_pomodoros": 5,
    "focus_time": 7500,
    "completed_tasks": 3
}
```

## 3.5 TypeScript 类型定义

为了保证前后端数据交互的类型安全，以下是应用中使用的 TypeScript 类型定义。

### 3.5.1 用户相关类型

```typescript
// 用户模型
interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  timezone: string;
  settings: UserSettings;
  created_at: Date;
  updated_at: Date;
}

// 用户设置模型
interface UserSettings {
  id: number;
  user_id: number;
  focus_duration: number; // 25分钟 = 1500秒
  short_break_duration: number; // 5分钟 = 300秒
  long_break_duration: number; // 15分钟 = 900秒
  long_break_interval: number; // 每4个番茄后长休息
  auto_start_breaks: boolean;
  auto_start_focus: boolean;
  sound_enabled: boolean;
  sound_volume: number; // 0-100
  notifications_enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  created_at: Date;
  updated_at: Date;
}
```

### 3.5.2 计时器相关类型

```typescript
// 计时器会话模型
interface TimerSession {
  id: number;
  user_id: number;
  task_id?: number;
  session_type: 'focus' | 'short_break' | 'long_break';
  duration: number; // 秒数
  completed_duration: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  started_at: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// 简化的计时器同步数据结构
interface TimerSyncData {
  sessionId: number;
  remainingTime: number;
  status: 'running' | 'paused' | 'completed';
  currentMode: 'focus' | 'short_break' | 'long_break';
  taskId?: number;
  lastUpdated: string;
}
```

### 3.5.3 任务相关类型

```typescript
// 任务模型
interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  estimated_pomodoros: number;
  completed_pomodoros: number;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority: number; // 0-5，数字越大优先级越高
  tags: string[];
  due_date?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// 任务创建请求
interface CreateTaskRequest {
  title: string;
  description?: string;
  estimated_pomodoros: number;
  priority?: number;
  tags?: string[];
  due_date?: Date;
}

// 任务更新请求
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  estimated_pomodoros?: number;
  priority?: number;
  tags?: string[];
  due_date?: Date;
  status?: 'pending' | 'in_progress' | 'completed' | 'archived';
}
```

### 3.5.4 统计相关类型

```typescript
// 统计数据模型
interface DailyStats {
  date: Date;
  user_id: number;
  completed_pomodoros: number;
  focus_time: number; // 总专注时间（秒）
  completed_tasks: number;
  break_time: number; // 总休息时间（秒）
  efficiency_score: number; // 效率评分 0-100
}

interface WeeklyStats {
  start_date: Date;
  end_date: Date;
  user_id: number;
  total_pomodoros: number;
  total_focus_time: number;
  total_completed_tasks: number;
  daily_stats: DailyStats[];
  weekly_average: {
    pomodoros_per_day: number;
    focus_time_per_day: number;
    tasks_per_day: number;
  };
}

interface MonthlyStats {
  year: number;
  month: number;
  user_id: number;
  total_pomodoros: number;
  total_focus_time: number;
  total_completed_tasks: number;
  weekly_stats: WeeklyStats[];
  monthly_trends: {
    pomodoro_trend: number; // 增长率 %
    focus_time_trend: number;
    task_completion_trend: number;
  };
}

// 热力图数据模型
interface HeatmapData {
  date: string; // YYYY-MM-DD
  pomodoros: number;
  focus_time: number;
  intensity: number; // 0-4，热力强度
}
```

### 3.5.5 成就相关类型

```typescript
// 成就模型
interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'milestone' | 'streak';
  requirement: AchievementRequirement;
  points: number; // 成就奖励积分
  created_at: Date;
}

interface AchievementRequirement {
  type: 'pomodoro_count' | 'focus_time' | 'task_completion' | 'streak_days';
  target_value: number;
  time_period?: 'daily' | 'weekly' | 'monthly' | 'all_time';
}

interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  unlocked_at: Date;
  achievement: Achievement;
}

// 专注技巧模型
interface FocusTip {
  id: number;
  title: string;
  content: string;
  category: 'time_management' | 'focus_techniques' | 'productivity' | 'wellness';
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
```

### 3.5.6 专注历程相关类型

```typescript
// 专注历程模型
interface FocusJourney {
  id: number;
  user_id: number;
  milestone_type: 'first_pomodoro' | 'week_streak' | 'month_streak' | 'total_hours' | 'task_master';
  milestone_value: number;
  title: string;
  description: string;
  achieved_at: Date;
  badge_icon: string;
}

interface ProgressMetrics {
  user_id: number;
  focus_ability: number; // 0-100，专注能力评分
  consistency: number; // 0-100，持续性评分
  efficiency: number; // 0-100，效率评分
  improvement_trend: number; // -100 to 100，进步趋势
  total_focus_hours: number;
  total_completed_tasks: number;
  longest_streak_days: number;
  current_streak_days: number;
  updated_at: Date;
}

interface LearningCurve {
  user_id: number;
  week_number: number; // 使用应用的第几周
  average_session_length: number; // 平均专注时长
  completion_rate: number; // 完成率
  break_adherence: number; // 休息遵循率
  weekly_improvement: number; // 周改进率
}
```

### 3.5.7 Socket.IO 事件类型

```typescript
// 简化的 Socket.IO 事件类型定义（仅用于单用户数据同步）
interface ServerToClientEvents {
  // 计时器状态同步
  timer_sync: (data: TimerSyncData) => void;
  
  // 任务数据同步
  task_sync: (data: TaskSyncData) => void;
  
  // 成就通知
  achievement_unlocked: (data: AchievementData) => void;
  
  // 连接状态
  connected: () => void;
  error: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  // 数据同步请求
  sync_request: () => void;
  
  // 心跳检测
  ping: () => void;
}

// 简化的数据同步结构
interface TimerSyncData {
  sessionId: number;
  remainingTime: number;
  status: 'running' | 'paused' | 'completed';
  currentMode: 'focus' | 'short_break' | 'long_break';
  taskId?: number;
  lastUpdated: string;
}

interface TaskSyncData {
  action: 'created' | 'updated' | 'deleted';
  task: Task;
  lastUpdated: string;
}

interface AchievementData {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}
```

## 4. API 接口设计

### 4.1 RESTful API 规范

#### 基础路径
```
/api/v1/
```

#### 认证相关
```
POST   /api/v1/auth/register      # 用户注册
POST   /api/v1/auth/login         # 用户登录
POST   /api/v1/auth/logout        # 用户登出
GET    /api/v1/auth/me           # 获取当前用户信息
GET    /api/v1/auth/session      # 获取会话状态
```

#### 计时器相关
```
POST   /api/v1/timer/start        # 开始计时
POST   /api/v1/timer/pause        # 暂停计时
POST   /api/v1/timer/resume       # 恢复计时
POST   /api/v1/timer/stop         # 停止计时
GET    /api/v1/timer/current      # 获取当前计时状态
GET    /api/v1/timer/sessions     # 获取计时历史
```

#### 任务管理
```
GET    /api/v1/tasks             # 获取任务列表
POST   /api/v1/tasks             # 创建新任务
GET    /api/v1/tasks/:id         # 获取任务详情
PUT    /api/v1/tasks/:id         # 更新任务
DELETE /api/v1/tasks/:id         # 删除任务
POST   /api/v1/tasks/:id/complete # 完成任务
```

#### 统计分析
```
GET    /api/v1/stats/overview     # 获取统计概览
GET    /api/v1/stats/daily        # 获取每日统计
GET    /api/v1/stats/weekly       # 获取每周统计
GET    /api/v1/stats/monthly      # 获取每月统计
GET    /api/v1/stats/heatmap      # 获取热力图数据
```

#### 成就系统
```
GET    /api/v1/achievements       # 获取所有成就
GET    /api/v1/achievements/user  # 获取用户成就
POST   /api/v1/achievements/unlock # 解锁成就
```

#### 用户设置
```
GET    /api/v1/settings          # 获取用户设置
PUT    /api/v1/settings          # 更新用户设置
```

### 4.2 API 响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数无效",
    "details": {
      "field": "username",
      "issue": "用户名不能为空"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 4.3 Socket.IO 实时数据同步

Socket.IO 用于单用户场景下的数据自动同步，确保多设备间的数据一致性。

#### 设计说明

本实现采用简化的单用户数据同步设计，具有以下特点：

**设计原则：**
- **专注核心功能**: 仅实现数据同步，避免过度设计
- **单用户场景**: 不支持用户间通信，无需复杂的房间管理
- **简单可靠**: 减少复杂性，提高系统稳定性
- **高效同步**: 按需同步，避免不必要的数据传输

**简化内容：**
- ❌ 移除多用户房间管理系统
- ❌ 移除复杂的连接池管理
- ❌ 移除用户间通信功能  
- ❌ 移除复杂的事件广播机制
- ✅ 保留核心数据同步功能
- ✅ 保留自动重连和错误处理
- ✅ 保留心跳检测机制

**同步策略：**
- 客户端连接时请求完整数据同步
- 服务端数据变更时主动推送更新
- 支持按需同步请求
- 简化的冲突解决机制

#### 前端 Socket.IO 配置

```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';

// 简化的事件接口
export interface ServerToClientEvents {
  timer_sync: (data: TimerSyncData) => void;
  task_sync: (data: TaskSyncData) => void;
  achievement_unlocked: (data: AchievementData) => void;
  connected: () => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  sync_request: () => void;
  ping: () => void;
}

// 简化的数据类型
export interface TimerSyncData {
  sessionId: number;
  remainingTime: number;
  status: 'running' | 'paused' | 'completed';
  currentMode: 'focus' | 'short_break' | 'long_break';
  taskId?: number;
  lastUpdated: string;
}

export interface TaskSyncData {
  action: 'created' | 'updated' | 'deleted';
  task: any; // 使用 Task 类型
  lastUpdated: string;
}

export interface AchievementData {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

// 简化的 Socket 管理器
class SimpleSocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  connect(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080', {
      withCredentials: true, // 允许携带 cookie
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  requestSync() {
    if (this.socket?.connected) {
      this.socket.emit('sync_request');
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketManager = new SimpleSocketManager();
```

#### 简化的前端 Socket Hook

```typescript
// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { socketManager } from '@/lib/socket';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      // 连接 Socket.IO，session 会通过 cookie 自动发送
      socketRef.current = socketManager.connect();
    } else {
      // 断开连接
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated]);

  return socketRef.current;
};
```

#### 简化的后端 Socket.IO 服务器

```go
// internal/socket/server.go
package socket

import (
    "log"
    "net/http"
    "encoding/json"
    
    socketio "github.com/googollee/go-socket.io"
    "github.com/googollee/go-socket.io/engineio"
    "github.com/googollee/go-socket.io/engineio/transport"
    "github.com/googollee/go-socket.io/engineio/transport/polling"
    "github.com/googollee/go-socket.io/engineio/transport/websocket"
)

// 简化的服务器结构
type SimpleSocketServer struct {
    socketServer *socketio.Server
    userSockets  map[string]string // socket.id -> user_id
}

func NewSimpleSocketServer() *SimpleSocketServer {
    server := &SimpleSocketServer{
        userSockets: make(map[string]string),
    }

    // 创建 Socket.IO 服务器
    socketServer := socketio.NewServer(&engineio.Options{
        Transports: []transport.Transport{
            &polling.Transport{
                CheckOrigin: func(r *http.Request) bool {
                    return true
                },
            },
            &websocket.Transport{
                CheckOrigin: func(r *http.Request) bool {
                    return true
                },
            },
        },
    })

    server.socketServer = socketServer
    server.setupEvents()
    
    return server
}

func (s *SimpleSocketServer) setupEvents() {
    // 连接事件
    s.socketServer.OnConnect("/", func(conn socketio.Conn) error {
        log.Printf("Socket connected: %s", conn.ID())
        
        // 基于 Session 的认证检查
        sessionID, err := extractSessionFromRequest(conn.Context().(*gin.Context).Request)
        if err != nil {
            return fmt.Errorf("authentication required: %v", err)
        }
        
        userID, err := validateSession(sessionID)
        if err != nil {
            return fmt.Errorf("authentication failed: %v", err)
        }
        
        // 存储用户连接
        s.userSockets[conn.ID()] = userID
        
        // 发送连接确认
        conn.Emit("connected")
        
        return nil
    })

    // 断开连接事件
    s.socketServer.OnDisconnect("/", func(conn socketio.Conn, reason string) {
        log.Printf("Socket disconnected: %s, reason: %s", conn.ID(), reason)
        delete(s.userSockets, conn.ID())
    })

    // 数据同步请求
    s.socketServer.OnEvent("/", "sync_request", func(conn socketio.Conn) {
        userID := s.userSockets[conn.ID()]
        log.Printf("Sync request from user %s", userID)
        
        // 获取最新数据并发送
        s.sendCurrentData(conn, userID)
    })

    // 心跳检测
    s.socketServer.OnEvent("/", "ping", func(conn socketio.Conn) {
        conn.Emit("pong")
    })

    // 错误处理
    s.socketServer.OnError("/", func(conn socketio.Conn, err error) {
        log.Printf("Socket error for %s: %v", conn.ID(), err)
    })
}

// 发送当前数据状态
func (s *SimpleSocketServer) sendCurrentData(conn socketio.Conn, userID string) {
    // 发送计时器状态
    if timerData := s.getCurrentTimerState(userID); timerData != nil {
        conn.Emit("timer_sync", timerData)
    }
    
    // 发送任务数据（如果有更新）
    if taskUpdates := s.getRecentTaskUpdates(userID); len(taskUpdates) > 0 {
        for _, update := range taskUpdates {
            conn.Emit("task_sync", update)
        }
    }
}

// 广播给用户的所有连接
func (s *SimpleSocketServer) BroadcastToUser(userID string, event string, data interface{}) {
    for socketID, uid := range s.userSockets {
        if uid == userID {
            if conn := s.socketServer.GetConnection(socketID); conn != nil {
                conn.Emit(event, data)
            }
        }
    }
}

// 获取服务器实例
func (s *SimpleSocketServer) GetServer() *socketio.Server {
    return s.socketServer
}

// 辅助方法（需要实现）
func (s *SimpleSocketServer) getCurrentTimerState(userID string) interface{} {
    // 从数据库或缓存获取当前计时器状态
    // 示例实现
    timerData := TimerSyncData{
        SessionID:     1,
        RemainingTime: 1500,
        Status:        "running",
        CurrentMode:   "focus",
        TaskID:        nil,
        LastUpdated:   time.Now().Format(time.RFC3339),
    }
    return timerData
}

func (s *SimpleSocketServer) getRecentTaskUpdates(userID string) []interface{} {
    // 获取最近的任务更新
    // 示例：返回最近5分钟内的任务变更
    var updates []interface{}
    
    // 这里应该查询数据库获取最近的任务变更
    // updates = append(updates, TaskSyncData{
    //     Action:      "updated",
    //     Task:        task,
    //     LastUpdated: time.Now().Format(time.RFC3339),
    // })
    
    return updates
}

// 主动推送数据更新给用户
func (s *SimpleSocketServer) NotifyTimerUpdate(userID string, timerData TimerSyncData) {
    s.BroadcastToUser(userID, "timer_sync", timerData)
}

func (s *SimpleSocketServer) NotifyTaskUpdate(userID string, taskData TaskSyncData) {
    s.BroadcastToUser(userID, "task_sync", taskData)
}
```

## 5. 核心功能实现

### 5.1 用户认证系统

#### 5.1.1 前端认证架构

**认证状态管理**
```typescript
// store/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  loginWithCredentials: (credentials: LoginCredentials) => Promise<void>;
  registerWithCredentials: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearAuthError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  loginWithCredentials: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      // 存储令牌
      localStorage.setItem('auth_token', token);
      
      // 设置 API 默认头部
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || '登录失败',
        isLoading: false,
      });
      throw error;
    }
  },

  registerWithCredentials: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('auth_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || '注册失败',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('登出请求失败:', error);
    }
    
    // 清除本地存储
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }
    
    set({ isLoading: true });
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/me');
      
      set({
        user: response.data,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // 令牌无效，清除本地状态
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearAuthError: () => set({ error: null }),
}));
```

**认证 Hook**
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    loginWithCredentials,
    registerWithCredentials,
    logout,
    checkAuth,
    clearAuthError,
  } = useAuthStore();

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuth();
  }, []);

  // 计算属性
  const isLoggedIn = useMemo(() => isAuthenticated && user !== null, [isAuthenticated, user]);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: isLoggedIn,
    loginWithCredentials,
    registerWithCredentials,
    logout,
    clearAuthError,
  };
};
```

**受保护路由组件**
```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  loginPath?: string;
  redirectOnUnauth?: boolean;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  loginPath = '/auth/login',
  redirectOnUnauth = true,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 未认证处理
  if (!isAuthenticated) {
    if (redirectOnUnauth) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${loginPath}?returnUrl=${returnUrl}`);
      return null;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">请先登录</h2>
          <Link
            href={loginPath}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  // 角色权限检查
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">权限不足</h2>
          <p className="text-gray-600">您没有访问此页面的权限</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

#### 5.1.2 后端认证架构

**认证服务**
```go
// services/auth_service.go
type AuthService struct {
    userRepo repository.UserRepository
    config   *config.Config
}

func (s *AuthService) Register(req RegisterRequest) (*User, string, error) {
    // 验证用户名是否已存在
    if existingUser, _ := s.userRepo.FindByUsername(req.Username); existingUser != nil {
        return nil, "", errors.New("用户名已存在")
    }

    // 验证邮箱是否已存在
    if existingUser, _ := s.userRepo.FindByEmail(req.Email); existingUser != nil {
        return nil, "", errors.New("邮箱已被注册")
    }

    // 验证密码强度
    if err := s.validatePassword(req.Password); err != nil {
        return nil, "", err
    }

    // 加密密码
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, "", err
    }

    // 创建用户
    user := &models.User{
        Username: req.Username,
        Email:    req.Email,
        Password: string(hashedPassword),
        Role:     "user",
        Status:   "active",
    }

    if err := s.userRepo.Create(user); err != nil {
        return nil, "", err
    }

    // 生成 JWT 令牌
    token, err := s.generateJWT(user)
    if err != nil {
        return nil, "", err
    }

    return user, token, nil
}

func (s *AuthService) Login(req LoginRequest) (*User, string, error) {
    // 根据邮箱查找用户
    user, err := s.userRepo.FindByEmail(req.Email)
    if err != nil {
        return nil, "", errors.New("用户不存在")
    }

    // 验证密码
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        return nil, "", errors.New("密码错误")
    }

    // 检查账户状态
    if user.Status != "active" {
        return nil, "", errors.New("账户已被禁用")
    }

    // 生成 JWT 令牌
    token, err := s.generateJWT(user)
    if err != nil {
        return nil, "", err
    }

    // 更新最后登录时间
    user.LastLoginAt = time.Now()
    s.userRepo.Update(user)

    return user, token, nil
}

func (s *AuthService) generateJWT(user *models.User) (string, error) {
    claims := jwt.MapClaims{
        "user_id":   user.ID,
        "username":  user.Username,
        "email":     user.Email,
        "role":      user.Role,
        "exp":       time.Now().Add(time.Hour * 24 * 7).Unix(), // 7天过期
        "iat":       time.Now().Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(s.config.JWTSecret))
}

func (s *AuthService) ValidateToken(tokenString string) (*models.User, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return []byte(s.config.JWTSecret), nil
    })

    if err != nil {
        return nil, err
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok || !token.Valid {
        return nil, errors.New("invalid token")
    }

    userID := uint(claims["user_id"].(float64))
    user, err := s.userRepo.FindByID(userID)
    if err != nil {
        return nil, errors.New("user not found")
    }

    return user, nil
}
```

**认证中间件**
```go
// middleware/auth.go
func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(401, gin.H{"error": "Missing authorization header"})
            c.Abort()
            return
        }

        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
        
        user, err := authService.ValidateToken(tokenString)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        // 将用户信息存储在上下文中
        c.Set("user", user)
        c.Next()
    }
}

func RequireRole(role string) gin.HandlerFunc {
    return func(c *gin.Context) {
        user, exists := c.Get("user")
        if !exists {
            c.JSON(401, gin.H{"error": "Unauthorized"})
            c.Abort()
            return
        }

        if user.(*models.User).Role != role {
            c.JSON(403, gin.H{"error": "Insufficient permissions"})
            c.Abort()
            return
        }

        c.Next()
    }
}
```

**认证处理器**
```go
// handlers/auth.go
type AuthHandler struct {
    authService *services.AuthService
}

func (h *AuthHandler) Register(c *gin.Context) {
    var req RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    user, token, err := h.authService.Register(req)
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    c.JSON(201, gin.H{
        "success": true,
        "data": gin.H{
            "user":  user,
            "token": token,
        },
        "message": "注册成功",
    })
}

func (h *AuthHandler) Login(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    user, token, err := h.authService.Login(req)
    if err != nil {
        c.JSON(401, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, gin.H{
        "success": true,
        "data": gin.H{
            "user":  user,
            "token": token,
        },
        "message": "登录成功",
    })
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
    user, _ := c.Get("user")
    c.JSON(200, gin.H{
        "success": true,
        "data": user,
    })
}
```

#### 5.1.3 表单验证系统

**前端表单验证**
```typescript
// utils/auth.ts
export const AUTH_VALIDATION_RULES = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
};

export function validateLoginForm(data: LoginFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email || data.email.trim().length === 0) {
    errors.email = '请输入邮箱';
  } else if (!AUTH_VALIDATION_RULES.email.pattern.test(data.email)) {
    errors.email = '请输入有效的邮箱地址';
  }

  if (!data.password || data.password.length === 0) {
    errors.password = '请输入密码';
  } else if (data.password.length < AUTH_VALIDATION_RULES.password.minLength) {
    errors.password = `密码至少需要${AUTH_VALIDATION_RULES.password.minLength}个字符`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRegisterForm(data: RegisterFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // 用户名验证
  if (!data.username || data.username.trim().length === 0) {
    errors.username = '请输入用户名';
  } else if (data.username.length < AUTH_VALIDATION_RULES.username.minLength) {
    errors.username = `用户名至少需要${AUTH_VALIDATION_RULES.username.minLength}个字符`;
  } else if (!AUTH_VALIDATION_RULES.username.pattern.test(data.username)) {
    errors.username = '用户名只能包含字母、数字和下划线';
  }

  // 邮箱验证
  if (!data.email || data.email.trim().length === 0) {
    errors.email = '请输入邮箱';
  } else if (!AUTH_VALIDATION_RULES.email.pattern.test(data.email)) {
    errors.email = '请输入有效的邮箱地址';
  }

  // 密码验证
  if (!data.password || data.password.length === 0) {
    errors.password = '请输入密码';
  } else if (data.password.length < AUTH_VALIDATION_RULES.password.minLength) {
    errors.password = `密码至少需要${AUTH_VALIDATION_RULES.password.minLength}个字符`;
  } else if (!AUTH_VALIDATION_RULES.password.pattern.test(data.password)) {
    errors.password = '密码必须包含大小写字母、数字和特殊字符';
  }

  // 确认密码验证
  if (!data.confirmPassword || data.confirmPassword.length === 0) {
    errors.confirmPassword = '请确认密码';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = '密码不匹配';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

**后端验证**
```go
// utils/validation.go
func (s *AuthService) validatePassword(password string) error {
    if len(password) < 8 {
        return errors.New("密码至少需要8个字符")
    }
    
    if len(password) > 128 {
        return errors.New("密码不能超过128个字符")
    }
    
    var hasUpper, hasLower, hasDigit, hasSpecial bool
    
    for _, char := range password {
        switch {
        case unicode.IsUpper(char):
            hasUpper = true
        case unicode.IsLower(char):
            hasLower = true
        case unicode.IsDigit(char):
            hasDigit = true
        case unicode.IsPunct(char) || unicode.IsSymbol(char):
            hasSpecial = true
        }
    }
    
    if !hasUpper || !hasLower || !hasDigit || !hasSpecial {
        return errors.New("密码必须包含大小写字母、数字和特殊字符")
    }
    
    return nil
}

func validateEmail(email string) error {
    emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
    if !emailRegex.MatchString(email) {
        return errors.New("邮箱格式不正确")
    }
    return nil
}

func validateUsername(username string) error {
    if len(username) < 3 {
        return errors.New("用户名至少需要3个字符")
    }
    
    if len(username) > 20 {
        return errors.New("用户名不能超过20个字符")
    }
    
    usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
    if !usernameRegex.MatchString(username) {
        return errors.New("用户名只能包含字母、数字和下划线")
    }
    
    return nil
}
```

#### 5.1.4 API 客户端集成

**HTTP 拦截器**
```typescript
// utils/apiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // 清除认证状态
      localStorage.removeItem('auth_token');
      useAuthStore.getState().logout();
      
      // 重定向到登录页
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 5.2 计时器核心逻辑

#### 前端计时器 Hook
```typescript
// hooks/useTimer.ts
export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  
  const startTimer = useCallback(async () => {
    // 调用后端 API 开始计时
    const response = await api.post('/timer/start', {
      type: mode,
      duration: getDefaultDuration(mode)
    });
    
    if (response.success) {
      setIsRunning(true);
      // 启动本地计时器同步
      startLocalTimer(response.data.session_id);
    }
  }, [mode]);
  
  const pauseTimer = useCallback(async () => {
    await api.post('/timer/pause');
    setIsRunning(false);
  }, []);
  
  const resetTimer = useCallback(async () => {
    await api.post('/timer/stop');
    setIsRunning(false);
    setTimeLeft(getDefaultDuration(mode));
  }, [mode]);
  
  return {
    timeLeft,
    isRunning,
    mode,
    startTimer,
    pauseTimer,
    resetTimer,
    setMode
  };
};
```

#### 后端计时器服务
```go
// services/timer_service.go
type TimerService struct {
    repo  repository.TimerRepository
    redis *redis.Client
}

func (s *TimerService) StartTimer(userID uint, req StartTimerRequest) (*TimerSession, error) {
    // 检查是否有活跃的计时器
    if activeSession, err := s.GetActiveTimer(userID); err == nil && activeSession != nil {
        return nil, errors.New("用户已有活跃的计时器")
    }
    
    // 创建新的计时会话
    session := &models.TimerSession{
        UserID:      userID,
        TaskID:      req.TaskID,
        SessionType: req.Type,
        Duration:    req.Duration,
        Status:      "active",
        StartedAt:   time.Now(),
    }
    
    // 保存到数据库
    if err := s.repo.Create(session); err != nil {
        return nil, err
    }
    
    // 缓存到 Redis
    timerData := map[string]interface{}{
        "session_id": session.ID,
        "type":       session.SessionType,
        "start_time": session.StartedAt.Unix(),
        "duration":   session.Duration,
        "paused_at":  nil,
    }
    
    key := fmt.Sprintf("timer:%d", userID)
    if err := s.redis.HMSet(key, timerData).Err(); err != nil {
        return nil, err
    }
    
    return session, nil
}
```

### 5.3 任务管理系统

#### 前端任务状态管理
```typescript
// store/taskStore.ts
interface TaskStore {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  
  fetchTasks: () => Promise<void>;
  addTask: (task: CreateTaskRequest) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/tasks');
      set({ tasks: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  addTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      set(state => ({
        tasks: [...state.tasks, response.data]
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // ... 其他方法
}));
```

#### 后端任务服务
```go
// services/task_service.go
func (s *TaskService) CreateTask(userID uint, req CreateTaskRequest) (*models.Task, error) {
    task := &models.Task{
        UserID:              userID,
        Title:               req.Title,
        Description:         req.Description,
        EstimatedPomodoros:  req.EstimatedPomodoros,
        Priority:            req.Priority,
        Tags:                req.Tags,
        DueDate:             req.DueDate,
        Status:              "pending",
    }
    
    if err := s.repo.Create(task); err != nil {
        return nil, err
    }
    
    // 检查成就解锁
    go s.achievementService.CheckTaskAchievements(userID)
    
    return task, nil
}

func (s *TaskService) CompletePomodoro(userID uint, taskID uint) error {
    task, err := s.repo.GetByID(taskID)
    if err != nil {
        return err
    }
    
    if task.UserID != userID {
        return errors.New("无权限操作此任务")
    }
    
    task.CompletedPomodoros++
    
    // 如果完成了所有预估的番茄数，标记任务为完成
    if task.CompletedPomodoros >= task.EstimatedPomodoros {
        task.Status = "completed"
        task.CompletedAt = &time.Time{}
        *task.CompletedAt = time.Now()
    }
    
    return s.repo.Update(task)
}
```

### 5.4 统计分析系统

#### 数据聚合服务
```go
// services/stats_service.go
type StatsService struct {
    repo     repository.StatsRepository
    redis    *redis.Client
    timerRepo repository.TimerRepository
    taskRepo  repository.TaskRepository
}

func (s *StatsService) GetDailyStats(userID uint, date time.Time) (*DailyStats, error) {
    cacheKey := fmt.Sprintf("stats:%d:%s", userID, date.Format("2006-01-02"))
    
    // 尝试从缓存获取
    if cached, err := s.redis.Get(cacheKey).Result(); err == nil {
        var stats DailyStats
        if err := json.Unmarshal([]byte(cached), &stats); err == nil {
            return &stats, nil
        }
    }
    
    // 从数据库计算统计数据
    startOfDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
    endOfDay := startOfDay.Add(24 * time.Hour)
    
    // 计算完成的番茄数
    completedSessions, err := s.timerRepo.GetCompletedSessions(userID, startOfDay, endOfDay)
    if err != nil {
        return nil, err
    }
    
    focusSessions := 0
    totalFocusTime := 0
    for _, session := range completedSessions {
        if session.SessionType == "focus" {
            focusSessions++
            totalFocusTime += session.Duration
        }
    }
    
    // 计算完成的任务数
    completedTasks, err := s.taskRepo.GetCompletedTasksCount(userID, startOfDay, endOfDay)
    if err != nil {
        return nil, err
    }
    
    stats := &DailyStats{
        Date:               date,
        CompletedPomodoros: focusSessions,
        FocusTime:         totalFocusTime,
        CompletedTasks:    completedTasks,
    }
    
    // 缓存结果（1小时过期）
    if data, err := json.Marshal(stats); err == nil {
        s.redis.Set(cacheKey, data, time.Hour)
    }
    
    return stats, nil
}
```

## 6. 部署方案

### 6.1 Docker 容器化

#### docker-compose.yml

基础配置文件（使用默认开发环境配置）：

```yaml
version: '3.8'

services:
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    expose:
      - "3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
    depends_on:
      - backend
    
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    expose:
      - "8080"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=tomato_clock
      - DB_USER=postgres
      - DB_PASSWORD=password
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - SESSION_SECRET=your-session-secret-key
    depends_on:
      - postgres
      - redis
    
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=tomato_clock
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/migrations:/docker-entrypoint-initdb.d
    expose:
      - "5432"
    
  redis:
    image: redis:7-alpine
    expose:
      - "6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
  caddy_data:
  caddy_config:
```

#### 环境配置

**开发环境 (.env.dev)**
```env
# 服务器配置
PORT=8080
GIN_MODE=debug

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USER=tomato_user
DB_PASSWORD=tomato_password
DB_NAME=tomato_db
DB_SSLMODE=disable

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Session 配置
SESSION_SECRET=your-session-secret-key
SESSION_TIMEOUT=7200  # 2小时，单位：秒
SESSION_COOKIE_NAME=session_id
SESSION_COOKIE_SECURE=false  # 开发环境设为 false
SESSION_COOKIE_HTTPONLY=true

# Socket.IO 配置
SOCKET_CORS_ORIGINS=http://localhost:3000

# 其他配置
LOG_LEVEL=debug
```

#### 前端 Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 后端 Dockerfile
```dockerfile
# backend/Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080

CMD ["./main"]
```

### 6.2 生产环境部署

#### 使用 Caddy 作为反向代理（推荐）

Caddy 是一个现代化的 Web 服务器，具有自动 HTTPS、简单配置和优秀性能的特点。

##### Caddyfile 配置
```caddyfile
# Caddyfile
{
    # 全局选项
    auto_https on
    email your-email@example.com
}

your-domain.com {
    # 自动 HTTPS 证书
    tls {
        protocols tls1.2 tls1.3
    }

    # 压缩响应
    encode gzip

    # API 路由代理到后端
    handle /api/* {
        reverse_proxy backend:8080 {
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }

    # WebSocket 连接代理
    handle /ws/* {
        reverse_proxy backend:8080 {
            header_up Connection {>Connection}
            header_up Upgrade {>Upgrade}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }

    # 静态文件和前端路由
    handle {
        reverse_proxy frontend:3000 {
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }

    # 安全头部
    header {
        # 安全相关头部
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        
        # 隐藏服务器信息
        -Server
    }

    # 日志记录
    log {
        output file /var/log/caddy/access.log
        format json
    }
}

# 开发环境配置（可选）
localhost:8000 {
    handle /api/* {
        reverse_proxy localhost:8080
    }
    
    handle /ws/* {
        reverse_proxy localhost:8080
    }
    
    handle {
        reverse_proxy localhost:3000
    }
}
```

##### 使用 Docker Compose 部署
```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看 Caddy 日志
docker-compose logs caddy

# 重新加载 Caddy 配置
docker-compose exec caddy caddy reload --config /etc/caddy/Caddyfile.dev
```

#### 使用 Nginx 作为反向代理（备选方案）

如果您更熟悉 Nginx，也可以使用以下配置：

##### Nginx 配置
```nginx
# nginx.conf
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:8080;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # 前端路由
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API 路由
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket 连接
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 7. 性能优化

### 7.1 前端优化
- Next.js 静态生成和服务端渲染
- 图片优化和懒加载
- 代码分割和动态导入
- 浏览器缓存策略
- CDN 分发静态资源

### 7.2 后端优化
- 数据库连接池
- Redis 缓存策略
- API 响应压缩
- 并发处理优化
- 数据库查询优化

### 7.3 数据库优化
- 索引设计优化
- 查询性能调优
- 分页查询优化
- 数据归档策略

## 8. 安全方案

### 8.1 认证授权
- 基于 Cookie 的 Session 认证
- Session 存储在 Redis 中
- 密码哈希存储（bcrypt）
- 角色权限控制
- Session 过期和续期机制

### 8.2 Session 安全设计

#### Session 存储策略
- **存储位置**: Redis 数据库，支持分布式部署
- **Session ID**: 使用加密安全的随机字符串生成
- **过期机制**: 
  - 默认过期时间：2小时
  - 滑动过期：用户活跃时自动续期
  - 绝对过期：最长保持时间 24 小时

#### Cookie 安全配置
- **HttpOnly**: 防止 XSS 攻击访问 Cookie
- **Secure**: HTTPS 环境下强制加密传输
- **SameSite**: 防止 CSRF 攻击
- **Path**: 限制 Cookie 作用域
- **Domain**: 控制子域名访问权限

#### Session 数据结构
```go
type Session struct {
    UserID       int       `json:"user_id"`
    Username     string    `json:"username"`
    CreatedAt    time.Time `json:"created_at"`
    LastAccess   time.Time `json:"last_access"`
    IPAddress    string    `json:"ip_address"`
    UserAgent    string    `json:"user_agent"`
    Permissions  []string  `json:"permissions"`
}
```

### 8.3 数据安全
- HTTPS 传输加密
- 敏感数据加密存储
- SQL 注入防护
- XSS 攻击防护
- CSRF 保护

### 8.4 系统安全
- 限流和防护
- 日志审计
- 异常监控
- 备份恢复

通过这套完整的技术实现方案，番茄时钟应用将具备现代化的架构、优秀的性能表现和良好的扩展能力，为用户提供稳定可靠的时间管理服务。 

#### 部署命令

**开发环境启动：**

```bash
# 使用开发环境配置启动
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 或者直接指定开发配置文件
docker-compose up -d
docker-compose exec caddy caddy reload --config /etc/caddy/Caddyfile.dev

# 查看日志
docker-compose logs -f caddy
docker-compose logs -f frontend
docker-compose logs -f backend
```

**生产环境启动：**

```bash
# 设置环境变量
export DOMAIN_NAME=your-domain.com
export ADMIN_EMAIL=your-email@example.com

# 使用生产环境配置启动
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 或者使用 .env 文件
echo "DOMAIN_NAME=your-domain.com" > .env
echo "ADMIN_EMAIL=your-email@example.com" >> .env
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 验证配置和证书
docker-compose exec caddy caddy validate --config /etc/caddy/Caddyfile.prod
docker-compose exec caddy caddy list-certificates
```

**配置文件切换：**

```bash
# 方法1：使用符号链接
ln -sf Caddyfile.dev Caddyfile.active
# 然后在 docker-compose.yml 中使用 ./Caddyfile.active:/etc/caddy/Caddyfile

# 方法2：重新加载配置
docker-compose exec caddy caddy reload --config /etc/caddy/Caddyfile.prod

# 方法3：环境变量控制
export CADDY_CONFIG=Caddyfile.prod
# 在 docker-compose.yml 中使用 ./${CADDY_CONFIG:-Caddyfile}:/etc/caddy/Caddyfile
```

**健康检查和监控：**

```bash
# 检查 Caddy 状态
curl -f http://localhost:2019/metrics || echo "Caddy admin interface not accessible"

# 检查应用健康状态
curl -f http://localhost/api/health || echo "Backend health check failed"
curl -f http://localhost/ || echo "Frontend health check failed"

# 查看 Caddy 配置
docker-compose exec caddy caddy config --pretty

# 重新加载配置（不停机）
docker-compose exec caddy caddy reload
``` 