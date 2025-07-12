import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  runTransaction,
  limit,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  uploadBytesResumable
} from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { User } from 'firebase/auth';

// 타입 정의
export interface Workspace {
  id?: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  members: { [key: string]: string }; // userId: role
  createdAt: any;
  updatedAt: any;
}

export interface Board {
  id?: string;
  name: string;
  description: string;
  workspaceId: string;
  ownerId: string;
  members: { [key: string]: string };
  isStarred: boolean;
  backgroundImage?: string; // 배경 이미지 URL
  createdAt: any;
  updatedAt: any;
}

export interface Note {
  id?: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  boardId: string;
  ownerId: string;
  isPinned: boolean;
  images?: string[]; // 이미지 URL 배열
  createdAt: any;
  updatedAt: any;
}

// 에러 처리 클래스
export class FirebaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirebaseError';
  }
}

// 캐시 관리
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5분

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// 워크스페이스 서비스
export const workspaceService = {
  // 워크스페이스 목록 조회 (캐시 적용)
  async getWorkspaces(userId: string): Promise<Workspace[]> {
    const cacheKey = `workspaces_${userId}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const q = query(
        collection(db, 'workspaces'),
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const workspaces = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workspace));
      setCachedData(cacheKey, workspaces);
      return workspaces;
    } catch (error) {
      throw new FirebaseError('워크스페이스를 불러오는데 실패했습니다.', 'workspace-fetch-error');
    }
  },

  // 워크스페이스 생성
  async createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'workspaces'), {
        ...workspace,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // 캐시 무효화
      cache.delete(`workspaces_${workspace.ownerId}`);
      
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('워크스페이스 생성에 실패했습니다.', 'workspace-create-error');
    }
  },

  // 워크스페이스 수정
  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<void> {
    try {
      const docRef = doc(db, 'workspaces', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      // 캐시 무효화
      if (updates.ownerId) {
        cache.delete(`workspaces_${updates.ownerId}`);
      }
    } catch (error) {
      throw new FirebaseError('워크스페이스 수정에 실패했습니다.', 'workspace-update-error');
    }
  },

  // 워크스페이스 삭제 (배치 처리)
  async deleteWorkspace(id: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // 워크스페이스 삭제
      const workspaceRef = doc(db, 'workspaces', id);
      batch.delete(workspaceRef);
      
      // 관련 보드들 삭제
      const boardsQuery = query(collection(db, 'boards'), where('workspaceId', '==', id));
      const boardsSnapshot = await getDocs(boardsQuery);
      boardsSnapshot.docs.forEach(boardDoc => {
        batch.delete(boardDoc.ref);
      });
      
      await batch.commit();
      
      // 캐시 무효화
      cache.clear();
    } catch (error) {
      throw new FirebaseError('워크스페이스 삭제에 실패했습니다.', 'workspace-delete-error');
    }
  }
};

// 보드 서비스
export const boardService = {
  // 보드 목록 조회 (페이지네이션 지원)
  async getBoards(workspaceId: string, lastDoc?: QueryDocumentSnapshot, limitCount: number = 20): Promise<{ boards: Board[]; lastDoc?: QueryDocumentSnapshot }> {
    const cacheKey = `boards_${workspaceId}_${lastDoc?.id || 'first'}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      let q = query(
        collection(db, 'boards'),
        where('workspaceId', '==', workspaceId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      const boards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Board));
      const result = { 
        boards, 
        lastDoc: snapshot.docs[snapshot.docs.length - 1] 
      };
      
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      throw new FirebaseError('보드를 불러오는데 실패했습니다.', 'board-fetch-error');
    }
  },

  // 보드 생성
  async createBoard(board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'boards'), {
        ...board,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // 캐시 무효화
      cache.delete(`boards_${board.workspaceId}_first`);
      
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('보드 생성에 실패했습니다.', 'board-create-error');
    }
  },

  // 보드 수정
  async updateBoard(id: string, updates: Partial<Board>): Promise<void> {
    try {
      const docRef = doc(db, 'boards', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      // 캐시 무효화
      if (updates.workspaceId) {
        cache.delete(`boards_${updates.workspaceId}_first`);
      }
    } catch (error) {
      throw new FirebaseError('보드 수정에 실패했습니다.', 'board-update-error');
    }
  },

  // 보드 삭제 (트랜잭션 사용)
  async deleteBoard(id: string): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const boardRef = doc(db, 'boards', id);
        const boardDoc = await transaction.get(boardRef);
        
        if (!boardDoc.exists()) {
          throw new FirebaseError('보드를 찾을 수 없습니다.', 'board-not-found');
        }
        
        // 보드 삭제
        transaction.delete(boardRef);
        
        // 관련 노트들 삭제
        const notesQuery = query(collection(db, 'notes'), where('boardId', '==', id));
        const notesSnapshot = await getDocs(notesQuery);
        notesSnapshot.docs.forEach(noteDoc => {
          transaction.delete(noteDoc.ref);
        });
      });
      
      // 캐시 무효화
      cache.clear();
    } catch (error) {
      throw new FirebaseError('보드 삭제에 실패했습니다.', 'board-delete-error');
    }
  }
};

// 노트 서비스
export const noteService = {
  // 노트 목록 조회
  async getNotes(boardId: string): Promise<Note[]> {
    const cacheKey = `notes_${boardId}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const q = query(
        collection(db, 'notes'),
        where('boardId', '==', boardId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
      setCachedData(cacheKey, notes);
      return notes;
    } catch (error) {
      throw new FirebaseError('노트를 불러오는데 실패했습니다.', 'note-fetch-error');
    }
  },

  // 노트 생성
  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        ...note,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // 캐시 무효화
      cache.delete(`notes_${note.boardId}`);
      
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('노트 생성에 실패했습니다.', 'note-create-error');
    }
  },

  // 노트 수정
  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    try {
      const docRef = doc(db, 'notes', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      // 캐시 무효화
      if (updates.boardId) {
        cache.delete(`notes_${updates.boardId}`);
      }
    } catch (error) {
      throw new FirebaseError('노트 수정에 실패했습니다.', 'note-update-error');
    }
  },

  // 노트 삭제
  async deleteNote(id: string, boardId: string): Promise<void> {
    try {
      const docRef = doc(db, 'notes', id);
      await deleteDoc(docRef);
      
      // 캐시 무효화
      cache.delete(`notes_${boardId}`);
    } catch (error) {
      throw new FirebaseError('노트 삭제에 실패했습니다.', 'note-delete-error');
    }
  }
};

// 실시간 리스너 (최적화된 버전)
export const realtimeService = {
  // 워크스페이스 실시간 구독
  subscribeToWorkspaces(userId: string, callback: (workspaces: Workspace[]) => void) {
    const q = query(
      collection(db, 'workspaces'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const workspaces = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workspace));
      callback(workspaces);
    }, (error) => {
      console.error('워크스페이스 실시간 구독 오류:', error);
    });
  },

  // 보드 실시간 구독
  subscribeToBoards(workspaceId: string, callback: (boards: Board[]) => void) {
    const q = query(
      collection(db, 'boards'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const boards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Board));
      callback(boards);
    }, (error) => {
      console.error('보드 실시간 구독 오류:', error);
    });
  },

  // 노트 실시간 구독
  subscribeToNotes(boardId: string, callback: (notes: Note[]) => void) {
    const q = query(
      collection(db, 'notes'),
      where('boardId', '==', boardId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
      callback(notes);
    }, (error) => {
      console.error('노트 실시간 구독 오류:', error);
    });
  }
};

// 스토리지 서비스 (진행률 표시 지원)
export const storageService = {
  // 파일 업로드 (진행률 콜백 지원)
  async uploadFile(file: File, path: string, onProgress?: (progress: number) => void): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
          },
          (error) => {
            reject(new FirebaseError('파일 업로드에 실패했습니다.', 'upload-error'));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(new FirebaseError('다운로드 URL을 가져오는데 실패했습니다.', 'download-url-error'));
            }
          }
        );
      });
    } catch (error) {
      throw new FirebaseError('파일 업로드에 실패했습니다.', 'upload-error');
    }
  },

  // 파일 다운로드 URL 가져오기
  async getFileURL(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new FirebaseError('파일 URL을 가져오는데 실패했습니다.', 'file-url-error');
    }
  },

  // 파일 삭제
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      throw new FirebaseError('파일 삭제에 실패했습니다.', 'file-delete-error');
    }
  },

  // 폴더 내 모든 파일 목록 가져오기
  async listFiles(folderPath: string): Promise<string[]> {
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);
      return result.items.map(item => item.fullPath);
    } catch (error) {
      throw new FirebaseError('파일 목록을 가져오는데 실패했습니다.', 'file-list-error');
    }
  },

  // 이미지 업로드 (노트에 첨부)
  async uploadNoteImage(file: File, boardId: string, noteId: string, onProgress?: (progress: number) => void): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const path = `boards/${boardId}/notes/${noteId}/images/${fileName}`;
    return await this.uploadFile(file, path, onProgress);
  },

  // 보드 배경 이미지 업로드
  async uploadBoardBackground(file: File, boardId: string, onProgress?: (progress: number) => void): Promise<string> {
    const fileName = `background_${Date.now()}_${file.name}`;
    const path = `boards/${boardId}/backgrounds/${fileName}`;
    return await this.uploadFile(file, path, onProgress);
  }
}; 