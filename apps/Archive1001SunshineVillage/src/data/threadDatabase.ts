import type {
  AttachmentRecord,
  EndingReport,
  EndingVariant,
  EvidenceRecord,
  ForumThread,
  ThreadPostRecord,
  ThreadRecord,
  UserHistoryEntry,
} from '../types';

const modules = import.meta.glob('./threads/*.json', { eager: true, import: 'default' }) as Record<string, ThreadRecord>;

export const threads = Object.values(modules).sort((left, right) => left.createdAt.localeCompare(right.createdAt));
export const threadById = new Map(threads.map((thread) => [thread.id, thread]));

function firstFloorPreview(thread: ThreadRecord) {
  return thread.posts[0]?.content ?? '正文缺失，服务器只留下了主题记录。';
}

export const boardThreads: ForumThread[] = threads.map((thread) => ({
  id: thread.id,
  boardId: thread.boardId,
  title: thread.title,
  authorUid: thread.author.uid,
  authorName: thread.author.name,
  createdAt: thread.createdAt,
  replies: thread.posts.reduce((total, post) => total + 1 + post.replies.length, 0),
  pinned: thread.pinned,
  locked: thread.locked,
  preview: firstFloorPreview(thread),
  tags: thread.tags,
}));

export const threadPosts: Record<string, ThreadPostRecord[]> = Object.fromEntries(
  threads.map((thread) => [thread.id, thread.posts]),
);

export const cafePages: ThreadPostRecord[][] = Array.from({ length: 50 }, (_, index) =>
  getThreadPosts('daily').filter((post) => post.page === index + 1),
);

const userLogs: Record<string, { title: string; content: string; time: string }[]> = {
  '334': [
    {
      title: '通风口尺寸有点奇怪',
      time: '2003-08-14 00:07',
      content:
        '最近睡觉太沉，三个闹钟都醒不来。今天量了通风口，直径比上个月大了3厘米。我用胶带和硬纸板把它封死了，今晚试试。如果你能看到这篇，也试试吧。',
    },
  ],
  '142': [
    {
      title: '主卧尺寸记录',
      time: '2003-08-13 19:20',
      content: '402主卧靠电梯井的墙，三天少了六厘米。床没坏，尺子也没坏。',
    },
  ],
  '056': [
    {
      title: '夜班回家路线',
      time: '2003-08-12 04:31',
      content: '以后不坐6栋电梯。楼梯间至少每一级台阶都还像台阶。',
    },
  ],
  '123': [
    {
      title: '猫的反应',
      time: '2003-08-12 22:26',
      content: '咪咪今天第一次主动钻进衣柜。衣柜里面没有风口。',
    },
  ],
  '225': [
    {
      title: '绿萝',
      time: '2003-08-09 16:02',
      content: '我把盆转过去，它又慢慢转回来。不是风吹的，窗户关着。',
    },
  ],
  '283': [
    {
      title: '账号备忘',
      time: '2003-08-13 21:22',
      content: '爷爷的密码是我的生日，我的密码变成了爷爷的生日。再试下去，我怕生日也会换。',
    },
  ],
};

const userAttachments: Record<string, AttachmentRecord[]> = {
  '334': [
    {
      id: 'att-334-vent',
      fileName: 'vent_334.tmp',
      time: '2003-08-14 00:09',
      evidence: {
        type: 'attachment',
        sourceThreadId: 'user-334',
        sourcePostId: 'att-334-vent',
        uid: '334',
        room: '未知',
        time: '2003-08-14 00:09',
        label: '损坏附件：vent_334.tmp',
      },
    },
    { id: 'att-334-faces', fileName: 'all_faces.dat', time: '2003-08-14 00:12' },
  ],
  '142': [{ id: 'att-142-bed', fileName: 'bed_402.jpg', time: '2003-08-13 19:21' }],
  '225': [{ id: 'att-225-yangtai', fileName: 'yangtai.jpg', time: '2003-08-09 16:04' }],
};

export function getThread(threadId: string) {
  return threadById.get(threadId);
}

export function getThreadPosts(threadId: string) {
  return threadById.get(threadId)?.posts ?? [];
}

export function getThreadTags(threadId: string) {
  return threadById.get(threadId)?.tags ?? [];
}

export function searchThreads(keyword: string) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return [];

  return boardThreads.filter((forumThread) => {
    const thread = threadById.get(forumThread.id);
    if (!thread) return false;

    const searchable = [
      forumThread.id,
      forumThread.title,
      forumThread.preview,
      thread.author.uid,
      thread.author.name,
      thread.author.room,
      ...thread.tags,
      ...thread.posts.flatMap((post) => [
        post.author.uid,
        post.author.name,
        post.author.room,
        post.content,
        ...post.replies.flatMap((reply) => [reply.author.uid, reply.author.name, reply.author.room, reply.content]),
      ]),
    ]
      .join('\n')
      .toLowerCase();

    return searchable.includes(normalized);
  });
}

export function getUserLogs(uid: string) {
  return userLogs[uid] ?? [];
}

export function getUserAttachments(uid: string) {
  return userAttachments[uid] ?? [];
}

export function getUserHistory(uid: string): UserHistoryEntry[] {
  const history = threads.flatMap((thread) =>
    thread.posts.flatMap((post) => {
      const entries: UserHistoryEntry[] = [];

      if (post.author.uid === uid) {
        entries.push({
          kind: 'post',
          threadId: thread.id,
          threadTitle: thread.title,
          boardId: thread.boardId,
          floor: post.floor,
          time: post.time,
          content: post.content,
        });
      }

      post.replies.forEach((reply) => {
        if (reply.author.uid === uid) {
          entries.push({
            kind: 'reply',
            threadId: thread.id,
            threadTitle: thread.title,
            boardId: thread.boardId,
            floor: post.floor,
            replyToFloor: post.floor,
            time: reply.time,
            content: reply.content,
          });
        }
      });

      return entries;
    }),
  );

  return history.sort((left, right) => right.time.localeCompare(left.time));
}

export function migrateTagsToEvidence(visitedTags: string[]): EvidenceRecord[] {
  return visitedTags.map((tag) => ({
    type:
      tag === 'awake-user'
        ? 'awake'
        : tag === 'password-merge'
          ? 'identity'
          : tag === 'property-coverup'
            ? 'coverup'
            : tag === 'market-shrink'
              ? 'space'
              : 'attachment',
    sourceThreadId: `legacy-${tag}`,
    sourcePostId: tag,
    uid: '1001',
    room: '全部',
    time: '2003-08-14 03:02',
    label: tag,
  }));
}

export function getEndingReport(evidenceLog: EvidenceRecord[]): EndingReport {
  const typeSet = new Set(evidenceLog.map((item) => item.type));
  const coverupCount = evidenceLog.filter((item) => item.type === 'coverup').length;
  const variant: EndingVariant =
    typeSet.has('awake') && typeSet.has('attachment') && typeSet.has('identity')
      ? 'awake'
      : typeSet.has('space') && typeSet.has('coverup') && typeSet.has('identity')
        ? 'evidence'
        : 'basic';

  if (variant === 'awake') {
    return {
      variant,
      lines: [
        '[系统归档日志 - 2003年8月14日]',
        '阳光新村一期住户（共302人）已全部完成数据合并。',
        '建筑消化完毕，进入休眠期。',
        '异常：awake_user residue detected。',
        `coverup_revision_count=${coverupCount}`,
        '通风口封堵记录未能清理。等待二期业主入住。',
      ],
      fileSuffix: `AWAKE_USER_RESIDUE=334\nVENTILATION=SEALED\ncoverup_revision_count=${coverupCount}\n`,
    };
  }

  if (variant === 'evidence') {
    return {
      variant,
      lines: [
        '[系统归档日志 - 2003年8月14日]',
        '阳光新村一期住户（共302人）已全部完成数据合并。',
        '建筑消化完毕，进入休眠期。',
        '异常字段未清理：room_width / password_owner / property_notice。',
        `coverup_revision_count=${coverupCount}`,
        '等待二期业主入住。',
      ],
      fileSuffix: `UNCLEAN_FIELDS=room_width,password_owner,property_notice\ncoverup_revision_count=${coverupCount}\n`,
    };
  }

  return {
    variant,
    lines: [
      '[系统归档日志 - 2003年8月14日]',
      '阳光新村一期住户（共302人）已全部完成数据合并。',
      '建筑消化完毕，进入休眠期。',
      '等待二期业主入住。',
    ],
    fileSuffix: '',
  };
}
