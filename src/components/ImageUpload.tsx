import React, { useState, useRef } from 'react';
import { storageService } from '../services/firebase';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  boardId: string;
  noteId?: string;
  className?: string;
  children?: React.ReactNode;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  boardId, 
  noteId, 
  className = '',
  children 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setIsUploading(true);
    try {
      let imageUrl: string;
      
      if (noteId) {
        // 노트 이미지 업로드
        imageUrl = await storageService.uploadNoteImage(file, boardId, noteId);
      } else {
        // 보드 배경 이미지 업로드
        imageUrl = await storageService.uploadBoardBackground(file, boardId);
      }
      
      onUpload(imageUrl);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        aria-label="이미지 파일 선택"
      />
      <button
        onClick={handleClick}
        disabled={isUploading}
        className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            업로드 중...
          </div>
        ) : (
          children || '이미지 업로드'
        )}
      </button>
    </div>
  );
};

export default ImageUpload; 