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
│   TypeScript   │    │   JWT Auth     │    │  File Storage  │
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
├── public/                  # 静态资源
│   ├── icons/              # 图标文件
│   ├── sounds/             # 提醒音效
│   ├── images/             # 图片资源
│   └── favicon.ico
│
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
│   │   ├── auth.go        # JWT 认证中间件
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
│   │   └── jwt.go         # JWT 配置
│   │
│   └── utils/             # 工具函数
│       ├── response.go    # 响应格式化
│       ├── validation.go  # 数据验证
│       ├── crypto.go      # 加密解密
│       └── time.go        # 时间处理
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
│   └── deploy.sh
│
├── go.mod                 # Go 模块定义
├── go.sum                 # 依赖校验文件
├── Dockerfile            # Docker 镜像配置
└── README.md
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
POST   /api/v1/auth/refresh       # 刷新令牌
GET    /api/v1/auth/me           # 获取当前用户信息
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

  connect(token: string): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080', {
      auth: { token },
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
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { 
  socketManager, 
  ServerToClientEvents, 
  ClientToServerEvents,
  TimerSyncData,
  TaskSyncData,
  AchievementData
} from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      socketRef.current = socketManager.connect(token);
      const socket = socketRef.current;

      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [token]);

  // 数据同步监听器
  const onTimerSync = (callback: (data: TimerSyncData) => void) => {
    socketRef.current?.on('timer_sync', callback);
    return () => socketRef.current?.off('timer_sync', callback);
  };

  const onTaskSync = (callback: (data: TaskSyncData) => void) => {
    socketRef.current?.on('task_sync', callback);
    return () => socketRef.current?.off('task_sync', callback);
  };

  const onAchievementUnlocked = (callback: (data: AchievementData) => void) => {
    socketRef.current?.on('achievement_unlocked', callback);
    return () => socketRef.current?.off('achievement_unlocked', callback);
  };

  const requestSync = () => {
    socketManager.requestSync();
  };

  return {
    isConnected,
    onTimerSync,
    onTaskSync,
    onAchievementUnlocked,
    requestSync,
  };
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
        
        // 简单的认证检查
        token := conn.URL().Query().Get("token")
        if token == "" {
            return fmt.Errorf("authentication required")
        }
        
        userID, err := validateJWTToken(token)
        if err != nil {
            return err
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

### 5.1 计时器核心逻辑

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

### 5.2 任务管理系统

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

### 5.3 统计分析系统

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
      - JWT_SECRET=your-secret-key
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

#### 环境特定的配置文件

**开发环境专用配置 (docker-compose.dev.yml)：**

```yaml
version: '3.8'

services:
  caddy:
    volumes:
      - ./Caddyfile.dev:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    environment:
      - CADDY_LOG_LEVEL=DEBUG
    ports:
      - "80:80"
      - "8000:8000"  # 额外的开发端口
      - "3001:3001"  # 前端直接访问
      - "8001:8001"  # 后端直接访问

  frontend:
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: ["npm", "run", "dev"]

  backend:
    environment:
      - GIN_MODE=debug
      - LOG_LEVEL=debug
    volumes:
      - ./backend:/app
    command: ["go", "run", "cmd/server/main.go"]

  postgres:
    ports:
      - "5432:5432"  # 开发时可直接访问数据库
    
  redis:
    ports:
      - "6379:6379"  # 开发时可直接访问 Redis
```

**生产环境专用配置 (docker-compose.prod.yml)：**

```yaml
version: '3.8'

services:
  caddy:
    volumes:
      - ./Caddyfile.prod:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
      - caddy_logs:/var/log/caddy
    environment:
      - DOMAIN_NAME=${DOMAIN_NAME:-your-domain.com}
      - ADMIN_EMAIL=${ADMIN_EMAIL:-your-email@example.com}
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://${DOMAIN_NAME}/api
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  backend:
    environment:
      - GIN_MODE=release
      - LOG_LEVEL=info
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  postgres:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    
  redis:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  caddy_logs:
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
- JWT 令牌认证
- 刷新令牌机制
- 密码哈希存储
- 角色权限控制

### 8.2 数据安全
- HTTPS 传输加密
- 敏感数据加密存储
- SQL 注入防护
- XSS 攻击防护
- CSRF 保护

### 8.3 系统安全
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