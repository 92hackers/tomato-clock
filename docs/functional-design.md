# 番茄时钟功能设计

本文档详细描述了番茄时钟应用的功能设计和用户交互流程。

## 1. 应用结构

番茄时钟应用包含以下六个主要界面：

1. **主计时界面** - 应用的核心界面，显示计时器和当前任务
2. **设置界面** - 用于自定义应用参数和偏好
3. **成就与提示界面** - 展示用户成就和提供专注技巧
4. **统计界面** - 展示用户的使用数据和统计图表
5. **添加任务界面** - 用于创建新任务
6. **专注历程界面** - 记录用户的使用历程和进步

## 2. 功能模块详细设计

### 2.1 计时器模块

#### 功能描述

计时器是应用的核心功能，提供三种计时模式：专注时间（默认25分钟）、短休息（默认5分钟）和长休息（默认15分钟）。

#### 交互流程

1. **启动计时**
   - 用户点击"开始"按钮
   - 计时器开始倒计时
   - "开始"按钮变为"暂停"按钮

2. **暂停计时**
   - 用户点击"暂停"按钮
   - 计时器暂停倒计时
   - "暂停"按钮变回"开始"按钮

3. **重置计时**
   - 用户点击"重置"按钮
   - 计时器重置为当前模式的默认时间
   - 如果计时器正在运行，停止计时

4. **模式切换**
   - 用户点击"专注"、"短休息"或"长休息"标签
   - 计时器重置为对应模式的默认时间
   - 界面可能根据模式变化（如颜色变化）

5. **计时完成**
   - 计时结束时发出提示音或通知
   - 根据设置可能自动切换到下一个模式（如从专注切换到休息）

#### 数据模型

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

### 2.2 任务管理模块

#### 功能描述

任务管理模块允许用户创建、编辑和完成任务，并跟踪每个任务的完成进度。

#### 交互流程

1. **查看任务列表**
   - 在主界面显示当前任务列表
   - 每个任务项显示任务名称和完成进度（如"2/4"表示完成了4个番茄中的2个）

2. **添加任务**
   - 用户点击"+"按钮
   - 跳转到添加任务界面
   - 用户输入任务名称、预计番茄数和备注
   - 用户点击"保存"按钮创建任务

3. **完成番茄**
   - 当一个专注时间段完成时，当前任务的完成番茄数+1
   - 更新任务的完成进度显示

4. **完成任务**
   - 用户点击任务前的复选框
   - 任务标记为已完成
   - 已完成任务可能会被归档或移至底部

#### 数据模型

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

### 2.3 统计分析模块

#### 功能描述

统计分析模块收集和展示用户的使用数据，包括完成的番茄数、专注时间和完成的任务数，以帮助用户了解自己的时间使用情况。

#### 交互流程

1. **查看今日统计**
   - 在主界面底部显示今日完成的番茄数、专注分钟数和完成任务数

2. **查看详细统计**
   - 用户点击统计界面
   - 显示按周、月、年分类的统计数据
   - 提供可视化图表（如柱状图）展示数据趋势

3. **筛选统计数据**
   - 用户可以选择不同的时间范围（周、月、年）
   - 统计图表和数据随之更新

#### 数据模型

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

### 2.4 设置模块

#### 功能描述

设置模块允许用户自定义应用的各种参数，包括计时器时间、通知和主题等。

#### 交互流程

1. **访问设置**
   - 用户点击主界面右上角的设置图标
   - 跳转到设置界面

2. **调整时间设置**
   - 用户可以修改专注时长、短休息时长和长休息时长
   - 修改后的设置立即生效

3. **通知设置**
   - 用户可以开启或关闭时间结束提醒
   - 用户可以开启或关闭休息提醒

4. **主题设置**
   - 用户可以切换深色模式

#### 数据模型

```typescript
{
  settings: {
    times: {
      focus: Number, // 专注时长（秒）
      shortBreak: Number, // 短休息时长（秒）
      longBreak: Number // 长休息时长（秒）
    },
    notifications: {
      timeEnd: Boolean, // 时间结束提醒
      breakReminder: Boolean // 休息提醒
    },
    theme: "light" | "dark" | "auto" // 主题
  }
}
```

### 2.5 成就与提示模块

#### 功能描述

成就与提示模块通过游戏化元素和实用建议来激励用户持续使用番茄工作法。

#### 交互流程

1. **查看成就**
   - 用户点击成就与提示界面
   - 显示已解锁和未解锁的成就列表
   - 已解锁成就显示获取时间和详情

2. **阅读专注技巧**
   - 在同一界面下方显示专注技巧卡片
   - 用户可以浏览不同的技巧建议

#### 数据模型

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

### 2.6 专注历程模块

#### 功能描述

专注历程模块记录用户使用番茄时钟的重要里程碑和进步情况，帮助用户了解自己在时间管理方面的成长。

#### 交互流程

1. **查看学习曲线**
   - 用户点击专注历程界面
   - 显示用户在专注能力、持续性和效率提升方面的进度条

2. **浏览历程记录**
   - 在界面下方以时间轴形式展示用户的重要里程碑
   - 每个里程碑包含日期、标题和描述

#### 数据模型

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

## 3. 用户流程图

### 3.1 主要用户流程

```
开始 -> 查看主界面 -> 选择操作:
  |
  ├─> 开始专注时间 -> 完成专注 -> 自动进入休息时间 -> 返回主界面
  |
  ├─> 添加新任务 -> 填写任务信息 -> 保存任务 -> 返回主界面
  |
  ├─> 查看统计数据 -> 浏览不同时间段的统计 -> 返回主界面
  |
  ├─> 修改设置 -> 调整参数 -> 保存设置 -> 返回主界面
  |
  ├─> 查看成就与提示 -> 浏览成就和技巧 -> 返回主界面
  |
  └─> 查看专注历程 -> 浏览进度和里程碑 -> 返回主界面
```

### 3.2 专注计时流程

```
开始专注 -> 计时器开始倒计时 -> 用户操作:
  |
  ├─> 暂停计时 -> 计时器暂停 -> 用户操作:
  |     |
  |     ├─> 继续计时 -> 计时器继续
  |     |
  |     └─> 重置计时 -> 计时器重置
  |
  ├─> 完成计时 -> 发出提示 -> 记录完成的番茄 -> 自动进入休息时间
  |
  └─> 切换模式 -> 计时器重置为新模式时间
```

## 4. 界面布局

应用采用类似Figma的画布式布局，各界面在画布上平铺展示，用户可以通过拖拽和缩放查看不同界面。各界面之间保持100px的间距，避免重叠。

### 4.1 界面位置坐标

| 界面名称 | 位置坐标 (top, left) |
|---------|-------------------|
| 主计时界面 | (100px, 100px) |
| 设置界面 | (100px, 620px) |
| 成就与提示界面 | (100px, 1140px) |
| 统计界面 | (620px, 100px) |
| 添加任务界面 | (620px, 620px) |
| 专注历程界面 | (620px, 1140px) |

### 4.2 界面尺寸

所有界面的基础尺寸为350px宽，在桌面端可扩展至420px宽。高度根据内容自适应，但基本保持在500-600px之间。

## 5. 交互设计

### 5.1 拖拽与缩放

- 用户可以按住画布并拖动来查看不同界面
- 用户可以使用右下角的缩放控制按钮或鼠标滚轮来放大/缩小视图
- 鼠标悬停在界面上时，界面会有轻微放大效果，提示可交互

### 5.2 按钮反馈

- 所有按钮点击时有明显的视觉反馈（如颜色变化或轻微缩放）
- 开关控件（如通知开关）点击时会改变颜色并有滑动动画

### 5.3 计时器交互

- 计时器以大字体显示在圆形区域中央，确保可读性
- 开始/暂停按钮根据状态变化图标（播放/暂停）
- 重置按钮使用循环箭头图标，表示重新开始

## 6. 响应式设计

应用采用响应式设计，确保在不同设备上都有良好的使用体验：

- 在桌面端，界面宽度为420px
- 在移动端，界面宽度自适应屏幕，最小为350px
- 所有交互元素（如按钮）都有足够大的点击区域，确保在触摸屏上易于操作
- 字体大小和间距根据屏幕尺寸自动调整 

## 2. 用户认证与授权设计

### 2.1 认证流程设计

#### 用户注册流程

1. **输入基本信息**
   - 用户名验证（唯一性、长度、格式）
   - 邮箱验证（格式、唯一性）
   - 密码强度验证
   - 服务条款确认

2. **邮箱验证**
   - 发送验证邮件
   - 用户点击验证链接
   - 激活账户

3. **初始设置**
   - 时区设置
   - 基础偏好配置
   - 引导教程

#### 用户登录流程

1. **凭据验证**
   - 邮箱/用户名 + 密码
   - 输入验证和安全检查
   - 限制登录尝试次数

2. **令牌生成**
   - 生成 JWT 访问令牌（15分钟有效期）
   - 生成刷新令牌（30天有效期）
   - 记录登录日志

3. **会话管理**
   - 在 Redis 中存储会话信息
   - 支持多设备登录
   - 异常登录检测

#### 令牌刷新机制

```typescript
interface AuthTokens {
  access_token: string; // JWT，15分钟有效期
  refresh_token: string; // 30天有效期
  token_type: 'Bearer';
  expires_in: number; // 秒数
}

interface JWTPayload {
  sub: number; // user_id
  username: string;
  email: string;
  iat: number; // issued at
  exp: number; // expires at
  jti: string; // JWT ID
}
```

### 2.2 授权设计

#### API 授权中间件

```typescript
// 权限级别定义
enum PermissionLevel {
  GUEST = 0,     // 游客，只能访问公开内容
  USER = 1,      // 已认证用户，可以使用基本功能
  PREMIUM = 2,   // 高级用户，可以使用高级功能
  ADMIN = 99     // 管理员，拥有所有权限
}

// 资源权限验证
interface ResourcePermission {
  resource_type: 'timer' | 'task' | 'stats' | 'settings';
  action: 'create' | 'read' | 'update' | 'delete';
  required_level: PermissionLevel;
  owner_only?: boolean; // 是否只允许资源所有者访问
}
```

## 3. 实时通信设计

### 3.1 WebSocket 连接管理

#### 连接建立

```typescript
interface WebSocketConnection {
  user_id: number;
  connection_id: string;
  connected_at: Date;
  last_ping: Date;
  device_info: {
    user_agent: string;
    device_type: 'desktop' | 'mobile' | 'tablet';
    platform: string;
  };
}

// WebSocket 消息类型
type WebSocketMessage = 
  | TimerUpdateMessage
  | TaskUpdateMessage
  | AchievementUnlockedMessage
  | SystemNotificationMessage;

interface TimerUpdateMessage {
  type: 'timer_update';
  data: {
    session_id: number;
    remaining_time: number;
    status: 'running' | 'paused' | 'completed';
    current_mode: 'focus' | 'short_break' | 'long_break';
  };
  timestamp: Date;
}
```

### 3.2 实时数据同步

#### 数据同步策略

1. **计时器状态同步**
   - 每秒同步剩余时间
   - 状态变更实时推送
   - 跨设备状态一致性

2. **任务状态同步**
   - 任务创建/更新实时推送
   - 完成状态同步
   - 优先级变更通知

3. **成就解锁通知**
   - 实时成就检测
   - 推送解锁通知
   - 成就进度更新

## 4. 缓存策略设计

### 4.1 多层缓存架构

#### 客户端缓存

```typescript
// 浏览器本地存储策略
interface CacheStrategy {
  localStorage: {
    user_settings: UserSettings;
    theme_preference: string;
    last_sync_timestamp: Date;
  };
  sessionStorage: {
    current_session: TimerSession;
    active_tasks: Task[];
  };
  indexedDB: {
    offline_stats: DailyStats[];
    cached_achievements: Achievement[];
  };
}
```

#### 服务端缓存

```typescript
// Redis 缓存键值设计
interface RedisCacheKeys {
  user_session: `session:${user_id}`;
  active_timer: `timer:${user_id}`;
  daily_stats: `stats:${user_id}:${date}`;
  user_settings: `settings:${user_id}`;
  task_list: `tasks:${user_id}`;
  achievement_progress: `achievements:${user_id}`;
}

// 缓存过期策略
interface CacheExpiration {
  user_session: '24h';
  active_timer: '6h';
  daily_stats: '1h';
  user_settings: '30m';
  task_list: '15m';
  achievement_progress: '10m';
}
```

### 4.2 缓存更新策略

1. **写入策略（Write-Through）**
   - 同时更新数据库和缓存
   - 保证数据一致性
   - 适用于关键数据

2. **失效策略（Cache-Aside）**
   - 数据更新时删除缓存
   - 下次读取时重新加载
   - 适用于复杂计算数据

3. **定时刷新**
   - 统计数据定时重新计算
   - 成就进度定时更新
   - 减少计算压力

通过这套完整的功能设计，番茄时钟应用将具备现代化Web应用的所有核心特性，为用户提供流畅、可靠的时间管理体验。 