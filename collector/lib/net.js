/* ============================================================================
 * lib/net.js — 取页 / 解码 / 正文识别 / 附件下载
 * ----------------------------------------------------------------------------
 * 地方政务站的三类坑，这里逐条兜住：
 *   1) 静态页用 HTTP 抓最快，但很多站是 JS 渲染 → 正文过短自动回落 CDP 浏览器
 *   2) 老站常是 GB2312/GBK → 按 content-type + meta 逐级判断编码
 *   3) 公告正文经常根本没有 HTML 正文，而是一个 PDF 附件 → 识别 iframe/链接并下载
 *
 * 只读公开页面，单站点串行，请求之间留间隔，不绕过验证码。
 * ==========================================================================*/
'use strict';

const fs = require('fs');
const path = require('path');
const { Browser, httpGet, decodeBuffer, sleep, UA } = require('../cdp');

const BROWSER_UA = UA;

/* ------------------------------------------------------------------ 文本化 */

const ENTITY = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ldquo: '“', rdquo: '”', mdash: '—', middot: '·' };

function unescapeHtml(s) {
  return String(s)
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => (ENTITY[n.toLowerCase()] !== undefined ? ENTITY[n.toLowerCase()] : m));
}

/** HTML → 纯文本：保留段落/表格行结构，丢掉脚本样式与导航噪声 */
function htmlToText(html) {
  return unescapeHtml(String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>|<\/div>|<\/li>|<\/h\d>|<\/tr>/gi, '\n')
    .replace(/<\/td>|<\/th>/gi, ' | ')
    .replace(/<[^>]+>/g, ''))
    .replace(/[ \t\u00a0]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .split('\n').map((l) => l.trim()).filter((l) => l).join('\n')
    .trim();
}

/**
 * 正文定位：政务站正文通常位于 id/class 含 zoom/content/article/TRS_Editor 的容器。
 * 用「文本量最大」的候选容器，找不到就用整页。
 */
function mainContentText(html) {
  const raw = String(html || '');
  const cands = [];
  const re = /<(div|article|section|td)[^>]*(?:id|class)\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const tag = m[1].toLowerCase();
    const cls = m[2];
    if (!/zoom|content|article|TRS_Editor|detail|main|text|body|xxgk|zwgk/i.test(cls)) continue;
    // 粗略取该标签之后 200KB 作为候选片段（政务站正文很少超过这个量级）
    const seg = raw.slice(m.index, m.index + 200000);
    const text = htmlToText(seg).slice(0, 60000);
    cands.push({ cls, tag, text, len: text.length });
  }
  cands.sort((a, b) => b.len - a.len);
  const best = cands[0];
  const all = htmlToText(raw);
  // 候选容器要明显比整页小、但信息量足够，才认为定位成功
  if (best && best.len > 120 && best.len <= all.length) return best.text;
  return all;
}

/* ------------------------------------------------------------------ 取页 */

function looksLikeShell(text) {
  return !text || text.length < 300;
}

/**
 * 抓一个页面。先 HTTP；正文过短或非 2xx 时回落到 CDP 渲染。
 * @returns {{ok:boolean, via:'http'|'cdp'|null, status:number|null, html:string, text:string, url:string, error?:string}}
 */
async function fetchPage(browser, url, opts = {}) {
  const timeout = opts.timeout || 15000;
  let httpErr = null;
  try {
    const r = await httpGet(url, timeout);
    const head = r.buf.subarray(0, 2048).toString('latin1');
    const html = decodeBuffer(r.buf, r.contentType, head);
    const text = mainContentText(html);
    if (r.status < 400 && !looksLikeShell(text)) {
      return { ok: true, via: 'http', status: r.status, html, text, url, bytes: r.buf.length };
    }
    httpErr = r.status >= 400 ? `HTTP ${r.status}` : `正文过短(${text.length})`;
    if (r.status >= 400 && text.length > 600) {
      // 图片/附件直链等非 HTML 响应，交给上层处理
      return { ok: true, via: 'http', status: r.status, html, text, url, bytes: r.buf.length, partial: true };
    }
  } catch (e) {
    httpErr = e.message;
  }

  if (!browser) return { ok: false, via: 'http', status: null, error: httpErr || '抓取失败', url };

  // 政务站的 SPA 正文有时要好几秒才回填（上海人社就是），
  // 一次渲染拿不到就再等一轮，宁可慢 3 秒，也别把「页面是空的」当成结论。
  const waits = [opts.waitMs || 2400, 4800];
  for (let i = 0; i < waits.length; i += 1) {
    try {
      const page = await browser.render(url, { waitMs: waits[i] });
      const text = mainContentText(page.html);
      if (text.length >= 600 || i === waits.length - 1) {
        return { ok: true, via: 'cdp', status: 200, html: page.html, text, url: page.url, bytes: page.html.length };
      }
    } catch (e) {
      if (i === waits.length - 1) {
        return { ok: false, via: 'cdp', status: null, error: `${httpErr} / CDP:${e.message}`, url };
      }
    }
  }
  return { ok: false, via: 'cdp', status: null, error: `${httpErr} / CDP:正文过短`, url };
}

/* --------------------------------------------------------------- 附件发现 */

const ATTACH_RE = /\.(pdf|docx?|xlsx?|wps|ofd)(?:$|[?#])/i;

/** 从页面里找出「正文载体」：PDF iframe / PDF 直链 / Word 附件 */
function findAttachments(html, baseUrl) {
  const raw = String(html || '');
  const out = [];
  const push = (u, label) => {
    if (!u) return;
    let abs;
    try { abs = new URL(u.replace(/&amp;/g, '&'), baseUrl).toString(); } catch (e) { return; }
    if (!/^http/i.test(abs)) return;
    if (!ATTACH_RE.test(abs) && !/\.pdf/i.test(abs)) return;
    if (/viewer\.html|\/pdf\/web\/viewer|player\.html/i.test(abs)) return;
    if (out.some((x) => x.url === abs)) return;
    out.push({ url: abs, kind: (abs.match(ATTACH_RE) || ['.pdf'])[1].toLowerCase().replace('.', ''), label: label || '' });
  };

  // 1) iframe / embed / object
  const frameRe = /<(iframe|embed|object)[^>]*(?:src|data)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = frameRe.exec(raw)) !== null) push(m[2], 'iframe');

  // 2) 明确的附件链接
  const aRe = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]{0,120}?)<\/a>/gi;
  while ((m = aRe.exec(raw)) !== null) {
    const href = m[1];
    if (!ATTACH_RE.test(href)) continue;
    push(href, unescapeHtml(m[2].replace(/<[^>]+>/g, '').trim()).slice(0, 60));
  }

  // 3a) 站内脚本变量：var pdfurl = '/cms_files/xxx.pdf';（iframe 由 JS 拼出来，HTML 里只有变量）
  const varRe = /pdf\s*url\s*[=:]\s*['"]([^'"]+)['"]/gi;
  while ((m = varRe.exec(raw)) !== null) {
    try { push(new URL(m[1], baseUrl).toString(), 'var'); } catch (e) { /* ignore */ }
  }

  // 3) 播放器包装：viewer.html?pdfurl=/cms_files/xxx.pdf —— 要的是后面那个真 PDF
  const puRe = /pdfurl=([^"'&\\s]+)/gi;
  while ((m = puRe.exec(raw)) !== null) {
    let raw2 = m[1];
    try { raw2 = decodeURIComponent(raw2); } catch (e) { /* ignore */ }
    // pdfurl 多为站内相对路径，按站点根解析
    let abs;
    try {
      const u = new URL(raw2, baseUrl);
      abs = u.toString();
    } catch (e) { continue; }
    push(abs, 'pdfurl');
  }

  // PDF 正文优先，其次是 doc/docx；同时按附件名字的语义排序：
  // 「缴存基数/调整通知」大概率是正文，而「决定书/处罚/名单/统计表」是附件模板，别拿去喂 AI。
  const rank = { pdf: 0, docx: 1, doc: 2, ofd: 3, xlsx: 4, xls: 5, wps: 6 };
  const labelScore = (l) => {
    let s = 0;
    if (/基数|缴存额|缴存比例|上下限|调整|通知|通告|公告/.test(l)) s -= 12;
    if (/决定书|处罚|催缴|催告|名单|明细|统计表|申请表|回执|模板|样表|花名册/.test(l)) s += 15;
    return s;
  };
  return out.sort((a, b) => ((rank[a.kind] ?? 9) + labelScore(a.label)) - ((rank[b.kind] ?? 9) + labelScore(b.label)));
}

/* ------------------------------------------------------------------ 工具 */

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function saveRaw(dir, name, obj) {
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, name), typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2));
}

module.exports = {
  fetchPage, findAttachments, htmlToText, mainContentText,
  unescapeHtml, ensureDir, saveRaw, looksLikeShell, sleep, Browser, UA,
};
