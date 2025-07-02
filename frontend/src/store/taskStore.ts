import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskCreateRequest, TaskUpdateRequest } from '../types/task';

// Utility function to generate UUID that works in both browser and test environments
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for test environment
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface TaskState {
  tasks: Task[];
  selectedTaskId: string | null;
  
  // Actions
  addTask: (task: TaskCreateRequest) => void;
  updateTask: (id: string, updates: TaskUpdateRequest) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  incrementTaskPomodoro: (id: string) => void;
  
  // Getters
  getTask: (id: string) => Task | undefined;
  getSelectedTask: () => Task | undefined;
  getTodayTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getActiveTasks: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTaskId: null,

      addTask: (taskRequest: TaskCreateRequest) => {
        const newTask: Task = {
          id: generateId(),
          title: taskRequest.title,
          estimatedPomodoros: taskRequest.estimatedPomodoros,
          completedPomodoros: 0,
          completed: false,
          notes: taskRequest.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      updateTask: (id: string, updates: TaskUpdateRequest) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        }));
      },

      completeTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: true, updatedAt: new Date() }
              : task
          ),
        }));
      },

      selectTask: (id: string | null) => {
        set({ selectedTaskId: id });
      },

      incrementTaskPomodoro: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { 
                  ...task, 
                  completedPomodoros: Math.min(
                    task.completedPomodoros + 1,
                    task.estimatedPomodoros
                  ),
                  updatedAt: new Date()
                }
              : task
          ),
        }));
      },

      // Getters
      getTask: (id: string) => {
        return get().tasks.find((task) => task.id === id);
      },

      getSelectedTask: () => {
        const { selectedTaskId, tasks } = get();
        return selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : undefined;
      },

      getTodayTasks: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return get().tasks.filter((task) => {
          const taskDate = new Date(task.createdAt);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
      },

      getCompletedTasks: () => {
        return get().tasks.filter((task) => task.completed);
      },

      getActiveTasks: () => {
        return get().tasks.filter((task) => !task.completed);
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        selectedTaskId: state.selectedTaskId,
      }),
    }
  )
); 