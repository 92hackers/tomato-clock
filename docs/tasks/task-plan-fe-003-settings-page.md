# 任务计划：FE-003 设置界面开发

## 任务概述
根据 `index.html` 设计稿实现设置界面，包含时间设置、通知设置和主题设置功能，与主界面的设置按钮进行集成。

## 任务目标
- [ ] 创建设置页面组件 `SettingsPage.tsx`
- [ ] 实现时间设置功能（专注时长/短休息时长/长休息时长）
- [ ] 实现通知设置切换开关（时间结束提醒/休息提醒）
- [ ] 实现主题设置切换开关（深色模式）
- [ ] 添加返回导航功能
- [ ] 集成路由系统（React Router）
- [ ] 创建设置数据持久化（localStorage/Zustand persist）
- [ ] 编写完整的测试用例
- [ ] 更新主界面设置按钮导航

## 技术方案

### 1. 路由系统集成
```typescript
// 使用 Next.js App Router 实现页面导航 (原生支持)
- 主界面路由：'/' (app/page.tsx)
- 设置界面路由：'/settings' (app/settings/page.tsx)  
- 使用 useRouter hook 进行程序化导航
```

### 2. 设置数据管理
```typescript
// 创建设置状态管理 store
interface SettingsState {
  timers: {
    workDuration: number;      // 专注时长（秒）
    shortBreakDuration: number; // 短休息时长（秒）
    longBreakDuration: number;  // 长休息时长（秒）
  };
  notifications: {
    timeEndAlert: boolean;     // 时间结束提醒
    breakReminder: boolean;    // 休息提醒
  };
  theme: {
    darkMode: boolean;         // 深色模式
  };
}
```

### 3. UI组件设计
```typescript
// 按照设计稿实现的组件结构
- SettingsPage (主容器)
  - SettingsHeader (标题栏 + 返回按钮)
  - SettingsSection (设置分组)
    - TimeSettings (时间设置)
    - NotificationSettings (通知设置)
    - ThemeSettings (主题设置)
  - ToggleSwitch (切换开关组件)
  - SettingItem (设置项组件)
```

### 4. 样式实现
- 严格按照 `index.html` 中的设计样式
- 白色卡片容器，350px 宽度
- 分组标题和设置项布局
- 切换开关动画效果

## 涉及文件

### 新增文件
- `frontend/src/pages/SettingsPage.tsx` - 设置页面主组件
- `frontend/src/components/Settings/SettingsHeader.tsx` - 设置页面头部
- `frontend/src/components/Settings/SettingsSection.tsx` - 设置分组组件
- `frontend/src/components/Settings/SettingItem.tsx` - 设置项组件
- `frontend/src/components/Settings/ToggleSwitch.tsx` - 切换开关组件
- `frontend/src/store/settingsStore.ts` - 设置状态管理
- `frontend/src/types/settings.ts` - 设置相关类型定义
- `frontend/src/pages/__tests__/SettingsPage.test.tsx` - 设置页面测试
- `frontend/src/components/Settings/__tests__/` - 组件测试文件夹

### 修改文件
- `frontend/src/app/page.tsx` - 更新路由配置
- `frontend/src/app/layout.tsx` - 添加路由提供者
- `frontend/src/components/Timer/PomodoroTimer.tsx` - 设置按钮添加导航
- `frontend/src/store/timerStore.ts` - 集成设置数据
- `frontend/package.json` - ❌ ~~添加 React Router 依赖~~ (Next.js 原生支持路由)

## 预计工作量
**估计完成时间：2-3 天**

- ~~路由系统集成：4小时~~ (Next.js 原生支持)
- 设置页面开发：8小时
- 状态管理集成：4小时
- 样式实现：6小时
- 测试编写：6小时
- 集成调试：2小时

## 依赖关系
- ✅ 依赖 FE-002 已完成的主界面
- ✅ 依赖现有的 Zustand 状态管理架构
- 🔄 为后续任务提供路由基础

## 风险评估

### 潜在风险
1. ~~**路由集成复杂性**：Next.js App Router 与组件导航的集成~~ (已简化)
2. **状态同步**：设置变更与计时器状态的同步
3. **持久化冲突**：多个 Zustand store 的持久化配置
4. **样式一致性**：确保与主界面设计风格一致

### 缓解措施
1. ~~使用 Next.js 推荐的路由模式~~ (原生支持，无需特殊配置)
2. 设计清晰的状态更新接口
3. 分离不同 store 的持久化 key
4. 复用现有的样式变量和组件

## 验收标准

### 功能验收
- [ ] 设置页面正确渲染，样式与设计稿一致
- [ ] 时间设置可以修改并影响计时器行为
- [ ] 通知开关可以切换并保存状态
- [ ] 主题开关可以切换（为后续深色模式预留）
- [ ] 返回按钮可以正确导航回主界面
- [ ] 设置数据持久化，刷新后保持

### 技术验收
- [ ] 所有测试用例通过（目标：95%+ 覆盖率）
- [ ] TypeScript 类型检查通过
- [ ] ESLint 代码规范检查通过
- [ ] 响应式设计适配移动端
- [ ] 无控制台错误或警告

### 设计验收
- [ ] 与 `index.html` 设计稿像素级一致
- [ ] 切换动画流畅自然
- [ ] 交互反馈及时明确
- [ ] 字体、颜色、间距精确匹配

## 创建时间
2025-01-21

## 负责人
AI Assistant (Claude)

## 下一步规划
FE-003 完成后，下一个任务将是 **FE-004 添加任务界面开发**，实现独立的任务添加页面。 