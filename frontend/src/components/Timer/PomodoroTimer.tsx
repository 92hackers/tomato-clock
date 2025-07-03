'use client';

import React, { useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useTaskStore } from '../../store/taskStore';
import { formatDuration } from '../../utils/timeFormatter';
import type { TimerMode } from '../../types/timer';
import type { Task } from '../../types/task';

// 严格按照设计稿的样式
const styles = `
  .timer-card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 350px;
    padding: 30px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .settings-btn {
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 22px;
    color: #888;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-btn:hover {
    background-color: #f5f5f5;
  }

  .timer-circle {
    width: 200px;
    height: 200px;
    background-color: #f0f0f0;
    border-radius: 50%;
    margin: 0 auto 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .timer-display {
    font-size: 46px;
    font-weight: 600;
    color: #333;
    line-height: 1;
  }

  .timer-unit {
    font-size: 16px;
    color: #666;
    margin-top: 4px;
  }

  .mode-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 25px;
  }

  .mode-tab {
    flex: 1;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .mode-tab.active {
    background-color: #007aff;
    color: white;
  }

  .mode-tab:not(.active) {
    background-color: #f0f0f0;
    color: #555;
  }

  .mode-tab:not(.active):hover {
    background-color: #e8e8e8;
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 30px;
  }

  .control-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    transition: all 0.2s;
  }

  .play-btn {
    background-color: #007aff;
    color: white;
  }

  .play-btn:hover {
    background-color: #0056d6;
    transform: scale(1.05);
  }

  .reset-btn {
    background-color: #f0f0f0;
    color: #555;
  }

  .reset-btn:hover {
    background-color: #e8e8e8;
    transform: scale(1.05);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .add-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #007aff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .add-btn:hover {
    background-color: #0056d6;
    transform: scale(1.1);
  }

  .task-list {
    margin-bottom: 30px;
    min-height: 80px;
  }

  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .task-item:last-child {
    border-bottom: none;
  }

  .task-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .task-checkbox {
    width: 16px;
    height: 16px;
    border: 2px solid #ddd;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .task-checkbox.completed {
    background-color: #007aff;
    border-color: #007aff;
  }

  .task-checkbox.completed::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 10px;
    font-weight: bold;
  }

  .task-text {
    font-size: 14px;
    color: #333;
    flex: 1;
  }

  .task-text.completed {
    text-decoration: line-through;
    color: #999;
  }

  .task-progress {
    font-size: 12px;
    color: #999;
  }

  .empty-tasks {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 20px 0;
  }

  .stats {
    display: flex;
    gap: 8px;
  }

  .stat-card {
    flex: 1;
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 16px 12px;
    text-align: center;
  }

  .stat-number {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    line-height: 1.2;
  }

  .task-form {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
  }

  .form-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .form-actions {
    display: flex;
    gap: 8px;
  }

  .form-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
  }

  .form-btn.primary {
    background-color: #007aff;
    color: white;
  }

  .form-btn.primary:hover {
    background-color: #0056d6;
  }

  .form-btn.secondary {
    background-color: #f0f0f0;
    color: #555;
  }

  .form-btn.secondary:hover {
    background-color: #e8e8e8;
  }
`;

// Mode Tab Component
interface ModeTabProps {
  mode: TimerMode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ModeTab: React.FC<ModeTabProps> = ({ mode, label, isActive, onClick }) => (
  <button
    className={`mode-tab ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Task Item Component
interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => (
  <div className="task-item">
    <div className="task-left">
      <div
        className={`task-checkbox ${task.completed ? 'completed' : ''}`}
        onClick={() => onToggle(task.id)}
      />
      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
        {task.title}
      </span>
    </div>
    <span className="task-progress">
      {task.completedPomodoros}/{task.estimatedPomodoros}
    </span>
  </div>
);

// Add Task Form Component
interface AddTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, estimatedPomodoros: number) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(4);

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title, estimatedPomodoros);
      setTitle('');
      setEstimatedPomodoros(4);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-form">
      <input
        type="text"
        className="form-input"
        placeholder="输入任务名称"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        autoFocus
      />
      <div className="form-actions">
        <button className="form-btn primary" onClick={handleSubmit}>
          保存
        </button>
        <button className="form-btn secondary" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
};

// Main PomodoroTimer Component
export const PomodoroTimer: React.FC = () => {
  const {
    currentMode,
    timeLeft,
    isRunning,
    isPaused,
    todayPomodoros,
    todayWorkTime,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  } = useTimer();

  const {
    tasks,
    addTask,
    completeTask,
    getActiveTasks,
  } = useTaskStore();

  const [showAddForm, setShowAddForm] = useState(false);

  const activeTasks = getActiveTasks();
  const completedTasks = tasks.filter(t => t.completed);

  // 根据当前状态决定时间显示格式
  const getTimeDisplay = () => {
    // 确保 timeLeft 有效
    const safeTimeLeft = timeLeft || 1500; // 默认25分钟
    
    if (isRunning || isPaused) {
      // 运行或暂停状态显示 MM:SS 格式
      const minutes = Math.floor(safeTimeLeft / 60);
      const seconds = safeTimeLeft % 60;
      return {
        time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        unit: null
      };
    } else {
      // 空闲状态显示分钟数
      const minutes = Math.floor(safeTimeLeft / 60);
      return {
        time: minutes.toString(),
        unit: 'minutes'
      };
    }
  };

  const { time, unit } = getTimeDisplay();

  const handleModeChange = (mode: TimerMode) => {
    if (!isRunning) {
      switchMode(mode);
    }
  };

  const handleTimerAction = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleTaskToggle = (taskId: string) => {
    completeTask(taskId);
  };

  const handleTaskAdd = (title: string, estimatedPomodoros: number) => {
    addTask({ title, estimatedPomodoros });
  };

  // Mode labels mapping
  const modeLabels = {
    work: '专注',
    shortBreak: '短休息',
    longBreak: '长休息',
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="timer-card" data-testid="pomodoro-timer">
        {/* Header */}
        <div className="header">
          <div className="title">专注时钟</div>
          <button className="settings-btn" title="设置">
            ⚙️
          </button>
        </div>

        {/* Timer Circle */}
        <div className="timer-circle">
          <div className="timer-display" data-testid="timer-display">{time}</div>
          {unit && <div className="timer-unit">{unit}</div>}
        </div>

        {/* Mode Tabs */}
        <div className="mode-tabs">
          <ModeTab
            mode="work"
            label={modeLabels.work}
            isActive={currentMode === 'work'}
            onClick={() => handleModeChange('work')}
          />
          <ModeTab
            mode="shortBreak"
            label={modeLabels.shortBreak}
            isActive={currentMode === 'shortBreak'}
            onClick={() => handleModeChange('shortBreak')}
          />
          <ModeTab
            mode="longBreak"
            label={modeLabels.longBreak}
            isActive={currentMode === 'longBreak'}
            onClick={() => handleModeChange('longBreak')}
          />
        </div>

        {/* Control Buttons */}
        <div className="controls">
          <button className="control-btn play-btn" onClick={handleTimerAction} aria-label={isRunning ? '暂停' : '开始'}>
            {isRunning ? '⏸' : '▶'}
          </button>
          <button className="control-btn reset-btn" onClick={resetTimer} aria-label="重置">
            ↻
          </button>
        </div>

        {/* Tasks Section */}
        <div className="section-header">
          <div className="section-title">今日任务</div>
          <button className="add-btn" onClick={() => setShowAddForm(true)}>
            +
          </button>
        </div>

        <AddTaskForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAdd={handleTaskAdd}
        />

        <div className="task-list">
          {activeTasks.length > 0 ? (
            activeTasks.slice(0, 3).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleTaskToggle}
              />
            ))
          ) : (
            <div className="empty-tasks">
              暂无任务，点击 + 添加任务
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="section-header">
          <div className="section-title">今日统计</div>
        </div>
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{todayPomodoros || 0}</div>
            <div className="stat-label">完成番茄</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{Math.round((todayWorkTime || 0) / 60)}</div>
            <div className="stat-label">专注分钟</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedTasks.length}</div>
            <div className="stat-label">完成任务</div>
          </div>
        </div>
      </div>
    </>
  );
}; 