---
tags:
  - 环境配置
---

# Maven 环境配置

> [!info] 前置条件
> 需要先安装 [[C与C++环境配置|JDK]]（Maven 是纯 Java 工具）。

## 安装

```powershell
scoop install maven
```

## 配置

编辑 `D:\APP\Packs\Scoop\persist\maven\conf\settings.xml`：

**本地仓库**（重定向到 Dev，因为可能需要手动引用 JAR）：

```xml
<localRepository>D:\APP\Miscs\Dev\maven\repository</localRepository>
```

**阿里云镜像**：

```xml
<mirror>
  <id>aliyun</id>
  <mirrorOf>central</mirrorOf>
  <name>Aliyun Maven Mirror</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

## 日常命令

| 命令 | 说明 |
|------|------|
| `mvn compile` | 编译 |
| `mvn test` | 跑测试 |
| `mvn clean package` | 清理并打包 |
| `mvn install` | 装入本地仓库 |
| `mvn dependency:tree` | 依赖树 |

## 验证

```powershell
mvn -v
mvn help:effective-settings | Select-String 'localRepository|aliyun'
```
