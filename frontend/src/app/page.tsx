'use client';

import { useState, useEffect } from 'react';
import { PomodoroTimer } from '../components/Timer/PomodoroTimer';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-gray-100 flex items-center justify-center py-8'>
      <div className='w-full max-w-lg'>
        <PomodoroTimer />
      </div>
    </main>
  );
}
