# 融资版文案（标题 + 叙述）

## 0. 电梯陈述（30 秒，自己念一遍）

> 人们以为 AI 的下一步是更聪明的对话框。我们的判断相反：**下一步是把它要操作的那台电脑还给用户。**
> 我们把 DeepSeek Harness 变成了一个 macOS —— 桌面上七个软件全是真插件：浏览器是真 Chromium，Office 是能改单元格的 Univer，笔记是你自己的 Obsidian 库。agent 不在旁边看着，它**住在这台机器里**：开窗、操作浏览器、往你正在读的那页里写字。
> 一句话：**我们不卖助手，我们卖 agent 的工位。**

---

## 1. 标题候选（挑一个当主标题）

| # | 标题 | 适合 |
|---|---|---|
| 1 | **Agent OS：把 AI 从对话框里放出来** | 最像发布会主视觉 |
| 2 | **We don't sell an assistant. We sell the desktop it works on.** | 最像路演开场 |
| 3 | **Your agent needs a desk, not a chat box.** | 最短、最好记 |
| 4 | **同一台机器，同一个上下文** | 中文语境最顺 |
| 5 | **The GUI was the missing product** | 给技术型投资人 |

主标题建议：**Agent OS**，副标题：**把 AI 从对话框里放出来 —— 一台可以被 AI 操作的 Mac 桌面**。

---

## 2. 三幕叙述（README 首屏 / 路演开场都用这个）

**第一幕 · 问题**
今天的 agent 很能干，但它没有工位。它在一列消息里工作，输出是一段文字，人再手动搬到真正的软件里。每一次"复制—粘贴"都是一次信任损耗。

**第二幕 · 转向**
我们做了相反的选择：不做一个更好的聊天框，而是**造一台电脑**。壁纸、菜单栏、程序坞、可拖动的窗口——以及七个真的软件。浏览器打开的是真网页，Office 打开的是真文档，笔记打开的是你 `~/Documents` 里那个 vault。

**第三幕 · 结果**
agent 住在这台机器里。它在自己的标签页里搜资料，把结论写进你正在读的那篇笔记，再往你开着的演示文稿里加一页。你全程看得见，但**它从不抢你的鼠标**。
这就是 Agent OS：不是更强的助手，是**助手终于有了桌面**。

---

## 3. 市场卡片描述（英文，投资人语气 + 可核实事实）

```
- [Yue-Lyu123/dsh-as-macOS](https://github.com/Yue-Lyu123/dsh-as-macOS) - Agent OS for DeepSeek Harness: the Web GUI becomes a real macOS desktop — Sonoma wallpaper, menu bar with a live clock, magnifying Dock, draggable windows with traffic lights — and the seven apps on it are not mock-ups. The browser is a real headless Chromium driven over CDP (parallel tabs, real mouse and keyboard, your logins intact). Office is the editable Univer gateway, so a cell you click is a cell that changes. Notes is your own Obsidian vault in ~/Documents. Finder is your workspace, Terminal is a persistent bash, Settings controls wallpaper, theme and Dock order. The agent is not a sidebar watching you: it opens windows, browses in its own tabs, writes into the note you are reading and adds the slide to the deck you have open, while the desktop stays scriptable through /api/macos-desktop/* and an in-page window.__macos surface. You keep the mouse; the agent keeps its own desk.
```

## 4. 中文卡片描述

```
- [Yue-Lyu123/dsh-as-macOS](https://github.com/Yue-Lyu123/dsh-as-macOS) - 给 DeepSeek Harness 装上 Agent OS：Web GUI 变成一台真正的 macOS 桌面——Sonoma 壁纸、带实时时钟的菜单栏、可放大的程序坞、带红黄绿灯的可拖动窗口——桌面上那七个软件都不是贴图。浏览器是真实的无头 Chromium（CDP 取帧、真实鼠标键盘、多标签并行、登录态照旧），Office 是可编辑的 Univer 网关（点哪个格就改哪个格），笔记直接读写你 `~/Documents` 里的 Obsidian 库，访达浏览工作区，终端维持常驻 bash，设置管壁纸、深浅色和程序坞顺序。agent 不是侧边栏里的旁观者：它自己开窗、在自己的标签里查资料、往你正在读的那篇笔记里写字、给你开着的演示文稿加一页；整个桌面通过 `/api/macos-desktop/*` 与页面内 `window.__macos` 对 agent 开放。鼠标留给你，工位归它。
```

---

## 5. README 首屏（替换现有开头）

```markdown
# Agent OS — a real Mac desktop for your agent

> **We don't sell an assistant. We sell the desktop it works on.**

Your agent can write code, but it has nowhere to *work*. Every task ends the same
way: it prints text, you copy it into the app that actually does the job.

So we stopped building a better chat box and built the machine instead.

Open one tab and the Harness Web GUI becomes a Mac — wallpaper, menu bar, Dock,
seven apps. They are not mock-ups: the browser is a real Chromium, Office is a
real Univer you can type into, Notes is your own Obsidian vault, Finder is your
workspace, Terminal is a real shell.

The agent lives on that machine. It opens windows, browses in its own tabs,
writes into the page you are reading, drops a slide into the deck you have open.
You watch it happen. **It never takes the mouse from you.**

**You keep the desk. It keeps the work.**
```

---

## 6. 给投资人的三条“可验证 traction”（不吹牛版）

1. **真的能被 agent 操作**：`macos-browser` CLI 与 `window.__macos` 控制面已在真机跑通（开 3 个标签 ≈4 秒，读 3 页 ≈2 秒）。
2. **真的是同一份数据**：agent 写的 `.md` 就是笔记窗口里那篇；agent 改的单元格就是你屏幕上那一格；没有“导出/导入”环节。
3. **真的是插件**：单个 `dsh plugin add` 安装，不 fork Harness、不改宿主、不打包 Electron。

一句收束：**别人做 agent 的能力，我们做 agent 的工作环境——而工作环境，是用户每天都得打开的那个东西。**
