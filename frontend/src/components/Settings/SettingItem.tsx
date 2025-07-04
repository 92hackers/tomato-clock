'use client';

import React, { ReactNode } from 'react';

interface SettingItemProps {
  label: string;
  value?: string;
  children?: ReactNode;
  onClick?: () => void;
  'data-testid'?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  value,
  children,
  onClick,
  'data-testid': testId,
}) => {
  const containerStyle: React.CSSProperties = {
    padding: '15px 0',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: onClick ? 'pointer' : 'default',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#333',
    margin: 0,
  };

  const valueStyle: React.CSSProperties = {
    color: '#999',
    fontSize: '16px',
    margin: 0,
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div style={containerStyle} onClick={handleClick} data-testid={testId}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {value && <span style={valueStyle}>{value}</span>}
        {children}
      </div>
    </div>
  );
};
