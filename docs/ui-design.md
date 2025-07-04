# UI设计文档

## 1. 设计理念

番茄时钟应用采用现代简约的iOS风格设计语言，注重用户体验和视觉美感。设计目标是创造一个既美观又实用的时间管理工具，让用户在使用过程中感到愉悦和专注。

### 1.1 设计原则

1. **简洁明了** - 界面布局清晰，信息层次分明，避免视觉干扰
2. **一致性** - 统一的设计语言贯穿所有界面，保持视觉和交互的一致性
3. **易用性** - 直观的操作流程，降低学习成本，提高使用效率
4. **专注导向** - 设计支持专注工作，通过颜色和布局引导用户注意力
5. **情感化设计** - 通过微交互和动画增强用户的情感体验

### 1.2 设计风格

- **iOS设计规范** - 遵循Apple Human Interface Guidelines
- **毛玻璃效果** - 使用半透明和模糊效果增加层次感
- **圆角设计** - 大量使用圆角元素，创造友好温和的视觉感受
- **卡片式布局** - 信息以卡片形式组织，清晰分离不同功能模块

## 2. 色彩系统

### 2.1 主色调

```css
/* 主要颜色 */
--primary-blue: #007AFF;      /* iOS蓝色，用于主要按钮和强调元素 */
--primary-green: #34C759;     /* 成功绿色，用于完成状态 */
--primary-red: #FF3B30;       /* 警告红色，用于删除或重要提醒 */
--primary-orange: #FF9500;    /* 专注橙色，用于番茄时钟相关元素 */

/* 中性色 */
--gray-50: #F2F2F7;          /* 背景色 */
--gray-100: #E5E5EA;         /* 分割线 */
--gray-200: #D1D1D6;         /* 边框 */
--gray-300: #C7C7CC;         /* 禁用状态 */
--gray-600: #8E8E93;         /* 次要文字 */
--gray-900: #1C1C1E;         /* 主要文字 */

/* 语义色 */
--background: #FFFFFF;        /* 背景白色 */
--surface: #F2F2F7;          /* 表面色 */
--text-primary: #1C1C1E;     /* 主要文字 */
--text-secondary: #8E8E93;   /* 次要文字 */
```

### 2.2 深色模式

```css
/* 深色模式色彩 */
--dark-background: #000000;
--dark-surface: #1C1C1E;
--dark-text-primary: #FFFFFF;
--dark-text-secondary: #8E8E93;
--dark-gray-100: #38383A;
--dark-gray-200: #48484A;
```

### 2.3 模式相关色彩

- **专注模式** - 暖橙色调 (#FF9500)，营造专注氛围
- **短休息模式** - 清新绿色调 (#34C759)，表示轻松休息
- **长休息模式** - 冷静蓝色调 (#007AFF)，表示充分休息

## 3. 字体系统

### 3.1 字体选择

```css
/* 主要字体栈 */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
```

### 3.2 字体层级

```css
/* 标题层级 */
.title-large {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.2;
}

.title-medium {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
}

.title-small {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
}

/* 正文层级 */
.body-large {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.5;
}

.body-medium {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
}

.body-small {
  font-size: 13px;
  font-weight: 400;
  line-height: 1.3;
}

/* 特殊字体 */
.timer-display {
  font-size: 48px;
  font-weight: 300;
  font-family: "SF Mono", Monaco, monospace;
}
```

## 4. 布局系统

### 4.1 画布式布局

应用采用创新的画布式布局，类似于Figma的设计体验：

- **无限画布** - 用户可以自由拖拽和缩放查看不同界面
- **卡片式界面** - 每个功能界面以独立卡片形式展示
- **空间组织** - 相关功能界面在空间上相邻布局

```css
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.screen {
  position: absolute;
  width: 350px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 30px;
}
```

### 4.2 栅格系统

在单个界面内采用8px栅格系统：

- **基础单位** - 8px
- **间距规范** - 8px, 16px, 24px, 32px, 48px
- **组件尺寸** - 遵循8px倍数规则

### 4.3 响应式设计

```css
/* 移动端适配 */
@media (max-width: 768px) {
  .screen {
    width: 90vw;
    max-width: 350px;
    padding: 20px;
  }
}
```

## 5. 组件设计

### 5.1 按钮组件

```css
/* 主要按钮 */
.button-primary {
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: #0056CC;
  transform: translateY(-1px);
}

/* 次要按钮 */
.button-secondary {
  background: var(--gray-100);
  color: var(--text-primary);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
}

/* 控制按钮（播放/暂停） */
.control-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-blue);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}
```

### 5.2 计时器组件

```css
.timer-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 
    20px 20px 60px #d9d9d9,
    -20px -20px 60px #ffffff;
}

.timer {
  font-size: 48px;
  font-weight: 300;
  color: var(--text-primary);
  font-family: "SF Mono", Monaco, monospace;
}
```

### 5.3 任务卡片组件

```css
.task-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 8px;
  border: 1px solid var(--gray-200);
  transition: all 0.2s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--gray-300);
  transition: all 0.2s ease;
}

.task-checkbox.completed {
  background: var(--primary-green);
  border-color: var(--primary-green);
}
```

### 5.4 统计卡片组件

```css
.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  text-align: center;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: scale(1.05);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}
```

## 6. 动画与交互

### 6.1 过渡动画

```css
/* 标准过渡 */
.transition-standard {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 弹性过渡 */
.transition-bounce {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 淡入淡出 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 6.2 微交互

- **按钮点击** - 轻微的缩放和阴影变化
- **卡片悬停** - 上浮效果和阴影增强
- **计时器运行** - 脉动效果表示活跃状态
- **任务完成** - 复选框动画和划线效果

### 6.3 状态反馈

```css
/* 计时器运行状态 */
.timer-running {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 149, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 149, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 149, 0, 0); }
}

/* 任务完成动画 */
.task-completed {
  animation: taskComplete 0.5s ease-in-out;
}

@keyframes taskComplete {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## 7. 图标系统

### 7.1 图标风格

- **线性图标** - 使用2px线宽的线性图标
- **圆角处理** - 图标端点采用圆角处理
- **统一尺寸** - 标准尺寸为24x24px

### 7.2 图标库

```css
/* 使用CSS创建图标 */
.icon-play::before {
  content: "▶";
  font-size: 18px;
}

.icon-pause::before {
  content: "⏸";
  font-size: 18px;
}

.icon-reset::before {
  content: "↻";
  font-size: 18px;
}

.icon-settings::before {
  content: "⚙";
  font-size: 18px;
}
```

## 8. 界面布局详细设计

### 8.1 主计时界面

- **顶部区域** - 显示当前日期和设置按钮
- **中央区域** - 大号计时器显示和模式切换标签
- **控制区域** - 播放/暂停和重置按钮
- **任务区域** - 当前任务列表和添加按钮
- **底部区域** - 今日统计信息

### 8.2 设置界面

- **标题栏** - 设置标题和返回按钮
- **时间设置** - 滑块控件调整各模式时长
- **通知设置** - 开关控件管理通知偏好
- **主题设置** - 明暗模式切换

### 8.3 统计界面

- **概览卡片** - 重要统计数据的卡片展示
- **图表区域** - 可视化统计图表
- **时间筛选** - 周、月、年选择器

### 8.4 成就界面

- **成就网格** - 成就徽章的网格布局
- **进度指示** - 成就解锁进度
- **技巧卡片** - 专注技巧的卡片展示

### 8.5 登录界面

**设计理念**
- 简洁优雅的iOS风格设计，营造安全可信的认证环境
- 最小化干扰元素，专注于认证流程本身
- 清晰的视觉层次和友好的错误提示

**布局结构**
```
┌─────────────────────────┐
│      应用标志/标题        │
│    "欢迎回来"欢迎语      │
├─────────────────────────┤
│                        │
│    [邮箱输入框]         │
│    [密码输入框]         │
│                        │
│    [登录按钮]           │
│                        │
│   "还没有账户？注册"     │
│                        │
└─────────────────────────┘
```

**组件规范**
```css
/* 认证容器 */
.auth-container {
  max-width: 350px;
  padding: 40px 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 应用标志区域 */
.auth-logo {
  margin-bottom: 24px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 17px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

/* 输入框样式 */
.auth-input {
  width: 100%;
  padding: 16px 20px;
  background: var(--gray-50);
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 17px;
  margin-bottom: 16px;
  transition: all 0.2s ease;
}

.auth-input:focus {
  border-color: var(--primary-blue);
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.auth-input.error {
  border-color: var(--primary-red);
  background: rgba(255, 59, 48, 0.05);
}

/* 认证按钮 */
.auth-button {
  width: 100%;
  padding: 16px;
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  margin: 24px 0;
  transition: all 0.2s ease;
}

.auth-button:hover {
  background: #0056CC;
  transform: translateY(-1px);
}

.auth-button:disabled {
  background: var(--gray-300);
  transform: none;
  cursor: not-allowed;
}

/* 错误提示 */
.auth-error {
  color: var(--primary-red);
  font-size: 14px;
  text-align: left;
  margin-top: -12px;
  margin-bottom: 8px;
  padding-left: 4px;
}

/* 链接样式 */
.auth-link {
  color: var(--primary-blue);
  text-decoration: none;
  font-size: 15px;
  transition: opacity 0.2s ease;
}

.auth-link:hover {
  opacity: 0.7;
}
```

**交互状态**
- **默认状态** - 输入框透明背景，蓝色边框聚焦
- **输入状态** - 实时验证，错误时红色边框和提示
- **提交状态** - 按钮显示加载动画，禁用表单
- **错误状态** - 统一的错误提示样式和恢复机制

### 8.6 注册界面

**设计理念**
- 引导式的注册流程，降低用户心理负担
- 实时验证反馈，提供即时的指导和确认
- 清晰的服务条款展示，建立用户信任

**布局结构**
```
┌─────────────────────────┐
│      应用标志/标题        │
│   "创建新账户"标题       │
├─────────────────────────┤
│                        │
│    [用户名输入框]        │
│    [邮箱输入框]         │
│    [密码输入框]         │
│    [确认密码输入框]      │
│                        │
│   ☑ 我同意服务条款      │
│                        │
│    [注册按钮]           │
│                        │
│   "已有账户？登录"       │
│                        │
└─────────────────────────┘
```

**特殊组件**
```css
/* 密码强度指示器 */
.password-strength {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  margin-bottom: 16px;
}

.strength-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-200);
  transition: all 0.3s ease;
}

.strength-dot.active {
  background: var(--primary-green);
  transform: scale(1.2);
}

/* 服务条款复选框 */
.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 24px 0;
  text-align: left;
}

.terms-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 0;
  accent-color: var(--primary-blue);
}

.terms-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.terms-link {
  color: var(--primary-blue);
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}
```

**验证反馈设计**
- **实时验证** - 用户输入时即时显示验证结果
- **成功指示** - 绿色对勾表示验证通过
- **错误指示** - 红色感叹号和具体错误信息
- **进度提示** - 密码强度可视化指示器

### 8.7 认证状态指示

**加载状态**
```css
/* 加载动画 */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 加载按钮 */
.auth-button.loading {
  position: relative;
  color: transparent;
}

.auth-button.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

**成功状态**
```css
/* 成功提示 */
.auth-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(52, 199, 89, 0.1);
  border: 1px solid rgba(52, 199, 89, 0.3);
  border-radius: 8px;
  color: var(--primary-green);
  font-size: 14px;
  margin-bottom: 16px;
}

.success-icon::before {
  content: "✓";
  font-weight: bold;
}
```

**错误状态**
```css
/* 全局错误提示 */
.auth-error-banner {
  padding: 12px 16px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 8px;
  color: var(--primary-red);
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.error-icon::before {
  content: "⚠";
  margin-right: 8px;
}
```

### 8.8 无障碍访问设计

**键盘导航**
```css
/* 焦点环 */
.auth-input:focus-visible,
.auth-button:focus-visible,
.terms-checkbox input:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Tab顺序优化 */
.auth-form input,
.auth-form button {
  tab-index: auto;
}
```

**屏幕阅读器支持**
```html
<!-- ARIA标签示例 -->
<div class="auth-container" role="main" aria-labelledby="auth-title">
  <h1 id="auth-title">登录到番茄时钟</h1>
  
  <form role="form" aria-label="登录表单">
    <input 
      type="email" 
      aria-label="邮箱地址"
      aria-describedby="email-error"
      aria-invalid="false"
      tabindex="1"
    />
    
    <div id="email-error" role="alert" aria-live="polite">
      <!-- 错误信息 -->
    </div>
    
    <button 
      type="submit" 
      aria-label="提交登录表单"
      aria-describedby="login-status"
      tabindex="3"
    >
      登录
    </button>
  </form>
</div>
```

**色彩对比度**
- 确保所有文字与背景的对比度至少为4.5:1
- 错误状态的红色对比度符合可访问性标准
- 提供高对比度模式选项

## 9. 数据可视化设计规范

### 9.1 图表设计原则

番茄时钟应用的数据统计界面采用现代化的数据可视化设计，遵循以下核心原则：

#### 9.1.1 设计理念
- **清晰性**: 数据展示清晰易懂，避免视觉混乱
- **一致性**: 图表样式与整体设计语言保持一致
- **交互性**: 提供丰富的交互功能增强用户体验
- **响应式**: 适配不同设备屏幕尺寸

#### 9.1.2 色彩规范

```css
/* 图表专用色彩系统 */
:root {
  /* 主要数据色彩 */
  --chart-primary: #007AFF;      /* iOS蓝色 - 主要数据 */
  --chart-secondary: #34C759;    /* 成功绿色 - 完成数据 */
  --chart-warning: #FF9500;      /* 专注橙色 - 专注相关 */
  --chart-error: #FF3B30;        /* 警告红色 - 问题数据 */
  
  /* 渐变色彩 */
  --chart-gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --chart-gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --chart-gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  
  /* 中性色彩 */
  --chart-gray-100: #F5F5F7;
  --chart-gray-200: #E5E5EA;
  --chart-gray-300: #D1D1D6;
  --chart-gray-600: #8E8E93;
  
  /* 背景色彩 */
  --chart-background: rgba(0, 122, 255, 0.05);
  --chart-grid: rgba(0, 0, 0, 0.1);
  --chart-tooltip-bg: rgba(0, 0, 0, 0.8);
}
```

### 9.2 图表组件设计

#### 9.2.1 折线图设计 (LineChart)

```css
.line-chart-container {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.line-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.line-chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.line-chart-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* 图表样式配置 */
.line-chart {
  --line-color: var(--chart-primary);
  --line-width: 3px;
  --point-radius: 6px;
  --point-hover-radius: 8px;
  --fill-color: var(--chart-background);
}
```

#### 9.2.2 柱状图设计 (BarChart)

```css
.bar-chart-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.bar-chart {
  --bar-color-1: var(--chart-primary);
  --bar-color-2: var(--chart-secondary);
  --bar-color-3: var(--chart-warning);
  --bar-color-4: var(--chart-error);
  --bar-radius: 8px;
  --bar-spacing: 0.6;
}

.bar-chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
```

#### 9.2.3 环形图设计 (DoughnutChart)

```css
.doughnut-chart-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.doughnut-chart {
  --cutout-percentage: 60%;
  --border-width: 0;
  --hover-border-width: 4px;
}

.doughnut-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.doughnut-center-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.doughnut-center-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}
```

### 9.3 时间选择器设计

```css
.period-selector {
  display: flex;
  background: var(--chart-gray-100);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.period-option {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-option.active {
  background: white;
  color: var(--chart-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.period-option:hover:not(.active) {
  color: var(--text-primary);
}
```

### 9.4 统计卡片设计

```css
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--chart-gradient-1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: var(--chart-background);
  color: var(--chart-primary);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
}

.stat-change.positive {
  color: var(--chart-secondary);
  background: rgba(52, 199, 89, 0.1);
}

.stat-change.negative {
  color: var(--chart-error);
  background: rgba(255, 59, 48, 0.1);
}
```

### 9.5 交互设计

#### 9.5.1 Tooltip 设计

```css
.chart-tooltip {
  background: var(--chart-tooltip-bg);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: none;
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.tooltip-body {
  font-weight: 400;
  opacity: 0.9;
}
```

#### 9.5.2 交互动画

```css
.chart-animation {
  animation: chartFadeIn 0.6s ease-out;
}

@keyframes chartFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-hover-effect {
  transition: all 0.2s ease;
}

.chart-hover-effect:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}
```

### 9.6 响应式适配

#### 9.6.1 移动端优化

```css
/* 移动端图表适配 */
@media (max-width: 768px) {
  .chart-container {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .chart-title {
    font-size: 16px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .period-selector {
    margin-bottom: 16px;
  }
  
  .period-option {
    padding: 10px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    padding: 12px;
    border-radius: 12px;
  }
  
  .stat-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .doughnut-center-value {
    font-size: 20px;
  }
  
  .legend-item {
    font-size: 12px;
  }
}
```

#### 9.6.2 平板端适配

```css
@media (min-width: 769px) and (max-width: 1024px) {
  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  
  .chart-container.full-width {
    grid-column: 1 / -1;
  }
}
```

### 9.7 数据加载状态设计

```css
.chart-skeleton {
  background: var(--chart-gray-100);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.chart-skeleton::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.skeleton-bar {
  height: 200px;
  background: var(--chart-gray-200);
  border-radius: 8px;
  margin-bottom: 16px;
}

.skeleton-text {
  height: 16px;
  background: var(--chart-gray-200);
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-text.long {
  width: 80%;
}
```

### 9.8 无障碍访问支持

```css
/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .chart-container {
    border: 2px solid var(--text-primary);
  }
  
  .stat-card {
    border: 1px solid var(--chart-gray-300);
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .chart-animation,
  .chart-hover-effect {
    animation: none;
    transition: none;
  }
}

/* 屏幕阅读器支持 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 9.9 数据可视化最佳实践

#### 9.9.1 图表选择指南

- **折线图**: 适用于时间序列数据，显示趋势变化
- **柱状图**: 适用于分类数据比较，显示数量对比
- **环形图**: 适用于部分与整体关系，显示比例分布

#### 9.9.2 颜色使用规范

1. **主色调**: 使用 iOS 系统色彩作为主要数据颜色
2. **对比度**: 确保足够的对比度以支持可访问性
3. **色盲友好**: 避免单纯依赖颜色传达信息
4. **语义化**: 绿色表示正面数据，红色表示负面数据

#### 9.9.3 交互设计规范

1. **悬停反馈**: 提供即时的视觉反馈
2. **点击交互**: 支持点击查看详细信息
3. **触摸友好**: 移动端触摸目标至少 44px
4. **键盘导航**: 支持键盘访问和导航

## 10. 设计规范总结

### 10.1 核心规范

- **最小点击区域** - 44x44px（遵循iOS规范）
- **文字最小尺寸** - 13px
- **圆角半径** - 8px, 12px, 16px, 20px
- **阴影层级** - 4个层级对应不同的元素重要性
- **动画时长** - 快速交互0.2s，页面过渡0.3s

### 10.2 质量检查清单

- [ ] 所有交互元素都有明确的视觉反馈
- [ ] 色彩使用保持一致性
- [ ] 字体层级清晰明确
- [ ] 间距符合8px栅格系统
- [ ] 动画流畅自然
- [ ] 深色模式适配完整
- [ ] 移动端体验良好
- [ ] 可访问性要求满足

通过遵循这些设计规范，番茄时钟应用能够提供一致、美观、易用的用户体验，帮助用户更好地专注于时间管理和工作效率提升。 