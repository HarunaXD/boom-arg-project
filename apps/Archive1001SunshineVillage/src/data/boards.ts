import type { Board } from '../types';

export const boards: Board[] = [
  {
    id: 'cafe',
    name: '闲聊茶馆',
    description: '居民灌水、报修、互相提醒。置顶帖记录了最后五十页。',
    moderator: '阳光物业_01',
  },
  {
    id: 'market',
    name: '二手交易',
    description: '急售床、柜子和儿童床。物件比人更早意识到房间变小。',
    moderator: '交易小助手',
  },
  {
    id: 'notice',
    name: '物业公告',
    description: '入住须知、户型图、被反复修改的温馨提示。',
    moderator: '阳光物业_01',
  },
  {
    id: 'feedback',
    name: '站务反馈',
    description: '账号串号、密码覆盖和被删掉的申诉。',
    moderator: '论坛管理员',
  },
];
