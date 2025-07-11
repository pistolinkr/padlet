import React, { useState, useRef, DragEvent } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Image, Link, Code, Quote, Table, Palette,
  Type, AlignLeft, AlignCenter, AlignRight,
  FileText, Download, Upload, Save
} from 'lucide-react';

interface AdvancedNoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  placeholder?: string;
}

const AdvancedNoteEditor: React.FC<AdvancedNoteEditorProps> = ({
  content,
  onChange,
  onSave,
  placeholder = "노트를 작성하세요..."
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates = [
    { name: '빈 노트', content: '' },
    { name: '회의록', content: '# 회의록\n\n## 참석자\n- \n\n## 안건\n1. \n2. \n\n## 결정사항\n- \n\n## 다음 액션\n- ' },
    { name: '프로젝트 계획', content: '# 프로젝트 계획\n\n## 목표\n\n## 일정\n- [ ] \n- [ ] \n\n## 리소스\n\n## 위험요소\n' },
    { name: '아이디어 노트', content: '# 아이디어\n\n## 개요\n\n## 장점\n\n## 단점\n\n## 구현 방안\n' }
  ];

  const handleFormat = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'list':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      case 'numbered':
        formattedText = selectedText.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);
    
    // 커서 위치 복원
    setTimeout(() => {
      textarea.setSelectionRange(start, start + formattedText.length);
      textarea.focus();
    }, 0);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const imageMarkdown = `![${file.name}](${imageUrl})`;
        onChange(content + '\n' + imageMarkdown);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: DragEvent) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const imageMarkdown = `![${file.name}](${imageUrl})`;
        onChange(content + '\n' + imageMarkdown);
      };
      reader.readAsDataURL(file);
    });
  };

  const applyTemplate = (template: { name: string; content: string }) => {
    onChange(template.content);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 툴바 */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center space-x-2 flex-wrap">
          {/* 텍스트 스타일 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleFormat('bold')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="굵게"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('italic')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="기울임"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('underline')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="밑줄"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          {/* 목록 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleFormat('list')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="글머리 기호 목록"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('numbered')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="번호 매기기 목록"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          {/* 인용 및 코드 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleFormat('quote')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="인용"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('code')}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="코드"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          {/* 이미지 및 링크 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="이미지 추가"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              title="링크 추가"
            >
              <Link className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          {/* 템플릿 */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex items-center space-x-1"
              title="템플릿"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">템플릿</span>
            </button>
            
            {showTemplates && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1"></div>

          {/* 저장 버튼 */}
          <button
            onClick={onSave}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center space-x-1"
          >
            <Save className="w-4 h-4" />
            <span>저장</span>
          </button>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div
        className="p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-64 resize-none border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setSelectedText(target.value.substring(target.selectionStart, target.selectionEnd));
          }}
        />
        
        {/* 드래그 앤 드롭 힌트 */}
        {content === '' && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
            이미지를 여기에 드래그하여 추가할 수 있습니다
          </div>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default AdvancedNoteEditor; 