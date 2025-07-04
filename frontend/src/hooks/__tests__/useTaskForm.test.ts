import { renderHook, act } from '@testing-library/react';
import { useTaskForm } from '../useTaskForm';
import { TaskFormData } from '../../types/task';

describe('useTaskForm', () => {
  it('should initialize with default form data', () => {
    const { result } = renderHook(() => useTaskForm());

    expect(result.current.formData).toEqual({
      title: '',
      estimatedPomodoros: 4,
      notes: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isValid).toBe(false);
  });

  it('should update form data when calling updateField', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField('title', 'New Task');
    });

    expect(result.current.formData.title).toBe('New Task');
    expect(result.current.isDirty).toBe(true);
  });

  it('should validate field on update and set errors', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField('title', '');
    });

    expect(result.current.errors.title).toBe('任务名称不能为空');
    expect(result.current.isValid).toBe(false);
  });

  it('should clear field error when valid value is provided', () => {
    const { result } = renderHook(() => useTaskForm());

    // First set an invalid value
    act(() => {
      result.current.updateField('title', '');
    });

    expect(result.current.errors.title).toBe('任务名称不能为空');

    // Then set a valid value
    act(() => {
      result.current.updateField('title', 'Valid Task');
    });

    expect(result.current.errors.title).toBeUndefined();
    expect(result.current.isValid).toBe(true);
  });

  it('should update estimated pomodoros with number selector', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.incrementPomodoros();
    });

    expect(result.current.formData.estimatedPomodoros).toBe(5);

    act(() => {
      result.current.decrementPomodoros();
    });

    expect(result.current.formData.estimatedPomodoros).toBe(4);
  });

  it('should not allow pomodoros to go below 1', () => {
    const { result } = renderHook(() => useTaskForm());

    // Set to minimum first
    act(() => {
      result.current.updateField('estimatedPomodoros', 1);
    });

    act(() => {
      result.current.decrementPomodoros();
    });

    expect(result.current.formData.estimatedPomodoros).toBe(1);
  });

  it('should not allow pomodoros to go above 20', () => {
    const { result } = renderHook(() => useTaskForm());

    // Set to maximum first
    act(() => {
      result.current.updateField('estimatedPomodoros', 20);
    });

    act(() => {
      result.current.incrementPomodoros();
    });

    expect(result.current.formData.estimatedPomodoros).toBe(20);
  });

  it('should validate entire form', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField('title', 'Valid Task');
      result.current.updateField('estimatedPomodoros', 4);
      result.current.updateField('notes', 'Valid notes');
    });

    const validationResult = result.current.validateForm();

    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors).toEqual({});
  });

  it('should reset form to default values', () => {
    const { result } = renderHook(() => useTaskForm());

    // Make some changes
    act(() => {
      result.current.updateField('title', 'Test Task');
      result.current.updateField('estimatedPomodoros', 8);
      result.current.updateField('notes', 'Test notes');
    });

    expect(result.current.isDirty).toBe(true);

    // Reset the form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({
      title: '',
      estimatedPomodoros: 4,
      notes: '',
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isDirty).toBe(false);
  });

  it('should set submitting state', () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.setSubmitting(true);
    });

    expect(result.current.isSubmitting).toBe(true);

    act(() => {
      result.current.setSubmitting(false);
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle custom initial data', () => {
    const initialData: TaskFormData = {
      title: 'Initial Task',
      estimatedPomodoros: 6,
      notes: 'Initial notes',
    };

    const { result } = renderHook(() => useTaskForm(initialData));

    expect(result.current.formData).toEqual(initialData);
    expect(result.current.isDirty).toBe(false);
  });

  it('should call onSubmit callback when form is submitted', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useTaskForm(undefined, mockOnSubmit));

    // Fill out valid form data
    act(() => {
      result.current.updateField('title', 'Test Task');
    });

    // Submit the form
    await act(async () => {
      await result.current.submitForm();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      estimatedPomodoros: 4,
      notes: '',
    });
  });

  it('should not submit if form is invalid', async () => {
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() => useTaskForm(undefined, mockOnSubmit));

    // Leave title empty (invalid)
    await act(async () => {
      await result.current.submitForm();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.title).toBe('任务名称不能为空');
  });

  it('should handle submit errors gracefully', async () => {
    const mockOnSubmit = jest
      .fn()
      .mockRejectedValue(new Error('Submit failed'));
    const { result } = renderHook(() => useTaskForm(undefined, mockOnSubmit));

    // Fill out valid form data
    act(() => {
      result.current.updateField('title', 'Test Task');
    });

    // Submit the form
    await act(async () => {
      await result.current.submitForm();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
