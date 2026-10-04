---
tags:
  - 环境配置
---

# Starship 环境配置

## 安装

```powershell
scoop install starship
```

## 配置

**应用 Tokyo Night 预设**：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.config" | Out-Null
starship preset tokyo-night -o "$env:USERPROFILE\.config\starship.toml"
```

> [!info] PATH 说明
> Starship 故意不走 shim，直接把 `apps\starship\current` 加入 PATH（性能原因）。

## 字体

图标依赖 Nerd Font，装好后在 Windows Terminal 设置里改字体。

```powershell
scoop bucket add nerd-fonts
scoop install JetBrainsMono-NF
```

## 日常命令

| 命令 | 说明 |
|------|------|
| `starship explain` | 解释当前提示符 |
| `starship timings` | 各模块渲染耗时 |
| `starship preset list` | 查看所有预设 |

## 验证

```powershell
starship --version
starship prompt
```
