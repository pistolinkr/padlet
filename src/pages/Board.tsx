import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Share2, 
  MoreVertical,
  Image,
  Link as LinkIcon,
  Smile,
  Send,
  Palette,
  Pin,
  Copy,
  Archive
} from 'lucide-react';

interface Note {
  id: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  createdAt: string;
  author: string;
  isPinned?: boolean;
}

const Board: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: '첫 번째 아이디어를 여기에 작성해보세요!',
      position: { x: 100, y: 100 },
      color: 'bg-yellow-200',
      createdAt: '방금 전',
      author: '사용자'
    },
    {
      id: '2',
      content: '프로젝트 계획을 세워보는 건 어떨까요?',
      position: { x: 300, y: 150 },
      color: 'bg-blue-200',
      createdAt: '5분 전',
      author: '사용자'
    }
  ]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const colors = [
    'bg-yellow-200', 'bg-blue-200', 'bg-green-200', 
    'bg-pink-200', 'bg-purple-200', 'bg-orange-200',
    'bg-red-200', 'bg-indigo-200', 'bg-teal-200'
  ];

  const boardRef = useRef<HTMLDivElement>(null);

  // 드래그 시작
  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggedNote(noteId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // 드래그 종료
  const handleDragEnd = () => {
    setDraggedNote(null);
  };

  // 드롭 처리
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedNote && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setNotes(notes.map(note => 
        note.id === draggedNote 
          ? { ...note, position: { x, y } }
          : note
      ));
    }
  };

  // 드래그 오버 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent,
        position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
        color: colors[Math.floor(Math.random() * colors.length)],
        createdAt: '방금 전',
        author: '사용자'
      };
      setNotes([...notes, newNote]);
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    setSelectedNote(null);
  };

  const handleUpdateNote = (noteId: string, newContent: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, content: newContent } : note
    ));
    setSelectedNote(null);
  };

  const handleColorChange = (noteId: string, color: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, color } : note
    ));
    setShowColorPicker(null);
  };

  const handlePinNote = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const handleCopyNote = (note: Note) => {
    navigator.clipboard.writeText(note.content);
    // 복사 완료 알림
    alert('노트가 클립보드에 복사되었습니다!');
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  return (
    <div className="h-full flex flex-col">
      {/* 보드 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">아이디어 보드</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">창의적인 아이디어들을 자유롭게 작성해보세요</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="노트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {viewMode === 'grid' ? '📋' : '🔲'}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>공유</span>
            </button>
            <button 
              onClick={() => setIsAddingNote(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>노트 추가</span>
            </button>
          </div>
        </div>
      </div>

      {/* 보드 영역 */}
      <div 
        ref={boardRef}
        className="flex-1 relative bg-gray-50 dark:bg-gray-900 overflow-auto"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {viewMode === 'grid' ? (
          // 그리드 뷰
          <>
            {/* 고정된 노트들 */}
            {pinnedNotes.map((note) => (
              <div
                key={note.id}
                className={`absolute ${note.color} dark:bg-gray-700 rounded-lg p-4 shadow-lg cursor-move min-w-[200px] max-w-[300px] z-10 ${
                  draggedNote === note.id ? 'opacity-50' : ''
                }`}
                style={{ left: note.position.x, top: note.position.y }}
                draggable
                onDragStart={(e) => handleDragStart(e, note.id)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{note.author}</span>
                    {note.isPinned && <Pin className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(showColorPicker === note.id ? null : note.id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Palette className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(note);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {note.createdAt}
                </div>

                {/* 색상 선택기 */}
                {showColorPicker === note.id && (
                  <div className="absolute top-0 left-0 mt-8 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                    <div className="grid grid-cols-3 gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(note.id, color)}
                          className={`w-6 h-6 rounded ${color} hover:scale-110 transition-transform`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 일반 노트들 */}
            {unpinnedNotes.map((note) => (
              <div
                key={note.id}
                className={`absolute ${note.color} dark:bg-gray-700 rounded-lg p-4 shadow-lg cursor-move min-w-[200px] max-w-[300px] ${
                  draggedNote === note.id ? 'opacity-50' : ''
                }`}
                style={{ left: note.position.x, top: note.position.y }}
                draggable
                onDragStart={(e) => handleDragStart(e, note.id)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{note.author}</span>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(showColorPicker === note.id ? null : note.id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Palette className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(note);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {note.createdAt}
                </div>

                {/* 색상 선택기 */}
                {showColorPicker === note.id && (
                  <div className="absolute top-0 left-0 mt-8 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                    <div className="grid grid-cols-3 gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(note.id, color)}
                          className={`w-6 h-6 rounded ${color} hover:scale-110 transition-transform`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          // 리스트 뷰
          <div className="p-6 space-y-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`${note.color} dark:bg-gray-700 rounded-lg p-4 shadow-lg`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{note.author}</span>
                    {note.isPinned && <Pin className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handlePinNote(note.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleCopyNote(note)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => setSelectedNote(note)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {note.createdAt}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 새 노트 추가 모달 */}
        {isAddingNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">새 노트 추가</h3>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="노트 내용을 입력하세요..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                autoFocus
              />
              <div className="flex items-center justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 노트 편집 모달 */}
        {selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">노트 편집</h3>
              <textarea
                value={selectedNote.content}
                onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                autoFocus
              />
              <div className="flex items-center justify-end space-x-2 mt-4">
                <button
                  onClick={() => setSelectedNote(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => handleUpdateNote(selectedNote.id, selectedNote.content)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 도구 모음 */}
        <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
          <button className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <LinkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board; 