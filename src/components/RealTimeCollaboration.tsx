import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Activity, Eye, User, Clock } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  position: { x: number; y: number };
  isTyping: boolean;
  lastActivity: Date;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  position?: { x: number; y: number };
}

interface RealTimeCollaborationProps {
  boardId: string;
  currentUser: any;
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({
  boardId,
  currentUser
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: '김철수',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=김철수',
      color: '#3B82F6',
      position: { x: 100, y: 200 },
      isTyping: false,
      lastActivity: new Date()
    },
    {
      id: '2',
      name: '이영희',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=이영희',
      color: '#10B981',
      position: { x: 300, y: 150 },
      isTyping: true,
      lastActivity: new Date()
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: '김철수',
      content: '이 부분에 이미지를 추가하면 좋을 것 같아요!',
      timestamp: new Date(Date.now() - 300000),
      position: { x: 200, y: 250 }
    },
    {
      id: '2',
      author: '이영희',
      content: '좋은 아이디어네요! 색상도 조정해보겠습니다.',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);

  const [activities, setActivities] = useState([
    { id: '1', user: '김철수', action: '노트를 추가했습니다', timestamp: new Date(Date.now() - 120000) },
    { id: '2', user: '이영희', action: '이미지를 업로드했습니다', timestamp: new Date(Date.now() - 90000) },
    { id: '3', user: '김철수', action: '댓글을 작성했습니다', timestamp: new Date(Date.now() - 300000) }
  ]);

  const [newComment, setNewComment] = useState('');
  const [showCollaborators, setShowCollaborators] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  // 실시간 커서 위치 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(collaborator => ({
        ...collaborator,
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600
        },
        isTyping: Math.random() > 0.7,
        lastActivity: new Date()
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: currentUser?.displayName || '사용자',
        content: newComment,
        timestamp: new Date()
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
  };

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            실시간 협업
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {collaborators.length}명 참여 중
            </span>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            setShowCollaborators(true);
            setShowComments(false);
            setShowActivities(false);
          }}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            showCollaborators
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          참여자
        </button>
        <button
          onClick={() => {
            setShowCollaborators(false);
            setShowComments(true);
            setShowActivities(false);
          }}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            showComments
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          댓글
        </button>
        <button
          onClick={() => {
            setShowCollaborators(false);
            setShowComments(false);
            setShowActivities(true);
          }}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            showActivities
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          활동
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        {showCollaborators && (
          <div className="p-4 space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="relative">
                  <img
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"
                    style={{ backgroundColor: collaborator.color }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {collaborator.name}
                    </span>
                    {collaborator.isTyping && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        입력 중...
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {collaborator.lastActivity.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showComments && (
          <div className="p-4 space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        )}

        {showActivities && (
          <div className="p-4 space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span>님이 {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeCollaboration; 