import React from 'react';

export interface NumberSelectorProps {
  value: number;
  min: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
  className?: string;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({
  value,
  min,
  max,
  onIncrement,
  onDecrement,
  label,
  className = '',
}) => {
  const isAtMin = value <= min;
  const isAtMax = value >= max;
  const labelId = `number-selector-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleDecrementClick = () => {
    if (!isAtMin) {
      onDecrement();
    }
  };

  const handleIncrementClick = () => {
    if (!isAtMax) {
      onIncrement();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className={`form-group ${className}`}>
      <label id={labelId} className='input-label'>
        {label}
      </label>
      <div
        className='flex items-center justify-between'
        role='group'
        aria-labelledby={labelId}
      >
        <button
          type='button'
          className='number-button p-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50'
          onClick={handleDecrementClick}
          onKeyDown={e => handleKeyDown(e, handleDecrementClick)}
          disabled={isAtMin}
          aria-label='减少'
          tabIndex={0}
        >
          -
        </button>
        <div
          className='number-value text-lg font-semibold'
          aria-live='polite'
          aria-label={`当前值: ${value}`}
          role='status'
        >
          {value}
        </div>
        <button
          type='button'
          className='number-button p-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50'
          onClick={handleIncrementClick}
          onKeyDown={e => handleKeyDown(e, handleIncrementClick)}
          disabled={isAtMax}
          aria-label='增加'
          tabIndex={0}
        >
          +
        </button>
      </div>
    </div>
  );
};
