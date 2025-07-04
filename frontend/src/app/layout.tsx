import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '番茄时钟 - Tomato Clock',
  description: '专注工作，高效管理时间的番茄钟应用',
  keywords: ['番茄时钟', '时间管理', '专注', '效率', 'pomodoro'],
  authors: [{ name: 'Tomato Clock Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='zh-CN'>
      <body className={`${inter.className} antialiased`}>
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50'>
          {children}
        </div>
      </body>
    </html>
  );
}
