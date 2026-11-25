/* ============================================================================
 * extract.js — 从政务站公告正文中抽取「缴存基数上限 / 下限 / 执行周期」
 * ----------------------------------------------------------------------------
 * 地方公告的措辞五花八门，这里用「关键词 + 邻近数字 + 置信度打分」的方式抽取，
 * 并把命中的原文片段一并输出，便于人工复核。
 *
 * 设计原则：
 *   宁可低置信度、标注原文，也不猜。取不到就是取不到。
 * ==========================================================================*/
'use strict';

const FULLWIDTH = /[\uFF01-\uFF5E]/g;

function normalize(text) {
  if (!text) return '';
  return String(text)
    .replace(FULLWIDTH, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/\u3000/g, ' ')
    .replace(/[ \t]+/g, ' ');
}

/** 把正文切成候选句（保留换行，便于定位） */
function sentences(text) {
  return normalize(text)
    .split(/[。；;\n\r]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 4);
}

const NUM = '(\\d{1,3}(?:,\\d{3})+|\\d+(?:\\.\\d+)?)\\s*(万)?\\s*元';
const RE_NUM = new RegExp(NUM, 'g');

function toNumber(raw, wan) {
  let v = parseFloat(String(raw).replace(/,/g, ''));
  if (!Number.isFinite(v)) return null;
  if (wan) v *= 10000;
  return v;
}

/** 在给定片段中取所有金额（元） */
function amountsIn(s) {
  const out = [];
  let m;
  RE_NUM.lastIndex = 0;
  while ((m = RE_NUM.exec(s)) !== null) {
    const v = toNumber(m[1], m[2]);
    if (v != null) out.push(v);
  }
  return out;
}

/** 基数上下限的合理区间（元/月） */
const RANGE = { housing: [300, 90000], social: [300, 90000] };

function plausible(v, kind) {
  const [lo, hi] = RANGE[kind] || RANGE.housing;
  return v >= lo && v <= hi;
}

/**
 * 抽取执行周期。
 * 支持：2026年7月1日至2027年6月30日 / 自2026年7月1日起 / 2026年7月1日起执行
 */
function extractPeriod(text) {
  const t = normalize(text);
  const m = t.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?\s*[至到\-—~]\s*(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
  if (m) {
    return {
      from: `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`,
      to: `${m[4]}-${String(m[5]).padStart(2, '0')}-${String(m[6]).padStart(2, '0')}`,
      text: m[0],
    };
  }
  const m2 = t.match(/(?:自|从)?\s*(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*起/);
  if (m2) {
    return {
      from: `${m2[1]}-${String(m2[2]).padStart(2, '0')}-${String(m2[3]).padStart(2, '0')}`,
      to: null,
      text: m2[0],
    };
  }
  return null;
}

const KEY = {
  housing: {
    // 必须出现「基数」：很多页面同时列「月缴存额上下限」，只认 缴存额 会抽错量纲
    base: /缴存基数|缴存工资基数|基数/, 
    upper: /上限|最高|不超过/,
    // 注意：不能用裸 /下限/ —— 标题「缴存基数上下限」里的「下限」会被误当成下限信号，
    // 导致上下限取到同一个数字。用负向后行断言排除「上下限」。
    lower: /(?<!上)下限|最低|不低于/,
  },
  social: {
    base: /缴费基数|缴费工资|社保基数/,
    upper: /上限|最高|不超过/,
    lower: /(?<!上)下限|最低|不低于/,
  },
};

/**
 * 从页面文本抽取基数上下限。
 * @param {string} text  页面正文
 * @param {string} kind  'housing' | 'social'
 * @param {number} year  目标政策年度
 */
function extractBase(text, kind = 'housing', year = new Date().getFullYear()) {
  const K = KEY[kind] || KEY.housing;
  const sents = sentences(text);

  const upper = [];
  const lower = [];

  sents.forEach((s, idx) => {
    if (!K.base.test(s)) return;
    const nums = amountsIn(s).filter((v) => plausible(v, kind));
    if (!nums.length) return;

    // 年份加权：同一句里出现目标年度更可信
    const hasYear = new RegExp(String(year)).test(s);
    const weight = hasYear ? 2 : 1;

    if (K.upper.test(s)) {
      // 优先取「上限」之后出现的第一个金额
      const pos = s.search(K.upper);
      const tail = s.slice(pos);
      const tailNums = amountsIn(tail).filter((v) => plausible(v, kind));
      upper.push({ value: (tailNums[0] != null ? tailNums[0] : nums[0]), weight, snippet: s.slice(0, 160), idx });
    }
    if (K.lower.test(s)) {
      const pos = s.search(K.lower);
      const tail = s.slice(pos);
      const tailNums = amountsIn(tail).filter((v) => plausible(v, kind));
      lower.push({ value: (tailNums[0] != null ? tailNums[0] : nums[nums.length - 1]), weight, snippet: s.slice(0, 160), idx });
    }
  });

  const pick = (list) => {
    if (!list.length) return null;
    const byWeight = list.filter((x) => x.weight === Math.max(...list.map((y) => y.weight)));
    // 同类候选取中位数，避免个别异常数字
    const vals = byWeight.map((x) => x.value).sort((a, b) => a - b);
    const mid = vals[Math.floor(vals.length / 2)];
    const hit = byWeight.find((x) => x.value === mid) || byWeight[0];
    return hit;
  };

  const up = pick(upper);
  const lo = pick(lower);

  // 基本法：上限必须大于下限；相等或倒挂直接判废，不输出数字
  let valid = true;
  if (up && lo && up.value <= lo.value) valid = false;

  // 合理性：缴存基数上限几乎不会低于 5000，上下限比例也不会小于 2 倍。
  // 达不到的多半是把「月缴存额」当成「基数」了。
  if (valid && up && lo) {
    if (up.value < 5000) valid = false;
    else if (up.value / lo.value < 2) valid = false;
  }
  if (!valid) {
    return {
      upper: null, lower: null, period: extractPeriod(text),
      confidence: 'conflict',
      snippets: [up, lo].filter(Boolean).map((x) => x.snippet),
      reason: '上下限不合法或不合理（可能是月缴存额）',
    };
  }

  const both = !!(up && lo);
  const sameSentence = both && up.idx === lo.idx;
  const weighted = both && up.weight === 2 && lo.weight === 2;

  let confidence = 'low';
  if (both && valid && sameSentence && weighted) confidence = 'high';
  else if (both && valid) confidence = 'medium';

  const period = extractPeriod(text);

  return {
    upper: up ? up.value : null,
    lower: lo ? lo.value : null,
    period,
    confidence: valid ? confidence : 'conflict',
    snippets: [up, lo].filter(Boolean).map((x) => x.snippet),
  };
}

/** 从列表页 HTML 中挑出可能包含基数调整公告的链接 */
function findNoticeLinks(html, baseUrl, year) {
  const out = [];
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    const title = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!title || title.length < 6) continue;
    if (!/基数|缴存|调整|通知|公告/.test(title)) continue;
    if (!new RegExp(String(year)).test(title) && !/调整|基数/.test(title)) continue;

    let url;
    try { url = new URL(href, baseUrl).toString(); } catch (e) { continue; }
    if (!/^https?:/.test(url)) continue;
    out.push({ url, title });
  }
  // 去重
  const seen = new Set();
  return out.filter((x) => (seen.has(x.url) ? false : (seen.add(x.url), true))).slice(0, 12);
}

module.exports = { extractBase, extractPeriod, findNoticeLinks, normalize, amountsIn };
