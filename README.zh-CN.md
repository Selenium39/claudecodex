# ClaudeCodeX

一个用于切换 Claude Code 和 Codex API 提供商的菜单栏应用程序。

## 简介

ClaudeCodeX 是一个轻量级的菜单栏应用，旨在帮助用户方便地切换和管理 AI 编程助手的 API 提供商，包括 Claude Code 和 Codex。

## 功能特性

- 🔄 快速切换 AI 编程助手 API 提供商（Claude Code、Codex）
- 🎨 简洁的菜单栏界面
- ⚙️ 配置文件管理

## 截图

![ClaudeCodeX 截图](https://storage.like.do/2026/01/13/claudecodex_1768296644447_5drg587pukk.png)

## 安装

### 从发布版本安装

下载最新的发布版本并安装：

1. 前往 [Releases](https://github.com/selenium39/ClaudeCodeX/releases) 页面
2. 下载适合您操作系统的安装包
   - **macOS**: `.dmg` 或 `.zip` 文件
   - **Windows**: `.exe` 安装程序或便携版
   - **Linux**: `.AppImage` 或 `.deb` 文件

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/selenium39/ClaudeCodeX.git
cd ClaudeCodeX

# 安装依赖
pnpm install

# 开发模式运行
pnpm run devx

# 构建应用
pnpm run build:all
```

## 常见问题

### macOS 提示"应用已损坏，无法打开"？

由于 macOS 的安全机制，非 App Store 下载的应用可能会触发此提示。您可以在终端中运行以下命令快速修复：

```bash
sudo xattr -rd com.apple.quarantine "/Applications/ClaudeCodeX.app"
```

## 使用方法

1. 启动 ClaudeCodeX 应用
2. 点击菜单栏图标打开设置面板
3. 添加或选择您的 API 提供商配置
4. 保存配置，应用将自动切换到新的提供商

## 配置文件

ClaudeCodeX 的配置文件位于：

- **macOS**: `~/Library/Application Support/ClaudeCodeX/config.json`
- **Windows**: `%APPDATA%/ClaudeCodeX/config.json`
- **Linux**: `~/.config/ClaudeCodeX/config.json`

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run devx

# 仅构建渲染进程
pnpm run build

# 仅构建主进程
pnpm run build:electron

# 构建所有平台
pnpm run build:all

# 构建特定平台
pnpm run build:mac    # macOS
pnpm run build:win    # Windows
pnpm run build:linux  # Linux
```

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **React** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 前端构建工具

## 许可证

本项目采用 [MIT License](LICENSE) 开源。

## 作者

Selenium39 <selenium39@qq.com>

## 贡献

欢迎提交 Issue 和 Pull Request！

## 致谢

- [Claude Code](https://code.anthropic.com) - Anthropic 出品的 AI 编程助手
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用开发框架
- [ChatTempMail](https://chat-tempmail.com) - AI驱动的临时邮箱服务
