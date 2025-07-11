import React, { useState } from 'react';
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
  Send
} from 'lucide-react';

interface Note {
  id: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  createdAt: string;
  author: string;
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

  const colors = [
    'bg-yellow-200', 'bg-blue-200', 'bg-green-200', 
    'bg-pink-200', 'bg-purple-200', 'bg-orange-200'
  ];

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

  return (
    <div className="h-full flex flex-col">
      {/* 보드 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">아이디어 보드</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">창의적인 아이디어들을 자유롭게 작성해보세요</p>
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
      <div className="flex-1 relative bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* 노트들 */}
        {notes.map((note) => (
          <div
            key={note.id}
            className={`absolute ${note.color} dark:bg-gray-700 rounded-lg p-4 shadow-lg cursor-move min-w-[200px] max-w-[300px]`}
            style={{ left: note.position.x, top: note.position.y }}
            onClick={() => setSelectedNote(note)}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{note.author}</span>
              <div className="flex items-center space-x-1">
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
          </div>
        ))}

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