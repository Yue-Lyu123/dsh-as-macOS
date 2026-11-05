# 插件主页 / npm 简介文案

## package.json description（一行，npm 与市场卡片都会用）

```
macOS desktop for the DeepSeek Harness Web GUI — wallpaper, menu bar, Dock and real app windows: a real Chromium browser, editable Univer, your Obsidian vault, Finder, a persistent terminal, all drivable by the agent.
```

## README 开头（替代现在的第一段，三行抓住人）

```markdown
# macOS Desktop for DeepSeek Harness

> **What if your agent's UI was a computer, not a chat box?**

Open one tab and the Harness Web GUI becomes a Mac: wallpaper, menu bar with a
live clock, a magnifying Dock, desktop icons — and seven apps you can actually
use. The browser is a real Chromium (search, click, log in). Office is a real
Univer you can type into. Notes is your Obsidian vault. Finder is your
workspace. Terminal is a real shell. Settings is where the wallpaper and the
Dock order live.

The agent is not watching over your shoulder — **it lives on the same desktop**.
It opens windows, drives the browser in its own tabs, writes into the note
you're reading, and drops a new slide into the deck you have open. You see it
happen; it never takes the mouse from you.
```

## 三张必放的截图（放 README 顶部）

1. `evidence/200-desktop-clean.png` —— 干净桌面（壁纸 + 菜单栏 + 7 图标 + Dock）
2. `evidence/214-stack-v3.png` —— 三层叠放（浏览器 / 笔记+PPT / 访达），最像“一台电脑”
3. `evidence/173-office.png` —— 真 Univer 可编辑（证明不是贴图）

## 顶部一段「它到底真在哪」（审核看得最重）

```markdown
### What is real

| App | Behind the window | Agent can |
|---|---|---|
| 浏览器 | headless Chromium over CDP (frames + real input) | open tabs, navigate, read text, click, type |
| 代码 | dsh-code-workbench panel | read/edit workspace files |
| Office | Univer gateway `/univer-api/state` → 9080 (editable) | read cells, write cells, add slides |
| 笔记 | plain Markdown in your Obsidian vault | read, append, create notes |
| 访达 | `/api/macos-desktop/files` listing | list, read, write |
| 终端 | persistent bash (`/api/macos-terminal/session`) | run commands |
| 设置 | localStorage + `/api/macos-desktop/system` | change theme, dock order |
```
