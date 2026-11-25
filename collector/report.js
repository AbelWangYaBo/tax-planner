/* ============================================================================
 * report.js — 覆盖报告：谁已经核验、谁还缺、谁有冲突
 * ----------------------------------------------------------------------------
 * 数据是逐城累积的，必须随时能回答三个问题：
 *   1 哪些城市/省份已经拿到官方数字（带文号与原文链接）
 *   2 还缺哪些（站点不可达 / 只找到一种年度 / 落在 AI 队列里）
 *   3 有没有同期数字打架（conflicts.json）
 *
 * 用法：node report.js            # 打印并写 data/COVERAGE.md
 * ==========================================================================*/
'use strict';

const fs = require('fs');
const path = require('path');
const store = require('./lib/store');
const { HOUSING, SOCIAL } = require('./registry');

const DATA = path.join(__dirname, '..', 'data');
const OUT = path.join(DATA, 'COVERAGE.md');

const dataset = store.loadDataset();
const conflicts = store.loadConflicts ? store.loadConflicts() : { items: [] };
const queue = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, 'ai-queue.json'), 'utf8')); } catch (e) { return { items: [] }; }
})();

const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('zh-CN'));
const docNoOf = (seg) => (seg && (seg.docNo || (seg.sources && seg.sources[0] && seg.sources[0].docNo))) || '—';
const segOf = (bucket, year) => {
  if (!bucket || !bucket.segments) return null;
  const july = `${year}-07-01`;
  return bucket.segments.find((s) => s.from <= july && (!s.to || s.to >= july)) || null;
};

function table(rows, head) {
  const lines = [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`];
  rows.forEach((r) => lines.push(`| ${r.join(' | ')} |`));
  return lines.join('\n');
}

const housingRows = [];
const housingMissing = [];
HOUSING.forEach((entry) => {
  const b = dataset.cities && dataset.cities[entry.id] ? dataset.cities[entry.id].housing : null;
  const s26 = b ? segOf(b, 2026) : null;
  const s25 = b ? segOf(b, 2025) : null;
  if (!s26 && !s25) { housingMissing.push(entry.id); return; }
  housingRows.push([
    entry.id,
    s26 ? `${fmt(s26.min)}–${fmt(s26.max)}` : '—',
    s25 ? `${fmt(s25.min)}–${fmt(s25.max)}` : '—',
    (s26 || s25).from || '—',
    docNoOf(s26 || s25),
    s26 && s25 ? '两年齐' : '缺一年',
  ]);
});

const socialRows = [];
const socialMissing = [];
SOCIAL.forEach((entry) => {
  const b = dataset.provinces && dataset.provinces[entry.id] ? dataset.provinces[entry.id].social : null;
  const s26 = b ? segOf(b, 2026) : null;
  const s25 = b ? segOf(b, 2025) : null;
  if (!s26 && !s25) { socialMissing.push(entry.id); return; }
  socialRows.push([
    entry.id,
    s26 ? `${fmt(s26.min)}–${fmt(s26.max)}` : '—',
    s25 ? `${fmt(s25.min)}–${fmt(s25.max)}` : '—',
    (s26 || s25).from || '—',
    docNoOf(s26 || s25),
  ]);
});

const pending = (queue.items || []).filter((x) => x.status !== 'done');
const conflictList = (conflicts.items || []).filter((x) => x.status !== 'resolved');

const md = [
  '# 基数采集覆盖报告',
  '',
  `生成时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`,
  '',
  '## 汇总',
  '',
  `- 公积金：${housingRows.length} / ${HOUSING.length} 个城市有官方数据（两年齐 ${housingRows.filter((r) => r[5] === '两年齐').length} 个）`,
  `- 社保：${socialRows.length} / ${SOCIAL.length} 个省份有官方数据`,
  `- 待 AI 识别：${pending.length} 篇`,
  `- 待复核冲突：${conflictList.length} 条`,
  '',
  '## 公积金（已核验）',
  '',
  housingRows.length ? table(housingRows, ['城市', '2026', '2025', '生效起', '文号', '完整度']) : '（暂无）',
  '',
  '## 公积金（尚缺）',
  '',
  housingMissing.length ? housingMissing.join('、') : '（无）',
  '',
  '## 社保（已核验）',
  '',
  socialRows.length ? table(socialRows, ['省份', '2026', '2025', '生效起', '文号']) : '（暂无）',
  '',
  '## 社保（尚缺）',
  '',
  socialMissing.length ? socialMissing.join('、') : '（无）',
  '',
  '## 冲突',
  '',
  conflictList.length
    ? table(conflictList.map((c) => [c.id, c.kind, c.from, `${c.keep} vs ${c.alt}`]), ['对象', '类型', '生效期', '两个数字'])
    : '（无）',
  '',
  '## AI 识别队列（不下载 PDF）',
  '',
  pending.length
    ? pending.map((q) => `- ${q.id} ${q.kind === 'housing' ? '公积金' : '社保'} ${q.year} · ${q.attachment}`).join('\n')
    : '（空）',
  '',
  '> 说明：官方核验 = 从地方政务站原文抽取，带文号与原文 URL。',
  '> 缺失的城市多为站点域名不可达 / 403 / 正文是扫描件（已进 AI 队列），补种子或人工复核后用同一条流水线回填。',
  '',
].join('\n');

fs.writeFileSync(OUT, md);
console.log(md);
console.log(`\n已写入 ${OUT}`);
