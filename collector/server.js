/* ============================================================================
 * server.js — 本地服务：静态页面 + 一键更新接口
 * ----------------------------------------------------------------------------
 * 为什么需要它：index.html 是纯静态页，浏览器不允许它直接跑采集脚本。
 * 这里起一个只监听 127.0.0.1 的小服务：
 *
 *   GET  /                 页面（index.html）
 *   GET  /api/health       是否在线、数据版本、覆盖情况
 *   GET  /api/status       最近一次采集的进度（页面轮询用）
 *   POST /api/refresh      触发一次采集（按钮）
 *   GET  /api/queue        待 AI 识别的 PDF 清单
 *
 * 采集是「串行」的：正在跑的时候再点按钮会直接返回 busy，不会并发写数据。
 *
 * 用法：node collector/server.js [--port=8787]
 * ==========================================================================*/
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const RUNS = path.join(DATA, 'runs');

const argv = process.argv.slice(2);
const portArg = argv.find((a) => a.startsWith('--port='));
const PORT = Number(portArg ? portArg.split('=')[1] : (process.env.PORT || 8787));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

let child = null;
let lastRun = null;

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function readJson(p, d) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return d; }
}

function latestProgress() {
  if (lastRun && lastRun.progressFile && fs.existsSync(lastRun.progressFile)) {
    return readJson(lastRun.progressFile, null);
  }
  if (!fs.existsSync(RUNS)) return null;
  const dirs = fs.readdirSync(RUNS).sort();
  const last = dirs[dirs.length - 1];
  return last ? readJson(path.join(RUNS, last, 'progress.json'), null) : null;
}

/* 命令行里跑的采集也要算「忙」：读最近一次 run 的 progress.json，
   更新时间在 2 分钟内且 running=true，就认为有采集在跑，避免按钮并发写数据。 */
function cliRunning() {
  if (!fs.existsSync(RUNS)) return false;
  const dirs = fs.readdirSync(RUNS).sort();
  for (let i = dirs.length - 1; i >= 0; i -= 1) {
    const f = path.join(RUNS, dirs[i], 'progress.json');
    if (!fs.existsSync(f)) continue;
    const p = readJson(f, null);
    if (!p) continue;
    const age = Date.now() - new Date(p.updatedAt || p.startedAt || 0).getTime();
    return !!(p.running && age < 120000);
  }
  return false;
}

function datasetSummary() {
  const d = readJson(path.join(DATA, 'dataset.json'), null);
  const cov = readJson(path.join(DATA, 'coverage.json'), null);
  if (!d) return { exists: false };
  const segCount = Object.values(d.cities || {}).reduce((n, c) => n + ((c.housing && c.housing.segments) || []).length, 0)
    + Object.values(d.provinces || {}).reduce((n, p) => n + ((p.social && p.social.segments) || []).length, 0);
  return {
    exists: true,
    updatedAt: d.updatedAt,
    policyYears: d.policyYears,
    segments: segCount,
    citiesWithHousing: Object.values(d.cities || {}).filter((c) => c.housing && c.housing.segments.length).length,
    provincesWithSocial: Object.values(d.provinces || {}).filter((p) => p.social && p.social.segments.length).length,
    coverage: cov ? { housing: { ok: cov.housing.ok, total: cov.housing.total }, social: { ok: cov.social.ok, total: cov.social.total } } : null,
  };
}

function startRun(body) {
  if (child) return { ok: false, busy: true };
  const args = ['run.js'];
  if (body.kind && body.kind !== 'all') args.push(`--kind=${body.kind}`);
  if (body.only && body.only.length) args.push(`--only=${body.only.join(',')}`);
  if (body.year) args.push(`--year=${body.year}`);
  if (body.prev) args.push(`--prev=${body.prev}`);
  if (body.pages) args.push(`--pages=${body.pages}`);
  if (body.noCdp) args.push('--no-cdp');

  const runId = `${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}-web`;
  args.push(`--run-id=${runId}`);

  child = spawn(process.execPath, args, { cwd: __dirname, stdio: ['ignore', 'pipe', 'pipe'] });
  lastRun = { runId, progressFile: path.join(RUNS, runId, 'progress.json'), startedAt: new Date().toISOString(), log: [] };

  child.stdout.on('data', (d) => {
    const s = d.toString();
    lastRun.log.push(s);
    if (lastRun.log.length > 200) lastRun.log.shift();
  });
  child.stderr.on('data', (d) => { lastRun.log.push(d.toString()); });
  child.on('exit', (code) => {
    lastRun.exitCode = code;
    lastRun.finishedAt = new Date().toISOString();
    child = null;
  });

  return { ok: true, runId };
}

function serveStatic(req, res, pathname) {
  let rel = pathname === '/' ? 'index.html' : decodeURIComponent(pathname.replace(/^\//, ''));
  if (rel.includes('..')) return json(res, 400, { error: 'bad path' });
  const abs = path.join(ROOT, rel);
  if (!abs.startsWith(ROOT)) return json(res, 403, { error: 'forbidden' });
  fs.readFile(abs, (err, buf) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(abs)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const p = url.pathname;

  if (p === '/api/health') {
    return json(res, 200, {
      ok: true,
      app: 'tax-planner',
      busy: !!child || cliRunning(),
      dataset: datasetSummary(),
      run: lastRun ? { runId: lastRun.runId, startedAt: lastRun.startedAt, finishedAt: lastRun.finishedAt || null, exitCode: lastRun.exitCode } : null,
    });
  }

  if (p === '/api/status') {
    const prog = latestProgress();
    return json(res, 200, {
      busy: !!child || cliRunning(),
      progress: prog,
      exitCode: lastRun ? lastRun.exitCode : null,
      log: lastRun ? lastRun.log.join('').split('\n').filter(Boolean).slice(-40) : [],
    });
  }

  if (p === '/api/queue') {
    const q = readJson(path.join(DATA, 'ai-queue.json'), { items: [] });
    return json(res, 200, { updatedAt: q.updatedAt, pending: (q.items || []).filter((x) => x.status !== 'done'), done: (q.items || []).filter((x) => x.status === 'done') });
  }

  if (p === '/api/refresh' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 4096) req.destroy(); });
    req.on('end', () => {
      let payload = {};
      try { payload = body ? JSON.parse(body) : {}; } catch (e) { payload = {}; }
      const r = startRun(payload);
      return json(res, r.busy ? 409 : 202, r);
    });
    return;
  }

  return serveStatic(req, res, p);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`tax-planner 已启动：http://127.0.0.1:${PORT}`);
  console.log('页面顶部「检查更新」按钮会调用 /api/refresh，串行采集，不会并发写数据。');
});
