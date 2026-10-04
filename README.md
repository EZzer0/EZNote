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
   - Obsidian 装 **Git 插件**（Vinzent03/obsidian-git），可设定时自动 commit-and-push
   - GitHub Desktop 点两下
   - 命令行 `git push`
4. 等 1~2 分钟，Actions 绿灯后线上生效（https://ezzer0.github.io/EZNote/ ）

> 换机器克隆：`git clone --recursive https://github.com/EZzer0/EZNote.git`（**必须带 `--recursive`**，否则 `runtime/` 为空、构建失败；若忘了补救：`git submodule update --init --recursive`）

## 自定义指南

### 1. 配色 / 字体（零代码，优先用这个）

改 `quartz.config.yaml`：

```yaml
configuration:
  theme:
    colors:
      light: "#ffffff"      # 页面背景
      secondary: "#1a73e8"  # 链接色
      highlight: "#e8f0fe"  # 内链高亮背景
      # ... 完整色板见 Quartz 官方 Configuration 文档
    typography:
      header: "Noto Sans SC"   # 标题字体（中文推荐 Noto Sans SC / 霞鹜文楷）
      body: "Noto Serif SC"
      code: "JetBrains Mono"
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

### 3. 自定义 CSS

写入 `runtime/quartz/styles/custom.scss`（编译入口：`runtime/quartz/plugins/emitters/componentResources.ts`）。

> [!WARNING]
> `runtime/` 是 submodule，**引擎升级会覆盖此文件**。两种策略：
> - **轻度改动**：直接改，升级被覆盖时从 git 历史找回（`cd runtime && git log -p quartz/styles/custom.scss`）
> - **长期维护**：fork `jackyzha0/quartz`，把 submodule 指向自己的 fork，在 fork 内维护 custom.scss，再手动 merge 上游更新（`git remote add upstream https://github.com/jackyzha0/quartz.git && git merge upstream/v5`）

### 4. 引擎升级

- 自动：dependabot 每周开 PR 更新 submodule，Actions 构建绿灯后合并即可
- 手动：`bash manual_update.sh` 后 push

## 本地预览（可选）

需要 Node ≥ 22，仅在想本地看效果时用：

```bash
cp quartz.config.yaml runtime/
cd runtime
npm ci
npx quartz plugin install --from-config
npx quartz build -d ../content --serve   # http://localhost:8080
```

## 迁移历史

- 2026-10-04：由双仓结构（`EZzer0/quartz-notes` 站点仓 + 本地 `D:\BPP\EZNote` vault + sync-notes.ps1 同步脚本）合并迁移而来，16 篇笔记全部并入 `content/`，旧仓已归档删除。
- 本地 `D:\BPP\EZNote` 为迁移前原 vault（观察期保留，**请勿再在其中编辑**，以本仓 `content/` 为准）。
