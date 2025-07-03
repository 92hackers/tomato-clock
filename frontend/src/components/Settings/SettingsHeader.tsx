'use client';

import React from 'react';

interface SettingsHeaderProps {
  title: string;
  onBack: () => void;
  'data-testid'?: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title,
  onBack,
  'data-testid': testId,
}) => {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px',
  };

  const backButtonStyle: React.CSSProperties = {
    marginRight: '10px',
    fontSize: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  };

  return (
    <div style={headerStyle} data-testid={testId}>
      <button
        style={backButtonStyle}
        onClick={onBack}
        aria-label="返回"
        data-testid="back-button"
      >
        ←
      </button>
      <div style={titleStyle}>{title}</div>
    </div>
  );
}; 