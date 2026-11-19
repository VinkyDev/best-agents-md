<div align="center">

<img src="assets/icon.svg" width="96" height="96" alt="best-agents-md">

# best-agents-md

**All you need for general coding in AGENTS.md.**

English | [简体中文](README.zh-CN.md)

</div>

## About

best-agents-md is a short coding standard for your `AGENTS.md` that helps agents write less code, cleaner code, and more valuable tests. It covers general coding rules, testing standards, a bug-fix workflow, and verification habits, and works with any language and any agent that reads `AGENTS.md`, such as Codex and Claude Code.

Keep project-specific details—such as build and test commands, architectural boundaries, and local conventions—outside the managed block so this standard stays focused on general engineering behavior.

We aim to be the shortest coding prompt with the biggest impact, and to keep evolving with new models and community feedback so it always reflects current best practices.

## Usage

Run this in your project directory with Node.js 18 or later:

```sh
npx best-agents-md
```

It adds the standard to `AGENTS.md` in a marked block and leaves the rest of the file untouched. Run it again to update to the latest version.

You can also copy [AGENTS.md](AGENTS.md) into your project by hand.

## Read the standard

- [AGENTS.md](AGENTS.md): the English standard that agents read
- [AGENTS.zh.md](AGENTS.zh.md): a Chinese translation for readers

## Contributing

Issues and pull requests are welcome. A good proposal names the agent behavior it fixes and keeps the standard short.

## License

[MIT](LICENSE)
