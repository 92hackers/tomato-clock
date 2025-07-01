'use client';

import React, { useEffect, useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import type { TimerMode } from '../../types/timer';
import { formatDuration } from '../../utils/timeFormatter';

// Color mapping for different modes
const modeColors = {
  work: {
    bg: 'bg-orange-600',
    text: 'text-orange-600',
    border: 'border-orange-600',
    ring: 'ring-orange-200',
  },
  shortBreak: {
    bg: 'bg-green-600',
    text: 'text-green-600',
    border: 'border-green-600',
    ring: 'ring-green-200',
  },
  longBreak: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    ring: 'ring-blue-200',
  },
};

// Mode labels
const modeLabels = {
  work: '专注',
  shortBreak: '短休息',
  longBreak: '长休息',
};

// Progress Circle Component
interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  children: React.ReactNode;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 280,
  strokeWidth = 8,
  color,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="计时进度"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={color}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Mode Tab Component
interface ModeTabProps {
  mode: TimerMode;
  isActive: boolean;
  isDisabled: boolean;
  onClick: (mode: TimerMode) => void;
}

const ModeTab: React.FC<ModeTabProps> = ({ mode, isActive, isDisabled, onClick }) => {
  const colors = modeColors[mode];
  
  return (
    <button
      onClick={() => onClick(mode)}
      disabled={isDisabled}
      className={`
        flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200
        ${isActive 
          ? `${colors.bg} text-white shadow-lg` 
          : `bg-gray-100 text-gray-600 hover:bg-gray-200 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`
        }
      `}
    >
      {modeLabels[mode]}
    </button>
  );
};

// Timer Controls Component
interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  modeColor: string;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  isIdle,
  isCompleted,
  onStart,
  onPause,
  onReset,
  modeColor,
}) => {
  const getMainButtonText = () => {
    if (isCompleted) return '开始新会话';
    if (isRunning) return '暂停';
    if (isPaused) return '继续';
    return '开始';
  };

  const getMainButtonAction = () => {
    if (isRunning) return onPause;
    return onStart;
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Main Control Button */}
      <button
        onClick={getMainButtonAction()}
        tabIndex={0}
        className={`
          ${modeColors[modeColor as keyof typeof modeColors].bg} 
          text-white px-8 py-4 rounded-full font-semibold text-lg
          shadow-lg hover:shadow-xl transform hover:scale-105 
          transition-all duration-200 focus:outline-none focus:ring-4 
          ${modeColors[modeColor as keyof typeof modeColors].ring}
        `}
      >
        {getMainButtonText()}
      </button>
      
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="
          bg-gray-200 text-gray-700 p-4 rounded-full 
          hover:bg-gray-300 transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-gray-200
        "
        title="重置"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};

// Statistics Component
interface StatisticsProps {
  todayPomodoros: number;
  todayWorkTime: number;
  currentCycleProgress: number;
  sessionsUntilLongBreak: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  todayPomodoros,
  todayWorkTime,
  currentCycleProgress,
  sessionsUntilLongBreak,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
      {/* Today's Pomodoros */}
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="text-2xl font-bold text-gray-800">{todayPomodoros}</div>
        <div className="text-sm text-gray-600">
          <div>今日完成</div>
          <div>个番茄钟</div>
        </div>
      </div>
      
      {/* Today's Work Time */}
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="text-2xl font-bold text-gray-800">
          {formatDuration(todayWorkTime)}
        </div>
        <div className="text-sm text-gray-600">今日专注</div>
      </div>
      
      {/* Cycle Progress */}
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="text-2xl font-bold text-gray-800">
          {currentCycleProgress}/{sessionsUntilLongBreak}
        </div>
        <div className="text-sm text-gray-600">周期进度</div>
      </div>
    </div>
  );
};

// Main PomodoroTimer Component
export const PomodoroTimer: React.FC = () => {
  const {
    currentMode,
    status,
    remainingTime,
    duration,
    progress,
    isRunning,
    isPaused,
    isIdle,
    isCompleted,
    start,
    pause,
    reset,
    switchMode,
    currentModeInfo,
    sessionStats,
    suggestedNextMode,
    shouldShowNotification,
    getNotificationMessage,
  } = useTimer();

  const [announcement, setAnnouncement] = useState('');
  const formattedTime = `${Math.floor(remainingTime / 60).toString().padStart(2, '0')}:${(remainingTime % 60).toString().padStart(2, '0')}`;

  // Handle status change announcements
  useEffect(() => {
    if (isRunning && !isPaused) {
      setAnnouncement('计时器已开始');
    } else if (isPaused) {
      setAnnouncement('计时器已暂停');
    } else if (isCompleted) {
      setAnnouncement('计时器已完成');
    }
  }, [isRunning, isPaused, isCompleted]);

  const colors = modeColors[currentMode];
  const suggested = suggestedNextMode();

  return (
    <div 
      className="flex flex-col items-center space-y-8 p-6 max-w-4xl mx-auto"
      data-testid="pomodoro-timer"
    >
      {/* Screen reader announcement */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
        hidden
      >
        {announcement}
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-2 bg-gray-50 p-2 rounded-lg w-full max-w-md">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((mode) => (
          <ModeTab
            key={mode}
            mode={mode}
            isActive={currentMode === mode}
            isDisabled={isRunning}
            onClick={switchMode}
          />
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center space-y-4">
        {/* Mode Info */}
        <div className="space-y-2">
          <h1 className={`text-2xl font-semibold ${colors.text}`}>
            {currentModeInfo.label}
          </h1>
          <p className="text-gray-600">
            {currentModeInfo.description}
          </p>
        </div>

        {/* Progress Circle with Timer */}
        <ProgressCircle 
          progress={progress} 
          color={colors.text}
        >
          <div 
            className="text-center"
            role="timer"
            aria-label="番茄钟计时器"
          >
            <div 
              className={`text-6xl md:text-8xl font-mono font-light ${colors.text}`}
              data-testid="timer-display"
            >
              {formattedTime}
            </div>
            {isCompleted && (
              <div className="text-xl font-semibold text-green-600 mt-2">
                完成！
              </div>
            )}
          </div>
        </ProgressCircle>

        {/* Timer Controls */}
        <TimerControls
          isRunning={isRunning}
          isPaused={isPaused}
          isIdle={isIdle}
          isCompleted={isCompleted}
          onStart={start}
          onPause={pause}
          onReset={reset}
          modeColor={currentMode}
        />
      </div>

      {/* Completion Suggestions */}
      {isCompleted && (
        <div className="text-center space-y-3">
          {shouldShowNotification() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                {getNotificationMessage()}
              </p>
            </div>
          )}
          
          <div className="text-gray-600">
            建议：{modeLabels[suggested]}
          </div>
        </div>
      )}

      {/* Statistics */}
      <Statistics
        todayPomodoros={sessionStats.todayPomodoros}
        todayWorkTime={sessionStats.todayWorkTime}
        currentCycleProgress={sessionStats.currentCycleProgress}
        sessionsUntilLongBreak={sessionStats.sessionsUntilLongBreak}
      />
    </div>
  );
}; 