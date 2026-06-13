export type BoardId = 'cafe' | 'market' | 'notice' | 'feedback';

export type ViewName =
  | 'home'
  | 'board'
  | 'thread'
  | 'search'
  | 'notice'
  | 'plan'
  | 'user'
  | 'ending';

export interface UserProfile {
  uid: string;
  name: string;
  room: string;
  registered: string;
  lastLogin: string;
  bio: string;
  avatar?: 'default' | 'broken' | 'flesh';
}

export interface Board {
  id: BoardId;
  name: string;
  description: string;
  moderator: string;
}

export interface ForumThread {
  id: string;
  boardId: BoardId;
  title: string;
  authorUid: string;
  createdAt: string;
  replies: number;
  pinned?: boolean;
  locked?: boolean;
  summary: string;
}

export interface Post {
  id: string;
  floor: number;
  uid: string;
  author: string;
  time: string;
  content: string;
  corrupted?: boolean;
  hiddenMessage?: string;
}

export interface GameLocks {
  s1: boolean;
  s2: boolean;
  s3: boolean;
  s4: boolean;
}
