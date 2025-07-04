'use client';

import { useState, useEffect } from 'react';
import { PomodoroTimer } from '../components/Timer/PomodoroTimer';
import { PageLayout } from '../components/Layout/PageLayout';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PageLayout data-testid='loading-page'>
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
    <PageLayout data-testid='home-page'>
      <PomodoroTimer />
    </PageLayout>
  );
}
