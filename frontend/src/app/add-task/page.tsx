'use client';

import { useState, useEffect } from 'react';
import { AddTaskPage } from '../../components/Task/AddTaskPage';
import { PageLayout } from '../../components/Layout/PageLayout';

export default function AddTask() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PageLayout data-testid='loading-add-task'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              width: '8rem',
              height: '8rem',
              border: '8px solid #e5e7eb',
              borderTop: '8px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout data-testid='add-task-layout'>
      <AddTaskPage />
    </PageLayout>
  );
}
