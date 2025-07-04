'use client';

import React from 'react';
import { AddTaskPage } from '../../components/Task/AddTaskPage';

export default function AddTask() {
  return (
    <main className='min-h-screen bg-gray-100 flex items-center justify-center py-8'>
      <AddTaskPage />
    </main>
  );
}
