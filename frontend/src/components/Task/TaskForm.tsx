import React, { useRef, useEffect, useState } from 'react';
import { TaskFormData } from '../../types/task';
import { useTaskForm } from '../../hooks/useTaskForm';
import { NumberSelector } from './NumberSelector';

export interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: TaskFormData;
  className?: string;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3 className="dialog-title">确认操作</h3>
        <p className="dialog-message">确定要放弃更改吗？所有未保存的内容将丢失。</p>
        <div className="dialog-actions">
          <button 
            type="button" 
            className="dialog-button secondary" 
            onClick={onCancel}
          >
            继续编辑
          </button>
          <button 
            type="button" 
            className="dialog-button primary" 
            onClick={onConfirm}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    formData,
    errors,
    isSubmitting,
    isDirty,
    isValid,
    updateField,
    incrementPomodoros,
    decrementPomodoros,
    submitForm,
  } = useTaskForm(initialData, onSubmit);

  // Focus title input on mount
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (isValid && !isSubmitting) {
          submitForm();
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isValid, isSubmitting, isDirty]);

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    onCancel();
  };

  const handleContinueEditing = () => {
    setShowConfirmDialog(false);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateField('title', event.target.value);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateField('notes', event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isValid && !isSubmitting) {
      submitForm();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={`task-form ${className}`} noValidate>
        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="task-title" className="input-label">
            任务名称
          </label>
          <input
            id="task-title"
            ref={titleInputRef}
            type="text"
            className={`text-input ${errors.title ? 'error' : ''}`}
            placeholder="输入任务名称"
            value={formData.title}
            onChange={handleTitleChange}
            aria-describedby={errors.title ? "title-error" : undefined}
            required
          />
          {errors.title && (
            <div id="title-error" className="error-message" role="alert">
              {errors.title}
            </div>
          )}
        </div>

        {/* Estimated Pomodoros Field */}
        <NumberSelector
          label="预计番茄数"
          value={formData.estimatedPomodoros}
          min={1}
          max={20}
          onIncrement={incrementPomodoros}
          onDecrement={decrementPomodoros}
        />
        {errors.estimatedPomodoros && (
          <div className="error-message" role="alert">
            {errors.estimatedPomodoros}
          </div>
        )}

        {/* Notes Field */}
        <div className="form-group">
          <label htmlFor="task-notes" className="input-label">
            备注
          </label>
          <input
            id="task-notes"
            type="text"
            className={`text-input ${errors.notes ? 'error' : ''}`}
            placeholder="添加备注（可选）"
            value={formData.notes || ''}
            onChange={handleNotesChange}
            aria-describedby={errors.notes ? "notes-error" : undefined}
          />
          {errors.notes && (
            <div id="notes-error" className="error-message" role="alert">
              {errors.notes}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={!isValid || isSubmitting}
            aria-describedby="submit-help"
          >
            {isSubmitting ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            取消
          </button>
        </div>

        <div id="submit-help" className="sr-only">
          {isValid ? '表单已准备好提交' : '请填写所有必填字段'}
        </div>
      </form>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmCancel}
        onCancel={handleContinueEditing}
      />
    </>
  );
}; 