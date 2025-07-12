import React from 'react';

interface ImageGalleryProps {
  images: string[];
  onDelete?: (index: number) => void;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  onDelete, 
  className = '' 
}) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img
            src={imageUrl}
            alt={`첨부된 이미지 ${index + 1}`}
            className="w-full h-32 object-cover rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {onDelete && (
            <button
              onClick={() => onDelete(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`이미지 ${index + 1} 삭제`}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery; 