import React, { useState } from 'react';
import { Sparkles, Lightbulb, Tag, FileText, Zap } from 'lucide-react';

interface AISmartFeaturesProps {
  noteContent: string;
  onAddTags: (tags: string[]) => void;
  onGenerateSummary: (summary: string) => void;
  onSuggestIdeas: (ideas: string[]) => void;
}

const AISmartFeatures: React.FC<AISmartFeaturesProps> = ({
  noteContent,
  onAddTags,
  onGenerateSummary,
  onSuggestIdeas
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // AI 기능 시뮬레이션 (실제로는 OpenAI API 등을 사용)
  const simulateAI = async (action: string) => {
    setIsLoading(true);
    setActiveFeature(action);
    
    // 실제 AI API 호출을 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (action) {
      case 'tags':
        const tags = generateSmartTags(noteContent);
        onAddTags(tags);
        break;
      case 'summary':
        const summary = generateSummary(noteContent);
        onGenerateSummary(summary);
        break;
      case 'ideas':
        const ideas = generateIdeas(noteContent);
        onSuggestIdeas(ideas);
        break;
    }
    
    setIsLoading(false);
    setActiveFeature(null);
  };

  const generateSmartTags = (content: string): string[] => {
    const words = content.toLowerCase().split(/\s+/);
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const uniqueWords = [...new Set(words.filter(word => 
      word.length > 3 && !commonWords.includes(word)
    ))];
    return uniqueWords.slice(0, 5);
  };

  const generateSummary = (content: string): string => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const summary = sentences.slice(0, 2).join('. ');
    return summary + (sentences.length > 2 ? '...' : '');
  };

  const generateIdeas = (content: string): string[] => {
    const ideas = [
      '이 내용을 바탕으로 프레젠테이션을 만들어보세요',
      '관련된 이미지나 다이어그램을 추가해보세요',
      '이 아이디어를 다른 팀원들과 공유해보세요',
      '이 내용을 기반으로 프로젝트 계획을 세워보세요',
      '관련된 리소스나 링크를 추가해보세요'
    ];
    return ideas.slice(0, 3);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center mb-4">
        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI 스마트 기능
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => simulateAI('tags')}
          disabled={isLoading || !noteContent.trim()}
          className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
            activeFeature === 'tags'
              ? 'bg-purple-100 dark:bg-purple-800 border-purple-300 dark:border-purple-600'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Tag className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium">스마트 태그</span>
        </button>

        <button
          onClick={() => simulateAI('summary')}
          disabled={isLoading || !noteContent.trim()}
          className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
            activeFeature === 'summary'
              ? 'bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium">내용 요약</span>
        </button>

        <button
          onClick={() => simulateAI('ideas')}
          disabled={isLoading || !noteContent.trim()}
          className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
            activeFeature === 'ideas'
              ? 'bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Lightbulb className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium">아이디어 제안</span>
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            AI가 분석 중입니다...
          </span>
        </div>
      )}

      {!noteContent.trim() && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            노트에 내용을 작성하면 AI 기능을 사용할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default AISmartFeatures; 