'use client';

import React, { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  'data-testid'?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  'data-testid': testId,
}) => {
  const sectionStyle: React.CSSProperties = {
    marginBottom: '30px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    display: 'block',
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
  };

  return (
    <div style={sectionStyle} data-testid={testId}>
      <div style={titleStyle}>{title}</div>
      <div style={contentStyle}>{children}</div>
    </div>
  );
};
