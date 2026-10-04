---
tags:
  - 环境配置
---

# Node 环境配置（fnm）

## 安装

```powershell
scoop install fnm
```

## 配置

**国内镜像**（环境变量，写一次永久生效）：

```powershell
[Environment]::SetEnvironmentVariable('FNM_NODE_DIST_MIRROR', 'https://npmmirror.com/mirrors/node/', 'User')
```

**npm 全局包目录**（重定向到 Dev）：

```powershell
npm config set prefix 'D:\APP\Miscs\Dev\npm-global'
```

> [!tip] 缓存不用管
> npm 缓存使用 C: 默认位置，不需要手动配置。

**安装 LTS 版本**：

```powershell
fnm install --lts
fnm default lts-latest
```

## 日常命令

| 命令 | 说明 |
|------|------|
| `fnm list` | 查看已装版本 |
| `fnm install 22` | 装指定版本 |
| `fnm use 22` | 当前终端切换 |
| `echo '22' > .node-version` | 项目锁定版本 |

## 验证

```powershell
node -v; npm -v
npm config get prefix   # D:\APP\Miscs\Dev\npm-global
```
