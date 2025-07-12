import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Plus, Search, Filter, Grid, List, 
  Settings, Share, Download, MoreVertical,
  Image, FileText, Link, Video, Music,
  Palette, Type, Smile, MapPin, Calendar
} from 'lucide-react';
import AdvancedNoteEditor from '../components/AdvancedNoteEditor';
import AISmartFeatures from '../components/AISmartFeatures';
import RealTimeCollaboration from '../components/RealTimeCollaboration';
import ImageUpload from '../components/ImageUpload';

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'link' | 'video' | 'file';
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

const Board: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: '프로젝트 아이디어',
      content: '# 프로젝트 아이디어\n\n## 개요\n새로운 웹 애플리케이션 개발\n\n## 기능\n- 사용자 인증\n- 실시간 협업\n- AI 도우미\n\n## 기술 스택\n- React\n- TypeScript\n- Firebase',
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 300, height: 400 },
      color: '#3B82F6',
      tags: ['프로젝트', '아이디어', '개발'],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000),
      author: '김철수'
    },
    {
      id: '2',
      title: '디자인 참고',
      content: 'https://example.com/design-inspiration',
      type: 'link',
      position: { x: 450, y: 150 },
      size: { width: 250, height: 200 },
      color: '#10B981',
      tags: ['디자인', '참고'],
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 1800000),
      author: '이영희'
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAI, setShowAI] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(true);
  const [currentUser] = useState({ displayName: '사용자' });
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '새 노트',
      content: '',
      type: 'text',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      size: { width: 250, height: 200 },
      color: '#6B7280',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      author: currentUser.displayName
    };
    setNotes(prev => [...prev, newNote]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleUpdateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    setSelectedNote(null);
    setIsEditing(false);
  };

  const handleAITags = (tags: string[]) => {
    if (selectedNote) {
      handleUpdateNote(selectedNote.id, { tags: [...selectedNote.tags, ...tags] });
    }
  };

  const handleAISummary = (summary: string) => {
    if (selectedNote) {
      handleUpdateNote(selectedNote.id, { content: selectedNote.content + '\n\n## AI 요약\n' + summary });
    }
  };

  const handleAIIdeas = (ideas: string[]) => {
    if (selectedNote) {
      const ideasText = ideas.map(idea => `- ${idea}`).join('\n');
      handleUpdateNote(selectedNote.id, { content: selectedNote.content + '\n\n## AI 제안 아이디어\n' + ideasText });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                프로젝트 보드
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAI(!showAI)}
                  className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-1"
                >
                  <Palette className="w-4 h-4" />
                  <span>AI 도우미</span>
                </button>
                <button
                  onClick={() => setShowCollaboration(!showCollaboration)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all flex items-center space-x-1"
                >
                  <Share className="w-4 h-4" />
                  <span>협업</span>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ImageUpload
                onUpload={setBackgroundImage}
                boardId={boardId || ''}
                className="mr-2"
              >
                <Image className="w-4 h-4 mr-1" />
                배경 설정
              </ImageUpload>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="설정"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="다운로드"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: 'calc(100vh - 80px)'
        }}
      >
        {/* AI 스마트 기능 */}
        {showAI && (
          <div className="mb-6">
            <AISmartFeatures
              noteContent={selectedNote?.content || ''}
              onAddTags={handleAITags}
              onGenerateSummary={handleAISummary}
              onSuggestIdeas={handleAIIdeas}
            />
          </div>
        )}

        {/* 검색 및 필터 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="노트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="필터"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="그리드 보기"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="리스트 보기"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>노트 추가</span>
            </button>
          </div>
        </div>

        {/* 노트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedNote(note);
                setIsEditing(false);
              }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: note.color }}
                    />
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {note.title}
                    </h3>
                  </div>
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="더보기"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {note.content.replace(/[#*`]/g, '').substring(0, 100)}...
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{note.author}</span>
                  <span>{note.updatedAt.toLocaleDateString()}</span>
                </div>

                {note.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 선택된 노트 편집 모달 */}
        {selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {isEditing ? '노트 편집' : selectedNote.title}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        편집
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedNote(null);
                        setIsEditing(false);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {isEditing ? (
                  <AdvancedNoteEditor
                    content={selectedNote.content}
                    onChange={(content) => handleUpdateNote(selectedNote.id, { content })}
                    onSave={() => setIsEditing(false)}
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-900 dark:text-white">
                      {selectedNote.content}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 실시간 협업 패널 */}
        {showCollaboration && (
          <RealTimeCollaboration
            boardId={boardId || ''}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default Board; 