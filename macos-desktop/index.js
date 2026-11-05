// Host half of the macOS desktop shell.
//
// The desktop, the window manager and every app icon live in the Client module. This half only
// exists because ego-lite (the agent browser) shows ONE task space per backend, and its profile is
// the very page the desktop runs in: a desktop that displays that space would display itself.
//
// So the browser app gets its own backend: a second ego-lite Chromium under a separate user-data
// directory, started headful when the desktop asks for it. Its spaces are exposed under
// /api/macos-ego/* and the client floats the native ego panel on top of them (the panel binds to
// whichever backend the page is served from).
import { spawn, execFile } from 'node:child_process';
import { request as httpRequest } from 'node:http';
import { readdir, stat, writeFile, chmod, readFile, mkdir } from 'node:fs/promises';
import { join, resolve, relative, sep, dirname } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

export const name = 'macos-desktop';

const DESKTOP = {
  files: '/api/macos-desktop/files',
  read: '/api/macos-desktop/read',
  exec: '/api/macos-terminal/exec',
  shell: '/api/macos-terminal/session',
  system: '/api/macos-desktop/system',
  write: '/api/macos-desktop/write',
  univer: '/api/macos-desktop/univer',
  apps: '/api/macos-desktop/apps',
  assist: '/api/macos-desktop/assist',
  open: '/api/macos-desktop/open',
  live: '/api/macos-desktop/live',
  invoke: '/api/macos-desktop/invoke',
  ego: '/api/macos-desktop/ego',
  window: '/api/macos-desktop/window',
  frame: '/api/macos-desktop/frame',
};

// ---- the shell's own ego browser, driven over CDP -------------------------------------------
// The desktop's browser window is a real browser: tabs, address bar, back/reload. ego's Chromium
// already runs for the agent, so the window drives THAT instance (no second Chromium, one set of
// logins) through a tiny CDP bridge. HTTP is used for target listing; one short WebSocket per
// command covers the rest.
const EGO_STATE = () => process.env.EGO_LINUX_STATE_DIR || join(homedir(), '.local/state/ego-lite-linux');

function egoCdpPort() {
  try {
    const raw = readFileSync(join(EGO_STATE(), 'browser.json'), 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && Number.isInteger(parsed.port) && parsed.port > 0) return parsed.port;
  } catch { /* not running */ }
  return 0;
}

function cdpHttp(port, method, path) {
  return new Promise((done) => {
    const req = httpRequest({ host: '127.0.0.1', port, path, method, agent: false, headers: { connection: 'close' } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        try { done({ ok: res.statusCode < 400, status: res.statusCode, body: JSON.parse(text) }); } catch { done({ ok: res.statusCode < 400, status: res.statusCode, body: text }); }
      });
    });
    req.on('error', (error) => done({ ok: false, error: String(error && error.message) }));
    req.setTimeout(8000, () => { req.destroy(); done({ ok: false, error: 'cdp timeout' }); });
    req.end();
  });
}

async function cdpCommand(port, targetId, method, params) {
  const { WebSocket } = await import('ws');
  let wsUrl = '';
  const listed = await cdpHttp(port, 'GET', '/json/list');
  if (Array.isArray(listed.body)) {
    const hit = listed.body.find((t) => t.id === targetId);
    if (hit) wsUrl = hit.webSocketDebuggerUrl;
  }
  if (!wsUrl) return { ok: false, error: 'target not found' };
  return new Promise((done) => {
    let settled = false;
    const socket = new WebSocket(wsUrl);
    const finish = (value) => { if (settled) return; settled = true; try { socket.close(); } catch { /* ignore */ } done(value); };
    socket.on('open', () => socket.send(JSON.stringify({ id: 1, method, params: params || {} })));
    socket.on('message', (raw) => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg.id === 1) finish(msg.error ? { ok: false, error: msg.error.message || 'cdp error' } : { ok: true, result: msg.result || {} });
      } catch { /* ignore other events */ }
    });
    socket.on('error', (error) => finish({ ok: false, error: String(error && error.message) }));
    socket.on('close', () => finish({ ok: false, error: 'cdp closed' }));
    setTimeout(() => finish({ ok: false, error: 'cdp timeout' }), 8000);
  });
}

async function egoOp(op, payload) {
  const port = egoCdpPort();
  if (!port) return { ok: false, error: 'the ego browser is not running' };
  const target = payload && payload.targetId ? String(payload.targetId) : '';
  if (op === 'tabs') {
    const listed = await cdpHttp(port, 'GET', '/json/list');
    const tabs = (Array.isArray(listed.body) ? listed.body : [])
      .filter((t) => t.type === 'page' && !/^devtools:/.test(String(t.url || '')))
      .map((t) => ({ targetId: t.id, title: t.title || '', url: t.url || '', active: !!t.active }));
    return { ok: true, tabs };
  }
  if (op === 'new') {
    const url = String((payload && payload.url) || 'https://www.bing.com/');
    const made = await cdpHttp(port, 'PUT', '/json/new?' + encodeURIComponent(url));
    return { ok: !!made.ok, targetId: made.body && made.body.id, error: made.error };
  }
  if (op === 'close') {
    const closed = await cdpHttp(port, 'GET', '/json/close/' + encodeURIComponent(target));
    return { ok: !!closed.ok };
  }
  if (op === 'activate') return cdpCommand(port, target, 'Target.activateTarget', { targetId: target });
  if (op === 'navigate') return cdpCommand(port, target, 'Page.navigate', { url: String((payload && payload.url) || 'about:blank') });
  if (op === 'reload') return cdpCommand(port, target, 'Page.reload', { ignoreCache: true });
  if (op === 'back') return cdpCommand(port, target, 'Runtime.evaluate', { expression: 'history.back()' });
  if (op === 'forward') return cdpCommand(port, target, 'Runtime.evaluate', { expression: 'history.forward()' });
  if (op === 'eval') return cdpCommand(port, target, 'Runtime.evaluate', { expression: String((payload && payload.expression) || '1'), returnByValue: true });
  if (op === 'frame') {
    // one still of THIS target — independent of which tab the browser has focused, so the desktop
    // window can show a page without asking the browser to switch
    const quality = Math.min(90, Math.max(30, Number(payload && payload.quality) || 62));
    // fromSurface:false captures the viewport exactly as laid out (the emulated device metrics),
    // so the picture's aspect always matches the window hole and nothing gets cropped
    let shot = await cdpCommand(port, target, 'Page.captureScreenshot', { format: 'jpeg', quality, fromSurface: false });
    if (!shot.ok || !shot.result || !shot.result.data) {
      shot = await cdpCommand(port, target, 'Page.captureScreenshot', { format: 'jpeg', quality, fromSurface: true });
    }
    if (!shot.ok) return shot;
    const metrics = await cdpCommand(port, target, 'Page.getLayoutMetrics', {});
    return { ok: true, data: shot.result.data, vw: metrics.ok ? metrics.result.cssVisualViewport.clientWidth : 0, vh: metrics.ok ? metrics.result.cssVisualViewport.clientHeight : 0 };
  }
  return { ok: false, error: 'unknown op: ' + op };
}

/* ------------------------------------------------------------------ *
 * the desktop's own browser window
 *
 * A SECOND Chromium, deliberately separate from the one that runs this
 * harness: its tab strip must never show the shell's own tab (that is what
 * makes the desktop look fake), and the user's browsing must not disturb
 * the page the agent is working in. The desktop window is only a viewport:
 * frames come from `Page.captureScreenshot` and pointer/key events go back
 * through `Input.*`, so the window behaves like a real browser while the
 * process stays off-screen (headless when there is no display).
 * ------------------------------------------------------------------ */
const WINDOW_DIR = process.env.DSH_MACOS_WINDOW_DIR || join(homedir(), '.cache', 'macos-desktop', 'window');
const WINDOW_STATE = { proc: null, port: null, launching: null, startedAt: 0, lastError: null };

function chromiumBinary() {
  const candidates = [
    process.env.DSH_MACOS_CHROME,
    process.env.EGO_BROWSER_EXECUTABLE,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
  ].filter(Boolean);
  for (const candidate of candidates) {
    try { if (existsSync(candidate)) return candidate; } catch { /* next */ }
  }
  return null;
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function windowPortFromDisk(userDataDir) {
  try {
    const raw = readFileSync(join(userDataDir, 'DevToolsActivePort'), 'utf8');
    const port = Number(String(raw).split('\n')[0]);
    return Number.isFinite(port) && port > 0 ? port : 0;
  } catch { return 0; }
}

async function ensureWindowBrowser() {
  if (WINDOW_STATE.port) {
    const alive = await cdpHttp(WINDOW_STATE.port, 'GET', '/json/version');
    if (alive.ok) return WINDOW_STATE.port;
    WINDOW_STATE.port = null;
  }
  if (WINDOW_STATE.launching) return WINDOW_STATE.launching;
  WINDOW_STATE.launching = (async () => {
    const bin = chromiumBinary();
    if (!bin) throw new Error('no chromium binary found (set DSH_MACOS_CHROME)');
    const userDataDir = join(WINDOW_DIR, 'profile');
    mkdirSync(userDataDir, { recursive: true });
    const args = [
      '--remote-debugging-port=0',
      '--user-data-dir=' + userDataDir,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-quic',
      '--disable-features=Translate,MediaRouter',
      '--window-size=1440,900',
    ];
    // no default proxy: only honour an explicit DSH_MACOS_BROWSER_PROXY, so the plugin carries no
    // machine-specific network assumptions
    if (process.env.DSH_MACOS_BROWSER_PROXY && process.env.DSH_MACOS_BROWSER_PROXY !== 'off') {
      args.push('--proxy-server=' + process.env.DSH_MACOS_BROWSER_PROXY);
    }
    // never a second visible window: the desktop window IS this browser. Headful only on demand.
    if (process.env.DSH_MACOS_BROWSER_HEADFUL !== '1') args.push('--headless=new');
    // the desktop browser opens straight onto a real page, never a blank tab
    args.push(process.env.DSH_MACOS_START_URL || 'about:blank');
    const proc = spawn(bin, args, { stdio: 'ignore', detached: false });
    WINDOW_STATE.proc = proc;
    WINDOW_STATE.startedAt = Date.now();
    proc.on('exit', () => { WINDOW_STATE.proc = null; WINDOW_STATE.port = null; });
    const deadline = Date.now() + 30000;
    let port = 0;
    while (Date.now() < deadline) {
      if (!WINDOW_STATE.proc) break;
      port = await windowPortFromDisk(userDataDir);
      if (port) {
        const ready = await cdpHttp(port, 'GET', '/json/version');
        if (ready.ok) break;
        port = 0;
      }
      await sleep(250);
    }
    if (!port) throw new Error('the desktop browser did not report a debugging port in time');
    WINDOW_STATE.port = port;
    WINDOW_STATE.lastError = null;
    return port;
  })();
  try {
    return await WINDOW_STATE.launching;
  } catch (err) {
    WINDOW_STATE.lastError = String((err && err.message) || err);
    throw err;
  } finally {
    WINDOW_STATE.launching = null;
  }
}

function inputToCdp(payload) {
  const type = String((payload && payload.type) || '');
  const x = Number(payload && payload.x) || 0;
  const y = Number(payload && payload.y) || 0;
  if (type === 'insertText') return ['Input.insertText', { text: String((payload && payload.text) || '') }];
  if (type === 'keyDown' || type === 'keyUp') {
    return ['Input.dispatchKeyEvent', {
      type,
      key: String((payload && payload.key) || ''),
      code: String((payload && payload.code) || ''),
      windowsVirtualKeyCode: Number(payload && payload.windowsVirtualKeyCode) || 0,
      text: type === 'keyDown' && payload && payload.text ? String(payload.text) : undefined,
    }];
  }
  if (type === 'mouseWheel') {
    return ['Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: Number(payload && payload.deltaX) || 0, deltaY: Number(payload && payload.deltaY) || 0 }];
  }
  if (type === 'mouseMoved') return ['Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none' }];
  if (type === 'mousePressed' || type === 'mouseReleased') {
    return ['Input.dispatchMouseEvent', {
      type,
      x,
      y,
      button: String((payload && payload.button) || 'left'),
      clickCount: Number(payload && payload.clickCount) || 1,
      buttons: type === 'mousePressed' ? 1 : 0,
    }];
  }
  return null;
}

async function windowOp(op, payload) {
  const port = await ensureWindowBrowser();
  const target = payload && payload.targetId ? String(payload.targetId) : '';
  const pages = async () => {
    const listed = await cdpHttp(port, 'GET', '/json/list');
    return (Array.isArray(listed.body) ? listed.body : [])
      .filter((t) => t.type === 'page' && !/^devtools:/.test(String(t.url || '')));
  };
  if (op === 'status') return { ok: true, port, pid: WINDOW_STATE.proc ? WINDOW_STATE.proc.pid : null, startedAt: WINDOW_STATE.startedAt };
  if (op === 'tabs') {
    const tabs = (await pages()).map((t) => ({ targetId: t.id, title: t.title || '', url: t.url || '', active: !!t.active }));
    return { ok: true, tabs };
  }
  if (op === 'new') {
    const url = String((payload && payload.url) || process.env.DSH_MACOS_START_URL || 'about:blank');
    const made = await cdpHttp(port, 'PUT', '/json/new?' + encodeURIComponent(url));
    return { ok: !!made.ok, targetId: made.body && made.body.id, error: made.error };
  }
  if (op === 'close') {
    const closed = await cdpHttp(port, 'GET', '/json/close/' + encodeURIComponent(target));
    return { ok: !!closed.ok };
  }
  if (op === 'activate') return cdpCommand(port, target, 'Target.activateTarget', { targetId: target });
  if (op === 'navigate') return cdpCommand(port, target, 'Page.navigate', { url: String((payload && payload.url) || 'about:blank') });
  if (op === 'reload') return cdpCommand(port, target, 'Page.reload', { ignoreCache: true });
  if (op === 'back') return cdpCommand(port, target, 'Runtime.evaluate', { expression: 'history.back()' });
  if (op === 'forward') return cdpCommand(port, target, 'Runtime.evaluate', { expression: 'history.forward()' });
  if (op === 'title') return cdpCommand(port, target, 'Runtime.evaluate', { expression: 'document.title', returnByValue: true });
  if (op === 'eval') return cdpCommand(port, target, 'Runtime.evaluate', { expression: String((payload && payload.expression) || '1'), returnByValue: true, awaitPromise: true });
  if (op === 'frame') {
    const quality = Math.min(90, Math.max(30, Number(payload && payload.quality) || 62));
    // fromSurface:false captures the viewport exactly as laid out (the emulated device metrics),
    // so the picture's aspect always matches the window hole and nothing gets cropped
    let shot = await cdpCommand(port, target, 'Page.captureScreenshot', { format: 'jpeg', quality, fromSurface: false });
    if (!shot.ok || !shot.result || !shot.result.data) {
      shot = await cdpCommand(port, target, 'Page.captureScreenshot', { format: 'jpeg', quality, fromSurface: true });
    }
    if (!shot.ok) return shot;
    const metrics = await cdpCommand(port, target, 'Page.getLayoutMetrics', {});
    return {
      ok: true,
      data: shot.result.data,
      vw: metrics.ok ? metrics.result.cssVisualViewport.clientWidth : 0,
      vh: metrics.ok ? metrics.result.cssVisualViewport.clientHeight : 0,
    };
  }
  if (op === 'resize') {
    // make the page's viewport exactly the window's content box: the capture then fills the window
    // with no letterboxing, and text stays crisp at any window size the user drags to
    const width = Math.max(320, Math.round(Number(payload && payload.width) || 0));
    const height = Math.max(240, Math.round(Number(payload && payload.height) || 0));
    return cdpCommand(port, target, 'Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: width,
      screenHeight: height,
    });
  }
  if (op === 'input') {
    const mapped = inputToCdp(payload);
    if (!mapped) return { ok: false, error: 'unsupported input: ' + String(payload && payload.type) };
    return cdpCommand(port, target, mapped[0], mapped[1]);
  }
  return { ok: false, error: 'unknown op: ' + op };
}

/* ------------------------------------------------------------------ *
 * a real shell session
 *
 * One long-lived interactive bash: the user types into the window, the
 * agent runs commands through the same pipe, and both watch the same
 * output — that is what makes the terminal a shared "app" instead of a
 * command runner.
 * ------------------------------------------------------------------ */
const SHELL = { proc: null, buf: '', since: 0, startedAt: 0 };

// The workspace root is derived from this file's location, never from process.cwd(): the host may
// run with any cwd, and the desktop's 访达/终端 both start at the workspace.
function rootDir() {
  if (process.env.DSH_MACOS_ROOT) return process.env.DSH_MACOS_ROOT;
  const here = (() => { try { return fileURLToPath(import.meta.url); } catch { return ''; } })();
  const marker = here.indexOf('/mac-desktop-plugin');
  if (marker > 0) return here.slice(0, marker);
  const cwd = process.cwd();
  return /DeepSeekWorkspace\/?$/.test(cwd) ? cwd : join(homedir(), 'DeepSeekWorkspace');
}

function shellStart() {
  if (SHELL.proc) return SHELL;
  const proc = spawn('/bin/bash', ['--noprofile', '--norc', '-i'], {
    cwd: rootDir(),
    env: {
      ...process.env,
      TERM: 'dumb',
      // the harness sandbox ships a narrow PATH; a desktop terminal is expected to find the
      // normal unix tools, so give it the usual system directories
      PATH: [
        join(homedir(), '.local/bin'),
        '/usr/local/bin',
        '/usr/bin',
        '/bin',
        '/usr/sbin',
        '/sbin',
        process.env.PATH || '',
      ].filter(Boolean).join(':'),
      PAGER: 'cat',
      GIT_PAGER: 'cat',
      PS1: '\\u@mac \\w $ ',
      PS2: '> ',
      HISTFILE: join(homedir(), '.cache', 'macos-desktop', 'shell_history'),
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  SHELL.proc = proc;
  SHELL.buf = '';
  SHELL.since = 0;
  SHELL.startedAt = Date.now();
  const push = (chunk) => {
    // bash on a pipe has no job control; that banner is noise in a window that looks like Terminal
    const text = String(chunk)
      .replace(/^bash: cannot set terminal process group.*\n/m, '')
      .replace(/^bash: no job control in this shell\.?\n/m, '');
    SHELL.buf += text.replace(/\r\n/g, '\n').replace(/\r/g, '');
    if (SHELL.buf.length > 400000) SHELL.buf = SHELL.buf.slice(-300000);
  };
  proc.stdout.on('data', push);
  proc.stderr.on('data', push);
  proc.on('exit', () => { SHELL.proc = null; push('\n[session ended]\n'); });
  proc.stdin.on('error', () => { /* shell went away */ });
  return SHELL;
}

function shellOp(op, payload) {
  if (op === 'start') {
    shellStart();
    return { ok: true, since: SHELL.buf.length, running: !!SHELL.proc };
  }
  if (op !== 'poll' && op !== 'stop') shellStart();
  if (op === 'poll') {
    if (!SHELL.proc) return { ok: true, out: '', since: SHELL.since, running: false };
    const since = Math.max(0, Math.min(Number(payload && payload.since) || 0, SHELL.buf.length));
    const out = SHELL.buf.slice(since);
    SHELL.since = SHELL.buf.length;
    return { ok: true, out, since: SHELL.buf.length, running: !!SHELL.proc };
  }
  if (op === 'write') {
    if (!SHELL.proc) return { ok: false, error: 'the shell is not running' };
    SHELL.proc.stdin.write(String((payload && payload.data) || ''));
    return { ok: true, at: SHELL.buf.length };
  }
  if (op === 'interrupt') {
    if (SHELL.proc) SHELL.proc.kill('SIGINT');
    return { ok: true };
  }
  if (op === 'resize') return { ok: true };
  if (op === 'stop') {
    if (SHELL.proc) { SHELL.proc.kill('SIGHUP'); SHELL.proc = null; }
    return { ok: true };
  }
  return { ok: false, error: 'unknown op: ' + op };
}

async function systemInfo() {
  const cpus = os.cpus() || [];
  let model = 'Raspberry Pi';
  try {
    const cpuinfo = readFileSync('/proc/cpuinfo', 'utf8');
    const line = cpuinfo.split('\n').find((l) => /^Model\s*:/.test(l));
    if (line) model = line.split(':').slice(1).join(':').trim();
    else {
      const rev = cpuinfo.split('\n').find((l) => /^Revision\s*:/.test(l));
      if (rev) model = 'Raspberry Pi (' + rev.split(':')[1].trim() + ')';
    }
  } catch { /* not a pi */ }
  const total = os.totalmem();
  const free = os.freemem();
  return {
    ok: true,
    model,
    hostname: os.hostname(),
    platform: os.platform() + ' ' + os.release(),
    arch: os.arch(),
    cores: cpus.length,
    cpuModel: (cpus[0] && cpus[0].model) || '',
    memoryTotal: total,
    memoryFree: free,
    uptime: os.uptime(),
    loadavg: os.loadavg(),
    node: process.version,
    pid: process.pid,
    startedAt: Date.now() - Math.round(process.uptime() * 1000),
    workspace: rootDir(),
  };
}

const ROUTES = {
  start: '/api/macos-ego/start',
  stop: '/api/macos-ego/stop',
  status: '/api/macos-ego/status',
  spaces: '/api/macos-ego/spaces',
  stream: '/api/macos-ego/stream',
  input: '/api/macos-ego/input',
};

const DEFAULT_STATE_DIR = process.env.DSH_MACOS_EGO_HOME || join(homedir(), '.cache', 'macos-desktop', 'ego');
const DEFAULT_EGO_BIN = process.env.DSH_MACOS_EGO_BIN || join(homedir(), '.local', 'share', 'ego-lite', 'linux', 'ego-browser.mjs');
const DEFAULT_NODE_BIN = process.env.DSH_MACOS_EGO_NODE || process.execPath;
const START_TIMEOUT_MS = 45000;
const DEFAULT_WORKER_BIN = process.env.DSH_MACOS_EGO_WORKER
  || join(homedir(), '.dsh', 'profiles', 'web', 'node_modules', 'dsh-ego-browser', 'bin', 'ego-cast-worker.mjs');
const DEFAULT_WORKER_ENV = () => {
  const env = { ...process.env };
  env.EGO_LINUX_STATE_DIR = join(homedir(), '.local', 'state', 'ego-lite-linux');
  return env;
};

const SIDECAR = `#!/usr/bin/env node
// Harness <-> ego-lite bridge for the desktop browser app.
//
// Commands arrive as JSON lines on stdin; replies are JSON lines on stdout ("@@reply" + payload).
// Everything the desktop window needs is taken from ego's own worker HTTP API (/api/*, the protocol
// the ego panel itself speaks) on the port ego announces here, so the panel can point at it.
import { createRequire } from 'node:module';
import { appendFileSync, createWriteStream, writeFileSync } from 'node:fs';

const [egoBin, sdkPath, stateFile, workingDir] = process.argv.slice(2);
const log = (record) => { try { appendFileSync(stateFile, JSON.stringify(record) + '\n'); } catch {} };
const reply = (payload) => { process.stdout.write('@@reply ' + JSON.stringify(payload) + '\n'); };

log({ state: 'spawning' });
const child = process['spawn'](process.execPath, [egoBin, 'nodejs'], { cwd: workingDir, stdio: ['pipe', 'pipe', 'pipe'] });

// Mirror everything the child prints, so the desktop sees the same host log egos own panel would.
child.stdout.on('data', (data) => process.stdout.write(data));
child.stderr.on('data', (data) => process.stderr.write(data));

const EGO_EVAL = '(async () => {\n'
  + 'const __ap = (ego.helpers && (ego.helpers.readAll || ego.helpers.write)) ? ego.helpers : null;\n'
  + 'const spaces = ego.state && Array.isArray(ego.state.spaces) ? ego.state.spaces : [];\n'
  + 'const tabs = typeof ego.tabs === "function" ? ego.tabs() : null;\n'
  + 'reply({ ok: true, state: true, profileId: ego.profileId, spaces: spaces.length, tabs: tabs ? tabs.length : null });\n'
  + '})()';

function send(code) {
  child.stdin.write(code + '\n');
}

// ego loads its own SDK into the eval context; the first instruction wires our reply channel.
setTimeout(() => {
  send('globalThis.reply = (p) => process.stderr.write("@@eval " + JSON.stringify(p) + "\\n");');
  send(EGO_EVAL);
}, 2500);

const http = require('node:http');
const net = require('node:net');

// Pick a free loopback port for the bridge's HTTP view of this ego instance.
const BRIDGE_PORT = 0;
let bridge = null;

child.on('exit', (code) => { log({ state: 'exited', code }); reply({ ok: false, error: 'ego exited', code }); process.exit(0); });

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let index;
  while ((index = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, index).trim();
    buf = buf.slice(index + 1);
    if (!line) continue;
    let command;
    try { command = JSON.parse(line); } catch { continue; }
    if (command.type === 'eval') send(String(command.code || ''));
    if (command.type === 'quit') { child.kill('SIGTERM'); }
  }
});
process.stdin.on('end', () => { child.kill('SIGTERM'); });
`;

// Spawned detached by the host half. Keeps one headful Chromium alive, writes browser.json the way
// ego-lite does (so the capture worker can attach), runs the worker, and reports its port.
const LAUNCHER = `#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync, rmSync } from 'node:fs';
const NEWLINE = String.fromCharCode(10);
import { join } from 'node:path';

const [stateFile, workerBin, stateDir] = process.argv.slice(2);
// The launcher owns the state dir: without this it would adopt an ego-cast worker left behind by an
// earlier Harness instance, and that worker kills every sibling it sees a moment later.
for (const name of ['ego-cast.json', 'browser.json']) { try { rmSync(join(stateDir, 'linux-state', name), { force: true }); } catch {} }
if (!stateFile || !workerBin || !stateDir) {
  console.error('launcher: usage <stateFile> <workerBin> <stateDir>');
  process.exit(2);
}
mkdirSync(stateDir, { recursive: true });
const profile = join(stateDir, 'profile');
const linuxState = join(stateDir, 'linux-state');
const browserStateFile = join(linuxState, 'browser.json');
mkdirSync(linuxState, { recursive: true });
let browserGone = false;
const log = (record) => { try { appendFileSync(stateFile, JSON.stringify({ ...record, at: Date.now() }) + NEWLINE); } catch {} };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const http = require('node:http');
// template literals are interpolated by index.js, so escapes must survive both layers
const readJson = (port, path, timeout) => new Promise((done) => {
  const req = http.get({ host: '127.0.0.1', port, path, agent: false, timeout, headers: { connection: 'close' } }, (res) => {
    let data = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { try { done(JSON.parse(data)); } catch { done(null); } });
  });
  req.on('error', () => done(null));
  req.on('timeout', () => { try { req.destroy(); } catch {} done(null); });
});
const readCast = () => {
  try { return JSON.parse(readFileSync(join(linuxState, 'ego-cast.json'), 'utf8')); } catch { return null; }
};
const announce = (port, pid) => {
  writeFileSync(browserStateFile, JSON.stringify({ port, wsUrl: 'ws://127.0.0.1:' + port, pid: pid || null, startedAt: Date.now() }));
  log({ state: 'browser-ready', port });
};

// chromium: its own profile dir, so it never shares cookies or the instance lock with ego
const chromium = process.env.EGO_BROWSER_EXECUTABLE || '/usr/bin/chromium';
const browserArgs = [
  '--remote-debugging-port=0',
  '--user-data-dir=' + profile,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-sync',
  '--disable-features=Translate',
  '--disable-quic',
  '--window-size=1280,800',
  'about:blank',
];
const browser = spawn(chromium, browserArgs, { stdio: ['ignore', 'ignore', 'ignore'], detached: true });
browser.on('error', (err) => { log({ state: 'error', error: 'chromium spawn failed: ' + err.message }); process.exit(1); });
browser.on('exit', (code, signal) => { browserGone = true; log({ state: 'browser-exit', code, signal }); });
browser.unref();

let wsUrl = null;
let workerPort = null;
let workerPid = null;
const deadline = Date.now() + 40000;
while (Date.now() < deadline) {
  await sleep(400);
  if (browserGone) { log({ state: 'error', error: 'chromium exited' }); process.exit(1); }
  const activePort = join(profile, 'DevToolsActivePort');
  if (!existsSync(activePort)) continue;
  try {
    const [portLine, pathLine] = readFileSync(activePort, 'utf8').split(NEWLINE);
    const port = Number(portLine.trim());
    if (!port) continue;
    // node's global fetch honours the environment proxy, and this machine routes everything
    // through an env proxy, so the http module with agent:false keeps the probe local
    const version = await readJson(port, '/json/version', 1500);
    if (!version) continue;
    wsUrl = version.webSocketDebuggerUrl || ('ws://127.0.0.1:' + port + (pathLine || '').trim());
    const cast = readCast();
    announce(port, browser.pid);
    if (cast && cast.port) { log({ state: 'reusing-cast', port: cast.port }); workerPort = Number(cast.port); workerPid = cast.pid || null; log({ state: 'ready', port: workerPort, pid: workerPid }); }
    break;
  } catch { /* not yet */ }
}
if (!wsUrl) { log({ state: 'error', error: 'chromium did not expose a CDP endpoint' }); process.exit(1); }

const worker = workerPort ? null : spawn(process.execPath, [workerBin, JSON.stringify({ cdpFps: 15, cdpQuality: 60, cdpMaxWidth: 1280 })], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, EGO_LINUX_STATE_DIR: linuxState },
  detached: true,
});
const claim = (state) => {
  if (workerPort || !state || !state.port) return;
  workerPort = Number(state.port);
  workerPid = state.pid || null;
  log({ state: 'ready', port: workerPort, pid: workerPid });
};
const onChunk = (chunk) => {
  const text = String(chunk);
  for (const line of text.split(NEWLINE)) {
    const trimmed = line.trim();
    const at = trimmed.indexOf('@@DSH_RESULT@@');
    if (at >= 0) { try { claim(JSON.parse(trimmed.slice(at + 14))); } catch {} continue; }
    const match = trimmed.match(/127\.0\.0\.1:(\d{2,5})/);
    if (match) { claim({ port: Number(match[1]) }); continue; }
    if (trimmed) log({ state: 'worker-log', line: trimmed.slice(0, 400) });
  }
};
if (worker) {
const chunks = [];
const collect = (chunk) => { chunks.push(String(chunk)); if (chunks.length > 40) chunks.shift(); try { writeFileSync(join(stateDir, 'worker.log'), chunks.join('')); } catch {} };
worker.stdout.on('data', (chunk) => { collect(chunk); onChunk(chunk); });
worker.stderr.on('data', (chunk) => { collect(chunk); onChunk(chunk); });
// the worker survives its own resignals: only stop the browser when it dies before it is ready
worker.on('exit', (code, signal) => {
  log({ state: workerPort ? 'cast-exited' : 'exited', code, signal });
  // a dead capture worker leaves a live browser with nobody reading it
  if (workerPort) process.exit(3);
  try { process.kill(-browser.pid, 'SIGTERM'); } catch { try { browser.kill('SIGTERM'); } catch {} }
  process.exit(1);
});
// the worker announces itself on stdout, but writes ego-cast.json first: poll the file as well
const workerDeadline = Date.now() + 40000;
while (!workerPort && Date.now() < workerDeadline) {
  await sleep(400);
  claim(readCast());
  if (worker.exitCode !== null && !workerPort) { log({ state: 'error', error: 'capture worker exited with code ' + worker.exitCode }); process.exit(1); }
}
}
if (!workerPort) { log({ state: 'error', error: 'capture worker did not report a port' }); try { worker.kill('SIGTERM'); } catch {} process.exit(1); }
`;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function apply(ctx) {
  const stateDir = DEFAULT_STATE_DIR;
  const sidecarPath = join(stateDir, 'sidecar.mjs');
  const stateFile = join(stateDir, 'state.log');
  const runtime = { child: null, port: null, startedAt: null, lastError: null, lines: [] };

  function ensureStateDir() {
    try {
      mkdirSync(stateDir, { recursive: true });
      writeFileSync(sidecarPath, SIDECAR, { mode: 0o755 });
    } catch (error) {
      runtime.lastError = String(error && error.message);
    }
  }

  function readState() {
    if (!existsSync(stateFile)) return [];
    try {
      const text = readFileSync(stateFile, "utf8");
      if (typeof text === 'string') {
        return text.split('\n').filter(Boolean).map((line) => {
          try { return JSON.parse(line); } catch { return null; }
        }).filter(Boolean);
      }
    } catch { /* fall through */ }
    return runtime.lines;
  }

  // Chromium finds its remote-debugging port in browser.json; the capture worker reads that file,
  // attaches over CDP and serves /api/spaces, /api/stream and /api/input. We keep one browser alive
  // (the ego CLI exits after every one-shot call) and one worker per lifecycle.
  const launcherPath = join(stripFile(sidecarPath), 'launch.mjs');

  // One browser is enough: the shell's own ego instance already has the tabs, the logins and the
  // capture. The second-kernel launcher below is kept only for an explicit, opt-in experiment
  // (DSH_MACOS_SECOND_KERNEL=1); the browser window talks to /api/ego/* instead.
  async function start() {
    if (!process.env.DSH_MACOS_SECOND_KERNEL) {
      return { ok: false, disabled: true, error: 'the desktop browser uses the shell ego instance (/api/ego/*)' };
    }
    if (runtime.child && runtime.port) return { ok: true, port: runtime.port, reused: true };
    if (runtime.child && runtime.launching) return { ok: false, error: 'ego is already starting' };
    ensureStateDir();
    try { writeFileSync(stateFile, ''); } catch { /* best effort */ }
    runtime.launching = true;
    runtime.lastError = null;
    try {
      await writeFile(launcherPath, LAUNCHER, { mode: 0o755 });
    } catch (error) {
      runtime.launching = false;
      runtime.lastError = String(error && error.message);
      return { ok: false, error: runtime.lastError };
    }
    const env = { ...DEFAULT_WORKER_ENV() };
    env.EGO_LINUX_STATE_DIR = join(stateDir, 'linux-state');
    env.USER_DATA_DIR = join(stateDir, 'profile');
    env.EGO_USER_DATA_DIR = env.USER_DATA_DIR;
    if (!env.EGO_BROWSER_EXECUTABLE) {
      for (const candidate of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) {
        if (existsSync(candidate)) { env.EGO_BROWSER_EXECUTABLE = candidate; break; }
      }
    }
    try {
      // the launcher inherits the service's stdio log: an early crash (bad binary, missing flag)
      // must still be visible in the Harness log while state.log stays empty
      runtime.child = spawn(DEFAULT_NODE_BIN, [launcherPath, stateFile, DEFAULT_WORKER_BIN, stateDir], { detached: true, stdio: ['ignore', 'inherit', 'inherit'], env });
      runtime.child.on('exit', (code, signal) => { runtime.lastError = 'launcher exited ' + String(code) + (signal ? ' (' + signal + ')' : ''); });
      runtime.child.unref();
    } catch (error) {
      runtime.launching = false;
      runtime.lastError = String(error && error.message);
      return { ok: false, error: runtime.lastError };
    }
    const deadline = Date.now() + START_TIMEOUT_MS;
    try {
      while (Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const state = readState().filter((e) => e.state === 'ready').pop();
        if (state && state.port) {
          runtime.port = state.port;
          runtime.startedAt = Date.now();
          return { ok: true, port: state.port };
        }
        const failed = readState().filter((e) => e.state === 'exited' || e.state === 'error').pop();
        if (failed) return { ok: false, error: String(failed.error || ('ego exited with code ' + String(failed.code))) };
      }
      const last = readState().pop();
      return { ok: false, error: last ? String(last.error || last.state) : 'ego did not report a port in time' };
    } finally {
      runtime.launching = false;
    }
  }

  function stripFile(file) { return file.slice(0, file.lastIndexOf('/')) || '.'; }

  async function stop() {
    try { runtime.child && runtime.child.pid && process.kill(-runtime.child.pid, 'SIGKILL'); } catch { /* ignore */ }
    try { process.kill(-runtime.child.pid, 'SIGTERM'); } catch { /* already gone */ }
    runtime.child = null;
    runtime.port = null;
    return { ok: true };
  }

  async function proxy(path, prefix, init) {
    if (!runtime.port) return null;
    const res = await fetch('http://127.0.0.1:' + runtime.port + path.replace(prefix, ''), init);
    return res;
  }

  // One window for the whole app: a fresh Chromium per launch would double the Pi's browser
  // memory, so /api/macos-desktop/open reuses the tab list of the running desktop browser.
  async function openTab(target) {
    const url = String(target || '').trim();
    if (!url) return { ok: false, error: 'url is required' };
    const started = await start();
    if (!started.ok) return started;
    const reply = await callWorker({ type: 'open', url });
    return reply && reply.ok ? { ok: true, url, targetId: reply.targetId || null } : { ok: false, error: (reply && reply.error) || 'worker did not open the tab' };
  }

  // The worker has no "open a tab" HTTP route (the ego panel never needs one); a tiny CDP script
  // against the launcher's browser port does it instead, using the protocol browser.json exposes.
  function callWorker(payload) {
    return new Promise((done) => {
      const script = [
        "const port = JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8')).port;",
        "fetch('http://127.0.0.1:' + port + '/json/new?' + encodeURIComponent(process.argv[2]), { method: 'PUT' })",
        "  .then((r) => r.json())",
        "  .then((t) => process.stdout.write(JSON.stringify({ ok: true, targetId: t.id })))",
        "  .catch((e) => process.stdout.write(JSON.stringify({ ok: false, error: String(e && e.message) })));",
      ].join('\n');
      execFile(DEFAULT_NODE_BIN, ['-e', script, join(stateDir, 'linux-state', 'browser.json'), payload.url || 'about:blank'],
        { timeout: 15000 }, (error, stdout) => {
          if (error) return done({ ok: false, error: String(error.message) });
          try { done(JSON.parse(stdout)); } catch { done({ ok: false, error: 'unreadable reply' }); }
        });
    });
  }

  // Live view: the desktop browser's own capture, relayed to the window as JPEG frames. Every page
  // the agent (or the user) opens lands in this one browser, so the window keeps working while the
  // agent drives it through /api/macos-desktop/open.
  const live = { timer: null, clients: new Set(), busy: false };

  function browserPort() {
    try { return JSON.parse(readFileSync(join(stateDir, 'linux-state', 'browser.json'), 'utf8')).port || null; } catch { return null; }
  }

  async function cdpTargets(port) {
    const res = await fetch('http://127.0.0.1:' + port + '/json/list', { cache: 'no-store' });
    return res.json();
  }

  const CDP_SCRIPT = [
    "const ws = new WebSocket(process.argv[1]);",
    "const id = 1;",
    "ws.addEventListener('open', () => ws.send(JSON.stringify({ id, method: process.argv[2], params: JSON.parse(process.argv[3] || '{}') })));",
    "ws.addEventListener('message', (event) => {",
    "  const msg = JSON.parse(event.data);",
    "  if (msg.id !== id) return;",
    "  process.stdout.write(JSON.stringify(msg.result || msg.error || {}));",
    "  ws.close(); process.exit(0);",
    "});",
    "setTimeout(() => { process.stdout.write('{}'); process.exit(0); }, 15000);",
  ].join('\n');

  function cdpCall(wsUrl, method, params) {
    return new Promise((done) => {
      execFile(DEFAULT_NODE_BIN, ['-e', CDP_SCRIPT, wsUrl, method, JSON.stringify(params || {})], { timeout: 20000, maxBuffer: 8 * 1024 * 1024 },
        (error, stdout) => {
          if (error) return done(null);
          try { done(JSON.parse(stdout || '{}')); } catch { done(null); }
        });
    });
  }

  async function liveFrame() {
    const port = browserPort();
    if (!port) return { error: 'desktop browser is not running' };
    const targets = await cdpTargets(port).catch(() => []);
    const page = (targets || []).find((t) => t.type === 'page' && t.webSocketDebuggerUrl && !String(t.url).startsWith('devtools://'));
    if (!page) return { error: 'the desktop browser has no page' };
    const shot = await cdpCall(page.webSocketDebuggerUrl, 'Page.captureScreenshot', { format: 'jpeg', quality: 55 });
    const metrics = await cdpCall(page.webSocketDebuggerUrl, 'Page.getLayoutMetrics', {});
    const size = metrics && metrics.cssLayoutViewport ? metrics.cssLayoutViewport : metrics && metrics.layoutViewport;
    return {
      frame: shot && shot.data ? shot.data : null,
      url: page.url,
      title: page.title,
      rect: size ? { width: Math.round(size.clientWidth), height: Math.round(size.clientHeight) } : null,
    };
  }

  function broadcast(payload) {
    const line = 'data: ' + JSON.stringify(payload) + '\n\n';
    for (const res of live.clients) { try { res.write(line); } catch { /* ignore */ } }
  }

  function startLive() {
    if (live.timer) return;
    live.timer = setInterval(async () => {
      if (live.busy || live.clients.size === 0) return;
      live.busy = true;
      try { broadcast(await liveFrame()); } catch (error) { broadcast({ error: String(error && error.message) }); } finally { live.busy = false; }
    }, 900);
    if (live.timer.unref) live.timer.unref();
  }

  function stopLive() {
    if (live.timer) { clearInterval(live.timer); live.timer = null; }
  }

  // A click the user makes on the window's live picture, replayed through the browser's DevTools
  // protocol so the page reacts exactly as if it had been clicked in the browser.
  async function invoke(payload) {
    const port = browserPort();
    if (!port) return { ok: false, error: 'desktop browser is not running' };
    const targets = await cdpTargets(port).catch(() => []);
    const page = (targets || []).find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    if (!page) return { ok: false, error: 'the desktop browser has no page' };
    const x = Number(payload.x) || 0;
    const y = Number(payload.y) || 0;
    if (payload.type === 'click') {
      await cdpCall(page.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      await cdpCall(page.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await cdpCall(page.webSocketDebuggerUrl, 'Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
      return { ok: true };
    }
    return { ok: false, error: 'unknown input' };
  }

  // Same trust rule ego-lite uses for its own routes: only a request carrying the GUI session
  // cookie may drive the desktop browser.
  const trusted = (req) => /(?:^|;\s*)dsh-auth-[^=]+=/.test(String(req.headers.cookie || ''));
  const rawRegister = (server) => server.register.bind(server);

  // The Finder and Office windows read the workspace straight off disk: they are desktop chrome
  // for files the agent and the user share, so a plain listing is all they need.
  // The Harness process does not run in the user's workspace, so "current directory" is the wrong
  // place for 访达 to open: the plugin lives inside the workspace it is meant to browse.
  const workspaceRoot = process.env.DSH_MACOS_ROOT || defaultRoot();

  function defaultRoot() {
    const here = (() => { try { return fileURLToPath(import.meta.url); } catch { return ''; } })();
    const marker = here.indexOf('/mac-desktop-plugin');
    if (marker > 0) return here.slice(0, marker);
    const cwd = process.cwd();
    return /DeepSeekWorkspace$/.test(cwd) ? cwd : homedir() + '/DeepSeekWorkspace';
  }

  async function listWorkspace(dir) {
    const items = [];
    const base = pathOf(safeRel(dir));
    let entries = [];
    try { entries = await readdir(base, { withFileTypes: true }); } catch { return items; }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const path = join(base, entry.name);
      let info = null;
      try { info = await stat(path); } catch { /* skip */ }
      // keep the aliased root in the rel so the client can ask for the same file back
      const rel = String(dir || '').replace(/\/+$/, '') + '/' + entry.name;
      items.push({
        name: entry.name,
        path,
        rel,
        dir: entry.isDirectory(),
        size: info ? info.size : 0,
        mtime: info ? info.mtimeMs : 0,
      });
      if (items.length >= 300) break;
    }
    items.sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1));
    return items;
  }

  const root = () => workspaceRoot;
  // Virtual roots the desktop exposes as places in 访达 / 笔记: the workspace plus the user's real
  // Documents folder (the Obsidian vault lives there), so a window can show files DSH also edits.
  const VAULT_ROOTS = () => ({
    '/文档': join(homedir(), 'Documents'),
    '/工作区': workspaceRoot,
  });

  // Turn an aliased relative path ('/文档/x.md') into the absolute path it denotes.
  function pathOf(rel) {
    const clean = String(rel || '').replace(/\0/g, '');
    const roots = VAULT_ROOTS();
    const names = Object.keys(roots);
    for (let i = 0; i < names.length; i += 1) {
      const alias = names[i];
      if (clean === alias || clean.startsWith(alias + '/')) return resolve(roots[alias], clean.slice(alias.length + 1));
    }
    return resolve(workspaceRoot, clean);
  }

  function safeRel(dir) {
    const clean = String(dir || '').replace(/\0/g, '');
    let resolved = resolve(workspaceRoot, clean);
    let ok = resolved === workspaceRoot || resolved.startsWith(workspaceRoot + sep);
    if (!ok) {
      const roots = VAULT_ROOTS();
      const names = Object.keys(roots);
      for (let i = 0; i < names.length; i += 1) {
        const alias = names[i];
        if (clean === alias || clean.startsWith(alias + '/')) {
          resolved = resolve(roots[alias], clean.slice(alias.length + 1));
          const base = roots[alias];
          ok = resolved === base || resolved.startsWith(base + sep);
          if (ok) return alias + (clean.length > alias.length ? clean.slice(alias.length) : '');
          break;
        }
      }
    }
    return ok ? clean : '';
  }

  // ---- app index: what each fake app can do, for the floating assistant ----------------------
  // The desktop's orb asks this endpoint to find out what the agent can operate in one window, so a
  // plugin that wants its app to be "drivable" only has to appear in this list (and expose a route).
  const APP_CAPABILITIES = {
    browser: {
      label: '浏览器',
      routes: ['/api/ego/spaces', '/api/ego/input', '/api/ego/stream'],
      tools: ['ego_tabs', 'ego_navigate', 'ego_snapshot', 'ego_js', 'ego_click', 'ego_fill', 'ego_screenshot'],
      note: '操作时始终带 targetId；不要切换用户正在看的标签页。',
    },
    code: { label: '代码', routes: ['/api/macos-desktop/files'], tools: ['read', 'write', 'edit', 'bash'], note: '工作区文件即代码工作台的文件树。' },
    office: { label: 'Office', routes: ['/api/macos-desktop/univer', '/univer-api'], tools: ['univer_*', 'office*'], note: '.univer 文档按 Unit 编辑；先 univer_status。' },
    notes: { label: '笔记', routes: ['/api/macos-desktop/files'], tools: ['read', 'write', 'edit'], note: '笔记是工作区里的 markdown 文件。' },
    finder: { label: '访达', routes: ['/api/macos-desktop/files'], tools: ['bash', 'glob', 'grep'], note: '列目录用 /api/macos-desktop/files?dir=。' },
    terminal: { label: '终端', routes: [], tools: ['bash'], note: '命令直接落到这台机器的 shell。' },
    settings: { label: '设置', routes: [], tools: [], note: '壁纸、深浅色、Dock 大小。' },
  };

  async function assistContext(app) {
    const cap = APP_CAPABILITIES[app] || null;
    const context = { app: app || null, capability: cap, workspace: workspaceRoot, workbench: join(workspaceRoot, 'agentic-os') };
    if (app === 'finder' || app === 'notes' || app === 'code') {
      try { context.items = (await listWorkspace('')).slice(0, 40).map((it) => ({ name: it.name, dir: it.dir })); } catch { /* none */ }
    }
    if (app === 'office') { try { context.univer = (await listUniver()).slice(0, 20).map((f) => f.name); } catch { /* none */ } }
    return context;
  }

  async function listUniver() {
    const found = [];
    const walk = async (dir, depth) => {
      if (depth > 3 || found.length > 60) return;
      let entries = [];
      try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        const path = join(dir, entry.name);
        if (entry.isDirectory()) { await walk(path, depth + 1); continue; }
        if (!entry.name.endsWith('.univer')) continue;
        let info = null;
        try { info = await stat(path); } catch { /* skip */ }
        found.push({ name: entry.name, path, size: info ? info.size : 0, mtime: info ? info.mtimeMs : 0 });
        if (found.length > 60) return;
      }
    };
    await walk(workspaceRoot, 0);
    found.sort((a, b) => b.mtime - a.mtime);
    return found;
  }

  function mount(server) {
  const register = rawRegister(server);
  const guarded = (handler) => async (req, res) => {
    if (!trusted(req)) return json(res, 401, { ok: false, error: 'unauthorized' });
    try {
      return await handler(req, res);
    } catch (error) {
      // A throw would leave the socket hanging (the client sees an empty body); answer with JSON.
      if (!res.writableEnded) return json(res, 500, { ok: false, error: String((error && error.stack) || error) });
      return undefined;
    }
  };
  const disposers = [
    register({ kind: 'exact', path: ROUTES.status, handler: guarded(async (_req, res) => {
      json(res, 200, { ok: true, running: !!runtime.port, port: runtime.port, startedAt: runtime.startedAt, error: runtime.lastError, stateDir });
    }) }),
    register({ kind: 'exact', path: ROUTES.start, handler: guarded(async (_req, res) => {
      const result = await start();
      json(res, result.ok ? 200 : 502, result);
    }) }),
    register({ kind: 'exact', path: ROUTES.stop, handler: guarded(async (_req, res) => {
      json(res, 200, await stop());
    }) }),
    register({ kind: 'exact', path: ROUTES.spaces, handler: guarded(async (_req, res) => {
      try {
        const upstream = await proxy('/api/spaces', ROUTES.spaces);
        if (!upstream) return json(res, 200, { ok: false, spaces: [], reason: 'desktop browser is not running' });
        return json(res, 200, await upstream.json());
      } catch (error) {
        return json(res, 200, { ok: false, spaces: [], reason: String(error && error.message) });
      }
    }) }),
    register({ kind: 'exact', path: ROUTES.stream, handler: guarded(async (req, res) => {
      try {
        const upstream = await proxy('/api/stream', ROUTES.stream);
        if (!upstream || !upstream.body) { res.statusCode = 503; return res.end(); }
        res.writeHead(upstream.status, {
          'content-type': upstream.headers.get('content-type') || 'text/event-stream',
          'cache-control': 'no-store',
          connection: 'keep-alive',
        });
        const reader = upstream.body.getReader();
        const pump = async () => {
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            if (!res.writableEnded) res.write(Buffer.from(value));
          }
        };
        req.on('close', () => { try { reader.cancel(); } catch { /* ignore */ } res.end(); });
        await pump().catch(() => res.end());
      } catch {
        if (!res.writableEnded) { res.statusCode = 503; res.end(); }
      }
    }) }),
    register({ kind: 'exact', path: ROUTES.input, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      try {
        const upstream = await proxy('/api/input', ROUTES.input, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: Buffer.concat(chunks).toString('utf8') || '{}',
        });
        if (!upstream) return json(res, 400, { ok: false, error: 'desktop browser is not running' });
        return json(res, upstream.status, await upstream.json().catch(() => ({ ok: false })));
      } catch (error) {
        return json(res, 502, { ok: false, error: String(error && error.message) });
      }
    }) }),
    register({ kind: 'exact', path: DESKTOP.files, handler: guarded(async (_req, res) => {
      const url = new URL(String(_req.url || '/'), 'http://127.0.0.1');
      const dir = safeRel(url.searchParams.get('dir') || '');
      return json(res, 200, { ok: true, root: workspaceRoot, dir, items: await listWorkspace(dir) });
    }) }),
    register({ kind: 'exact', path: DESKTOP.live, handler: guarded(async (req, res) => {
      res.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      });
      res.write(':ok\n\n');
      live.clients.add(res);
      startLive();
      if (!runtime.port) { try { await start(); } catch { /* the next frame reports it */ } }
      const drop = () => { live.clients.delete(res); if (live.clients.size === 0) stopLive(); };
      req.on('close', drop);
      res.on('close', drop);
      broadcast(await liveFrame().catch(() => ({ error: 'frame failed' })));
    }) }),
    register({ kind: 'exact', path: DESKTOP.invoke, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      let payload = {};
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { payload = {}; }
      return json(res, 200, await invoke(payload).catch((error) => ({ ok: false, error: String(error && error.message) })));
    }) }),
    register({ kind: 'exact', path: DESKTOP.open, handler: guarded(async (req, res) => {
      const url = new URL(String(req.url || '/'), 'http://127.0.0.1');
      return json(res, 200, await openTab(url.searchParams.get('url') || ''));
    }) }),
    register({ kind: 'exact', path: DESKTOP.univer, handler: guarded(async (_req, res) => {
      return json(res, 200, { ok: true, files: await listUniver() });
    }) }),
    // A terminal window runs one shell command at a time in the workspace and reports cwd back, so
    // typed `cd` behaves like a terminal (the client resends the cwd with the next command).
    register({ kind: 'exact', path: DESKTOP.exec, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      let payload = {};
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { return json(res, 400, { ok: false, error: 'invalid json' }); }
      const cmd = String(payload.cmd || '');
      if (!cmd.trim()) return json(res, 400, { ok: false, error: 'cmd is required' });
      const cwd = join(workspaceRoot, safeRel(payload.cwd || ''));
      const started = Date.now();
      const result = await new Promise((done) => {
        execFile('/bin/bash', ['-lc', cmd], { cwd, timeout: 60000, maxBuffer: 4 * 1024 * 1024, env: { ...process.env, TERM: 'dumb' } }, (error, stdout, stderr) => {
          const code = error ? (typeof error.code === 'number' ? error.code : 1) : 0;
          done({ ok: !error || typeof error.code === 'number', code, stdout: String(stdout || ''), stderr: String(stderr || '') + (error && typeof error.code !== 'number' ? String(error.message) : '') });
        });
      });
      // `cd` cannot persist across processes: report the directory the command left the shell in
      let nextCwd = cwd;
      try {
        const pwd = await new Promise((done) => {
          execFile('/bin/bash', ['-lc', cmd + '\n/bin/pwd'], { cwd, timeout: 60000, env: { ...process.env, TERM: 'dumb' } }, (error, stdout) => {
            const out = String(stdout || '').trim().split('\n');
            done(out[out.length - 1] || cwd);
          });
        });
        if (pwd && pwd.startsWith(workspaceRoot)) nextCwd = pwd;
      } catch { /* keep cwd */ }
      return json(res, 200, {
        ...result,
        cwd: relative(workspaceRoot, nextCwd) || '',
        ms: Date.now() - started,
      });
    }) }),
    register({ kind: 'exact', path: DESKTOP.read, handler: guarded(async (req, res) => {
      const url = new URL(String(req.url || '/'), 'http://127.0.0.1');
      const rel = safeRel(url.searchParams.get('path') || '');
      if (!rel) return json(res, 400, { ok: false, error: 'path is outside the workspace' });
      try {
        const abs = pathOf(rel);
        const info = await stat(abs);
        if (!info.isFile()) return json(res, 400, { ok: false, error: 'not a file' });
        if (info.size > 2 * 1024 * 1024) return json(res, 413, { ok: false, error: 'file is larger than 2 MB' });
        return json(res, 200, { ok: true, path: rel, text: await readFile(abs, 'utf8') });
      } catch (error) {
        return json(res, 404, { ok: false, error: String((error && error.message) || error) });
      }
    }) }),
    register({ kind: 'exact', path: DESKTOP.write, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      let payload = {};
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { return json(res, 400, { ok: false, error: 'invalid json' }); }
      const rel = safeRel(payload.path || '');
      if (!rel) return json(res, 400, { ok: false, error: 'path is outside the workspace' });
      if (typeof payload.text !== 'string') return json(res, 400, { ok: false, error: 'text is required' });
      try {
        const abs = pathOf(rel);
        await mkdir(dirname(abs), { recursive: true });
        await writeFile(abs, payload.text, 'utf8');
        return json(res, 200, { ok: true, path: rel, bytes: Buffer.byteLength(payload.text, 'utf8') });
      } catch (error) {
        return json(res, 500, { ok: false, error: String((error && error.message) || error) });
      }
    }) }),
    register({ kind: 'exact', path: DESKTOP.ego, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      let payload = {};
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { payload = {}; }
      return json(res, 200, await egoOp(payload.op, payload));
    }) }),
    register({ kind: 'exact', path: DESKTOP.shell, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      let payload = {};
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { payload = {}; }
      try {
        return json(res, 200, shellOp(String(payload.op || 'poll'), payload));
      } catch (err) {
        return json(res, 200, { ok: false, error: String((err && err.message) || err) });
      }
    }) }),
    register({ kind: 'exact', path: DESKTOP.system, handler: guarded(async (_req, res) => json(res, 200, await systemInfo())) }),
    register({ kind: 'exact', path: DESKTOP.window, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      let payload = {};
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { payload = {}; }
      const op = String(payload && payload.op || '');
      if (!op) return json(res, 400, { ok: false, error: 'op is required' });
      try {
        return json(res, 200, await windowOp(op, payload));
      } catch (err) {
        return json(res, 200, { ok: false, error: String((err && err.message) || err) });
      }
    }) }),
    register({ kind: 'exact', path: DESKTOP.frame, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      let payload = {};
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { payload = {}; }
      return json(res, 200, await egoOp('frame', payload));
    }) }),
    register({ kind: 'exact', path: DESKTOP.apps, handler: guarded(async (_req, res) => {
      return json(res, 200, { ok: true, apps: APP_CAPABILITIES });
    }) }),
    register({ kind: 'exact', path: DESKTOP.assist, handler: guarded(async (req, res) => {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      let payload = {};
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { payload = {}; }
      const context = await assistContext(payload.app).catch(() => ({ app: payload.app || null }));
      // The desktop has no private model channel: the reply tells the window how to reach the agent
      // with the current context, and the agent (this DSH session) is the one that does the work.
      const prompt = String(payload.prompt || '').slice(0, 2000);
      return json(res, 200, {
        ok: true,
        app: payload.app || null,
        context,
        prompt,
        reply: '已记录你的问题（' + (APP_CAPABILITIES[payload.app] ? APP_CAPABILITIES[payload.app].label : '桌面上') + '）。'
          + '这台 Mac 的对话由 DeepSeek Harness 处理：在对话窗口或菜单栏输入框里发给我，我会用 '
          + ((APP_CAPABILITIES[payload.app] && APP_CAPABILITIES[payload.app].tools) || ['工具']).join(' / ')
          + ' 在这个窗口里操作。',
      });
    }) }),
  ];
  return () => { for (const dispose of disposers) { try { dispose(); } catch { /* ignore */ } } };
  }

  // The desktop browser is started on demand by the client (a start call while the browser window
  // opens), so nothing runs until the user asks for it.
  ctx.inject(['webServer'], (wctx) => {
    const server = wctx.get('webServer') || wctx.webServer;
    if (!server || typeof server.register !== 'function') return;
    const unmount = mount(server);
    wctx.effect?.(() => () => { unmount(); stop(); }, 'macos-desktop: desktop browser backend');
  });
}
