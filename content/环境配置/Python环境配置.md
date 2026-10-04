---
tags:
  - 环境配置
---

# Python 环境配置（uv）

## 安装

```powershell
scoop install uv
```

## 配置

**安装解释器**：

```powershell
uv python install 3.13 --default
```

> [!tip] 缓存不用管
> uv 缓存使用 C: 默认位置，不需要手动配置。

## 日常命令

| 命令 | 说明 |
|------|------|
| `uv init` | 新项目 |
| `uv add requests` | 加依赖 |
| `uv remove requests` | 移除依赖 |
| `uv sync` | 还原环境 |
| `uv run python main.py` | 在项目环境内执行 |
| `uvx ruff check .` | 临时跑工具 |

## 验证

```powershell
python --version
(Get-Command python).Source
```
