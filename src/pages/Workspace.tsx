import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { workspaceService, boardService, Workspace as WorkspaceType, Board as BoardType } from '../services/firebase';
import { 
  Plus, 
  FolderOpen, 
  Users, 
  Settings, 
  Share2,
  MoreVertical,
  Star,
  Calendar,
  UserPlus,
  Edit3,
  Trash2,
  Loading
} from 'lucide-react';

const Workspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<'boards' | 'members' | 'settings'>('boards');
  const [workspace, setWorkspace] = useState<WorkspaceType | null>(null);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');

  const tabs = [
    { id: 'boards', label: '보드', icon: FolderOpen },
    { id: 'members', label: '멤버', icon: Users },
    { id: 'settings', label: '설정', icon: Settings }
  ] as const;

  // 워크스페이스 데이터 로드
  useEffect(() => {
    if (!user || !id) return;

    const loadWorkspaceData = async () => {
      try {
        setIsLoading(true);
        
        // 워크스페이스 정보 로드 (실제로는 별도 함수 필요)
        const workspaceData: WorkspaceType = {
          id,
          name: '개인 워크스페이스',
          description: '개인적인 아이디어와 프로젝트를 관리하는 공간입니다.',
          color: 'bg-blue-500',
          ownerId: user.uid,
          members: { [user.uid]: 'owner' },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setWorkspace(workspaceData);

        // 보드 목록 로드
        const boardsData = await boardService.getBoards(id);
        setBoards(boardsData);
      } catch (error) {
        console.error('워크스페이스 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaceData();
  }, [user, id]);

  // 새 보드 생성
  const handleCreateBoard = async () => {
    if (!user || !id || !newBoardName.trim()) return;

    try {
      const boardData = {
        name: newBoardName,
        description: newBoardDescription,
        workspaceId: id,
        ownerId: user.uid,
        members: { [user.uid]: 'owner' },
        isStarred: false
      };

      const boardId = await boardService.createBoard(boardData);
      
      // 새 보드를 목록에 추가
      const newBoard: BoardType = {
        id: boardId,
        ...boardData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setBoards([newBoard, ...boards]);

      // 폼 초기화
      setNewBoardName('');
      setNewBoardDescription('');
      setIsCreatingBoard(false);
    } catch (error) {
      console.error('보드 생성 실패:', error);
      alert('보드 생성에 실패했습니다.');
    }
  };

  // 보드 삭제
  const handleDeleteBoard = async (boardId: string) => {
    if (!confirm('정말로 이 보드를 삭제하시겠습니까?')) return;

    try {
      await boardService.deleteBoard(boardId);
      setBoards(boards.filter(board => board.id !== boardId));
    } catch (error) {
      console.error('보드 삭제 실패:', error);
      alert('보드 삭제에 실패했습니다.');
    }
  };

  // 보드 즐겨찾기 토글
  const handleToggleStar = async (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    try {
      await boardService.updateBoard(boardId, { isStarred: !board.isStarred });
      setBoards(boards.map(b => 
        b.id === boardId ? { ...b, isStarred: !b.isStarred } : b
      ));
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            워크스페이스를 찾을 수 없습니다
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 워크스페이스 헤더 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg ${workspace.color} flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">{workspace.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{workspace.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{workspace.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{boards.length}개 보드</span>
                <span>•</span>
                <span>{Object.keys(workspace.members).length}명 멤버</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>공유</span>
            </button>
            <button 
              onClick={() => setIsCreatingBoard(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>새 보드</span>
            </button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'boards' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards.map((board) => (
                  <div key={board.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Link
                            to={`/board/${board.id}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {board.name}
                          </Link>
                          {board.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{board.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{board.createdAt?.toDate?.()?.toLocaleDateString() || '방금 전'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleToggleStar(board.id!)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              <Star className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteBoard(board.id!)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">멤버</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlus className="w-4 h-4" />
                  <span>멤버 초대</span>
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(workspace.members).map(([userId, role]) => (
                  <div key={userId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">U</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">사용자</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{userId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {role}
                      </span>
                      <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">워크스페이스 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      워크스페이스 이름
                    </label>
                    <input
                      type="text"
                      defaultValue={workspace.name}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      설명
                    </label>
                    <textarea
                      defaultValue={workspace.description}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      색상
                    </label>
                    <div className="flex space-x-2">
                      {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full ${color} border-2 ${
                            workspace.color === color ? 'border-gray-900 dark:border-white' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 새 보드 생성 모달 */}
      {isCreatingBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">새 보드 생성</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  보드 이름
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="보드 이름을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  설명 (선택사항)
                </label>
                <textarea
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="보드에 대한 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsCreatingBoard(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace; 