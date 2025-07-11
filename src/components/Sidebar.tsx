import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Plus, 
  ChevronDown,
  Users,
  Star,
  Settings,
  Search,
  Calendar,
  Archive,
  Trash2,
  HelpCircle
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState({
    workspaces: true,
    boards: true,
    tools: false
  });
  const location = useLocation();

  const toggleSection = (section: 'workspaces' | 'boards' | 'tools') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    { icon: Home, label: '대시보드', path: '/' },
    { icon: Star, label: '즐겨찾기', path: '/favorites' },
    { icon: Users, label: '팀', path: '/teams' },
    { icon: Calendar, label: '일정', path: '/calendar' },
    { icon: Settings, label: '설정', path: '/settings' }
  ];

  const workspaces = [
    { id: '1', name: '개인 워크스페이스', color: 'bg-blue-500', boardCount: 5 },
    { id: '2', name: '팀 프로젝트', color: 'bg-green-500', boardCount: 3 },
    { id: '3', name: '학습 자료', color: 'bg-purple-500', boardCount: 2 }
  ];

  const boards = [
    { id: '1', name: '아이디어 보드', workspace: '1', isStarred: true },
    { id: '2', name: '프로젝트 계획', workspace: '1', isStarred: false },
    { id: '3', name: '디자인 참고', workspace: '2', isStarred: true },
    { id: '4', name: '회의록', workspace: '1', isStarred: false },
    { id: '5', name: '참고 자료', workspace: '3', isStarred: false }
  ];

  const tools = [
    { icon: Search, label: '검색', path: '/search' },
    { icon: Archive, label: '보관함', path: '/archive' },
    { icon: Trash2, label: '휴지통', path: '/trash' },
    { icon: HelpCircle, label: '도움말', path: '/help' }
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
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${workspace.color}`}></div>
                      <span className="text-sm">{workspace.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {workspace.boardCount}
                    </span>
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
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FolderOpen className="w-4 h-4" />
                      <span className="text-sm">{board.name}</span>
                      {board.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    </div>
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

        {/* 도구 섹션 */}
        <div className="mt-6">
          <button
            onClick={() => toggleSection('tools')}
            className="flex items-center justify-between w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="font-medium">도구</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${
                expandedSections.tools ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {expandedSections.tools && (
            <ul className="mt-2 space-y-1">
              {tools.map((tool) => (
                <li key={tool.path}>
                  <Link
                    to={tool.path}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <tool.icon className="w-4 h-4" />
                    <span className="text-sm">{tool.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* 하단 정보 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Padlet Clone v1.0.0</p>
          <p className="mt-1">© 2024 Demo Project</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 