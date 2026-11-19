<div align="center">

<img src="assets/icon.svg" width="96" height="96" alt="best-agents-md">

# best-agents-md

**All you need for general coding in AGENTS.md.**

[English](README.md) | 简体中文

</div>

## 简介

best-agents-md 是一份放进 `AGENTS.md` 的简短代码规范，让 Agent 写出的代码更少、更干净、测试更有价值。包含通用代码规范、测试标准、Bug 修复流程和验证习惯，适用于任何编程语言，以及任何读取 `AGENTS.md` 的 Agent（Codex、Claude Code 等）。

请将项目特有的信息（如构建与测试命令、架构边界、本地约定等）写在托管区块之外，让本规范专注于跨项目通用的工程行为。

我们致力于成为最短但能发挥最大作用的代码开发提示词，并跟着模型更新和社区反馈不断进化，确保符合最新的最佳实践。

## 使用

### 1. 通过 CLI 写入 `AGENTS.md`

在项目目录中运行（需要 Node.js 18 或更高版本）：

```sh
npx best-agents-md
```

它会把规范以带标记的区块写入 `AGENTS.md`，不改动文件中的其他内容。再次运行即可更新到最新版本。

### 2. 手动复制到 `AGENTS.md`

直接将 [AGENTS.md](AGENTS.md) 手动复制到项目的 `AGENTS.md` 中。

### 3. 以 Skill 形式安装

使用 [skills](https://skills.sh) CLI 安装：

```sh
npx skills add VinkyDev/best-agents-md
```

## 阅读规范

- [AGENTS.md](AGENTS.md)：供 Agent 读取的英文规范
- [AGENTS.zh.md](AGENTS.zh.md)：供阅读的中文译文
- [skills/coding-standard/SKILL.md](skills/coding-standard/SKILL.md)：供 `skills` CLI 安装的 Agent Skill 文件

## 参与贡献

欢迎提交 Issue 和 Pull Request。好的提议应说明它修正了 Agent 的哪种行为，并保持规范简短。

## 许可证

[MIT](LICENSE)
