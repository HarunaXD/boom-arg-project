import type { Post } from '../types';
import { users } from './users';

const earlySeeds = [
  ['031', '今天烧了红烧肉，香滴很。非典总算过去了，小区门口还测体温不？'],
  ['056', '6栋的电梯最近声音好怪，嗡嗡的，像什么在蠕动。物业看看啊。'],
  ['123', '我家猫死都不进卧室，就对着通风口哈气，你们家猫也这样吗？'],
  ['078', '论坛老串号，我刚才发帖怎么变成三楼王姐的头像了？'],
  ['1001', '经查，电梯声音为变频器正常工作电流声，请业主不必惊慌。'],
  ['215', '昨晚听见老赵半夜又在凿墙，咚咚咚的，家里小孩都吓醒了。'],
  ['009', '墙皮里是软的，还流黄水。你们别只笑我，去量量自己家的墙。'],
];

const spaceSeeds = [
  ['215', '邪门了！我铺在地上的拼图泡沫垫，以前横着铺8块，现在第8块得竖起来硬塞进去。客厅肯定窄了！'],
  ['142', '上个月买的1.8米双人床，今天想挪个位置，死活塞不进主卧那个凹槽了。床还能自己长胖吗？'],
  ['078', '我家大门现在得用力推才能全打开，门框是不是变形了？我住602。'],
  ['203', '502这边也不对，柜门只开到一半就顶住墙，明明以前不这样。'],
  ['177', '孩子说次卧晚上在喘气，我本来想骂他，可墙面摸起来真的一下一下的。'],
  ['1001', '墙体轻微位移属于正常建材沉降，请勿自行拆改。'],
];

const memorySeeds = [
  ['088', '今天新买的发卡真可爱>_< 啊不是，我是说降压药一天三次，饭后服用。'],
  ['225', '高血压不能吃太咸，另外哥哥演唱会的票为什么还没寄到？'],
  ['101', '刚才在厨房洗碗，眼一黑，睁开眼就站在402门口，手里拿着孙姐家的钥匙。我住101啊，孙姐是谁？'],
  ['1001', '嘴里全是苦味，我没吃苦瓜。哦，是楼上张姨在喝中药吧？我能感觉到药渣的颗粒感。'],
  ['1001', '今天这盘炒猪肝太老了咬不动，不过下周高数期末要是挂了就惨了，我还得赶紧去把洋娃娃的裙边缝好，王大爷又催我交电费了。'],
  ['334', '最近论坛好卡， 今 天 晚 上 又 断 网。 头 有 点 疼。'],
];

const finalSeeds = [
  ['1001', '我在一楼洗碗我在六楼咳嗽我在四零二挪床我在五零二关柜门我在电梯井里向内收紧没有疼只有挤压只有越来越近'],
  ['1001', '不要深呼吸不要睡着不要听见管道里有人叫自己的名字那不是别人那是我也是你也是我们'],
  ['1001', '三百零二份晚饭三百零二张门牌三百零二次登录失败合并成功合并成功合并成功'],
  ['1001', '阳光很好新村很好欢迎入住请勿封堵通风口请勿破坏墙体请勿拒绝成为一零零一'],
];

function post(id: string, page: number, index: number, uid: string, content: string): Post {
  const profile = users[uid] ?? users['1001'];
  return {
    id,
    floor: (page - 1) * 30 + index + 1,
    uid,
    author: profile.name,
    time: `2003-08-${String(Math.min(14, 1 + Math.floor(page / 4))).padStart(2, '0')} ${String(18 + (index % 6)).padStart(2, '0')}:${String((page * 7 + index * 9) % 60).padStart(2, '0')}`,
    content,
    corrupted: page >= 31 && index % 4 === 0,
    hiddenMessage: uid === '334' ? '去 - 我 - 主 - 页' : undefined,
  };
}

function buildPage(page: number): Post[] {
  const source = page <= 15 ? earlySeeds : page <= 30 ? spaceSeeds : page <= 45 ? memorySeeds : finalSeeds;
  const count = page <= 15 ? 6 : page <= 30 ? 7 : page <= 45 ? 6 : 4;
  return Array.from({ length: count }, (_, index) => {
    const seed = source[(page + index) % source.length];
    let content = seed[1];

    if (page === 8 && index === 1) {
      content = '老赵半夜又在凿墙，吵死了！物业能不能管管？';
    }

    if (page === 12 && index === 2) {
      content = '引用老赵：墙皮里是软的，还流黄水……管理员别删啊，这事怪得很。';
    }

    if (page === 15 && index === count - 1) {
      content = 'mysql_fetch_array(): supplied argument is not a valid MySQL result resource in /bbs/thread.php on line 1001';
    }

    if (page === 30 && index === count - 1) {
      content = 'mysql_fetch_array(): record area overflow, room_width expected 3.60 got 3.17';
    }

    if (page === 45 && index === count - 1) {
      content = '锟斤拷锟斤拷 UID merge failed: awake_user=334 ventilation=sealed';
    }

    return post(`daily-${page}-${index}`, page, index, seed[0], content);
  });
}

export const cafePages: Post[][] = Array.from({ length: 50 }, (_, index) => buildPage(index + 1));

export const threadPosts: Record<string, Post[]> = {
  'zhao-final': [
    post(
      'zhao-final-1',
      1,
      0,
      '009',
      '物业经理就是个骗子！你们去凿主卧那面墙！凿到五厘米深根本不是砖，是肉红色的软胶！改锥拔出来全是黄黏液，墙还会自己往回缩！别住一楼了，快搬走啊！！！',
    ),
    post('zhao-final-2', 1, 1, '1001', '用户“老赵”因散布不实信息被永久禁言，请不信谣、不传谣。'),
  ],
  password: [
    post('password-1', 1, 0, '283', '版主，我号“王家大孙子”登不上了，密码没改过！我用我爷爷的号上来问。'),
    post('password-2', 1, 1, '084', '我也是！我儿子的号也登不上了，但奇怪，用我的密码登他的号竟然登上了……这论坛搞什么？'),
  ],
  bed: [post('bed-1', 1, 0, '142', '急售1.8米双人床，主卧那个凹槽突然放不下了。床没变形，我拿卷尺量过。402自提。')],
  wardrobe: [post('wardrobe-1', 1, 0, '203', '大衣柜低价出，以前正好的地方现在门关不上。502，楼下帮忙抬走。')],
  'kids-bed': [post('kids-bed-1', 1, 0, '177', '儿童床不要了，次卧越来越小，孩子说晚上墙会靠过来。602自提，越快越好。')],
  rules: [
    post(
      'rules-1',
      1,
      0,
      '1001',
      '欢迎您入住阳光新村！本小区采用中央新风系统，通风口已预设，请勿私自拆卸、封堵或更改其开口尺寸。如因封堵造成呼吸不畅或睡眠异常，物业概不负责。如发现墙体有轻微位移或温度变化，属正常建材沉降，请致电物业，切勿自行凿开或破坏。',
    ),
  ],
};

export const userLog334 = {
  title: '通风口尺寸有点奇怪',
  content:
    '最近睡觉太沉，三个闹钟都醒不来。今天量了通风口，直径比上个月大了3厘米。我用胶带和硬纸板把它封死了，今晚试试。如果你能看到这篇，也试试吧。',
};
