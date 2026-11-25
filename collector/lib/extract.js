/* ============================================================================
 * lib/extract.js — 从公告正文抽取「基数上下限 / 执行期 / 比例 / 文号」
 * ----------------------------------------------------------------------------
 * 地方公告没有统一模板，真实语料里至少有这么几种写法（都已在实测中遇到）：
 *
 *   A 直陈式   缴存基数上限为 42151 元；缴存基数下限为 2660 元
 *   B 倍数式   不高于 2025 年职工月平均工资的 3 倍（41697 元）
 *              不低于本市最低工资标准（现行标准为 2500 元）
 *   C 拆分式   上限在上一句、下限在下一句（成都）
 *   D 举例式   其 2026 年度缴存基数按上限 28849 元核定（郑州）
 *   E 表格      | 城市 | 缴存基数上限 | 缴存基数下限 |
 *
 * 共同陷阱：
 *   · 「月缴存额上限 6094 元」和「缴存基数上限 25392 元」同句出现 → 必须按紧邻词排掉
 *   · 「缴存基数上下限」里的「下限」不是下限信号 → 负向后行断言 + 金额邻近度
 *   · 特殊人群下限（领取基本生活费职工 1778 元）不是普适下限 → 降权
 *
 * 原则：宁可只给一个数 + 原文片段让人复核，也不猜。
 * ==========================================================================*/
'use strict';

const FULLWIDTH = /[\uFF01-\uFF5E]/g;

/** 全角转半角、统一引号、压缩空白 */
function normalize(text) {
  return String(text || '')
    .replace(FULLWIDTH, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u3000/g, ' ')
    .replace(/[ \t]+/g, ' ');
}

/** 把换行压平（OCR 会把一句话切成多行），保留句读 */
function flatten(text) {
  return normalize(text).replace(/\s*\n\s*/g, ' ').replace(/ {2,}/g, ' ').trim();
}

/** 切成句子；表格行（含 | ）单独成句 */
function sentences(text) {
  // 关键：不能按换行切句。
  // PDF/OCR 的版式换行会把「缴存基数上限为 42151」和「元；缴存基数下限…」切成两句，
  // 数字与单位、上下限就被拆散了。先把换行压平成空格，再按中文句读切。
  return flatten(text)
    .split(/[。；;！？]+|(?=\|\s)/)
    .map((s) => s.replace(/ {2,}/g, ' ').trim())
    .filter((s) => s.length >= 4);
}

/* ------------------------------------------------------------------ 金额 */

const NUM_RE = /(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(万)?\s*元/g;

function toNumber(raw, wan) {
  let v = parseFloat(String(raw).replace(/,/g, ''));
  if (!Number.isFinite(v)) return null;
  if (wan) v *= 10000;
  return v;
}

/** 句中所有「元」金额 */
function amounts(s) {
  const out = [];
  NUM_RE.lastIndex = 0;
  let m;
  while ((m = NUM_RE.exec(s)) !== null) {
    const v = toNumber(m[1], m[2]);
    if (v != null) out.push({ value: v, index: m.index, raw: m[0] });
  }
  return out;
}

const LIMIT = {
  housing: { lo: 200, hi: 120000 },
  social: { lo: 200, hi: 120000 },
};

function plausible(v) { return v >= LIMIT.housing.lo && v <= LIMIT.housing.hi; }

/* ------------------------------------------------------------- 上下限信号 */

const UP_RE = /上限|最高|不高于|不超过|至多|封顶|不得超过|3倍|300%|三倍/;
const DOWN_RE = /(?<!上)下限|最低|不低于|不少于|不得低于|60%|百分之六十/;

const BASE_RE = /(?:缴存|缴费|社保|公积金)?基数|缴存工资|缴费工资|社会保险缴费/;

/** 紧邻词打分：判断这个数字到底是「基数」还是「月缴存额」「月平均工资」 */
function nearScore(s, idx) {
  const before = s.slice(Math.max(0, idx - 16), idx);
  const after = s.slice(idx, idx + 10);
  let score = 0;

  // 「月缴存额」「缴存额」紧邻 → 这是月缴存额，不是基数
  if (/缴存额|缴存金额|月缴存额|存额上限|存额下限/.test(before)) score -= 12;
  // 常见的取值引导词
  if (/(?:为|即|是|\(|:|标准为|达到|调整为|确定为|按)\s*$/.test(before)) score += 4;
  if (/(?:为|即|是|\(|:|标准为|达到|调整为|确定为|按)\s*[¥￥]?\s*$/.test(before)) score += 0;
  // 前面 20 字内有「基数」
  if (BASE_RE.test(before)) score += 5;
  // 「3倍(42400元)」「60%(2660元)」括号里就是上下限
  if (/倍\s*\(\s*$|%\s*\(\s*$|倍\s*（\s*$/.test(before)) score += 5;
  // 前面是「年」「月」「个月」等时间单位，多半是时间不是钱
  if (/(年|月|日|个月|年度|岁)\s*$/.test(before)) score -= 6;
  // 后面紧跟「倍/％/%」
  if (/^\s*(倍|%|％)/.test(after)) score -= 8;
  // 特殊人群下限
  if (/基本生活费|见习|实习|灵活就业人员/.test(s.slice(Math.max(0, idx - 30), idx))) score -= 3;
  return score;
}

/**
 * 在「上限/下限」标签后面找金额。
 * 先看标签后 12 字内是否直接跟金额，再放宽到 100 字（应付「下限为：中心城区…2330元」）。
 */
function amountAfterLabel(s, labelStart, labelLen) {
  const seg = s.slice(labelStart + labelLen, labelStart + labelLen + 110);
  const cands = [];
  NUM_RE.lastIndex = 0;
  let m;
  while ((m = NUM_RE.exec(seg)) !== null) {
    const v = toNumber(m[1], m[2]);
    if (v == null || !plausible(v)) continue;
    const absIdx = labelStart + labelLen + m.index;
    const gap = m.index;
    let sc = nearScore(s, absIdx);
    if (gap <= 20) sc += 3;
    else if (gap <= 45) sc += 1;
    else sc -= 2;
    // 中间隔着另一组上下限标签，说明已经跑到下一个话题了
    const between = seg.slice(0, m.index);
    if (UP_RE.test(between) || DOWN_RE.test(between)) sc -= 6;
    cands.push({ value: v, index: absIdx, score: sc, raw: m[0] });
  }
  cands.sort((a, b) => b.score - a.score || a.index - b.index);
  return cands[0] || null;
}

/* ---------------------------------------------------------------- 主抽取 */

/**
 * 句子级修正分。真实公告里经常并列出现「上年度」和「本年度」两个数字，
 * 上海 2026 的通知就同时写了「2025年度缴存基数上限(37302元)」和
 * 「2026年度最高不超过37731元」——只看「上限」标签会挑到前者（错一年）。
 */
function sentScore(s, year) {
  let sc = 0;
  const years = (String(s).match(/20\d{2}/g) || []).map(Number);
  if (year && years.length) {
    const hasTarget = years.includes(Number(year));
    const others = years.filter((y) => y !== Number(year));
    if (others.length && !hasTarget) sc -= 10;      // 整句说的都是别的年度
    if (others.length && hasTarget) sc -= 4;        // 两个年度混在一句，谨慎
    if (hasTarget && !others.length) sc += 3;
  }
  // 「最高不超过 X 元，最低不低于 Y 元」这种一句给两端的写法，是最可靠的模板
  if (/最高不?超过|不得超过|不高于/.test(s) && /最低不?低于|不低于/.test(s)) sc += 8;
  if (/月缴存额|缴存金额/.test(s)) sc -= 4;
  return sc;
}

function collectCandidates(text, year) {
  const sents = sentences(text);
  const up = [];
  const down = [];
  const rows = [];

  // 注意：循环里必须用带 g 的正则副本，否则 exec 不会前进（会死循环）
  const upG = new RegExp(UP_RE.source, 'g');
  const downG = new RegExp(DOWN_RE.source, 'g');

  sents.forEach((s, idx) => {
    if ((s.match(/\|/g) || []).length >= 2) rows.push({ s, idx });

    upG.lastIndex = 0;
    let m;
    while ((m = upG.exec(s)) !== null) {
      if (m[0].length === 0) { upG.lastIndex++; continue; }
      const hit = amountAfterLabel(s, m.index, m[0].length);
      if (hit) up.push({ ...hit, score: hit.score + sentScore(s, year), sent: idx, snippet: s, label: m[0] });
    }

    downG.lastIndex = 0;
    while ((m = downG.exec(s)) !== null) {
      if (m[0].length === 0) { downG.lastIndex++; continue; }
      const hit = amountAfterLabel(s, m.index, m[0].length);
      if (hit) down.push({ ...hit, score: hit.score + sentScore(s, year), sent: idx, snippet: s, label: m[0] });
    }
  });

  return { sents, up, down, rows };
}

/** 表格行解析：找到含「上限/下限」表头的行，按列取值 */
function fromTable(rows) {
  const out = [];
  rows.forEach(({ s }) => {
    const cells = s.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 3) return;
    const upIdx = cells.findIndex((c) => /(?:基数)?上限|最高/.test(c));
    const downIdx = cells.findIndex((c) => /(?:基数)?下限|最低/.test(c));
    if (upIdx < 0 || downIdx < 0) return;
    const nums = cells.map((c) => {
      const a = amounts(c);
      return a.length ? a[0].value : null;
    });
    if (nums[upIdx] && nums[downIdx]) out.push({ upper: nums[upIdx], lower: nums[downIdx], row: s });
  });
  return out;
}

function pick(list) {
  if (!list.length) return null;
  const best = list.slice().sort((a, b) => b.score - a.score)[0];
  return best;
}

/** 执行周期
 *
 * 真实文本里「日期」经常是干扰项：上海 2026 年度的问答里出现了
 * 「2026年1月1日起新调入职工的缴存基数如何确定」，这不是政策执行期。
 * 所以按句子上下文打分：带「调整 / 执行 / 期限 / 年度」的加分，
 * 带「新调入 / 新录用 / 补缴 / 上一年度」的减分，负分直接丢弃。
 */
function lastDayOfMonth(y, m) {
  return new Date(Date.UTC(Number(y), Number(m), 0)).getUTCDate();
}

function extractPeriod(text) {
  const t = flatten(text);
  const cands = [];

  // 区间：2026年7月1日至2027年6月30日 / 2026年7月-2027年6月
  const reRange = /(\d{4})\s*年\s*(\d{1,2})\s*月(?:\s*(\d{1,2})\s*日)?\s*(?:至|到|—|~|-)\s*(\d{4})\s*年\s*(\d{1,2})\s*月(?:\s*(\d{1,2})\s*日)?/g;
  // 「自2026年7月1日起」
  const reStart = /(?:自|从)?\s*(\d{4})\s*年\s*(\d{1,2})\s*月(?:\s*(\d{1,2})\s*日)?\s*(?:起|开始)/g;

  const mk = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d || 1).padStart(2, '0')}`;

  const scoreCtx = (idx, len, isRange) => {
    const before = t.slice(Math.max(0, idx - 80), idx);
    const after = t.slice(idx + len, idx + len + 60);
    const ctx = before + after;
    let sc = 0;
    if (/调整|执行|期限|缴存基数|基数调整|缴存比例|实施/.test(ctx)) sc += 3;
    if (/年度/.test(ctx)) sc += 1;
    if (isRange) sc += 2;
    if (/新调入|新录用|新入职|新开户|调入|离职|补缴|上一年度|去年|截至|截至到/.test(ctx)) sc -= 6;
    return sc;
  };

  let m;
  while ((m = reRange.exec(t)) !== null) {
    const [full, y1, m1, d1, y2, m2, d2] = m;
    const from = mk(y1, m1, d1);
    const to = d2
      ? `${y2}-${String(m2).padStart(2, '0')}-${String(d2).padStart(2, '0')}`
      : `${y2}-${String(m2).padStart(2, '0')}-${lastDayOfMonth(y2, m2)}`;
    if (from < to) cands.push({ from, to, text: full, score: scoreCtx(m.index, full.length, true) + 2 });
  }

  while ((m = reStart.exec(t)) !== null) {
    const [full, y1, m1, d1] = m;
    cands.push({ from: mk(y1, m1, d1), to: null, text: full, score: scoreCtx(m.index, full.length, false) });
  }

  cands.sort((a, b) => b.score - a.score);
  const best = cands.find((c) => c.score >= 1);
  if (!best) return null;
  return { from: best.from, to: best.to, text: best.text, confident: true, score: best.score };
}

/** 缴存比例区间：5%至12% / 不低于5%，不高于12% / 5%-12% */
function extractRate(text) {
  const t = flatten(text);
  let m = t.match(/(?:不低于|最低)\s*(\d{1,2})\s*%[^。]{0,40}?(?:不高于|最高)\s*(\d{1,2})\s*%/);
  if (m) return { min: Number(m[1]) / 100, max: Number(m[2]) / 100, text: m[0] };
  m = t.match(/(\d{1,2}(?:\.\d)?)\s*%\s*(?:至|-|—|~|到)\s*(\d{1,2}(?:\.\d)?)\s*%/);
  if (m) return { min: Number(m[1]) / 100, max: Number(m[2]) / 100, text: m[0] };
  m = t.match(/(?:缴存|缴交)?比例[^。]{0,30}?(\d{1,2})\s*%[^。]{0,20}?(\d{1,2})\s*%[^。]{0,10}(?:区间|之间|以内)/);
  if (m) return { min: Number(m[1]) / 100, max: Number(m[2]) / 100, text: m[0] };
  return null;
}

/** 发文字号 */
function extractDocNo(text, policyYear) {
  const t = normalize(text);
  const all = [...t.matchAll(/([\u4e00-\u9fa5]{0,14}〔\s*20\d{2}\s*〕\s*\d+\s*号)/g)]
    .map((m) => ({ no: m[1].replace(/\s+/g, ''), at: m.index, year: Number((m[1].match(/20\d{2}/) || [0])[0]) }));
  if (!all.length) return null;
  // 优先「正文最前面」的本年度文号；引用的上级/往年文件文号不要
  const own = all.filter((x) => x.year === policyYear && x.at < 600);
  if (own.length) return own[0].no;
  const anyOwn = all.filter((x) => x.year === policyYear);
  if (anyOwn.length) return anyOwn[0].no;
  return null;
}

/** 基数所依据的「上年度」——2026 年度基数按 2025 年月平均工资核定 */
function extractBasisYear(text, policyYear) {
  const t = flatten(text);
  const all = [...t.matchAll(/(20\d{2})\s*年[^。]{0,25}?(?:月平均工资|年平均工资|在岗职工|全口径)/g)].map((m) => Number(m[1]));
  const cand = all.filter((y) => y < policyYear && y >= policyYear - 3);
  if (cand.length) return Math.max(...cand);
  return policyYear - 1;
}

/**
 * 主入口
 * @param {string} text 公告正文（HTML 文本或 PDF/OCR 文本）
 * @param {object} opts {kind:'housing'|'social', year:number}
 */
function extractNotice(text, opts = {}) {
  const kind = opts.kind || 'housing';
  const year = Number(opts.year) || new Date().getFullYear();
  const flat = flatten(text);

  if (!flat || flat.length < 30) {
    return { ok: false, reason: '正文为空或过短', confidence: 'low' };
  }

  const { rows, up: upList, down: downList, sents } = collectCandidates(text, year);
  const up = pick(upList);
  const down = pick(downList);
  const table = fromTable(rows);

  let upper = up && up.value ? up.value : null;
  let lower = down && down.value ? down.value : null;
  let upperEv = up ? { snippet: up.snippet.slice(0, 180), label: up.label, score: up.score } : null;
  let lowerEv = down ? { snippet: down.snippet.slice(0, 180), label: down.label, score: down.score } : null;

  // 表格兜底（不少省社保公告是「地区-上限-下限」表格）
  if (table.length) {
    const t0 = table[0];
    if (!upper && t0.upper) { upper = t0.upper; upperEv = { snippet: t0.row.slice(0, 180), label: 'table' }; }
    if (!lower && t0.lower) { lower = t0.lower; lowerEv = { snippet: t0.row.slice(0, 180), label: 'table' }; }
  }

  const period = extractPeriod(text);
  const rate = extractRate(text);
  const docNo = extractDocNo(text, year);
  const basisYear = extractBasisYear(text, year);

  // ---- 合法性 ----
  const notes = [];
  let valid = true;
  if (upper && lower) {
    if (upper <= lower) { valid = false; notes.push('上限不大于下限'); }
    if (upper < 5000) { valid = false; notes.push('上限异常偏小（疑似月缴存额）'); }
    if (upper / lower < 1.6) { valid = false; notes.push('上下限比值异常（疑似取到同一量纲）'); }
  }
  if (kind === 'social' && upper && lower) {
    const ratio = upper / lower;
    if (ratio < 4.5 || ratio > 5.6) notes.push(`社保上下限比值 ${ratio.toFixed(2)} 偏离 5.0（60%~300%）`);
  }

  // 比例合理性
  if (rate && (rate.min < 0.01 || rate.max > 0.30 || rate.min > rate.max)) {
    notes.push('缴存比例区间异常');
  }

  if (!upper || !lower) {
    return {
      ok: false,
      reason: !upper && !lower ? '未找到基数上下限' : (upper ? '找到上限但缺下限' : '找到下限但缺上限'),
      upper, lower, period, rate, docNo, basisYear,
      confidence: 'low',
      evidence: [upperEv, lowerEv].filter(Boolean),
      notes,
      year,
      kind,
    };
  }

  let confidence = 'medium';
  if (!valid) confidence = 'conflict';
  else {
    const strongUp = up && up.score >= 6;
    const strongDown = down && down.score >= 6;
    const periodOk = period && period.confident && Number(period.from.slice(0, 4)) === year;
    if (periodOk && (strongUp || strongDown)) confidence = 'high';
    else if (periodOk) confidence = 'medium';
    else if (strongUp && strongDown) confidence = 'high';
  }
  if (notes.length && confidence === 'high') confidence = 'medium';

  return {
    ok: valid,
    year,
    kind,
    upper,
    lower,
    unit: '元/月',
    period,
    rate,
    docNo,
    basisYear,
    confidence,
    evidence: [upperEv, lowerEv].filter(Boolean),
    notes,
    textLen: flat.length,
    titleLine: sents.slice(0, 3).join(' ').slice(0, 120),
  };
}

/* ------------------------------------------------------- 公告候选与发现 */

const NOTICE_KEYS = /基数|缴存|缴费|调整|上下限|社会保险|公积金/;

/** 列表页候选链接：标题相关 + 年度匹配 */
function findNoticeLinks(html, baseUrl, year) {
  const out = [];
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]{0,160}?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (/^(javascript:|#|mailto:)/i.test(href)) continue;
    const title = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, '').trim();
    if (title.length < 6) continue;
    if (!NOTICE_KEYS.test(title)) continue;

    let url;
    try { url = new URL(href, baseUrl).toString(); } catch (e) { continue; }
    if (!/^https?:/i.test(url)) continue;
    if (/\.(jpg|png|gif|zip|rar)$/i.test(url)) continue;

    const years = (title.match(/(20\d{2})/g) || []).map(Number);
    const hitYear = years.includes(year);
    const otherYear = years.some((y) => y !== year);
    if (otherYear && !hitYear) continue; // 明确是往年度公告

    let score = 0;
    if (/基数/.test(title)) score += 8;
    if (/缴存|缴费/.test(title)) score += 4;
    if (/调整|上下限/.test(title)) score += 4;
    if (hitYear) score += 12;
    if (/补充|问答|解读|征求意见|新闻|报道|培训|会议|采购|招标|中标|招聘|声明|告知书|决定书|处罚|责令|催缴|催告|名单|明细|统计表/.test(title)) score -= 20;

    out.push({ url, title, score, year: hitYear });
  }
  const seen = new Set();
  return out.filter((x) => (seen.has(x.url) ? false : (seen.add(x.url), true)))
    .sort((a, b) => b.score - a.score);
}

/** 从列表页找下一页（政务站常见 index_1.html / list_2.html / page=2） */
function findNextPage(html, baseUrl) {
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>\s*(?:下一页|下页|&gt;|>|后页)\s*<\/a>/i;
  const m = re.exec(html);
  if (!m) return null;
  try { return new URL(m[1], baseUrl).toString(); } catch (e) { return null; }
}

module.exports = {
  extractNotice, findNoticeLinks, findNextPage,
  normalize, flatten, sentences, amounts, extractPeriod, extractRate, maybe: 1,
};
