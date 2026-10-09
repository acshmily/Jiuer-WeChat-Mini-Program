# AGENT.md — 咎儿助手

供在本仓库工作的 AI agent 使用的简报。改动以本地优先、人设一致、视觉贴合品牌为准。

## 产品

**咎儿助手** — 离线个人工具：做决定、拆解选项、记录策略笔记。

- 人设：咎儿 / Togame（刀语）奇策士语气 — 「本官」、傲、算计、短句刺穿 + 戏剧化局势研判。气质致敬，文案产品原创。
- 纯本地：`wx.setStorageSync` / `wx.getStorageSync`。当前产品面无后端、登录、JWT、HTTP 客户端。
- 文案：中文 UI，咎儿口吻。只用自写台词 — **不要**粘贴番剧 / 轻小说 / 漫画原台词、口头禅或官方口号。
- 美术：无官方角色立绘 / 授权素材。

## 技术栈

| 项 | 值 |
|------|--------|
| 平台 | 微信原生小程序（WXML / WXSS / JS） |
| AppID | `wxbd933efb20d2fe9c` |
| 入口 | `app.js`（空 `App({})`）、`app.json`、`app.wxss` |
| 基础库 | `project.config.json` → `libVersion` ~3.17.x |
| 导航栏 | 无 `tabBar`。页内 `tg-nav` / `navigator` 链接 |

## 页面与流程

在 `app.json` 中注册（顺序 = 首页在前）：

1. `pages/decisions/index` — 表单：主题 + ≥2 个选项 → `decisionStore.add` → 跳转结果页
2. `pages/decisions/result` — 排名分数、条形动画、重掷（`seed++`）、咎儿台词；Canvas 2D 定论海报（分享好友 / 保存相册 / 朋友圈菜单）。好友打开落地 **`/pages/decisions/index`**（本地 `decisionHistory`，对方看不到同一局；定论写进海报图与分享标题）。
3. `pages/decisions/history` — 列表 / 打开 / 删除历史决定
4. `pages/dissect/index` — 各路径利弊 → 规则型短评 → 可选交接去决定
5. `pages/notes/index` — 策略笔记列表
6. `pages/notes/edit` — 新建 / 编辑笔记（标签：人 / 局 / 险）

### 交接：`pendingDecisionDraft`

- 拆解页 `sendToDecide` 将 JSON `{ subject, options: string[] }` 写入存储键 **`pendingDecisionDraft`**，再 `navigateBack` 或 `reLaunch` → `/pages/decisions/index`。
- 决定页 `onShow` 读取该键、预填表单，然后 **`removeStorageSync`**。

### 存储键

| 键 | 模块 | 上限 | 结构（摘要） |
|-----|--------|-----|-----------------|
| `decisionHistory` | `utils/decisionStore.js` | 30 | `{ id, subject, seed, createdAt, items:[{option,score}] }` |
| `strategyNotes` | `utils/noteStore.js` | 50 | `{ id, body, tag, createdAt, updatedAt }` |
| `pendingDecisionDraft` | 临时 | 1 | `{ subject, options }` |

## 关键工具

- **`utils/decisionStore.js`** — `add` / `get` / `list` / `reroll` / `remove` / `topOption`
- **`utils/noteStore.js`** — `list` / `get` / `add` / `update` / `remove`；`TAGS = ['人','局','险']`
- **`utils/dealOptionsUntils.js`** — 以 seed 的 CRC32 权重 → 分数合计 100（`scoreOptions(subject, options, seed)`）。相同主题 + 选项顺序 + seed ⇒ 相同百分比。展示用 `rankByScore`。
- **`utils/togameVoice.js`** — 句库：`DAILY_LINES`（`dailyLine` 按日期稳定）、`RESULT_LINES` / `REROLL_LINES`、`DISSECT_INTROS` / `DISSECT_TEMPLATES`（及利弊偏斜分支池）、空态 / 校验 / 抹去确认文案；分享：`shareTitle`、落印 / 相册授权 toast。`asVoice` 轻裹「」。优先用 voice 导出，勿在页面硬编码人设句。
- **`utils/sharePoster.js`** — Canvas 2D 绘制定论海报（冰墨朱红 token 硬编码）并 `exportTempPath`；竖版约 750×1334。
- **`utils/util.js`** — 时间戳用 `formatTime`

## UI 体系（刀语扁平）

Token 写在 `app.wxss` 的 `page` 上：

- `--tg-bg: #F4F6F8`（冷白）
- `--tg-ink: #12151C`
- `--tg-muted: #5A6573`
- `--tg-primary: #3A6F8F`（冰蓝）
- `--tg-accent: #A83232`（朱红）
- `--tg-surface`、`--tg-panel-alt`、硬边 `--tg-line` / 软边 `--tg-line-soft`
- `--tg-radius: 3px`、`--tg-stroke: 1.5px`

页面骨架用 **`tg-*` 类**（`.tg-page`、`.tg-brow`、`.tg-brand`、`.tg-aside`、`.tg-daily`、`.tg-primary-btn`、`.tg-ghost-btn`、`.tg-verdict`、`.tg-rank*`、`.tg-path-card*` 等）。扁平 / 硬边 / 舞台斜向色块 — 不是软圆 WeUI 卡片。

- **不要**在活跃页面为骨架重新引入 WeUI。
- `app.json` 中窗口栏颜色与 `--tg-bg` 一致。

## 已移除（勿随意复活）

工作区 / 转型已丢弃服务端时代及无关模块：

- 密码工具（`pages/passwordTools`、`utils/passwordUntil.js`）
- Lo裙 / Infanta 图鉴（`pages/infanta/*`）
- 登录 / JWT / HTTP（`utils/jwtUntil.js`、`utils/httpUntil.js`、旧 `pages/index` 登录）
- 杂项演示（`pages/logs`、`pages/native`）
- 2026-10-09 清理：`weui.wxss`、`utils/stringUntils.js` 空桩、`images/native/*` 旧素材、`dealOptionsUntils.js` 中无引用的 `objectArraySort` / `randomEmoji` / `makeCRCTable` 导出

若这些文件仍以已删但磁盘残留形式出现，以 **`app.json` 页面列表** 为事实来源。无明确产品需求不要重新接入。

## 约定

- 中文文案用咎儿口吻；扩展台词只改 `togameVoice.js`（气质致敬《刀语》咎儿，文案原创）。
- 只用自写文案（无官方刀语台词 / 口头禅 / 立绘）。
- 优先链接导航，勿新增 `tabBar`。
- 勿提交 `project.private.config.json`（本地 IDE / 私有设置）。仅在有意时提交公开的 `project.config.json` AppID/设置。
- 评分通过 CRC32 seed 保持确定性；无产品意图勿把决定百分比换成「真随机」。
- 匹配现有 JS 风格（CommonJS `require` / `module.exports`、`var` + 经典 `Page` 处理器）。
- **新需求必须开功能分支开发**；发布步骤见「发布与分支流程」。勿在 `master` / `main` 上直接堆改动。

## 发布与分支流程

主分支目标为 **`main`**。若远端目前仍只有 `master`：PR 先打到 `master`，并尽快把默认分支统一为 `main`（可从当前默认分支创建 `main` 后改默认）。**禁止**在 `master` / `main` 上直接堆需求改动。

每次开发与发布按下列顺序执行（不得跳步）：

1. **开分支** — 从最新主分支拉出功能分支（如 `fix/…`、`feat/…`），在分支上开发。
2. **冒烟 + 回归** — 发布前必须验证通过后再继续。最低覆盖：表单 → 定论 → 历史；拆解 → 草稿交接；笔记 CRUD；若改了分享，再验定论分享/保存图。可用微信开发者工具或 `user-weapp-devtools` MCP。
3. **commit** — 验证通过后 `git commit`；message 写清**本次更新内容与原因**（中文或英文均可，但要具体）。勿提交 `project.private.config.json` / 密钥。
4. **push 分支** — `git push -u origin HEAD`（或等价）推远程功能分支。
5. **开 PR 到 main** — 用 `gh pr create`（或网页）将功能分支合入 `main`。若仓库尚无 `main`、默认仍是 `master`：本次 PR 目标写 `master`，并在 PR/AGENT 中注明待统一为 `main`。`gh auth` 失效时先完成 push，再提示执行 `gh auth refresh -h github.com` 后补开 PR。
6. **上传微信** — 用开发者工具 CLI 打包上传为体验版/正式待审更新，**版本号与描述与本次更新一致**（格式 `YY.MM.DD.HH.MM`，如 `26.10.02.09.30`）：

```bash
"/Applications/wechatwebdevtools.app/Contents/MacOS/cli" upload \
  --project "/Users/r2d2/IdeaProjects/homework-score/Jiuer-WeChat-Mini-Program" \
  -v "YY.MM.DD.HH.MM" \
  -d "更新说明（与 commit/PR 一致）" \
  -i "/tmp/wechat-upload/upload-info.json" \
  --lang zh
```

7. **保留版本发布分支（正式发布必做）** — 每次正式上传后，在 git 上从本次发布提交打出并 **push** 同名分支，作为可追溯快照。分支名与微信上传版本号对齐，点分隔年月日时分，例如：`26.10.02.09.30`。

```bash
VER="26.10.02.09.30"   # 与 -v 一致
git branch "$VER"      # 指向本次发布提交
git push -u origin "$VER"
```

勿删远端版本分支；功能分支（`fix/…`）可按需合并后清理，版本分支长期保留。

上传成功后在下方「版本与 git」登记版本号、版本分支名与说明。

## 版本与 git

- 里程碑上传：**26.10.01.1156**
- 同版本复传（优化）：**26.10.01.1156** — 描述「优化：定论分享海报/结果页/抹去动效」
- **26.10.02.09.31** — 分支 `26.10.02.09.31`；修复可走之路输入焦点跳转（`wx:key=index`）；固化「发布与分支流程」（含正式版版本分支）
- 远端已建 **`main`**（自 `master` 同步起点）；默认分支仍可能是 `master`，尽快在 GitHub 改为 `main`
- 近期方向（见 `git log`）：本地决定 / 拆解 / 笔记 + 刀语扁平 UI（`7f688c8` 及后续）。更早提交属密码 / Lo裙 / HTTP 时代 — 仅作历史。

## 如何运行

1. 打开 **微信开发者工具** → 导入 / 打开本项目路径（含 `project.config.json` 的目录）。
2. 模拟器使用 `project.config.json` 中的 AppID `wxbd933efb20d2fe9c`。
3. 若可用 **user-weapp-devtools** MCP：用本 `projectPath` 调用 `mp_ensureConnection`，再导航 / 截图 / evaluate。优先 `mp_ensureConnection`，勿手动 CLI open/quit。

## 要做

- 保持离线优先；仅通过上述存储键持久化（或在此文档登记新键）。
- 复用 `tg-*` token/类；朱红强调少用（裁决、危险、每日标签）。
- 新 UX 走决定 / 拆解 / 笔记，除非产品有意扩展。
- 跨页共享的人设字符串放进 `togameVoice.js`。
- UI 改动后按「发布与分支流程」做冒烟 / 回归：表单 → 结果 → 历史、拆解 → 草稿交接、笔记 CRUD。

## 不要

- 勿为这些功能加后端、登录墙或远程同步。
- 勿粘贴受版权保护的刀语台词或上架官方立绘。
- 无明确需求勿重新加入 WeUI 骨架、密码工具或 Infanta。
- 勿随意加 `tabBar` 或额外首页仪表盘稀释入口表单。
- 勿提交密钥或本地 IDE 私有配置。
- 勿破坏 seed 评分稳定性（相同输入 + seed 必须一致）。
- 勿在 UI 捏造英文营销腔；保持军师中文。
