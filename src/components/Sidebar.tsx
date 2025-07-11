import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Plus, 
  ChevronDown,
  Users,
  Star,
  Settings
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState({
    workspaces: true,
    boards: true
  });
  const location = useLocation();

  const toggleSection = (section: 'workspaces' | 'boards') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    { icon: Home, label: '대시보드', path: '/' },
    { icon: Star, label: '즐겨찾기', path: '/favorites' },
    { icon: Users, label: '팀', path: '/teams' },
    { icon: Settings, label: '설정', path: '/settings' }
  ];

  const workspaces = [
    { id: '1', name: '개인 워크스페이스', color: 'bg-blue-500' },
    { id: '2', name: '팀 프로젝트', color: 'bg-green-500' },
    { id: '3', name: '학습 자료', color: 'bg-purple-500' }
  ];

  const boards = [
    { id: '1', name: '아이디어 보드', workspace: '1' },
    { id: '2', name: '프로젝트 계획', workspace: '1' },
    { id: '3', name: '디자인 참고', workspace: '2' }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Padlet Clone
        </h1>
      </div>

      {/* 메인 메뉴 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* 워크스페이스 섹션 */}
        <div className="mt-8">
          <button
            onClick={() => toggleSection('workspaces')}
            className="flex items-center justify-between w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="font-medium">워크스페이스</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${
                expandedSections.workspaces ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {expandedSections.workspaces && (
            <ul className="mt-2 space-y-1">
              {workspaces.map((workspace) => (
                <li key={workspace.id}>
                  <Link
                    to={`/workspace/${workspace.id}`}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full ${workspace.color}`}></div>
                    <span className="text-sm">{workspace.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">새 워크스페이스</span>
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* 보드 섹션 */}
        <div className="mt-6">
          <button
            onClick={() => toggleSection('boards')}
            className="flex items-center justify-between w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="font-medium">보드</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${
                expandedSections.boards ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {expandedSections.boards && (
            <ul className="mt-2 space-y-1">
              {boards.map((board) => (
                <li key={board.id}>
                  <Link
                    to={`/board/${board.id}`}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span className="text-sm">{board.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">새 보드</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 