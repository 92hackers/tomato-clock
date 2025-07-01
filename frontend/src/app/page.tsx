'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500'></div>
      </div>
    );
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto text-center'>
        <h1 className='text-4xl md:text-6xl font-bold text-gray-800 mb-6'>
          🍅 番茄时钟
        </h1>
        <p className='text-xl text-gray-600 mb-8'>专注工作，高效管理时间</p>

        <div className='bg-white rounded-2xl shadow-soft p-8 mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            项目结构搭建完成
          </h2>
          <p className='text-gray-600 mb-6'>
            前后端分离架构已就绪，现代化开发环境配置完成
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-800 mb-2'>
                前端技术栈
              </h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>✅ Next.js 14 (App Router)</li>
                <li>✅ TypeScript 5.x</li>
                <li>✅ Tailwind CSS 3.x</li>
                <li>✅ Jest + Testing Library</li>
                <li>✅ ESLint + Prettier</li>
              </ul>
            </div>

            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-medium text-gray-800 mb-2'>
                后端技术栈
              </h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>🔧 Go 1.21+ (配置中)</li>
                <li>🔧 Gin Framework (配置中)</li>
                <li>🔧 GORM (配置中)</li>
                <li>✅ Testify + Ginkgo</li>
                <li>🔧 PostgreSQL + Redis (配置中)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='text-sm text-gray-500'>
          ARCH-001 任务进行中 - 项目结构搭建 🚀
        </div>
      </div>
    </main>
  );
}
