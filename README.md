# EZNote

个人笔记 / 数字花园站点。**Obsidian 编辑 → push → GitHub Actions 自动构建 → Pages 上线**，引擎与部署全程云端托管，本地只需 Obsidian。

- 🌐 站点：https://ezzer0.github.io/EZNote/
- 📦 仓库：https://github.com/EZzer0/EZNote

## 目录结构

```
EZNote/
├── content/                 ← Obsidian vault，唯一日常维护区
│   ├── .obsidian/           （插件/主题配置随仓同步，换机免重配；
│   │                         workspace*.json 已 gitignore，不产生噪音提交）
│   ├── index.md             （站点首页）
│   └── **/*.md              （全部笔记）
├── quartz.config.yaml       ← 站点主配置：配色/字体/插件启停（见下方自定义指南）
├── quartz.ts                ← 高级覆写入口（需 JS 回调的插件选项才用得到）
├── runtime/                 ← Quartz 引擎（git submodule，勿手改，见「引擎升级」）
├── eznote/
│   ├── custom.scss          ← 自定义样式（CI 构建时自动拷入引擎，动效/微交互都在这）
│   ├── icon.svg / icon.png  ← 站点图标源文件与 256px 位图（CI 拷入引擎替换默认 favicon）
├── .github/
│   ├── workflows/ci.yml     ← 构建+部署：push main 自动触发，约 1~2 分钟上线
│   ├── workflows/lychee.yml ← 笔记外链死链检查（月度 + push 触发，失败自动开 issue，不阻塞发布）
│   └── dependabot.yml       ← 每周提醒引擎/Actions 更新（PR 形式，合并与否自己定）
├── manual_update.sh         ← 手动拉取引擎更新：bash manual_update.sh
└── README.md                ← 本文件
```

## 日常工作流

1. Obsidian 打开 **`content/` 文件夹**当 vault（双链 `[[...]]`、callout、LaTeX、Mermaid、图谱全部原样渲染到网站）
2. 写笔记
3. 推送到 `main`（三选一）：
   - Obsidian **Git 插件**已配置为：**每 12 小时最多自动 commit+push 一次**（仅 Obsidian 开着时计时，开机自动 pull）；手动随时点插件按钮；游戏等需要安静的时段不会被打扰
   - GitHub Desktop 点两下
   - 命令行 `git push`
4. 等 1~2 分钟，Actions 绿灯后线上生效（https://ezzer0.github.io/EZNote/ ）

> 换机器克隆：`git clone --recursive https://github.com/EZzer0/EZNote.git`（**必须带 `--recursive`**，否则 `runtime/` 为空、构建失败；若忘了补救：`git submodule update --init --recursive`）

## 自定义指南

### 1. 配色 / 字体（零代码，优先用这个）

色板与字体源自同作者的 EzInbox 项目（反复调试定稿），已配好于 `quartz.config.yaml`：

```yaml
configuration:
  theme:
    fontOrigin: local        # 系统字体零下载（字体栈由 eznote/custom.scss 接管）
    colors:
      darkMode:
        light: "#090909"     # 暗色纯黑底
        lightgray: "#242424" # 中性边框
        secondary: "#3077e8" # 主蓝（EzInbox primary）
      # 亮色同源：#fafafa 底 / #3c83f6 主蓝
    typography:
      header: "Segoe UI"
      body: "Segoe UI"
      code: "Cascadia Mono"
```

### 2. 装插件（改 YAML 即可，本地不用装任何环境）

CI 构建时执行 `npx quartz plugin install --from-config`——**只在 `quartz.config.yaml` 的 `plugins:` 列表里加条目，push 后云端自动安装生效**：

```yaml
plugins:
  - source: github:quartz-community/graph    # 关系图谱
    enabled: true
  - source: github:quartz-community/comments # Giscus 评论
    enabled: true
    options:
      repo: EZzer0/EZNote
```

插件目录：https://github.com/quartz-community （40+ 官方插件：graph、search、encrypted-pages、canvas-page 等）。
本地也可以用 CLI 装（会自动改 config）：`npx quartz plugin add github:quartz-community/xxx`（需 Node ≥ 22）。

右栏组件顺序由 `layout.priority` 控制（数字小靠上）：当前 TOC=10 → 反链=50 → 关系图谱=70。

### 3. Obsidian 插件包（21 个，已随仓同步）

`content/.obsidian/plugins/` 随仓库分发，换机克隆即恢复。清单：

| 类别 | 插件 |
| --- | --- |
| 同步 | obsidian-git（12h 自动 + 手动） |
| 外观 | Style Settings、Iconic、Banners |
| 效率 | Commander、QuickAdd、Templater、Homepage、Advanced URI、Calendar、Recent Files、Periodic Notes |
| 整理 | Linter、Tag Wrangler、Better Word Count、Various Complements |
| 知识管理 | Dataview、Kanban、Excalidraw、List Callouts、Force Note View Mode |

启用列表在 `content/.obsidian/community-plugins.json`；核心插件另开了 slash-command、footnotes。

### 4. 自定义 CSS

写入 **`eznote/custom.scss`**（主仓文件，CI 构建时自动拷贝进引擎的 `runtime/quartz/styles/custom.scss`，submodule 保持纯净、升级不丢）。

当前职责：字体栈、目录中性化（hover/当前页胶囊）、顶栏玻璃、页脚/hero/卡片、**正文区样式（callout Obsidian 配色 + 4px 左色条 + 14% 实底、引用纯左线、h2 无下划线）**、滚动条、入场动效。

> [!NOTE]
> 本地预览需手动多拷一次：`cp -f eznote/custom.scss runtime/quartz/styles/custom.scss`

### 5. 引擎升级

- 自动：dependabot 每周开 PR 更新 submodule，Actions 构建绿灯后合并即可
- 手动：`bash manual_update.sh` 后 push

## 本地预览（可选）

需要 Node ≥ 22，仅在想本地看效果时用：

```bash
cp quartz.config.yaml runtime/
cp -f eznote/custom.scss runtime/quartz/styles/custom.scss
cd runtime
npm ci
npx quartz plugin install --from-config
npx quartz build -d ../content --serve   # http://localhost:8080
```

## 迁移历史

- 2026-10-05：视觉体系重做（EzInbox 同源色板 + Segoe UI 系统栈 + 目录中性化当前页背景）；首页「最近更新」迁至 `/updates/` 独立页；favicon 换闪电图标；Obsidian 插件包 21 个；obsidian-git 降频至 12h。同日二次：正文区 Notion 化 + callout Obsidian 配色（左色条/实底）；右栏改 TOC 上、关系图谱下。
- 2026-10-04：由双仓结构（`EZzer0/quartz-notes` 站点仓 + 本地 vault + sync-notes.ps1 同步脚本）合并迁移而来，16 篇笔记全部并入 `content/`，旧仓已归档删除。
