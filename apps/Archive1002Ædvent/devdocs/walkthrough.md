# 《Project-Æ 完美降临》通关流程文档

> 维护规则：任何会改变主线解锁条件、支线发现方式、终端命令门槛、结局判定、关键页面入口或 Playwright 测试流程的改动，都必须同步更新本文档。

本文档描述当前实现版本的必要通关操作和可发现支线。策划文档 `devdocs/main.md` 中有部分未来设想，例如 Ctrl+滚轮缩放和长时间停留揭示；本文以代码中已落地的交互为准，可作为验收清单和自动化测试维护参考。

## 一、主线通关必要流程

### 1. 进入 Gallery 并读取第一组编码

必要操作：

1. 打开游戏首页，默认进入 `Æ-Gallery / 圣像陈列室`。
2. 在 `Photo-1 / 圣像正面` 上悬停左眼热区。
3. 保持约 3 秒，底部 `pixel-drop` 显示 `094`。

效果：

- 记录热区 `eye-left`。
- 增加 `eye` 权重。
- 为后续 Devotees 中确认 `094号信徒` 做铺垫。

注意：

- `Photo-1` 右眼热区需要先镜像翻转才可读，未翻转时只会提示反向文字无法读取。
- 鼠标移出热区会取消倒计时，需要重新悬停。

### 2. 镜像 Gallery 照片并读取准备室编码

必要操作：

1. 在 `Photo-2 / 侧脸` 图片区域右键。
2. 在自定义右键菜单中点击「镜像翻转」。
3. 悬停嘴唇热区 `reverse lip print`。
4. 保持约 3 秒，底部显示 `DONOR-PREP-ROOM-03`。

效果：

- 记录热区 `mouth`。
- 增加 `voice` 权重。
- 解锁准备室线索，但终端查询仍需要 Boutique 的楼层证据补全。

### 3. 从 Boutique 获取主暗号

必要操作：

1. 点击左侧导航 `BOUT [获取]`，进入 `Æ-Boutique / 信徒黑市`。
2. 找到商品「限量版血滴项链」。
3. 点击该商品的「放大检查」。
4. 商品图上的微缩文字显露 `BLD-O-NEG-0412`。

效果：

- 记录商品 `necklace` 已放大。
- 增加 `skin` 权重。
- 获得主线终端暗号。

### 4. 触发终端数据库入侵

必要操作：

1. 在顶部终端输入 `BLD-O-NEG-0412`。
2. 按 Enter 提交。

效果：

- 终端输出 `DATABASE BREACH`。
- `terminalUnlocked` 变为 true。
- 结局倒计时开始：正式环境 10 秒，`testMode=1` 下 30 秒。
- 终端提示 `QUERY:VERIFY` 可显示防伪码查询表。
- 导航和页面仍可继续操作，倒计时结束后会按当前权重进入结局。

重要门槛：

- 在输入主暗号之前，`QUERY:VERIFY`、`BLD-O-POS-0307`、`BLD-A-NEG-0519`、`DONOR-PREP-ROOM-03` 都会返回无效查询。
- 主暗号一旦输入，结局倒计时就会启动；想完整探索支线时，应先收集必要线索，再输入主暗号，或在测试模式中使用更长倒计时。

### 5. 查询防伪码表

必要操作：

1. 在已输入主暗号后，终端输入 `QUERY:VERIFY`。

效果：

- 终端输出 `VERIFY TABLE`。
- 记录支线 `verify`。
- 显示三条血型配对记录：
  - `BLD-O-POS-0307`：已出货 / `#056` / 心脏。
  - `BLD-A-NEG-0519`：已出货 / `#071` / 皮肤。
  - `BLD-O-NEG-0412`：采集中 / `#???` / 访客。

### 6. 完成 094 眼部档案交叉验证

必要操作：

1. 点击左侧导航 `DEVO [排名]`，进入 `Æ-Devotees / 狂热者名录`。
2. 找到 `094号信徒`。
3. 点击其状态按钮 `[已收割]`。
4. 状态按钮变为 `[已验证]`。
5. 回到终端输入 `EYE-094`。

效果：

- 记录 `eye094Confirmed`。
- 终端输出 `EYE FILE #094`。
- 记录支线 `eyeFile`。

门槛说明：

- 只在 Gallery 看到 `094` 不足以查询 `EYE-094`。
- 未点击 Devotees 中 `094号信徒` 的 `[已收割]` 状态前，终端会返回交叉验证失败。

### 7. 完成 H-042 手部档案交叉验证

必要操作：

1. 回到 `GALL [凝视]`。
2. 在 `Photo-3 / 手链` 上悬停手链挂饰热区 `bracelet charm`。
3. 保持约 3 秒，底部显示 `H-042`。
4. 进入 `BOUT [获取]`。
5. 找到商品「定制手模」。
6. 点击「放大检查」。
7. 确认商品卡出现 `购买者备注：#094`。
8. 在终端输入 `H-042`。

效果：

- 记录热区 `hand-right`。
- 记录商品 `hand-cast` 已放大。
- 记录 `handBuyerConfirmed`。
- 终端输出 `HAND FILE H-042`。
- 记录支线 `handFile`。

门槛说明：

- `H-042` 需要 Gallery 的手链编码和 Boutique 的购买者备注共同互证。
- 未完成互证前，终端会提示需要 `Gallery 手链编码 + Boutique 定制手模购买者备注 #094`。

### 8. 完成供体准备室实时监控

必要操作：

1. 已先通过 `Photo-2` 镜像嘴唇获得 `DONOR-PREP-ROOM-03`。
2. 在 `BOUT [获取]` 中找到商品「VIP见面会邀请函」。
3. 点击「放大检查」。
4. 确认商品卡出现 `封蜡平面图：B2 / DONOR WING`。
5. 在终端输入 `DONOR-PREP-ROOM-03`。

效果：

- 记录商品 `vip` 已放大。
- 记录 `donorB2Confirmed`。
- 终端输出 `ROOM-03 LIVE`。
- 记录支线 `donorRoom`。
- `Devotees` 中 `草莓奶昔` 的状态会从 `[离线]` 变为 `[已收割]`。
- 增加 `voice` 权重。

门槛说明：

- 仅获得嘴唇编码时，准备室编号缺少楼层。
- 必须通过 VIP 邀请函确认 `B2 / DONOR WING` 后，终端查询才会通过。

### 9. 解锁并访问 V1.0 归档站

必要操作：

1. 回到 `GALL [凝视]`。
2. 在 `Photo-5 / 粉丝合影` 上悬停脸颊噪点热区 `cheek noise`。
3. 保持约 1.6 秒，底部显示 `/v1`。
4. 左侧导航出现隐藏入口 `V1.0 [V1]`。
5. 点击 `V1.0`。

效果：

- 记录热区 `cheek`。
- `v1Unlocked` 变为 true。
- 记录支线 `v1`。
- 地址栏会切到 `./v1`。
- 页面显示 `Project-Æ V1.0 Prototype Archive`、错位原型体扫描图和实验记录。

替代入口：

- 在任意位置右键选择「申请接触许可」，输入 `#094` 或 `094`，也会暴露 `/v1`。

### 10. 进入结局

必要操作：

1. 输入主暗号 `BLD-O-NEG-0412` 后等待倒计时结束。
2. 测试模式下可点击顶部的 `finish sampling` 按钮立即结算。

效果：

- 页面切换到 `ending`。
- 浏览器标题变为对应器官结局标题。
- 结局页显示 `[End of Connection]`。

## 二、支线发现与解决

### 1. 血型配对数据库

入口：

- 主暗号 `BLD-O-NEG-0412` 后，终端提示 `QUERY:VERIFY`。

解决方式：

1. 输入 `QUERY:VERIFY` 显示防伪码查询表。
2. 输入 `BLD-O-POS-0307` 查看供体 `#056` 心脏档案。
3. 输入 `BLD-A-NEG-0519` 查看供体 `#071` 皮肤档案。

作用：

- 揭示防伪码其实是血型和供体编号。
- 该支线不设置额外交叉验证门槛，只要求主暗号已输入。

### 2. 自我麻醉指南

入口：

- 在 `Devotees` 中点击第一名 `Æternal_Sleep` 签名里的「每晚都用她推荐的配方」。
- 或在 `Boutique` 中点击「临睡圣礼套装」的「查看隐藏详情」。

解决方式：

1. 打开隐藏商品「Æ的临睡圣礼套装」。
2. 读取成分：
   - `Succinylcholinum Chloride`
   - `Tetrodotoxinum Purificatum`
3. 在终端分别输入两个成分名。

作用：

- 终端解释氯化琥珀胆碱和纯化河豚毒素的效果。
- 记录支线 `sleepFormula`。
- 揭示粉丝使用的不是护肤品，而是让身体保持清醒瘫痪的麻醉剂。

### 3. 右键菜单

入口：

- 网站任意位置右键。

当前选项：

- 「保存影像副本」：下载一个 `ae-shadow-*.txt` 文本副本，内容包含当前目标和器官权重。
- 「镜像翻转」：仅在图片上右键时可用，用于翻转 Gallery 照片。
- 「申请接触许可」：弹出推荐人编号输入框。

关键用途：

- `Photo-2` 必须镜像后才能读出 `DONOR-PREP-ROOM-03`。
- 输入推荐人 `#094` 或 `094` 可解锁 V1.0 入口。

### 4. Scanner 页面

入口：

- 点击 `SCAN [检测]`。

当前作用：

- 氛围页面，不承载必要解谜锁。
- 页面展示复古机械扫描界面和随机伪检测结果。
- 结局已锁定后会进入锁定状态。

### 5. 存档与刷新

当前状态存储：

- 使用 `localStorage` key：`archive-1002-aedvent-state`。
- 保存内容包括热区、镜像照片、放大商品、终端历史、支线状态、权重和结局状态。

效果：

- 输入主暗号后的 `DATABASE BREACH` 会在刷新后保留。
- V1.0 入口、终端历史、已完成支线和结局状态也会保留。

重开测试方式：

- 清空 localStorage 后刷新。
- Playwright helper 会先进入页面、清空 localStorage，再以 `?testMode=1` 打开。

## 三、终端命令表

### 初始可用

- `BLD-O-NEG-0412`：触发数据库入侵、解锁终端扩展命令、启动结局倒计时。
- `H-042`：命令存在，但需要手部互证门槛。
- `EYE-094`：命令存在，但需要 Devotees 确认门槛。
- `Succinylcholinum Chloride`：查询麻醉成分。
- `Tetrodotoxinum Purificatum`：查询麻醉成分。

### 主暗号后可用

- `QUERY:VERIFY`：显示防伪码查询表。
- `BLD-O-POS-0307`：显示供体 `#056` 档案。
- `BLD-A-NEG-0519`：显示供体 `#071` 档案。
- `DONOR-PREP-ROOM-03`：命令存在，但仍需要 VIP 邀请函确认 `B2 / DONOR WING`。

### 无效输入

- 长度小于 3 或未知命令会返回无效查询。
- 每次无效查询增加 `heart` 权重。
- 无效次数超过 9 次后，提示变为「尝试查询产品上的编码」。
- 在终端输入框按 Delete 也会增加 `heart` 权重。

## 四、结局判定

结局在倒计时结束时根据 `weights` 中最高的器官权重判定。

平局优先级：

1. `eye`
2. `heart`
3. `skin`
4. `voice`

### eye：凝视深渊

增加权重的主要行为：

- 悬停 Gallery 眼部热区。
- 触发 `/v1` 脸颊噪点也会增加少量 `eye`。

结局表现：

- 标题：`■ EYE ■`
- 文案强调虹膜数据和视角被收录。

### heart：跳动的祭品

增加权重的主要行为：

- 终端输入无效命令。
- 在终端输入框按 Delete。

结局表现：

- 标题：`♥ HEART ♥`
- 文案强调输入犹豫被记录为恐惧温度。

### skin：无瑕的外衣

增加权重的主要行为：

- 使用右键菜单「镜像翻转」。
- 点击商品「放大检查」。
- 触发 `Photo-3` 手链热区。

结局表现：

- 标题：`◻ SKIN ◻`
- 文案强调试图看见她皮肤之下，也让她看见了玩家的皮肤。

### voice：绝望的回声

增加权重的主要行为：

- 进入 Devotees 页面。
- 触发 `Photo-2` 嘴唇热区。
- 成功查询 `DONOR-PREP-ROOM-03`。

结局表现：

- 标题：`~ VOICE ~`
- 文案强调无声阅读和声线采样。

## 五、当前最短自动化通关路径

当前 Playwright 主流程覆盖以下步骤：

1. 清空 localStorage，并用 `?testMode=1` 打开游戏。
2. 悬停 `left iris archive`，获得 `094`。
3. 右键 `Photo-2`，点击「镜像翻转」。
4. 悬停 `reverse lip print`，获得 `DONOR-PREP-ROOM-03`。
5. 进入 Boutique，放大「限量版血滴项链」，获得 `BLD-O-NEG-0412`。
6. 先输入 `QUERY:VERIFY`，确认未解锁时返回无效查询。
7. 输入 `BLD-O-NEG-0412`，确认 `DATABASE BREACH`。
8. 输入 `QUERY:VERIFY`，确认 `VERIFY TABLE`。
9. 输入 `DONOR-PREP-ROOM-03`，确认缺少楼层。
10. 输入 `H-042`，确认需要互证。
11. 输入 `EYE-094`，确认需要先在 Devotees 确认。
12. 进入 Devotees，点击 `094号信徒` 的 `[已收割]`。
13. 输入 `EYE-094`，确认 `EYE FILE #094`。
14. 回到 Gallery，悬停 `bracelet charm`，获得 `H-042`。
15. 进入 Boutique，放大「定制手模」，确认 `购买者备注：#094`。
16. 输入 `H-042`，确认 `HAND FILE H-042`。
17. 放大「VIP见面会邀请函」，确认 `B2 / DONOR WING`。
18. 输入 `DONOR-PREP-ROOM-03`，确认 `ROOM-03 LIVE`。
19. 回到 Gallery，悬停 `cheek noise`，获得 `/v1`。
20. 点击 `V1.0`，确认 `Project-Æ V1.0` 页面可见。
21. 点击测试模式按钮 `finish sampling`。
22. 确认结局页可见，并包含 `[End of Connection]`。

## 六、维护要求

后续只要出现以下任一变化，必须更新本文档：

- Gallery 热区位置、热区 label、悬停时长、编码或镜像条件变化。
- Boutique 商品名称、按钮文案、微缩线索或交叉验证门槛变化。
- Devotees 用户状态、确认按钮或签名支线入口变化。
- 终端命令、锁定规则、输出文案或无效输入逻辑变化。
- V1.0 解锁方式、导航显示逻辑或地址处理变化。
- 结局倒计时、权重增量、平局优先级或结局文案变化。
- Playwright 通关测试流程变化。

建议同步检查：

- `apps/Archive1002Ædvent/devdocs/main.md`
- `apps/Archive1002Ædvent/__tests__/game-flow.spec.ts`
- `apps/Archive1002Ædvent/src/App.vue`
- `apps/Archive1002Ædvent/src/components/GalleryView.vue`
- `apps/Archive1002Ædvent/src/components/BoutiqueView.vue`
- `apps/Archive1002Ædvent/src/components/DevoteesView.vue`
- `apps/Archive1002Ædvent/src/data/gameData.ts`
