'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTimer } from '../../hooks/useTimer';
import { useTaskStore } from '../../store/taskStore';
import { formatDuration } from '../../utils/timeFormatter';
import type { TimerMode } from '../../types/timer';
import type { Task } from '../../types/task';

// 严格按照 index.html 设计稿的样式实现
const styles = `
  .main-card {
    width: 100%;
    transition: transform 0.2s;
  }

  .main-card:hover {
    transform: scale(1.02);
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

  .settings {
    width: 28px;
    height: 28px;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 22px;
    color: #888;
  }

  .timer-circle {
    width: 200px;
    height: 200px;
    background-color: #f0f0f0;
    border-radius: 50%;
    margin: 0 auto 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .timer {
    font-size: 46px;
    font-weight: 600;
    color: #333;
  }

  .buttons-row {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;
    gap: 12px;
  }

  .tab-button {
    flex: 1;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .tab-button.active {
    background-color: #007aff;
    color: white;
  }

  .tab-button:not(.active) {
    background-color: #f0f0f0;
    color: #555;
  }

  .control-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 30px;
  }

  .control-button {
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

  .play-button {
    background-color: #007aff;
    color: white;
  }

  .reset-button {
    background-color: #f0f0f0;
    color: #555;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
  }

  .add-button {
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
  }

  .task-list {
    list-style: none;
    padding: 0;
    margin: 0 0 30px 0;
    max-height: 120px;
    overflow-y: auto;
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
    border-radius: 50%;
    border: 2px solid #ddd;
    cursor: pointer;
    transition: all 0.2s;
  }

  .task-checkbox.completed {
    background-color: #007aff;
    border-color: #007aff;
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

  .task-count {
    font-size: 12px;
    color: #999;
  }

  .stats {
    display: flex;
    gap: 8px;
  }

  .stat-box {
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
  }
`;

// Mode Tab Component
interface ModeTabProps {
  mode: TimerMode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ModeTab: React.FC<ModeTabProps> = ({
  mode,
  label,
  isActive,
  onClick,
}) => (
  <button
    className={`tab-button ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Task Item Component
interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => (
  <li className='task-item'>
    <div className='task-left'>
      <div
        className={`task-checkbox ${task.completed ? 'completed' : ''}`}
        onClick={() => onToggle(task.id)}
      />
      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
        {task.title}
      </span>
    </div>
    <span className='task-count'>
      {task.completedPomodoros}/{task.estimatedPomodoros}
    </span>
  </li>
);

// Main Component
export const PomodoroTimerCard: React.FC = () => {
  const router = useRouter();
  const {
    currentMode,
    timeLeft,
    isRunning,
    isPaused,
    isIdle,
    isCompleted,
    todayPomodoros,
    todayWorkTime,
    currentCycleProgress,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  } = useTimer();

  const { tasks, completeTask, incrementTaskPomodoro, getActiveTasks } =
    useTaskStore();

  const formattedTime = formatDuration(timeLeft);
  const activeTasks = getActiveTasks();

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

  const handleTaskDelete = (taskId: string) => {
    // Implementation for task deletion
  };

  // 处理添加任务按钮点击 - 导航到添加任务页面
  const handleAddTaskClick = () => {
    router.push('/add-task');
  };

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    router.push('/settings');
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
      <div className='main-card'>
        {/* Header */}
        <div className='header'>
          <div className='title'>专注时钟</div>
          <button className='settings' onClick={handleSettingsClick}>
            ⚙️
          </button>
        </div>

        {/* Timer Circle */}
        <div className='timer-circle'>
          <div className='timer'>{formattedTime}</div>
        </div>

        {/* Mode Tabs */}
        <div className='buttons-row'>
          <ModeTab
            mode='work'
            label={modeLabels.work}
            isActive={currentMode === 'work'}
            onClick={() => handleModeChange('work')}
          />
          <ModeTab
            mode='shortBreak'
            label={modeLabels.shortBreak}
            isActive={currentMode === 'shortBreak'}
            onClick={() => handleModeChange('shortBreak')}
          />
          <ModeTab
            mode='longBreak'
            label={modeLabels.longBreak}
            isActive={currentMode === 'longBreak'}
            onClick={() => handleModeChange('longBreak')}
          />
        </div>

        {/* Control Buttons */}
        <div className='control-buttons'>
          <button
            className='control-button play-button'
            onClick={handleTimerAction}
          >
            {isRunning ? '⏸' : '▶'}
          </button>
          <button className='control-button reset-button' onClick={resetTimer}>
            ↻
          </button>
        </div>

        {/* Tasks Section */}
        <div className='section-title'>
          今日任务
          <button className='add-button' onClick={handleAddTaskClick}>
            +
          </button>
        </div>

        <ul className='task-list'>
          {activeTasks.length > 0 ? (
            activeTasks
              .slice(0, 3)
              .map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleTaskToggle}
                  onDelete={handleTaskDelete}
                />
              ))
          ) : (
            <li style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              暂无任务，点击 + 添加任务
            </li>
          )}
        </ul>

        {/* Statistics */}
        <div className='section-title'>今日统计</div>
        <div className='stats'>
          <div className='stat-box'>
            <div className='stat-number'>{todayPomodoros || 0}</div>
            <div className='stat-label'>完成番茄</div>
          </div>
          <div className='stat-box'>
            <div className='stat-number'>
              {Math.round((todayWorkTime || 0) / 60)}
            </div>
            <div className='stat-label'>专注分钟</div>
          </div>
          <div className='stat-box'>
            <div className='stat-number'>
              {activeTasks.filter(t => t.completed).length}
            </div>
            <div className='stat-label'>完成任务</div>
          </div>
        </div>
      </div>
    </>
  );
};
