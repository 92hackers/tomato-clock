import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskFormData } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { NumberSelector } from './NumberSelector';
import { createPortal } from 'react-dom';

export interface AddTaskPageProps {
  className?: string;
}

// iOS-style add task form styles matching home page design
const styles = `
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }

  .back-button {
    margin-right: 10px;
    font-size: 20px;
    background: none;
    border: none;
    cursor: pointer;
    color: #007aff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .back-button:hover {
    background-color: #f0f0f0;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .input-label {
    display: block;
    margin-bottom: 8px;
    font-size: 16px;
    color: #555;
    font-weight: 500;
  }

  .text-input {
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 16px;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    background-color: white;
  }

  .text-input:focus {
    outline: none;
    border-color: #007aff;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }

  .text-input.error {
    border-color: #ff3b30;
  }

  .text-input.error:focus {
    box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
  }

  .number-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 8px;
  }

  .number-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background-color: #007aff;
    color: white;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-weight: bold;
  }

  .number-button:hover {
    background-color: #0056d6;
    transform: scale(1.1);
  }

  .number-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: scale(1);
  }

  .number-button.decrement {
    background-color: #f0f0f0;
    color: #555;
  }

  .number-button.decrement:hover {
    background-color: #e0e0e0;
  }

  .number-value {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    min-width: 60px;
    text-align: center;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 30px;
  }

  .submit-button {
    flex: 1;
    padding: 15px;
    background-color: #007aff;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #0056d6;
    transform: translateY(-1px);
  }

  .submit-button:focus {
    outline: 2px solid #007aff;
    outline-offset: 2px;
  }

  .submit-button:disabled {
    background-color: #999;
    cursor: not-allowed;
    transform: none;
  }

  .cancel-button {
    flex: 1;
    padding: 15px;
    background-color: #f0f0f0;
    color: #555;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cancel-button:hover:not(:disabled) {
    background-color: #e0e0e0;
    transform: translateY(-1px);
  }

  .cancel-button:focus {
    outline: 2px solid #007aff;
    outline-offset: 2px;
  }

  .cancel-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .error-message {
    color: #ff3b30;
    font-size: 14px;
    margin-top: 4px;
    display: block;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .dialog {
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 300px;
    width: 90%;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .dialog-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }

  .dialog-message {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .dialog-actions {
    display: flex;
    gap: 12px;
  }

  .dialog-button {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    border: none;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .dialog-button.secondary {
    background-color: #f0f0f0;
    color: #555;
  }

  .dialog-button.secondary:hover {
    background-color: #e0e0e0;
  }

  .dialog-button.primary {
    background-color: #007aff;
    color: white;
  }

  .dialog-button.primary:hover {
    background-color: #0056d6;
  }
`;

// Confirmation Dialog Component with Portal
interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className='dialog-overlay'>
      <div className='dialog'>
        <h3 className='dialog-title'>确认操作</h3>
        <p className='dialog-message'>
          确定要放弃更改吗？所有未保存的内容将丢失。
        </p>
        <div className='dialog-actions'>
          <button
            type='button'
            className='dialog-button secondary'
            onClick={onCancel}
          >
            继续编辑
          </button>
          <button
            type='button'
            className='dialog-button primary'
            onClick={onConfirm}
          >
            确定
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const AddTaskPage: React.FC<AddTaskPageProps> = ({ className = '' }) => {
  const router = useRouter();
  const { addTask } = useTaskStore();
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    estimatedPomodoros: 4,
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = '任务名称不能为空';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = '任务名称不能超过100个字符';
    }

    if (formData.estimatedPomodoros < 1 || formData.estimatedPomodoros > 20) {
      newErrors.estimatedPomodoros = '预计番茄数必须在1-20之间';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = '备注不能超过500个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Add task to store
      addTask({
        title: formData.title.trim(),
        estimatedPomodoros: formData.estimatedPomodoros,
        notes: formData.notes?.trim(),
      });

      // Navigate back to main page
      router.push('/');
    } catch (error) {
      console.error('Failed to add task:', error);
      setErrors({ title: '保存失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = formData.title.trim() || formData.notes?.trim() || formData.estimatedPomodoros !== 4;

    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      router.push('/');
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    router.push('/');
  };

  const handleContinueEditing = () => {
    setShowConfirmDialog(false);
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const incrementPomodoros = () => {
    if (formData.estimatedPomodoros < 20) {
      handleInputChange('estimatedPomodoros', formData.estimatedPomodoros + 1);
    }
  };

  const decrementPomodoros = () => {
    if (formData.estimatedPomodoros > 1) {
      handleInputChange('estimatedPomodoros', formData.estimatedPomodoros - 1);
    }
  };

  const isDirty = formData.title.trim() || formData.notes?.trim() || formData.estimatedPomodoros !== 4;
  const isValid = formData.title.trim().length > 0 &&
                  formData.title.trim().length <= 100 &&
                  formData.estimatedPomodoros >= 1 &&
                  formData.estimatedPomodoros <= 20 &&
                  (!formData.notes || formData.notes.length <= 500);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className={className} data-testid='add-task-page'>
        {/* Header */}
        <div className='header'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className='back-button' onClick={handleCancel}>
              ←
            </button>
            <div className='title'>添加任务</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className='form-group'>
            <label htmlFor='task-title' className='input-label'>
              任务名称
            </label>
            <input
              id='task-title'
              type='text'
              className={`text-input ${errors.title ? 'error' : ''}`}
              placeholder='输入任务名称'
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              aria-describedby={errors.title ? 'title-error' : undefined}
              autoFocus
            />
            {errors.title && (
              <span id='title-error' className='error-message' role='alert'>
                {errors.title}
              </span>
            )}
          </div>

          {/* Estimated Pomodoros Field */}
          <div className='form-group'>
            <label className='input-label'>
              预计番茄数
            </label>
            <div className='number-input'>
              <button
                type='button'
                className='number-button decrement'
                onClick={decrementPomodoros}
                disabled={formData.estimatedPomodoros <= 1}
              >
                −
              </button>
              <div className='number-value'>
                {formData.estimatedPomodoros}
              </div>
              <button
                type='button'
                className='number-button'
                onClick={incrementPomodoros}
                disabled={formData.estimatedPomodoros >= 20}
              >
                +
              </button>
            </div>
            {errors.estimatedPomodoros && (
              <span className='error-message' role='alert'>
                {errors.estimatedPomodoros}
              </span>
            )}
          </div>

          {/* Notes Field */}
          <div className='form-group'>
            <label htmlFor='task-notes' className='input-label'>
              备注
            </label>
            <input
              id='task-notes'
              type='text'
              className={`text-input ${errors.notes ? 'error' : ''}`}
              placeholder='添加备注（可选）'
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              aria-describedby={errors.notes ? 'notes-error' : undefined}
            />
            {errors.notes && (
              <span id='notes-error' className='error-message' role='alert'>
                {errors.notes}
              </span>
            )}
          </div>

          {/* Form Actions */}
          <div className='form-actions'>
            <button
              type='button'
              className='cancel-button'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type='submit'
              className='submit-button'
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>

        {/* Confirmation Dialog with Portal */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onConfirm={handleConfirmCancel}
          onCancel={handleContinueEditing}
        />
      </div>
    </>
  );
};
