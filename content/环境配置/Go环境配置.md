---
tags:
  - 环境配置
---

# Go 环境配置

## 安装

```powershell
scoop install go
```

## 配置

**环境变量**（先设再装，安装器会自动把 `$GOPATH\bin` 写入 PATH）：

```powershell
[Environment]::SetEnvironmentVariable('GOPATH', 'D:\APP\Miscs\Dev\go', 'User')
[Environment]::SetEnvironmentVariable('GOPROXY', 'https://goproxy.cn,direct', 'User')
```

> [!tip] 缓存不用管
> Go 缓存使用 C: 默认位置（`%LocalAppData%\go-build`），不需要手动配置。

**关闭遥测**：

```powershell
go telemetry off
```

## 日常命令

| 命令 | 说明 |
|------|------|
| `go mod init` | 初始化模块 |
| `go get pkg@v1` | 加依赖 |
| `go mod tidy` | 整理依赖 |
| `go build ./...` | 编译 |
| `go run main.go` | 运行 |
| `go test ./...` | 跑测试 |
| `go install` | 编译并装到 `$GOPATH\bin` |

## 验证

```powershell
go version
go env GOPATH GOPROXY
```
