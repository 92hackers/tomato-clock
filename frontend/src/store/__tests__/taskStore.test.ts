import { describe, it, expect, beforeEach } from '@jest/globals';
import { useTaskStore } from '../taskStore';
import type { TaskCreateRequest } from '../../types/task';

describe('TaskStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useTaskStore.setState({
      tasks: [],
      selectedTaskId: null,
    });
  });

  describe('Task Management', () => {
    it('should add a new task', () => {
      const store = useTaskStore.getState();
      const taskRequest: TaskCreateRequest = {
        title: '完成番茄时钟设计',
        estimatedPomodoros: 4,
        notes: '按照设计稿实现',
      };

      store.addTask(taskRequest);

      const tasks = useTaskStore.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('完成番茄时钟设计');
      expect(tasks[0].estimatedPomodoros).toBe(4);
      expect(tasks[0].completedPomodoros).toBe(0);
      expect(tasks[0].completed).toBe(false);
      expect(tasks[0].notes).toBe('按照设计稿实现');
      expect(tasks[0].id).toBeDefined();
      expect(tasks[0].createdAt).toBeInstanceOf(Date);
      expect(tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should update a task', () => {
      const store = useTaskStore.getState();

      // Add a task first
      store.addTask({
        title: '原始任务',
        estimatedPomodoros: 2,
      });

      const tasks = useTaskStore.getState().tasks;
      const taskId = tasks[0].id;

      // Update the task
      store.updateTask(taskId, {
        title: '更新后的任务',
        estimatedPomodoros: 3,
        notes: '添加备注',
      });

      const updatedTasks = useTaskStore.getState().tasks;
      expect(updatedTasks[0].title).toBe('更新后的任务');
      expect(updatedTasks[0].estimatedPomodoros).toBe(3);
      expect(updatedTasks[0].notes).toBe('添加备注');
    });

    it('should delete a task', () => {
      const store = useTaskStore.getState();

      // Add two tasks
      store.addTask({ title: '任务1', estimatedPomodoros: 2 });
      store.addTask({ title: '任务2', estimatedPomodoros: 3 });

      let tasks = useTaskStore.getState().tasks;
      expect(tasks).toHaveLength(2);

      const taskToDelete = tasks[0].id;
      store.deleteTask(taskToDelete);

      tasks = useTaskStore.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('任务2');
    });

    it('should complete a task', () => {
      const store = useTaskStore.getState();

      store.addTask({ title: '待完成任务', estimatedPomodoros: 2 });
      const taskId = useTaskStore.getState().tasks[0].id;

      store.completeTask(taskId);

      const task = useTaskStore.getState().tasks[0];
      expect(task.completed).toBe(true);
    });

    it('should select a task', () => {
      const store = useTaskStore.getState();

      store.addTask({ title: '可选择任务', estimatedPomodoros: 2 });
      const taskId = useTaskStore.getState().tasks[0].id;

      store.selectTask(taskId);

      expect(useTaskStore.getState().selectedTaskId).toBe(taskId);
    });

    it('should increment task pomodoro count', () => {
      const store = useTaskStore.getState();

      store.addTask({ title: '番茄任务', estimatedPomodoros: 4 });
      const taskId = useTaskStore.getState().tasks[0].id;

      store.incrementTaskPomodoro(taskId);

      let task = useTaskStore.getState().tasks[0];
      expect(task.completedPomodoros).toBe(1);

      // Increment again
      store.incrementTaskPomodoro(taskId);
      task = useTaskStore.getState().tasks[0];
      expect(task.completedPomodoros).toBe(2);
    });

    it('should not exceed estimated pomodoros when incrementing', () => {
      const store = useTaskStore.getState();

      store.addTask({ title: '限制任务', estimatedPomodoros: 2 });
      const taskId = useTaskStore.getState().tasks[0].id;

      // Increment beyond limit
      store.incrementTaskPomodoro(taskId);
      store.incrementTaskPomodoro(taskId);
      store.incrementTaskPomodoro(taskId); // Should not exceed 2

      const task = useTaskStore.getState().tasks[0];
      expect(task.completedPomodoros).toBe(2);
    });
  });

  describe('Task Getters', () => {
    beforeEach(() => {
      const store = useTaskStore.getState();

      // Add sample tasks
      store.addTask({ title: '任务1', estimatedPomodoros: 2 });
      store.addTask({ title: '任务2', estimatedPomodoros: 3 });

      // Complete one task
      const tasks = useTaskStore.getState().tasks;
      store.completeTask(tasks[0].id);
    });

    it('should get task by id', () => {
      const store = useTaskStore.getState();
      const tasks = useTaskStore.getState().tasks;
      const taskId = tasks[0].id;

      const task = store.getTask(taskId);
      expect(task).toBeDefined();
      expect(task?.title).toBe('任务1');
    });

    it('should get selected task', () => {
      const store = useTaskStore.getState();
      const tasks = useTaskStore.getState().tasks;
      const taskId = tasks[1].id;

      store.selectTask(taskId);
      const selectedTask = store.getSelectedTask();

      expect(selectedTask).toBeDefined();
      expect(selectedTask?.title).toBe('任务2');
    });

    it('should get completed tasks', () => {
      const store = useTaskStore.getState();
      const completedTasks = store.getCompletedTasks();

      expect(completedTasks).toHaveLength(1);
      expect(completedTasks[0].title).toBe('任务1');
      expect(completedTasks[0].completed).toBe(true);
    });

    it('should get active tasks', () => {
      const store = useTaskStore.getState();
      const activeTasks = store.getActiveTasks();

      expect(activeTasks).toHaveLength(1);
      expect(activeTasks[0].title).toBe('任务2');
      expect(activeTasks[0].completed).toBe(false);
    });

    it('should get today tasks', () => {
      const store = useTaskStore.getState();
      const todayTasks = store.getTodayTasks();

      // All tasks were created today
      expect(todayTasks).toHaveLength(2);
    });
  });

  describe('Task Selection', () => {
    it('should clear selected task when deleting selected task', () => {
      const store = useTaskStore.getState();

      store.addTask({ title: '将被删除的任务', estimatedPomodoros: 2 });
      const taskId = useTaskStore.getState().tasks[0].id;

      // Select the task
      store.selectTask(taskId);
      expect(useTaskStore.getState().selectedTaskId).toBe(taskId);

      // Delete the selected task
      store.deleteTask(taskId);
      expect(useTaskStore.getState().selectedTaskId).toBeNull();
    });

    it('should keep selected task when deleting other task', () => {
      const store = useTaskStore.getState();

      store.addTask({ title: '选中任务', estimatedPomodoros: 2 });
      store.addTask({ title: '将被删除任务', estimatedPomodoros: 3 });

      const tasks = useTaskStore.getState().tasks;
      const selectedTaskId = tasks[0].id;
      const toDeleteTaskId = tasks[1].id;

      // Select first task
      store.selectTask(selectedTaskId);

      // Delete second task
      store.deleteTask(toDeleteTaskId);

      // Selected task should remain
      expect(useTaskStore.getState().selectedTaskId).toBe(selectedTaskId);
    });
  });
});
