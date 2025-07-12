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
  onSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
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

// 워크스페이스 서비스
export const workspaceService = {
  // 워크스페이스 목록 조회
  async getWorkspaces(userId: string): Promise<Workspace[]> {
    const q = query(
      collection(db, 'workspaces'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workspace));
  },

  // 워크스페이스 생성
  async createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'workspaces'), {
      ...workspace,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // 워크스페이스 수정
  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<void> {
    const docRef = doc(db, 'workspaces', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // 워크스페이스 삭제
  async deleteWorkspace(id: string): Promise<void> {
    const docRef = doc(db, 'workspaces', id);
    await deleteDoc(docRef);
  }
};

// 보드 서비스
export const boardService = {
  // 보드 목록 조회
  async getBoards(workspaceId: string): Promise<Board[]> {
    const q = query(
      collection(db, 'boards'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Board));
  },

  // 보드 생성
  async createBoard(board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'boards'), {
      ...board,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // 보드 수정
  async updateBoard(id: string, updates: Partial<Board>): Promise<void> {
    const docRef = doc(db, 'boards', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // 보드 삭제
  async deleteBoard(id: string): Promise<void> {
    const docRef = doc(db, 'boards', id);
    await deleteDoc(docRef);
  }
};

// 노트 서비스
export const noteService = {
  // 노트 목록 조회
  async getNotes(boardId: string): Promise<Note[]> {
    const q = query(
      collection(db, 'notes'),
      where('boardId', '==', boardId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
  },

  // 노트 생성
  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // 노트 수정
  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    const docRef = doc(db, 'notes', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // 노트 삭제
  async deleteNote(id: string): Promise<void> {
    const docRef = doc(db, 'notes', id);
    await deleteDoc(docRef);
  }
};

// 실시간 리스너
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
    });
  }
}; 

// 스토리지 서비스
export const storageService = {
  // 파일 업로드
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  // 파일 다운로드 URL 가져오기
  async getFileURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  },

  // 파일 삭제
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  // 폴더 내 모든 파일 목록 가져오기
  async listFiles(folderPath: string): Promise<string[]> {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    return result.items.map(item => item.fullPath);
  },

  // 이미지 업로드 (노트에 첨부)
  async uploadNoteImage(file: File, boardId: string, noteId: string): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const path = `boards/${boardId}/notes/${noteId}/images/${fileName}`;
    return await this.uploadFile(file, path);
  },

  // 보드 배경 이미지 업로드
  async uploadBoardBackground(file: File, boardId: string): Promise<string> {
    const fileName = `background_${Date.now()}_${file.name}`;
    const path = `boards/${boardId}/backgrounds/${fileName}`;
    return await this.uploadFile(file, path);
  }
}; 