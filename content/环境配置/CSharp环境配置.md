---
tags:
  - 环境配置
---

# C# 环境配置（dotnet SDK）

> [!info] 当前版本
> 已安装：SDK **10.0.400**（含 Roslyn 编译器 + MSBuild）

## 日常命令

| 命令 | 说明 |
|------|------|
| `dotnet new console -o demo` | 新项目 |
| `dotnet add package Newtonsoft.Json` | 加 NuGet 包 |
| `dotnet build` | 编译 |
| `dotnet run` | 运行 |
| `dotnet watch run` | 热重启 |
| `dotnet test` | 跑测试 |
| `dotnet publish -c Release` | 发布 |

> [!tip] 缓存不用管
> NuGet 包缓存使用 C: 默认位置，不需要手动配置。

## 验证

```powershell
dotnet --version
dotnet --info
```
