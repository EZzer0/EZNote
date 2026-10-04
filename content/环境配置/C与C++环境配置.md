---
tags:
  - 环境配置
---

# C 与 C++ 环境配置

## 安装

**Build Tools**（管理员窗口）：

```powershell
winget install Microsoft.VisualStudio.BuildTools
```

**构建工具**（普通窗口）：

```powershell
scoop install cmake ninja vcpkg
```

## 日常命令

> [!warning] 编译前必须先进 MSVC 环境
> PowerShell profile 里已配置 `Enter-MSVC` 函数。

```powershell
Enter-MSVC                          # 必须最先执行
cmake -G Ninja -B build -S .        # 配置
cmake --build build                 # 编译
.\build\demo.exe                    # 运行
```

## 验证

```powershell
cl; cmake --version; ninja --version; vcpkg version
```
