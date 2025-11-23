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
    width: 100%;
    max-width: 350px;
    height: 774px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    font-family: system-ui, -apple-system, sans-serif;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    padding: 40px 0;
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

export const AddTaskPage: React.FC<AddTaskPageProps> = ({ className = '' }) => {
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
        <div className="content-wrapper">
          <FormHeader title='添加任务' onBack={handleCancel} />

          <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </>
  );
};
