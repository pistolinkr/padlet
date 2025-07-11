import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // 시스템 테마에 따라 다크모드 자동 적용
  useEffect(() => {
    const matchDark = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      if (matchDark.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    updateTheme();
    matchDark.addEventListener('change', updateTheme);
    return () => matchDark.removeEventListener('change', updateTheme);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-2xl p-8 rounded-xl shadow-lg bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Padlet Clone</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">소셜 로그인, 워크스페이스, 보드 관리, 초대/실시간 참여 등 padlet.com 스타일 구현 예정</p>
        {/* 여기에 소셜 로그인, 워크스페이스, 보드 UI가 들어갈 예정 */}
      </div>
    </div>
  );
}

export default App;
