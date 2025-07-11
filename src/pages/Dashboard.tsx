import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, Grid, List, 
  TrendingUp, Users, Clock, Star, 
  Lightbulb, Target, Calendar, BarChart3,
  Sparkles, Zap, Activity, Award
} from 'lucide-react';
import AISmartFeatures from '../components/AISmartFeatures';

interface Workspace {
  id: string;
  name: string;
  description: string;
  boardCount: number;
  memberCount: number;
  lastActivity: Date;
  color: string;
  isFavorite: boolean;
}

interface DashboardStats {
  totalWorkspaces: number;
  totalBoards: number;
  totalNotes: number;
  activeCollaborators: number;
  productivityScore: number;
  weeklyActivity: number;
}

const Dashboard: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: '프로젝트 A',
      description: '신제품 개발 프로젝트',
      boardCount: 8,
      memberCount: 12,
      lastActivity: new Date(Date.now() - 3600000),
      color: '#3B82F6',
      isFavorite: true
    },
    {
      id: '2',
      name: '마케팅 캠페인',
      description: 'Q4 마케팅 전략',
      boardCount: 5,
      memberCount: 8,
      lastActivity: new Date(Date.now() - 7200000),
      color: '#10B981',
      isFavorite: false
    },
    {
      id: '3',
      name: '디자인 시스템',
      description: 'UI/UX 가이드라인',
      boardCount: 3,
      memberCount: 6,
      lastActivity: new Date(Date.now() - 86400000),
      color: '#F59E0B',
      isFavorite: true
    }
  ]);

  const [stats, setStats] = useState<DashboardStats>({
    totalWorkspaces: 3,
    totalBoards: 16,
    totalNotes: 247,
    activeCollaborators: 8,
    productivityScore: 85,
    weeklyActivity: 23
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAI, setShowAI] = useState(false);

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkspace = () => {
    // 새 워크스페이스 생성 로직
    console.log('새 워크스페이스 생성');
  };

  const handleToggleFavorite = (workspaceId: string) => {
    setWorkspaces(prev => prev.map(ws => 
      ws.id === workspaceId ? { ...ws, isFavorite: !ws.isFavorite } : ws
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                대시보드
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                프로젝트와 아이디어를 관리하세요
              </p>
            </div>
            <button
              onClick={() => setShowAI(!showAI)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI 도우미</span>
            </button>
          </div>
        </div>

        {/* AI 스마트 기능 */}
        {showAI && (
          <div className="mb-8">
            <AISmartFeatures
              noteContent=""
              onAddTags={(tags) => console.log('태그 추가:', tags)}
              onGenerateSummary={(summary) => console.log('요약 생성:', summary)}
              onSuggestIdeas={(ideas) => console.log('아이디어 제안:', ideas)}
            />
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">워크스페이스</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWorkspaces}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Grid className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">보드</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBoards}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">생산성 점수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.productivityScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">주간 활동</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.weeklyActivity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="워크스페이스 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 워크스페이스 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 새 워크스페이스 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 flex flex-col items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
               onClick={handleCreateWorkspace}>
            <Plus className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              새 워크스페이스
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              프로젝트를 시작하세요
            </p>
          </div>

          {/* 기존 워크스페이스들 */}
          {filteredWorkspaces.map((workspace) => (
            <div key={workspace.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: workspace.color }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {workspace.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {workspace.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(workspace.id)}
                    className={`p-1 rounded ${workspace.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                  >
                    <Star className={`w-4 h-4 ${workspace.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Grid className="w-4 h-4 mr-1" />
                      {workspace.boardCount} 보드
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {workspace.memberCount} 멤버
                    </span>
                  </div>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {workspace.lastActivity.toLocaleDateString()}
                  </span>
                </div>

                <Link
                  to={`/workspace/${workspace.id}`}
                  className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                >
                  열기
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 추천 섹션 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            AI 추천
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center mb-4">
                <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  아이디어 브레인스토밍
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                AI가 도와주는 창의적인 아이디어 생성
              </p>
              <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                시작하기 →
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  목표 설정
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                스마트한 목표 설정과 진행 상황 추적
              </p>
              <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                시작하기 →
              </button>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  성과 분석
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                팀 성과와 개인 생산성 분석
              </p>
              <button className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                시작하기 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 