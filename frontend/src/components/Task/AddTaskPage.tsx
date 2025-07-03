import React from 'react';
import { useRouter } from 'next/navigation';
import { TaskFormData } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { FormHeader } from './FormHeader';
import { TaskForm } from './TaskForm';

export interface AddTaskPageProps {
  className?: string;
}

// Inline styles to match design specifications
const styles = `
  .add-task-container {
    width: 350px;
    background: white;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .form-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }

  .back-button {
    font-size: 20px;
    margin-right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .back-button:hover {
    background-color: #f0f0f0;
  }

  .back-button:focus {
    outline: 2px solid #007aff;
    outline-offset: 2px;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
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
  }

  .number-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background-color: #f0f0f0;
    color: #555;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-weight: 600;
  }

  .number-button:hover:not(:disabled) {
    background-color: #e0e0e0;
    transform: scale(1.05);
  }

  .number-button:focus {
    outline: 2px solid #007aff;
    outline-offset: 2px;
  }

  .number-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .number-value {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    min-width: 40px;
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
    background-color: #0056cc;
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
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .error-message::before {
    content: "⚠️";
    font-size: 12px;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog {
    background: white;
    border-radius: 15px;
    padding: 24px;
    max-width: 300px;
    width: 90%;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .dialog-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #333;
  }

  .dialog-message {
    font-size: 14px;
    color: #666;
    margin: 0 0 20px 0;
    line-height: 1.4;
  }

  .dialog-actions {
    display: flex;
    gap: 8px;
  }

  .dialog-button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .dialog-button.primary {
    background-color: #007aff;
    color: white;
  }

  .dialog-button.primary:hover {
    background-color: #0056cc;
  }

  .dialog-button.secondary {
    background-color: #f0f0f0;
    color: #555;
  }

  .dialog-button.secondary:hover {
    background-color: #e0e0e0;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 480px) {
    .add-task-container {
      width: 100%;
      max-width: 350px;
      margin: 0 20px;
    }

    .form-actions {
      flex-direction: column;
    }

    .submit-button,
    .cancel-button {
      width: 100%;
    }
  }
`;

export const AddTaskPage: React.FC<AddTaskPageProps> = ({
  className = '',
}) => {
  const router = useRouter();
  const { addTask } = useTaskStore();

  const handleSubmit = async (formData: TaskFormData) => {
    try {
      // Add task to store
      addTask({
        title: formData.title,
        estimatedPomodoros: formData.estimatedPomodoros,
        notes: formData.notes,
      });

      // Navigate back to main page
      router.push('/');
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error; // Re-throw to let form handle the error
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className={`add-task-container ${className}`}>
        <FormHeader
          title="添加任务"
          onBack={handleCancel}
        />
        
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
}; 