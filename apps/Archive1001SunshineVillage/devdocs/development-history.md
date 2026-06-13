# Archive1001SunshineVillage 开发历史

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
