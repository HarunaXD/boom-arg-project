export type BoardId = 'cafe' | 'market' | 'notice' | 'feedback';

export type ViewName = 'home' | 'board' | 'thread' | 'search' | 'notice' | 'plan' | 'user' | 'ending';

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
  authorName: string;
  createdAt: string;
  replies: number;
  pinned?: boolean;
  locked?: boolean;
  preview: string;
  tags: string[];
}

export interface AuthorSnapshot {
  uid: string;
  name: string;
  room: string;
  avatar?: 'default' | 'broken' | 'flesh';
}

export interface ThreadReply {
  id: string;
  author: AuthorSnapshot;
  time: string;
  content: string;
  flags?: string[];
}

export type EvidenceType = 'space' | 'coverup' | 'awake' | 'identity' | 'attachment';

export interface EvidenceRecord {
  type: EvidenceType;
  sourceThreadId: string;
  sourcePostId: string;
  uid: string;
  room: string;
  time: string;
  label: string;
}

export interface QuoteRef {
  threadId: string;
  postId: string;
  label: string;
}

export interface RevisionRef {
  threadId: string;
  postId: string;
  label: string;
  before: string;
}

export interface ThreadPostRecord {
  id: string;
  floor: number;
  page: number;
  author: AuthorSnapshot;
  time: string;
  content: string;
  flags?: string[];
  hiddenMessage?: string;
  quoteOf?: QuoteRef;
  revisionOf?: RevisionRef;
  attachmentIds?: string[];
  evidence?: EvidenceRecord;
  replies: ThreadReply[];
}

export interface ThreadRecord {
  id: string;
  boardId: BoardId;
  title: string;
  tags: string[];
  createdAt: string;
  author: AuthorSnapshot;
  pinned?: boolean;
  locked?: boolean;
  posts: ThreadPostRecord[];
}

export interface UserHistoryEntry {
  kind: 'post' | 'reply';
  threadId: string;
  threadTitle: string;
  boardId: BoardId;
  floor: number;
  time: string;
  content: string;
  replyToFloor?: number;
}

export type EndingVariant = 'basic' | 'evidence' | 'awake';

export interface AttachmentRecord {
  id: string;
  fileName: string;
  time: string;
  evidence?: EvidenceRecord;
}

export interface EndingReport {
  variant: EndingVariant;
  lines: string[];
  fileSuffix: string;
}

export interface GameLocks {
  s1: boolean;
  s2: boolean;
  s3: boolean;
  s4: boolean;
}
