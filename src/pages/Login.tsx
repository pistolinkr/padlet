import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Mail, Github, Chrome } from 'lucide-react';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Firebase 설정이 실제 값인지 확인
  const isFirebaseConfigured = () => {
    const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
    const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
    
    // 데모 값이 아닌 실제 값인지 확인
    return apiKey && 
           apiKey !== "demo-key" && 
           projectId && 
           projectId !== "padlet-clone";
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google 로그인 오류:', error);
      
      // Firebase 설정이 데모 값인 경우에만 데모 모드로 전환
      if (!isFirebaseConfigured()) {
        console.log('Firebase 설정 없음, 데모 모드로 진행');
        const demoUser = {
          uid: 'demo-user-id',
          displayName: '데모 사용자',
          email: 'demo@example.com',
          photoURL: null
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        window.location.reload();
      } else {
        setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('GitHub 로그인 오류:', error);
      
      // Firebase 설정이 데모 값인 경우에만 데모 모드로 전환
      if (!isFirebaseConfigured()) {
        console.log('Firebase 설정 없음, 데모 모드로 진행');
        const demoUser = {
          uid: 'demo-user-id',
          displayName: '데모 사용자',
          email: 'demo@example.com',
          photoURL: null
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        window.location.reload();
      } else {
        setError('GitHub 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    const demoUser = {
      uid: 'demo-user-id',
      displayName: '데모 사용자',
      email: 'demo@example.com',
      photoURL: null
    };
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Padlet Clone에 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            협업과 아이디어 공유를 시작하세요
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Google로 계속하기
            </button>

            <button
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5 mr-3" />
              GitHub로 계속하기
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  또는
                </span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-5 h-5 mr-3" />
              데모 모드로 시작하기
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              계정이 없으신가요?{' '}
              <button className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                회원가입
              </button>
            </p>
          </div>
        </div>

        {/* Firebase 설정 상태 표시 */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            {isFirebaseConfigured() ? 'Firebase 연결됨' : '데모 모드'}
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {isFirebaseConfigured() 
              ? '실제 Firebase 설정이 연결되어 있습니다. 소셜 로그인이 정상적으로 작동합니다.'
              : 'Firebase 설정이 없어 데모 모드로 실행됩니다. "데모 모드로 시작하기" 버튼을 클릭하여 모든 기능을 테스트할 수 있습니다.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 