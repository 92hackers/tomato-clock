'use client';

import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'data-testid'?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  'data-testid': testId,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const toggleStyle: React.CSSProperties = {
    position: 'relative',
    width: '50px',
    height: '28px',
    borderRadius: '14px',
    backgroundColor: checked ? '#007aff' : '#ddd',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s ease',
    opacity: disabled ? 0.6 : 1,
  };

  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'white',
    transition: 'transform 0.2s ease',
    transform: `translateX(${checked ? '22px' : '0'})`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div
      style={toggleStyle}
      onClick={handleClick}
      data-testid={testId}
      role='switch'
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div style={handleStyle} />
    </div>
  );
};
