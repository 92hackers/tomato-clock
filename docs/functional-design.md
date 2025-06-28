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

## 3. Socket.IO 实时通信设计

### 3.1 Socket.IO 连接管理

Socket.IO 提供了比原生 WebSocket 更强大的功能，包括自动重连、房间管理、事件命名空间等。

#### 连接建立和认证

```typescript
// Socket.IO 连接接口
interface SocketConnection {
  socket_id: string;
  user_id: number;
  session_id: string;
  connected_at: Date;
  last_activity: Date;
  room: string; // user_{user_id}
  device_info: {
    user_agent: string;
    device_type: 'desktop' | 'mobile' | 'tablet';
    platform: string;
    app_version: string;
  };
}

// Socket.IO 事件类型定义
interface ServerToClientEvents {
  // 计时器相关事件
  timer_update: (data: TimerUpdateData) => void;
  timer_complete: (data: TimerCompleteData) => void;
  timer_tick: (data: TimerTickData) => void;
  
  // 任务相关事件
  task_created: (data: TaskCreatedData) => void;
  task_updated: (data: TaskUpdatedData) => void;
  task_deleted: (data: TaskDeletedData) => void;
  
  // 成就相关事件
  achievement_unlocked: (data: AchievementData) => void;
  achievement_progress: (data: AchievementProgressData) => void;
  
  // 系统通知事件
  notification: (data: NotificationData) => void;
  sync_complete: (data: SyncData) => void;
  error: (data: SocketErrorData) => void;
  
  // 连接状态事件
  user_joined: (data: UserJoinedData) => void;
  user_left: (data: UserLeftData) => void;
}

interface ClientToServerEvents {
  // 认证和房间管理
  authenticate: (token: string, callback: (response: AuthResponse) => void) => void;
  join_user_room: (userId: number) => void;
  
  // 计时器控制事件
  timer_start: (data: TimerStartData, callback?: (response: TimerResponse) => void) => void;
  timer_pause: (data: TimerPauseData) => void;
  timer_resume: (data: TimerResumeData) => void;
  timer_stop: (data: TimerStopData) => void;
  timer_reset: (data: TimerResetData) => void;
  
  // 任务管理事件
  task_create: (data: CreateTaskData, callback?: (response: TaskResponse) => void) => void;
  task_update: (data: UpdateTaskData) => void;
  task_delete: (data: DeleteTaskData) => void;
  task_complete: (data: CompleteTaskData) => void;
  
  // 数据同步事件
  request_sync: (lastSyncTime: Date) => void;
  heartbeat: () => void;
}

// 计时器事件数据结构
interface TimerUpdateData {
  session_id: number;
  user_id: number;
  remaining_time: number;
  elapsed_time: number;
  status: 'running' | 'paused' | 'completed' | 'cancelled';
  current_mode: 'focus' | 'short_break' | 'long_break';
  task_id?: number;
  pomodoro_count: number;
  next_mode?: string;
  auto_transition: boolean;
}

interface TimerCompleteData {
  session_id: number;
  user_id: number;
  session_type: 'focus' | 'short_break' | 'long_break';
  duration: number;
  completed_at: Date;
  task_id?: number;
  pomodoro_count: number;
  next_mode: string;
  auto_start_next: boolean;
  achievement_unlocked?: AchievementData[];
}

interface TimerTickData {
  session_id: number;
  remaining_time: number;
  elapsed_time: number;
  progress_percentage: number;
}
```

#### 房间管理策略

```typescript
// Socket.IO 房间设计
interface RoomStructure {
  // 用户专属房间
  user_rooms: {
    [key: `user_${number}`]: {
      user_id: number;
      sockets: string[]; // 同一用户的多个连接
      active_sessions: number[];
      last_activity: Date;
    };
  };
  
  // 全局房间（可选）
  global_rooms: {
    'announcements': string[]; // 系统公告
    'leaderboard': string[]; // 排行榜更新
  };
}

// 房间管理服务
class SocketRoomManager {
  joinUserRoom(socketId: string, userId: number): void;
  leaveUserRoom(socketId: string, userId: number): void;
  broadcastToUser(userId: number, event: string, data: any): void;
  broadcastToRoom(room: string, event: string, data: any): void;
  getUserConnections(userId: number): string[];
  cleanupInactiveRooms(): void;
}
```

### 3.2 实时数据同步策略

#### 计时器实时同步

```typescript
// 计时器同步配置
interface TimerSyncConfig {
  // 同步频率
  tick_interval: 1000; // 每秒更新一次
  heartbeat_interval: 30000; // 30秒心跳检测
  
  // 同步策略
  sync_strategies: {
    server_authoritative: true; // 服务器时间为准
    client_prediction: true; // 客户端预测减少延迟
    reconciliation: true; // 时间差校正
  };
  
  // 冲突解决
  conflict_resolution: {
    time_drift_threshold: 2000; // 2秒误差阈值
    auto_correction: true; // 自动校正
    user_notification: false; // 不通知用户小幅调整
  };
}

// 计时器同步逻辑
class TimerSyncManager {
  // 服务器端时间校准
  synchronizeServerTime(clientTime: number, serverTime: number): number {
    const drift = serverTime - clientTime;
    if (Math.abs(drift) > this.config.time_drift_threshold) {
      return serverTime; // 使用服务器时间
    }
    return clientTime; // 保持客户端时间
  }
  
  // 处理网络延迟
  compensateNetworkLatency(timestamp: number, rtt: number): number {
    return timestamp + (rtt / 2);
  }
  
  // 状态一致性检查
  validateTimerState(clientState: TimerState, serverState: TimerState): boolean {
    return clientState.session_id === serverState.session_id &&
           Math.abs(clientState.remaining_time - serverState.remaining_time) < 2000;
  }
}
```

#### 任务状态同步

```typescript
// 任务同步策略
interface TaskSyncStrategy {
  // 实时事件
  real_time_events: {
    task_created: boolean;
    task_updated: boolean;
    task_completed: boolean;
    task_deleted: boolean;
    priority_changed: boolean;
  };
  
  // 批量同步
  batch_sync: {
    enabled: boolean;
    interval: number; // 批量同步间隔
    max_batch_size: number;
  };
  
  // 冲突解决
  conflict_resolution: {
    strategy: 'last_write_wins' | 'timestamp_based' | 'user_choice';
    merge_strategy: 'field_level' | 'object_level';
  };
}

// 任务数据结构优化
interface OptimizedTaskEvent {
  event_id: string;
  event_type: 'create' | 'update' | 'delete' | 'complete';
  task_id: number;
  user_id: number;
  timestamp: Date;
  
  // 增量数据（仅包含变更字段）
  delta: Partial<Task>;
  
  // 版本控制
  version: number;
  previous_version?: number;
}
```

#### 离线和重连同步

```typescript
// 离线支持配置
interface OfflineSyncConfig {
  // 离线存储
  offline_storage: {
    enabled: boolean;
    max_events: number; // 最大离线事件数
    storage_type: 'indexeddb' | 'localstorage';
  };
  
  // 重连策略
  reconnection: {
    auto_reconnect: boolean;
    max_attempts: number;
    backoff_strategy: 'exponential' | 'linear' | 'fixed';
    initial_delay: number;
    max_delay: number;
  };
  
  // 数据恢复
  data_recovery: {
    full_sync_on_reconnect: boolean;
    incremental_sync: boolean;
    conflict_resolution: boolean;
  };
}

// 离线事件管理
class OfflineEventManager {
  private offlineEvents: OfflineEvent[] = [];
  
  // 存储离线事件
  storeOfflineEvent(event: SocketEvent): void {
    const offlineEvent: OfflineEvent = {
      id: generateId(),
      event,
      timestamp: new Date(),
      retry_count: 0,
      status: 'pending'
    };
    
    this.offlineEvents.push(offlineEvent);
    this.persistToStorage();
  }
  
  // 重连后同步
  async syncOfflineEvents(socket: Socket): Promise<void> {
    const pendingEvents = this.offlineEvents
      .filter(e => e.status === 'pending')
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    for (const offlineEvent of pendingEvents) {
      try {
        await this.replayEvent(socket, offlineEvent);
        offlineEvent.status = 'synced';
      } catch (error) {
        offlineEvent.retry_count++;
        if (offlineEvent.retry_count >= 3) {
          offlineEvent.status = 'failed';
        }
      }
    }
    
    this.persistToStorage();
  }
}
```

### 3.3 性能优化策略

#### 事件节流和防抖

```typescript
// Socket.IO 事件优化
class SocketEventOptimizer {
  // 计时器更新节流（避免过于频繁的更新）
  private throttledTimerUpdate = throttle((data: TimerUpdateData) => {
    this.socket.emit('timer_update', data);
  }, 1000);
  
  // 任务更新防抖（用户快速编辑时合并请求）
  private debouncedTaskUpdate = debounce((data: UpdateTaskData) => {
    this.socket.emit('task_update', data);
  }, 500);
  
  // 批量事件处理
  private eventQueue: SocketEvent[] = [];
  private batchProcessor = setInterval(() => {
    if (this.eventQueue.length > 0) {
      this.processBatchEvents(this.eventQueue.splice(0));
    }
  }, 2000);
}
```

#### 连接池管理

```typescript
// Socket.IO 连接池配置
interface ConnectionPoolConfig {
  max_connections_per_user: number; // 每用户最大连接数
  connection_timeout: number; // 连接超时时间
  idle_timeout: number; // 空闲连接超时
  cleanup_interval: number; // 清理间隔
}

// 连接管理
class SocketConnectionManager {
  private userConnections = new Map<number, Set<string>>();
  
  addConnection(userId: number, socketId: string): void {
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    
    const connections = this.userConnections.get(userId)!;
    
    // 检查连接数限制
    if (connections.size >= this.config.max_connections_per_user) {
      this.closeOldestConnection(userId);
    }
    
    connections.add(socketId);
  }
  
  removeConnection(userId: number, socketId: string): void {
    const connections = this.userConnections.get(userId);
    if (connections) {
      connections.delete(socketId);
      if (connections.size === 0) {
        this.userConnections.delete(userId);
      }
    }
  }
}
```

### 3.4 错误处理和监控

```typescript
// Socket.IO 错误处理
interface SocketErrorHandler {
  // 连接错误
  onConnectionError(error: Error, socketId: string): void;
  
  // 认证错误
  onAuthenticationError(error: AuthError, socketId: string): void;
  
  // 事件处理错误
  onEventError(event: string, error: Error, data: any): void;
  
  // 房间操作错误
  onRoomError(operation: string, room: string, error: Error): void;
}

// 监控指标
interface SocketMetrics {
  // 连接指标
  active_connections: number;
  connections_per_second: number;
  average_connection_duration: number;
  
  // 事件指标
  events_per_second: number;
  event_processing_time: number;
  failed_events: number;
  
  // 房间指标
  active_rooms: number;
  messages_per_room: number;
  room_utilization: number;
}
```

通过这套基于 Socket.IO 的实时通信设计，番茄时钟应用将具备：

1. **可靠的实时通信**：自动重连、心跳检测、错误恢复
2. **高效的数据同步**：增量更新、冲突解决、离线支持
3. **优秀的用户体验**：低延迟、状态一致性、流畅交互
4. **强大的扩展能力**：房间管理、事件命名空间、集群支持

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