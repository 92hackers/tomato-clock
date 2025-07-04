import React from 'react';

export interface FormHeaderProps {
  title: string;
  onBack: () => void;
  className?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  onBack,
  className = '',
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onBack();
    }
  };

  return (
    <div className={`form-header ${className}`}>
      <button
        type='button'
        className='back-button'
        onClick={onBack}
        onKeyDown={handleKeyDown}
        aria-label='返回'
        tabIndex={0}
      >
        ←
      </button>
      <h1 className='title'>{title}</h1>
    </div>
  );
};
