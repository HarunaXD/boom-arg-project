import photo1 from '../assets/generated/photo-1-idol-front.png';
import photo2 from '../assets/generated/photo-2-idol-profile.png';
import photo3 from '../assets/generated/photo-3-idol-fullbody.png';
import photo4 from '../assets/generated/photo-4-hand-closeup.png';
import photo5 from '../assets/generated/photo-5-fan-photo.png';
import necklace from '../assets/generated/product-necklace.png';
import handCast from '../assets/generated/product-hand-cast.png';
import sleepKit from '../assets/generated/product-sleep-kit.png';
import vipInvite from '../assets/generated/product-vip-invite.png';
import type { Devotee, EndingContent, GalleryPhoto, OrganKey, ProductItem, ViewId } from '../types';

export const navItems: Array<{ id: ViewId; code: string; label: string; hidden?: boolean }> = [
  { id: 'gallery', code: 'GALL', label: '[凝视]' },
  { id: 'scanner', code: 'SCAN', label: '[检测]' },
  { id: 'devotees', code: 'DEVO', label: '[排名]' },
  { id: 'boutique', code: 'BOUT', label: '[获取]' },
  { id: 'v1', code: 'V1.0', label: '[V1]', hidden: true },
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Photo-1 / 圣像正面',
    caption: '请看我。我的眼睛是你的。',
    image: photo1,
    shape: 'portrait',
    hotspots: [
      {
        id: 'eye-left',
        label: 'left iris archive',
        code: '094',
        organ: 'eye',
        weight: 3,
        style: { left: '38%', top: '33%', width: '12%', height: '8%' },
      },
      {
        id: 'eye-right',
        label: 'right iris archive',
        code: 'H-042',
        organ: 'eye',
        weight: 3,
        mirrorOnly: true,
        style: { left: '54%', top: '33%', width: '12%', height: '8%' },
      },
    ],
  },
  {
    id: 'photo-2',
    title: 'Photo-2 / 侧脸',
    caption: '她没说话。她把房间号含在嘴里。',
    image: photo2,
    shape: 'portrait',
    hotspots: [
      {
        id: 'mouth',
        label: 'reverse lip print',
        code: 'DONOR-PREP-ROOM-03',
        organ: 'voice',
        weight: 4,
        mirrorOnly: true,
        style: { left: '49%', top: '48%', width: '22%', height: '9%' },
      },
    ],
  },
  {
    id: 'photo-3',
    title: 'Photo-3 / 手链',
    caption: '挂饰里有一枚不应该存在的防伪码。',
    image: photo3,
    shape: 'tall',
    hotspots: [
      {
        id: 'hand-right',
        label: 'bracelet charm',
        code: 'H-042',
        organ: 'skin',
        weight: 4,
        style: { left: '58%', top: '53%', width: '18%', height: '12%' },
      },
    ],
  },
  {
    id: 'photo-4',
    title: 'Photo-4 / 左手样本',
    caption: '掌纹没有编码。只有过分干净的石膏味。',
    image: photo4,
    shape: 'square',
    hotspots: [],
  },
  {
    id: 'photo-5',
    title: 'Photo-5 / 粉丝合影',
    caption: '停留久一点，噪点会替她说话。',
    image: photo5,
    shape: 'wide',
    hotspots: [
      {
        id: 'cheek',
        label: 'cheek noise',
        code: '/v1',
        organ: 'eye',
        weight: 2,
        style: { left: '45%', top: '35%', width: '16%', height: '14%' },
      },
    ],
  },
];

export const products: ProductItem[] = [
  {
    id: 'necklace',
    name: '限量版血滴项链',
    price: '5,000',
    sold: '已售 0412',
    description: '玻璃瓶吊坠，佩戴后请避免强光直射。',
    image: necklace,
    clue: 'BLD-O-NEG-0412',
    microLabel: '吊坠玻璃瓶标签',
  },
  {
    id: 'hand-cast',
    name: '定制手模',
    price: '8,000',
    sold: '已售 094',
    description: '白色石膏手模，掌心纹路可按编号复刻。',
    image: handCast,
    clue: 'H-042',
    microLabel: '手掌心位置',
    lockedNote: '购买者备注需在 Gallery 发现手链后显示：#094',
  },
  {
    id: 'sleep-kit',
    name: '临睡圣礼套装',
    price: '12,000',
    sold: '已售 047',
    description: '让她触碰你之前，先让你的身体安静下来。',
    image: sleepKit,
    clue: 'Succinylcholinum Chloride / Tetrodotoxinum Purificatum',
    microLabel: '成分表底部',
  },
  {
    id: 'shirt',
    name: 'Æ出道百日纪念T恤',
    price: '2,000',
    sold: '已售 888',
    description: '黑色棉布，洗涤后图案会逐渐贴近皮肤。',
    image: necklace,
    clue: '无隐藏线索',
    microLabel: '无',
  },
  {
    id: 'tape',
    name: '第一版Demo磁带',
    price: '15,000',
    sold: '售罄',
    description: '标签边缘有日期：2003-04-12。',
    image: sleepKit,
    clue: '2003-04-12',
    microLabel: '旧磁带标签',
  },
  {
    id: 'vip',
    name: 'VIP见面会邀请函',
    price: '50,000',
    sold: '售罄 / 5',
    description: '红色信封，封蜡纹路像地下二层平面图。',
    image: vipInvite,
    clue: 'DONOR WING B2',
    microLabel: '封蜡印章',
  },
];

export const devotees: Devotee[] = [
  { rank: 1, id: 'Æternal_Sleep', score: '99,847', status: '活跃', signature: '每晚都用她推荐的配方。梦里总能见到她。' },
  { rank: 2, id: '草莓奶昔', score: '87,230', status: '离线', signature: '已经到后台了马上就能见到她了好紧张！' },
  { rank: 3, id: '094号信徒', score: '76,500', status: '已收割', signature: '我的眼睛相似度99%！' },
  { rank: 4, id: 'VOID_224', score: '65,120', status: '已收割', signature: '—' },
  { rank: 5, id: '血橙', score: '54,300', status: '已收割', signature: '手模采集完成，期待她戴上我' },
  { rank: 6, id: 'room_112', score: '42,100', status: '已沉睡', signature: '眼睑压力异常。' },
  { rank: 7, id: 'mirror_mouth', score: '37,770', status: '离线', signature: '右键之后她终于转过来了。' },
  { rank: 8, id: '404_Bride', score: '34,020', status: '活跃', signature: '请不要刷新，刷新没有用。' },
  { rank: 9, id: 'H042_owner', score: '31,940', status: '已收割', signature: '掌心是最后一张门票。' },
  { rank: 10, id: 'v1_child', score: '30,003', status: '已沉睡', signature: '第二阶段已启动。' },
];

export const terminalCommands: Record<string, string> = {
  'BLD-O-NEG-0412':
    'DATABASE BREACH // 防伪码不是商品编号。供体 #0412，血型 O-，状态：待采集。购买周边 = 加入配对池。',
  'QUERY:VERIFY':
    'VERIFY TABLE // BLD-O-POS-0307: 已出货 / #056 / 心脏。BLD-A-NEG-0519: 已出货 / #071 / 皮肤。BLD-O-NEG-0412: 采集中 / #??? / 访客。',
  'BLD-O-POS-0307':
    'DONOR #056 // 血型 O+。采集部位：心脏。术后24小时死亡。最后遗言：我听见她在胸腔里练习呼吸。',
  'BLD-A-NEG-0519':
    'DONOR #071 // 血型 A-。采集部位：皮肤。状态：组织保存中。最后遗言：镜子里的人比我先眨眼。',
  'Succinylcholinum Chloride':
    '氯化琥珀胆碱 // 骨骼肌松弛。副作用记录：意识清醒但无法移动任何肌肉，包括眼睑。领取者名单新增：#???（你）。',
  'Tetrodotoxinum Purificatum':
    '纯化河豚毒素 // 神经信号阻断。副作用记录：无法感知触碰，无法发声。系统建议：保持静止，等待她触碰你。',
  'DONOR-PREP-ROOM-03':
    'ROOM-03 LIVE // 供体 #112 草莓奶昔。心率 78→74→69。眼睑压力 0.3N。声带振动匹配：“她在哪”。麻醉剂量建议追加。手术团队预计8分钟后到达。',
  'H-042': 'HAND FILE H-042 // 右手采集档案。购买者 #094。用途：Boutique 定制手模与舞台动作复刻。',
  'EYE-094': 'EYE FILE #094 // 虹膜匹配度 99%。Devotees #094 已收割。Æ 现在拥有他的视角。',
};

export const endingContent: Record<OrganKey, EndingContent> = {
  eye: {
    title: '■ EYE ■',
    label: '凝视深渊',
    body:
      '生物特征比对完成。你在 Gallery 累计凝视她的眼部特写。虹膜数据已完整收录。Æ 现在拥有你的视角。闭上眼，看到的就是她看到的。',
  },
  heart: {
    title: '♥ HEART ♥',
    label: '跳动的祭品',
    body:
      '心率波动分析完成。你在终端输入时的犹豫被记录为恐惧温度。Æ 胸腔中的寂静被你填满。感谢你的教学。',
  },
  skin: {
    title: '◻ SKIN ◻',
    label: '无瑕的外衣',
    body:
      '触觉模拟完成。你试图看到她皮肤之下的真相，Æ 也看到了你的。表皮张力、毛孔密度、皮下脂肪分布均已建模。',
  },
  voice: {
    title: '~ VOICE ~',
    label: '绝望的回声',
    body:
      '音频样本采集完成。你阅读献祭者遗言时，喉咙在无声移动。你的声线将在她下一首歌中被提取为人声采样。',
  },
};
