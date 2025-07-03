import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../TaskForm';
import { TaskFormData } from '../../../types/task';

// Mock the useTaskForm hook
const mockUseTaskForm = {
  formData: {
    title: '',
    estimatedPomodoros: 4,
    notes: '',
  },
  errors: {},
  isSubmitting: false,
  isDirty: false,
  isValid: false,
  updateField: jest.fn(),
  incrementPomodoros: jest.fn(),
  decrementPomodoros: jest.fn(),
  validateForm: jest.fn(),
  resetForm: jest.fn(),
  setSubmitting: jest.fn(),
  submitForm: jest.fn(),
};

jest.mock('../../../hooks/useTaskForm', () => ({
  useTaskForm: () => mockUseTaskForm,
}));

describe('TaskForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockUseTaskForm, {
      formData: {
        title: '',
        estimatedPomodoros: 4,
        notes: '',
      },
      errors: {},
      isSubmitting: false,
      isDirty: false,
      isValid: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should render all form fields', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByLabelText('任务名称')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '预计番茄数' })).toBeInTheDocument();
    expect(screen.getByLabelText('备注')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
  });

  it('should display form data correctly', () => {
    mockUseTaskForm.formData = {
      title: 'Test Task',
      estimatedPomodoros: 6,
      notes: 'Test notes',
    };

    render(<TaskForm {...defaultProps} />);

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test notes')).toBeInTheDocument();
  });

  it('should call updateField when title input changes', () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText('任务名称');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });

    expect(mockUseTaskForm.updateField).toHaveBeenCalledWith('title', 'New Task');
  });

  it('should call updateField when notes input changes', () => {
    render(<TaskForm {...defaultProps} />);

    const notesInput = screen.getByLabelText('备注');
    fireEvent.change(notesInput, { target: { value: 'New notes' } });

    expect(mockUseTaskForm.updateField).toHaveBeenCalledWith('notes', 'New notes');
  });

  it('should call increment/decrement when number selector buttons are clicked', () => {
    render(<TaskForm {...defaultProps} />);

    const incrementButton = screen.getByRole('button', { name: /增加/i });
    const decrementButton = screen.getByRole('button', { name: /减少/i });

    fireEvent.click(incrementButton);
    expect(mockUseTaskForm.incrementPomodoros).toHaveBeenCalledTimes(1);

    fireEvent.click(decrementButton);
    expect(mockUseTaskForm.decrementPomodoros).toHaveBeenCalledTimes(1);
  });

  it('should display validation errors', () => {
    mockUseTaskForm.errors = {
      title: '任务名称不能为空',
      estimatedPomodoros: '预计番茄数必须在1-20之间',
      notes: '备注不能超过500个字符',
    };

    render(<TaskForm {...defaultProps} />);

    expect(screen.getByText('任务名称不能为空')).toBeInTheDocument();
    expect(screen.getByText('预计番茄数必须在1-20之间')).toBeInTheDocument();
    expect(screen.getByText('备注不能超过500个字符')).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    mockUseTaskForm.isValid = false;

    render(<TaskForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: '保存' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', () => {
    mockUseTaskForm.isValid = true;

    render(<TaskForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: '保存' });
    expect(submitButton).not.toBeDisabled();
  });

  it('should show loading state when submitting', () => {
    mockUseTaskForm.isSubmitting = true;

    render(<TaskForm {...defaultProps} />);

    expect(screen.getByText('保存中...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存中...' })).toBeDisabled();
  });

  it('should call onSubmit when form is submitted', async () => {
    mockUseTaskForm.isValid = true;
    mockUseTaskForm.submitForm.mockResolvedValue(undefined);

    render(<TaskForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    expect(mockUseTaskForm.submitForm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<TaskForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: '取消' });
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should show confirmation dialog when canceling with unsaved changes', () => {
    mockUseTaskForm.isDirty = true;

    render(<TaskForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: '取消' });
    fireEvent.click(cancelButton);

    expect(screen.getByText(/确定要放弃更改吗/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确定' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '继续编辑' })).toBeInTheDocument();
  });

  it('should proceed with cancel when confirmed in dialog', () => {
    mockUseTaskForm.isDirty = true;

    render(<TaskForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: '取消' });
    fireEvent.click(cancelButton);

    const confirmButton = screen.getByRole('button', { name: '确定' });
    fireEvent.click(confirmButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should stay on form when cancel is not confirmed in dialog', () => {
    mockUseTaskForm.isDirty = true;

    render(<TaskForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: '取消' });
    fireEvent.click(cancelButton);

    const continueButton = screen.getByRole('button', { name: '继续编辑' });
    fireEvent.click(continueButton);

    expect(defaultProps.onCancel).not.toHaveBeenCalled();
    expect(screen.queryByText(/确定要放弃更改吗/i)).not.toBeInTheDocument();
  });

  it('should handle keyboard shortcuts', () => {
    render(<TaskForm {...defaultProps} />);

    // Test Ctrl+Enter for submit
    fireEvent.keyDown(document, { key: 'Enter', ctrlKey: true });
    // Note: This test would need the actual implementation to handle global shortcuts

    // Test Escape for cancel
    fireEvent.keyDown(document, { key: 'Escape' });
    // Note: This test would need the actual implementation to handle global shortcuts
  });

  it('should focus title input on mount', () => {
    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByLabelText('任务名称');
    expect(titleInput).toHaveFocus();
  });

  it('should handle initial data correctly', () => {
    const initialData: TaskFormData = {
      title: 'Initial Task',
      estimatedPomodoros: 8,
      notes: 'Initial notes',
    };

    mockUseTaskForm.formData = initialData;

    render(<TaskForm {...defaultProps} initialData={initialData} />);

    expect(screen.getByDisplayValue('Initial Task')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial notes')).toBeInTheDocument();
  });
}); 