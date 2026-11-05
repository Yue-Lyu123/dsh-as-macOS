# 市场收录条目（awesome-dsh-plugin PR 用）

分类：**UI Enhancements**

## 英文（README.md，直接续在 UI Enhancements 列表里，按 owner 字母序插入）

```
- [<your-github>/macos-desktop](https://github.com/Yue-Lyu123/dsh-as-macOS) - Turns the DeepSeek Harness Web GUI into a macOS desktop: Sonoma wallpaper, menu bar with clock, magnifying Dock, desktop icons, and draggable windows with traffic lights. Seven apps sit on the desktop and every one is a real thing rather than a mock — 浏览器 drives a real headless Chromium over CDP with multi-tab parallel browsing and working mouse/keyboard input, 代码 embeds the code-workbench panel, Office embeds the editable Univer gateway (so you can type in cells), 笔记 edits the Obsidian vault in `~/Documents`, 访达 browses the workspace with grid/list views and a text preview, 终端 keeps a persistent bash session, 设置 controls wallpaper, light/dark, Dock order and shows a macOS-style About panel. Each window carries a floating assistant orb for per-app questions, and the whole shell is scriptable for agents: host routes under `/api/macos-desktop/*` plus an in-page `window.__macos` control surface let the agent open windows, lay them out and drive the browser while the user watches. Optional companions: dsh-ego-browser (browser app), dsh-code-workbench (代码), dsh-univer-office (Office), dsh-obsidian-notes (笔记).
```

## 中文（README.zh.md 同名分类下）

```
- [<your-github>/macos-desktop](https://github.com/Yue-Lyu123/dsh-as-macOS) - 把 DeepSeek Harness 的 Web GUI 变成一台 macOS：Sonoma 壁纸、带时钟的菜单栏、带放大的程序坞、桌面图标、带红黄绿灯的可拖动窗口。桌面上的七个软件背后都是真家伙而不是贴图——浏览器驱动一个真实的无头 Chromium（CDP 取帧 + 真实鼠标键盘，多标签并行），代码内嵌 code-workbench 面板，Office 内嵌可编辑的 Univer 网关（单元格能直接改），笔记直接编辑 `~/Documents` 的 Obsidian 库，访达以图标/列表视图浏览工作区并预览文本，终端维持一个常驻 bash 会话，设置管理壁纸、深浅色、程序坞顺序并展示一个 macOS 风格的「关于本机」。每个窗口右下角都有一颗精灵球可以做单独提问；整个桌面还能被 agent 驱动：`/api/macos-desktop/*` 路由加上页面内 `window.__macos` 控制面，agent 可以开窗、摆位、操作浏览器，用户全程看得见。可选搭配：dsh-ego-browser（浏览器）、dsh-code-workbench（代码）、dsh-univer-office（Office）、dsh-obsidian-notes（笔记）。
```

## 短描述（市场卡片/搜索结果显示用，~120 字符）

- EN: `A macOS desktop inside DSH: real Chromium browser, editable Univer, Obsidian vault, Finder, terminal, and a Dock — all agent-drivable.`
- ZH: `给 DSH 装一台 macOS 桌面：真浏览器、可编辑 Univer、Obsidian 笔记、访达、终端，全部可被 agent 操作。`
