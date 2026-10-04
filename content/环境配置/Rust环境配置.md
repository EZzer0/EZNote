---
tags:
  - 环境配置
---

# Rust 环境配置

> [!info] 前置条件
> 需要先完成 [[C与C++环境配置]]（msvc 目标需要 link.exe）。

## 安装

```powershell
scoop install rustup
```

## 日常命令

| 命令 | 说明 |
|------|------|
| `cargo new demo` | 新项目 |
| `cargo add serde` | 加依赖 |
| `cargo build --release` | 编译 |
| `cargo run` | 运行 |
| `cargo check` | 只查错不产码（最快） |
| `cargo test` | 跑测试 |
| `cargo fmt` | 格式化 |
| `cargo clippy` | lint |

## 验证

```powershell
rustc -V
cargo --version
```
