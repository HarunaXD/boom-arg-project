# Archive1001SunshineVillage 开发历史

## 2026-06-15 01:49

### 帖子列表数据口径

- 移除主题帖 JSON 与类型定义中的 `summary` 字段，主题概括不再作为后台数据保存。
- 主题列表与搜索结果改为显示一楼正文作为预览内容，并限制为单行超出省略。
- 帖子阅读页根据主题作者 UID 显示“楼主”标识，楼主后续回楼也会被标记。

### 验证记录

- 已执行 `pnpm build Archive1001SunshineVillage` 与 `pnpm test Archive1001SunshineVillage`，均通过。

## 2026-06-15 01:46

### 超自然归档系统

- 首页新增「最近浏览」预言队列，会混入尚未访问过但系统认为“应当访问”的记录。
- 搜索框新增问题式自动补全，敏感词输入时显示“你为什么还在查”等非普通搜索建议。
- 分页锁定按钮增加预言性 title，提示缺失的处理记录、未完成测量和仍清醒用户。
- `s3` 后版块主题时间统一显示为 `2003-08-14 03:02`，模拟按归档完成时间重新排序。
- `s3` 后资料卡增加查看者字段：`查看者房号：未分配`、`查看者最后登录：2003-08-14 03:02`。
- 个人主页附件列表新增当前日期 `visitor_YYYY-MM-DD.tmp`，制造玩家也被归档系统纳入的感觉。
- 第 46-50 页内容改为数据库行风格，显露论坛背后的归档系统界面。
- 帖子正文在空间阶段后会被部分官方措辞污染，但个人主页历史仍保留原始发言。

### 验证记录

- 已执行 `pnpm build Archive1001SunshineVillage` 与 `pnpm test Archive1001SunshineVillage`，均通过。

## 2026-06-15 01:34

### 文档

- 新增 `devdocs/walkthrough.md`，记录当前版本主线必要通关流程、支线发现与解决方式、结局判定和维护要求。
- 明确规定：后续凡涉及主线解锁、支线入口、结局条件、关键文案或自动化通关流程变化，必须同步更新通关流程文档。

## 2026-06-15 01:22

### 解谜机制升级

- 将主线第一阶段从“搜索老赵”改为引用链追踪，茶馆帖可通过 `引用自 #009` 进入老赵申诉帖。
- 新增 `evidenceLog` 证据日志，兼容旧 `visitedTags` 存档迁移，并用空间、掩盖、清醒者、身份融合、附件残影等证据组合判断结局。
- 帖子 JSON 支持 `quoteOf`、`revisionOf`、`attachmentIds`、`evidence` 字段，解谜条件从组件硬编码转向数据记录。
- 户型图改为证据叠层，按已发现房号显示红色手写标注和扫描仪批注，移除“停留五秒/已点开几个”的游戏化提示。
- 移除 UID 334 白字直给提示，改为个人主页历史聚合残留和损坏附件 `vent_334.tmp` 暗示清醒线索。
- 终局输入框改为 `merge_target = ____`；输错不会报错，而是生成 UID 1001 临时归档回复。

### 支线与氛围

- 资料卡在空间阶段出现“曾用房号”，暗示门牌与身份边界回流。
- 物业公告/密码帖支持查看修订前版本，完成后结局报告增加 `coverup_revision_count`。
- 搜索敏感词时显示屏蔽表处理记录，减少直接攻略式结果。

### 验证记录

- 已执行 `pnpm build Archive1001SunshineVillage` 与 `pnpm test Archive1001SunshineVillage`，均通过。

## 2026-06-14 17:08

### 支线与氛围补强

- 新增夜班门卫、水表倒转、阳台绿萝、公告修订记录四个支线主题 JSON。
- 为夜归人、家有咪咪、小甜心补充个人日志，让个人主页更像真实用户空间。
- 主题列表和搜索结果显示支线标签，方便玩家从标签发现线索族群。
- 优化旧论坛视觉反馈：主题 hover、帖子隔行底色、楼层 hover、资料卡标识、日志分隔。
- 将自动化测试中个人历史数量断言改为内容导向，避免后续新增支线时误报。
- 已执行 `pnpm build Archive1001SunshineVillage` 与 `pnpm test Archive1001SunshineVillage`，均通过。

## 2026-06-14 16:59

### 自动化测试

- 选用 Playwright Test 作为端到端测试框架，用真实浏览器验证 BBS 游戏流程。
- 新增根目录 `test.mjs`，与 `build/` 并列，负责启动指定子项目的 Vite dev server 并运行 Playwright。
- 根目录 `package.json` 增加 `pnpm test <子项目名>` 脚本。
- 在 `apps/Archive1001SunshineVillage/__tests__` 下新增游戏流程测试和操作 helper。
- 测试覆盖首页、主帖分页、楼中楼回复、个人主页历史、老赵解锁、户型图解锁、UID 334 主页解锁、支线访问、清醒结局和最终下载文件内容。
- 已执行 `pnpm build Archive1001SunshineVillage` 与 `pnpm test Archive1001SunshineVillage`，均通过。

## 2026-06-14 16:48

### 数据库化与帖子结构

- 将主题帖数据迁移为 `src/data/threads/*.json`，每个 JSON 保存主题元数据、作者快照、楼层数组与楼中楼回复数组。
- 新增 `src/data/threadDatabase.ts`，通过 `import.meta.glob` 读取 JSON，并派生版块主题、分页帖子、搜索结果、个人发帖历史和结局报告。
- `boards.ts` 仅保留版块定义，主题列表不再手写维护。

### 论坛交互

- `ThreadView.vue` 增加楼中楼回复展示，主楼作者和楼中楼作者都可进入个人主页。
- `UserSpaceView.vue` 改为通用个人主页，展示资料、个人日志、主楼发帖历史和楼中楼回复历史。
- 弱化 UID 334 的显式入口提示，保留白字/选择可见的隐藏信息。

### 支线与结局

- 新增猫与通风口、账号融合、空间侵蚀、物业掩盖等支线标签。
- 记录玩家访问过的支线标签，并根据完成度生成基础、证据、清醒三种归档报告。
- 最终下载的 `archive_1001_final.txt` 会随结局变体追加对应残留字段。

### 验证记录

- 已执行 `pnpm build Archive1001SunshineVillage`，验证 JSON import、类型和 Vue 模板通过。

## 2026-06-12

### 项目结构

- 在 monorepo 的 `apps/Archive1001SunshineVillage` 下保留独立 Vue 3 SPA 子项目。
- 继续复用根目录 `build/vite.config.mjs` 的统一 Vite 构建配置。
- 子项目构建命令为 `pnpm build Archive1001SunshineVillage`，产物输出到 `apps/Archive1001SunshineVillage/dist`。
- 构建产物使用 `base: './'` 和相邻路径资源引用，适合本地打开 `dist/index.html`。

### 游戏实现

- 根据 `devdocs/main.md` 的策划案，将游戏实现为 2003 年 Discuz! 风格的离线 BBS 归档模拟。
- 主要流程包括：
  - 首页版块浏览。
  - 搜索“老赵”或“009”并阅读绝笔帖，解除第一阶段锁。
  - 点开空间异常住户资料卡，进入物业公告户型图并停留，解除第二阶段锁。
  - 在 UID 334 的帖子中发现“去 - 我 - 主 - 页”，访问个人空间日志，解除第三阶段锁。
  - 翻到第 50 页输入 `1001`，进入归档报告终局。
- 音效部分按需求暂未添加，终局确认使用下载 `archive_1001_final.txt` 代替真实系统另存为对话框。

### 组件拆分

- `App.vue`：全局状态机、路由式视图切换、本地进度保存。
- `ForumHome.vue`：论坛首页和版块入口。
- `BoardView.vue`：版块主题列表。
- `ThreadView.vue`：帖子阅读、分页、阶段锁报错和终局代号输入。
- `SearchView.vue`：全站搜索结果与老赵系统警告。
- `ProfileName.vue`：用户名资料卡和 UID 异变展示。
- `FloorPlanView.vue`：户型图证据比对。
- `UserSpaceView.vue`：UID 334 个人空间日志。
- `ArchiveEnding.vue`：Windows XP 风格归档报告弹窗。
- `PaginationBar.vue`：帖子分页组件。

### 数据组织

- `src/data/users.ts`：住户 UID、昵称、房号、登录时间和资料卡内容。
- `src/data/boards.ts`：版块与主题元数据。
- `src/data/posts.ts`：主线五十页帖子、支线主题、UID 334 日志。
- `src/types.ts`：版块、帖子、用户资料、视图和状态锁类型。

### 验证记录

- 已执行 `pnpm build Archive1001SunshineVillage`。
- Vite 成功生成 `dist/index.html`、相邻 JS 和 CSS 资源。
