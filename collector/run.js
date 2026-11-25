/* ============================================================================
 * run.js — 采集主流程
 * ----------------------------------------------------------------------------
 * 一个目标（城市公积金 / 省社保）× 两个政策年度（今年 + 去年），走同一条流程：
 *
 *   1 种子    人工钉住的原文 URL（seeds.js / data/seeds-learned.json）
 *   2 栏目    登记的列表页 → 翻页 → 标题筛候选
 *   3 首页    自动发现「通知公告 / 政策文件」入口，再抓一层
 *   4 正文    静态 HTML 不够就 CDP 渲染；正文是附件就下载 PDF/Word 转换
 *               （PDF 扫描件自动走 Vision OCR，很多公告就是盖章扫描件）
 *   5 抽取    上下限 / 执行期 / 比例 / 文号 / 基期年度
 *   6 校验    合理性 + 同比 + 同期冲突
 *   7 入库    观测日志、数据集合并、快照、冲突队列
 *
 * 用法：
 *   node run.js                        # 全量（公积金 + 社保）
 *   node run.js --only=广州,杭州        # 只跑指定目标
 *   node run.js --kind=housing          # 只跑公积金
 *   node run.js --year=2026 --prev=2025
 *   node run.js --no-cdp --delay=400 --pages=2
 *   node run.js --rebuild               # 不抓取，按观测日志重建数据集
 *
 * 输出：
 *   data/observations.jsonl            每次观测（只追加）
 *   data/dataset.json                  合并后的当前口径
 *   data/snapshots/<date>.json         本次运行的快照
 *   data/conflicts.json                同期不同数字的复核队列
 *   data/runs/<runId>/                 progress.json / report.json / raw/*.json
 * ==========================================================================*/
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const store = require('./lib/store');
const { validate } = require('./lib/validate');
const { extractNotice, findNoticeLinks, findNextPage } = require('./lib/extract');
const { fetchPage, findAttachments, ensureDir, Browser, sleep } = require('./lib/net');
const registry = require('./registry');
const { seedsFor } = require('./seeds');

/* ------------------------------------------------------------------ 参数 */

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const hit = argv.find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.split('=').slice(1).join('=') : d;
};
const flag = (k) => argv.includes(`--${k}`);

const NOW = new Date();
const POLICY_YEARS = (() => {
  const y = Number(arg('year', NOW.getFullYear()));
  const p = Number(arg('prev', y - 1));
  return [y, p];
})();
const ONLY = (arg('only', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
const KIND = arg('kind', 'all');
const DELAY = Number(arg('delay', 500));
const PAGES = Number(arg('pages', 2));
const LIMIT = Number(arg('limit', 999));
const USE_CDP = !flag('no-cdp');
const REBUILD = flag('rebuild');
const MAX_CANDIDATES = Number(arg('max-candidates', 6));
const RUN_ID = arg('run-id', '') || `${NOW.toISOString().replace(/[-:]/g, '').slice(0, 15)}-${crypto.randomBytes(3).toString('hex')}`;

const LEARNED = path.join(store.DATA, 'seeds-learned.json');

/* ------------------------------------------------------------------ 日志 */

const state = {
  runId: RUN_ID,
  startedAt: NOW.toISOString(),
  updatedAt: NOW.toISOString(),
  years: POLICY_YEARS,
  completed: 0,
  total: 0,
  current: null,
  items: [],
  running: true,
};

let progressFile = null;

function progress() {
  state.updatedAt = new Date().toISOString();
  if (progressFile) {
    try { fs.writeFileSync(progressFile, JSON.stringify(state, null, 2)); } catch (e) { /* ignore */ }
  }
}

function log(...a) { console.log(...a); }

/* ------------------------------------------------------------- 页面缓存 */

const pageCache = new Map();
async function page(browser, url) {
  if (pageCache.has(url)) return pageCache.get(url);
  const r = await fetchPage(browser, url);
  pageCache.set(url, r);
  return r;
}

/* ------------------------------------------------------------- 候选发现 */

function navToColumns(html, baseUrl) {
  const out = [];
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]{0,80}?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    const title = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, '').trim();
    // 标题命中，或路径本身就是公告/政策栏目（很多站点菜单是图片或 JS，只能看 href）
    const titleHit = /通知公告|公告公示|政策文件|政策法规|规范性文件|部门文件|政务公开|信息公开|政府信息公开|政策解读|最新文件|文件公告|政策发布|法规/.test(title)
      && title.length <= 24;
    const hrefHit = /tzgg|ggtz|zcfg|zcwj|gfxwj|zhengce|policy|notice|ggxx|xxgkml|zfxxgk|zcjd|flfg/.test(href)
      && /\/|index|list/.test(href);
    if (!titleHit && !hrefHit) continue;
    try {
      const u = new URL(href, baseUrl).toString();
      if (!/^https?:/i.test(u)) continue;
      if (/\.(pdf|jpg|png|doc|docx|xls|xlsx|zip)$/i.test(u)) continue;
      if (u === baseUrl) continue;
      out.push({ url: u, title: title || href.slice(0, 40) });
    } catch (e) { /* ignore */ }
  }
  const seen = new Set();
  return out.filter((x) => (seen.has(x.url) ? false : (seen.add(x.url), true)));
}

async function collectFromLists(browser, listUrls, year) {
  const found = [];
  for (const lu of listUrls.slice(0, 6)) {
    let lp = await page(browser, lu);
    if (!lp.ok) continue;
    let url = lp.url;
    let pageNo = 0;
    const seenPages = new Set();
    while (pageNo < PAGES && url && !seenPages.has(url)) {
      seenPages.add(url);
      found.push(...findNoticeLinks(lp.html, url, year).map((x) => ({ ...x, from: 'list' })));
      const next = findNextPage(lp.html, url);
      if (!next) break;
      await sleep(DELAY);
      lp = await page(browser, next);
      if (!lp.ok) break;
      url = lp.url;
      pageNo++;
    }
  }
  return found;
}

async function buildCandidates(browser, entry, year) {
  const out = [];
  const learned = loadLearned();
  const key = `${entry.kind}:${entry.id}`;

  // 1) 种子
  [...seedsFor(entry.id, year, entry.kind), ...((learned[key] || {})[year] || [])].forEach((u) => {
    out.push({ url: u, title: '[种子]', score: 100, from: 'seed' });
  });

  // 2) 登记的栏目
  if (entry.columns && entry.columns.length) {
    out.push(...await collectFromLists(browser, entry.columns, year));
  }

  // 3) 首页自动发现栏目 → 再抓一层
  for (const site of entry.sites || []) {
    const home = await page(browser, site);
    if (!home.ok) continue;
    const cols = navToColumns(home.html, home.url).map((x) => x.url);
    if (cols.length) {
      out.push(...await collectFromLists(browser, cols, year));
      break;
    }
  }

  // 年度亲和度：标题/URL 明确写了目标年度的优先，写了别的年度的往后排。
  // 政务站列表页通常是「最新在前」，找上一年度文件必须靠这个信号翻到正确的那条。
  const yearBias = (c) => {
    const t = `${c.title || ''} ${c.url || ''}`;
    if (t.includes(String(year))) return 25;
    for (const y of [year - 1, year + 1, year - 2, year + 2]) {
      if (t.includes(String(y))) return -20;
    }
    return 0;
  };
  const seen = new Set();
  return out.filter((c) => (seen.has(c.url) ? false : (seen.add(c.url), true)))
    .sort((a, b) => (b.score + yearBias(b)) - (a.score + yearBias(a)))
    .slice(0, MAX_CANDIDATES);
}

/* ------------------------------------------------------------- 正文读取 */

function guessPublishedAt(text, url) {
  const t = String(text || '').slice(0, 1200);
  const m = t.match(/20\d{2}\s*[-年]\s*\d{1,2}\s*[-月]\s*\d{1,2}\s*日?/);
  if (m) {
    const [y, mo, d] = m[0].split(/[-年月日]/).map((x) => x.trim()).filter(Boolean);
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  const u = String(url).match(/\/(20\d{2})[-/](\d{1,2})\//);
  if (u) return `${u[1]}-${String(u[2]).padStart(2, '0')}-01`;
  return null;
}

/**
 * 抓一篇公告的正文。
 *
 * 这里有一条硬约束：**不下载任何附件到本地**。
 * 政务站的公告正文经常就是一个 PDF 播放器，而这些 PDF 动辄 1MB 以上、且多为扫描件。
 * 本机存储紧张时，把 PDF 落盘 + 本地 OCR 是最不该做的事。
 *
 * 所以遇到「正文没有数字、附件才是正文」的情况，就地返回 needsAI=true，
 * 由上层写入 AI 识别队列，交给具备识图/PDF 解析能力的调用方读取（不落地）。
 */
async function readDoc(browser, url) {
  const pg = await page(browser, url);
  if (!pg.ok) return { ok: false, error: pg.error || '抓取失败', url };

  const text = pg.text || '';
  const atts = findAttachments(pg.html, pg.url);
  const bodyHasNumbers = /(基数|上限|下限)/.test(text) && /元/.test(text);

  return {
    ok: true,
    text,
    via: pg.via,
    pageUrl: pg.url,
    attachments: atts,
    hash: crypto.createHash('sha1').update(text).digest('hex'),
    ocr: false,
  };
}

function guessTitle(text) {
  const lines = String(text || '').split('\n').map((x) => x.trim()).filter(Boolean);
  for (const l of lines.slice(0, 8)) {
    if (l.length >= 8 && /(关于|通知|公告|办法|规定)/.test(l)) return l.slice(0, 100);
  }
  return (lines[0] || '').slice(0, 100);
}

/* ------------------------------------------------------------- 观测构造 */

function defaultFrom(kind, year) {
  return kind === 'housing' ? `${year}-07-01` : `${year}-01-01`;
}

function makeObservation(entry, year, result, doc, url) {
  const period = result.period;
  let from = period && period.from ? period.from : defaultFrom(entry.kind, year);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) from = defaultFrom(entry.kind, year);

  let to = period && period.to ? period.to : null;
  if (to && to <= from) to = null;

  return {
    kind: entry.kind,
    scope: entry.scope,
    id: entry.id,
    province: entry.province,
    policyYear: year,
    from,
    to,
    min: Math.round(result.lower),
    max: Math.round(result.upper),
    basisYear: result.basisYear,
    rate: result.rate ? { min: result.rate.min, max: result.rate.max } : null,
    docNo: result.docNo,
    title: (result.titleLine || '').slice(0, 120),
    url,
    publishedAt: guessPublishedAt(doc.text, url),
    via: doc.via,
    ocr: !!doc.ocr,
    confidence: result.confidence,
    evidence: result.evidence,
    notes: result.notes,
    hash: doc.hash,
    collectedAt: new Date().toISOString(),
    runId: RUN_ID,
  };
}

function findSegment(dataset, entry, from) {
  const bucket = entry.scope === 'province'
    ? dataset.provinces?.[entry.province]?.social
    : dataset.cities?.[entry.id]?.housing;
  return (bucket?.segments || []).find((s) => s.from === from) || null;
}

function findPrevSegment(dataset, entry, year) {
  const bucket = entry.scope === 'province'
    ? dataset.provinces?.[entry.province]?.social
    : dataset.cities?.[entry.id]?.housing;
  const segs = (bucket?.segments || []).filter((s) => Number(s.from.slice(0, 4)) < year)
    .sort((a, b) => (a.from < b.from ? 1 : -1));
  return segs[0] || null;
}

/* ------------------------------------------------------------- 单个目标 */

async function collectTarget(browser, entry, year, dataset) {
  const item = { id: entry.id, kind: entry.kind, year, ok: false, error: null, upper: null, lower: null, confidence: null, url: null, merged: null, notes: [] };

  const candidates = await buildCandidates(browser, entry, year);
  if (!candidates.length) {
    item.error = '未发现候选公告（站点不可达或无相关栏目）';
    return item;
  }

  let best = null;
  let aiQueued = false;
  const tried = [];

  for (const c of candidates) {
    const slug = `${entry.id}-${year}-${tried.length + 1}`;
    let doc;
    try {
      doc = await readDoc(browser, c.url);
    } catch (e) {
      doc = { ok: false, error: e.message };
    }
    await sleep(DELAY);
    if (!doc.ok) {
      tried.push({ url: c.url, title: c.title, error: doc.error });
      continue;
    }

    const result = extractNotice(doc.text, { kind: entry.kind, year });
    tried.push({
      url: c.url, title: c.title, via: doc.via,
      ok: !!result.ok, upper: result.upper, lower: result.lower,
      confidence: result.confidence, reason: result.reason,
    });

    if (!result.ok) {
      // 正文抽不出数字，但页面挂着 PDF/Word 附件：正文在附件里，交 AI 识别（不下载）
      if (doc.attachments && doc.attachments.length && !aiQueued && doc.attachments[0].url) {
        // 只把「看起来就是基数调整通知」的页面排进队列。
        // 否则年报、决算、送达决定书、双随机公告都会挂附件，排进来只会让 AI 白读一遍。
        const t = String(c.title || '');
        const looksLikeBase = /基数|缴存额|缴存比例/.test(t);
        const junk = /年报|决算|预算|目录|决定书|处罚|双随机|贷款|流程|清单|表格|名单|通知公告$/;
        const relevant = (c.from === 'seed' || c.score >= 6) && looksLikeBase && !junk.test(t);
        if (relevant) {
          enqueueAI(entry, year, {
            attachment: doc.attachments[0],
            pageUrl: doc.pageUrl || c.url,
            title: guessTitle(doc.text),
          }, c.title);
          aiQueued = true;
        }
        tried.push({ url: c.url, title: c.title, needsAI: true, relevant, attachment: doc.attachments[0].url });
      }
      continue;
    }

    // 年度核对：公告里的执行期若不是目标年度，说明抓到了别的年度文件。
    // 这种情况不能当成本年度数据入库，否则会把「去年」写成「今年」（成都曾因此两年同值）。
    const fromYear = result.period && result.period.from ? Number(result.period.from.slice(0, 4)) : null;
    const yearMismatch = !!(fromYear && fromYear !== year);
    if (yearMismatch) {
      result.notes = result.notes || [];
      result.notes.push(`执行期起始 ${result.period.from} 与目标年度 ${year} 不符，视为未找到 ${year} 年度公告`);
      result.confidence = 'low';
    }

    const obs = makeObservation(entry, year, result, doc, c.url);
    const ctxPrev = findPrevSegment(dataset, entry, year);
    const v = validate(obs, { prevSegment: ctxPrev, sameFromSegment: findSegment(dataset, entry, obs.from) });
    obs.status = v.status;
    obs.notes = [...(obs.notes || []), ...v.notes];
    obs.candidatesTried = tried;

    const score = yearMismatch ? 10 : ({ high: 100, medium: 70, low: 30, conflict: 0 }[obs.confidence] || 0);
    if (!best || score > best.score) best = { obs, score, result, doc, url: c.url, title: c.title, yearMismatch };
    if (obs.confidence === 'high' && obs.status !== 'conflict' && !yearMismatch) break;
  }

  // 只抽到别的年度公告：宁可留空，也不写错年度（宁可显示「缺」让人补，不要让历史失真）
  if (best && best.yearMismatch) {
    item.error = `只找到 ${best.obs.from ? best.obs.from.slice(0, 4) : '其他'} 年度公告，缺 ${year} 年度原文`;
    item.tried = tried;
    return item;
  }

  if (!best) {
    const aiCount = tried.filter((t) => t.needsAI).length;
    item.error = aiCount
      ? `正文是 PDF/附件，已加入 AI 识别队列（${aiCount} 篇）`
      : (tried.length ? '候选页面均未抽到上下限' : '候选抓取全部失败');
    item.tried = tried;
    return item;
  }

  item.ok = true;
  item.upper = best.obs.max;
  item.lower = best.obs.min;
  item.confidence = best.obs.confidence;
  item.url = best.url;
  item.title = best.title;
  item.notes = best.obs.notes;
  item.from = best.obs.from;
  item.to = best.obs.to;
  item.tried = tried;
  item.observation = best.obs;

  store.appendObservation(best.obs);
  const m = store.mergeObservation(dataset, best.obs);
  item.merged = m.action;
  return item;
}

/* ------------------------------------------------------- AI 识别队列（PDF） */

const AI_QUEUE = path.join(store.DATA, 'ai-queue.json');
const AI_MD = path.join(store.DATA, 'ai-queue.md');

function loadQueue() {
  try { return JSON.parse(fs.readFileSync(AI_QUEUE, 'utf8')); } catch (e) { return { updatedAt: null, items: [] }; }
}

function renderQueueMd(q) {
  const pending = q.items.filter((x) => x.status !== 'done');
  const lines = [
    '# AI 识别队列',
    '',
    '这些公告的正文是 PDF / 附件，按你的要求**不下载到本地、不做本地 OCR**。',
    '请用具备 PDF 解析 / 识图能力的工具（例如 web_fetch 读取 PDF 链接）读取原文，',
    '把正文文本按 `data/ai-ingest.jsonl` 的格式回灌：',
    '',
    '```json',
    '{"id":"杭州","kind":"housing","year":2026,"url":"<公告或 PDF 链接>","text":"<原文>","via":"ai"}',
    '```',
    '',
    '然后执行 `node run.js --ingest=data/ai-ingest.jsonl`。',
    '',
    `待识别 ${pending.length} 篇。`,
    '',
  ];
  pending.forEach((x) => {
    lines.push(`- [ ] **${x.id}** ${x.kind === 'housing' ? '公积金' : '社保'} ${x.year} · ${x.attachment}`);
  });
  fs.writeFileSync(AI_MD, lines.join('\n') + '\n');
}

function enqueueAI(entry, year, doc, listTitle) {
  const q = loadQueue();
  const key = `${entry.kind}:${entry.id}:${year}`;
  const url = (doc.attachment && doc.attachment.url) || doc.pageUrl;
  const exist = q.items.find((x) => x.key === key && x.attachment === url);
  if (exist) {
    exist.lastSeen = new Date().toISOString();
    exist.hits = (exist.hits || 1) + 1;
  } else {
    q.items.push({
      key,
      id: entry.id,
      kind: entry.kind,
      scope: entry.scope,
      province: entry.province,
      year,
      attachment: url,
      pageUrl: doc.pageUrl,
      title: listTitle || doc.title || '',
      status: 'pending',
      addedAt: new Date().toISOString(),
      hits: 1,
    });
  }
  q.updatedAt = new Date().toISOString();
  fs.writeFileSync(AI_QUEUE, JSON.stringify(q, null, 2) + '\n');
  renderQueueMd(q);
}

function markQueueDone(ids) {
  const q = loadQueue();
  q.items.forEach((x) => {
    if (ids.has(`${x.kind}:${x.id}:${x.year}`)) {
      x.status = 'done';
      x.verifiedAt = new Date().toISOString();
    }
  });
  q.updatedAt = new Date().toISOString();
  fs.writeFileSync(AI_QUEUE, JSON.stringify(q, null, 2) + '\n');
  renderQueueMd(q);
}

/* ------------------------------------------------------- 回灌 AI 识别结果 */

function ingest(file) {
  if (!file) throw new Error('用法：node run.js --ingest=data/ai-ingest.jsonl');
  const abs = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
  if (!fs.existsSync(abs)) throw new Error(`找不到回灌文件：${abs}`);

  const lines = fs.readFileSync(abs, 'utf8').split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
  const dataset = store.loadDataset();
  const registryAll = registry.all();
  const done = new Set();
  const results = [];

  for (const line of lines) {
    let rec;
    try { rec = JSON.parse(line); } catch (e) {
      results.push({ ok: false, error: 'JSON 解析失败：' + line.slice(0, 80) });
      continue;
    }
    const entry = registryAll.find((x) => x.id === rec.id && x.kind === (rec.kind || 'housing'))
      || { id: rec.id, kind: rec.kind || 'housing', scope: rec.scope || (rec.kind === 'social' ? 'province' : 'city'), province: rec.province || '' };

    const result = extractNotice(rec.text || '', { kind: entry.kind, year: Number(rec.year) });
    if (!result.ok) {
      results.push({ ok: false, id: entry.id, year: rec.year, error: result.reason });
      continue;
    }

    const doc = { text: rec.text || '', via: rec.via || 'ai', hash: crypto.createHash('sha1').update(rec.text || '').digest('hex') };
    const obs = makeObservation(entry, Number(rec.year), result, doc, rec.url || null);
    obs.ocr = false;
    obs.readBy = 'ai';
    const v = validate(obs, {
      prevSegment: findPrevSegment(dataset, entry, Number(rec.year)),
      sameFromSegment: findSegment(dataset, entry, obs.from),
    });
    obs.status = v.status;
    obs.notes = [...(obs.notes || []), ...v.notes];

    store.appendObservation(obs);
    const m = store.mergeObservation(dataset, obs);
    done.add(`${entry.kind}:${entry.id}:${rec.year}`);
    results.push({ ok: true, id: entry.id, kind: entry.kind, year: rec.year, min: obs.min, max: obs.max, from: obs.from, confidence: obs.confidence, status: obs.status, merged: m.action });
  }

  store.saveDataset(dataset);
  const snap = store.snapshot(dataset);
  markQueueDone(done);
  fs.writeFileSync(path.join(store.DATA, 'ingest-report.json'), JSON.stringify({ at: new Date().toISOString(), file: abs, results }, null, 2));

  log(`回灌 ${lines.length} 条：成功 ${results.filter((r) => r.ok).length}`);
  results.forEach((r) => {
    if (r.ok) log(`  ${r.id} ${r.kind === 'housing' ? '公积金' : '社保'} ${r.year} → ${r.min}~${r.max} ${r.from} ${r.confidence}/${r.status} (${r.merged})`);
    else log(`  ${r.id || '-'} ${r.year || ''} 失败：${r.error}`);
  });
  log(`快照 ${snap}`);
  return { results, snapshot: snap };
}

/* --------------------------------------------------------- 种子自动学习 */

function loadLearned() {
  try { return JSON.parse(fs.readFileSync(LEARNED, 'utf8')); } catch (e) { return {}; }
}

function learnSeed(entry, year, url) {
  const all = loadLearned();
  const key = `${entry.kind}:${entry.id}`;
  all[key] = all[key] || {};
  all[key][year] = all[key][year] || [];
  if (!all[key][year].includes(url)) {
    all[key][year].push(url);
    fs.writeFileSync(LEARNED, JSON.stringify(all, null, 2));
  }
}

/* ------------------------------------------------------------------ 主流程 */

async function main() {
  ensureDir(store.DATA);
  const dir = store.runDir(RUN_ID);
  progressFile = path.join(dir, 'progress.json');

  if (REBUILD) return rebuild();
  if (arg('ingest', '')) return ingest(arg('ingest', ''));

  let targets = registry.all();
  if (KIND !== 'all') targets = targets.filter((t) => t.kind === KIND);
  if (ONLY.length) targets = targets.filter((t) => ONLY.includes(t.id) || ONLY.includes(t.province));
  targets = targets.slice(0, LIMIT);

  const dataset = store.loadDataset();
  state.total = targets.length * POLICY_YEARS.length;
  progress();

  log(`运行 ${RUN_ID}`);
  log(`目标 ${targets.length} 个 × 年度 ${POLICY_YEARS.join('/')}，浏览器渲染=${USE_CDP ? '开' : '关'}，翻页=${PAGES}`);
  log('');

  const browser = USE_CDP ? await Browser.launch() : null;
  const t0 = Date.now();

  try {
    for (let i = 0; i < targets.length; i++) {
      const entry = targets[i];
      for (const year of POLICY_YEARS) {
        state.current = { id: entry.id, kind: entry.kind, year };
        const label = `${entry.id}(${entry.kind === 'housing' ? '公积金' : '社保'}) ${year}`;
        process.stdout.write(`[${state.completed + 1}/${state.total}] ${label} ... `);

        let item;
        try {
          item = await collectTarget(browser, entry, year, dataset);
        } catch (e) {
          item = { id: entry.id, kind: entry.kind, year, ok: false, error: `异常：${e.message}`, notes: [] };
        }
        state.items.push(item);
        state.completed++;

        if (item.ok) {
          log(`${item.confidence}  ${item.lower}~${item.upper}  ${item.from}${item.to ? ' ~ ' + item.to : ''}  (${item.merged})`);
          if (item.confidence === 'high' && item.url) learnSeed(entry, year, item.url);
        } else {
          log(`失败：${item.error}`);
        }
        progress();
        await sleep(DELAY);
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  const snap = store.snapshot(dataset);
  store.saveDataset(dataset);

  const cov = store.coverage(dataset, POLICY_YEARS[0]);
  fs.writeFileSync(path.join(store.DATA, 'coverage.json'), JSON.stringify(cov, null, 2));

  const report = {
    runId: RUN_ID,
    startedAt: state.startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - t0,
    years: POLICY_YEARS,
    total: state.total,
    ok: state.items.filter((x) => x.ok).length,
    high: state.items.filter((x) => x.ok && x.confidence === 'high').length,
    conflicts: state.items.filter((x) => x.merged === 'conflict').length,
    snapshot: snap,
    items: state.items,
  };
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(report, null, 2));

  state.running = false;
  progress();

  log('');
  log('—— 汇总 ——');
  log(`成功 ${report.ok}/${report.total}，高置信度 ${report.high}，冲突 ${report.conflicts}`);
  log(`公积金覆盖 ${cov.housing.ok}/${cov.housing.total} 城，社保覆盖 ${cov.social.ok}/${cov.social.total} 省`);
  log(`快照 ${snap}`);
  log(`报告 ${path.join(dir, 'report.json')}`);
  return report;
}

function rebuild() {
  const observations = store.readObservations();
  const dataset = store.emptyDataset();
  let inserted = 0; let dup = 0; let conflict = 0;
  for (const obs of observations) {
    const m = store.mergeObservation(dataset, obs);
    if (m.action === 'inserted') inserted++;
    else if (m.action === 'duplicate') dup++;
    else if (m.action === 'conflict') conflict++;
  }
  store.saveDataset(dataset);
  const snap = store.snapshot(dataset);
  log(`重建完成：观测 ${observations.length} 条 → 新增 ${inserted} / 重复 ${dup} / 冲突 ${conflict}`);
  log(`快照 ${snap}`);
  return { inserted, dup, conflict };
}

if (require.main === module) {
  main().catch((e) => {
    state.running = false;
    state.error = String((e && e.stack) || e);
    progress();
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main, collectTarget };
