import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Board from './pages/Board';
import Settings from './pages/Settings';
import Loading from './components/Loading';

// 메인 앱 컴포넌트
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {user ? (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header user={user} />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workspace/:id" element={<Workspace />} />
                <Route path="/board/:id" element={<Board />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
