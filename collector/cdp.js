/* ============================================================================
 * cdp.js — 极简 Chrome DevTools Protocol 客户端（零依赖）
 * ----------------------------------------------------------------------------
 * 为什么需要它：
 *   地方政务站大量使用 JS 渲染、SPA、动态接口，直接 HTTP GET 只能拿到空壳。
 *   这里用 CDP 驱动真实浏览器，拿到渲染后的 DOM 文本。
 *
 * 依赖：本机 Chrome/Chromium + Node 22+（内置全局 WebSocket 与 fetch）
 * ==========================================================================*/
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  for (const p of CHROME_PATHS) {
    try { if (fs.existsSync(p)) return p; } catch (e) { /* ignore */ }
  }
  throw new Error('未找到 Chrome，请设置 CHROME_PATH 环境变量');
}

/* ------------------------------------------------------------------ */

class Browser {
  constructor(proc, wsUrl, profile, port) {
    this.proc = proc;
    this.wsUrl = wsUrl;
    this.profile = profile;
    this.port = port;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.handlers = new Map();
  }

  static async launch(port = 9333) {
    const bin = findChrome();
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'gjj-cdp-'));
    const proc = spawn(bin, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--window-size=1366,900',
      `--user-agent=${UA}`,
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ], { stdio: ['ignore', 'ignore', 'ignore'] });

    const base = `http://127.0.0.1:${port}`;
    for (let i = 0; i < 120; i++) {
      try {
        const r = await fetch(`${base}/json/version`);
        if (r.ok) {
          const j = await r.json();
          const b = new Browser(proc, j.webSocketDebuggerUrl, profile, port);
          await b.connect();
          return b;
        }
      } catch (e) { /* 尚未就绪 */ }
      await sleep(100);
    }
    try { proc.kill('SIGKILL'); } catch (e) { /* ignore */ }
    throw new Error('Chrome 启动超时');
  }

  async connect() {
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl);
      this.ws = ws;
      ws.addEventListener('open', () => resolve());
      ws.addEventListener('error', (e) => reject(new Error('WebSocket 连接失败')));
      ws.addEventListener('message', (ev) => this._onMessage(ev.data));
    });
  }

  _onMessage(raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch (e) { return; }
    if (msg.id && this.pending.has(msg.id)) {
      const { resolve, reject } = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message || 'CDP 错误'));
      else resolve(msg.result);
      return;
    }
    if (msg.method) {
      const list = this.handlers.get(msg.method);
      if (list) list.forEach((fn) => { try { fn(msg.params, msg.sessionId); } catch (e) { /* ignore */ } });
    }
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try { this.ws.send(JSON.stringify(payload)); } catch (e) { reject(e); }
      setTimeout(() => {
        if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('CDP 超时: ' + method)); }
      }, 45000);
    });
  }

  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }

  /** 打开一个页面、等渲染、返回 { html, text, url, title } */
  async render(url, opts = {}) {
    const waitMs = opts.waitMs || 1800;
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true });

    let loaded = false;
    this.on('Page.loadEventFired', (p, sid) => { if (sid === sessionId) loaded = true; });

    try {
      await this.send('Page.enable', {}, sessionId);
      await this.send('Runtime.enable', {}, sessionId);
      await this.send('Page.navigate', { url }, sessionId);

      const deadline = Date.now() + 20000;
      while (!loaded && Date.now() < deadline) await sleep(100);
      // 给 JS 渲染和接口回填留时间
      await sleep(waitMs);

      const res = await this.send('Runtime.evaluate', {
        expression: 'JSON.stringify({html: document.documentElement.outerHTML, '
          + 'text: document.body ? document.body.innerText : "", '
          + 'url: location.href, title: document.title})',
        returnByValue: true,
      }, sessionId);

      const out = res && res.result && res.result.value ? JSON.parse(res.result.value) : null;
      return out || { html: '', text: '', url, title: '' };
    } finally {
      try { await this.send('Target.closeTarget', { targetId }); } catch (e) { /* ignore */ }
    }
  }

  async close() {
    try { this.ws && this.ws.close(); } catch (e) { /* ignore */ }
    try { this.proc.kill('SIGKILL'); } catch (e) { /* ignore */ }
    try { fs.rmSync(this.profile, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }
}

/* ------------------------------------------------------------------ */

/** 纯 HTTP 抓取（快路径，用于静态页面） */
async function httpGet(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
    });
    const buf = Buffer.from(await r.arrayBuffer());
    return { status: r.status, buf, contentType: r.headers.get('content-type') || '' };
  } finally {
    clearTimeout(timer);
  }
}

/** 政务站常见 GBK/GB2312，按 content-type 或 meta 判断解码 */
function decodeBuffer(buf, contentType, headHtml) {
  const ct = (contentType || '').toLowerCase();
  let charset = '';
  const m1 = /charset=([\w-]+)/i.exec(ct);
  if (m1) charset = m1[1].toLowerCase();
  if (!charset && headHtml) {
    const m2 = /<meta[^>]+charset=["']?([\w-]+)/i.exec(headHtml);
    if (m2) charset = m2[1].toLowerCase();
  }
  if (!charset) charset = 'utf-8';

  const enc = /gb2312|gbk|gb18030/.test(charset) ? 'gb18030' : charset;
  try {
    return new TextDecoder(enc, { fatal: false }).decode(buf);
  } catch (e) {
    return new TextDecoder('utf-8', { fatal: false }).decode(buf);
  }
}

module.exports = { Browser, httpGet, decodeBuffer, sleep, UA, findChrome };
