/* ============================================================================
 * lib/store.js — 观测入库、历史归档、冲突隔离
 * ----------------------------------------------------------------------------
 * 数据模型的核心不是「一个城市一个上下限」，而是「一条生效时间段」：
 *
 *   { from: '2026-07-01', to: '2027-06-30', min: 2500, max: 41697, ... }
 *
 * 原因：7 月前后用的是两套基数，且各地切换月份不同（1 月 / 7 月 / 9 月）。
 * 只有把「起止日期」存下来，引擎才能按月取基数，也才能回答「这条数据哪天开始生效」。
 *
 * 三层存储，互不覆盖：
 *   data/observations.jsonl   每一次抓取到的原始观测（只追加，永不改）
 *   data/dataset.json         合并后的当前口径（同生效期同数字才算重复）
 *   data/snapshots/<date>.json 每次运行的整份快照（按内容哈希去重）
 *   data/conflicts.json       同一生效期出现两套数字的复核队列
 * ==========================================================================*/
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');
const DATA = path.join(ROOT, 'data');
const OBS = path.join(DATA, 'observations.jsonl');
const DATASET = path.join(DATA, 'dataset.json');
const CONFLICTS = path.join(DATA, 'conflicts.json');
const SNAPSHOTS = path.join(DATA, 'snapshots');
const RUNS = path.join(DATA, 'runs');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function emptyDataset() {
  return {
    schemaVersion: 2,
    updatedAt: null,
    policyYears: [],
    provinces: {},
    cities: {},
    stats: { observations: 0 },
  };
}

function loadDataset() {
  try {
    const d = JSON.parse(fs.readFileSync(DATASET, 'utf8'));
    if (d && d.schemaVersion === 2) return d;
  } catch (e) { /* 首次运行 */ }
  return emptyDataset();
}

function saveDataset(d) {
  ensureDir(DATA);
  d.updatedAt = new Date().toISOString();
  const years = new Set();
  const collect = (bucket) => {
    if (!bucket || !Array.isArray(bucket.segments)) return;
    bucket.segments.forEach((s) => {
      const y = Number(String(s.from || '').slice(0, 4));
      if (Number.isFinite(y)) years.add(y);
    });
  };
  Object.values(d.cities || {}).forEach((c) => { collect(c.housing); collect(c.social); });
  Object.values(d.provinces || {}).forEach((p) => collect(p.social));
  d.policyYears = [...years].sort();
  fs.writeFileSync(DATASET, JSON.stringify(d, null, 2) + '\n');
}

/* --------------------------------------------------------------- 观测日志 */

function appendObservation(obs) {
  ensureDir(DATA);
  fs.appendFileSync(OBS, JSON.stringify(obs) + '\n');
}

function readObservations() {
  if (!fs.existsSync(OBS)) return [];
  return fs.readFileSync(OBS, 'utf8').split('\n').filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch (e) { return null; }
  }).filter(Boolean);
}

/* ------------------------------------------------------------------ 日期 */

function shiftDays(iso, days) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function addMonths(iso, months) {
  const d = new Date(iso + 'T00:00:00Z');
  const day = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + months);
  if (d.getUTCDate() !== day) d.setUTCDate(0); // 月末回退
  return d.toISOString().slice(0, 10);
}

/** 给没有截止日期的记录补上正常周期 */
function inferTo(from, kind, siblings) {
  const next = (siblings || [])
    .filter((s) => s.from && s.from > from)
    .sort((a, b) => (a.from < b.from ? -1 : 1))[0];
  if (next) {
    const d = new Date(next.from + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  // 无后继：公积金按缴存年度（7/1 起 12 个月），社保按自然年
  if (kind === 'housing') return shiftDays(addMonths(from, 12), -1);
  if (from.slice(5) === '01-01') return `${from.slice(0, 4)}-12-31`;
  return shiftDays(addMonths(from, 12), -1);
}

function coversMonth(seg, ym) {
  if (!seg || !seg.from) return false;
  return seg.from <= ym && (!seg.to || seg.to >= ym);
}

/* ------------------------------------------------------------------ 合并 */

function targetBucket(dataset, obs) {
  const isProv = obs.scope === 'province';
  const key = isProv ? (obs.province || obs.id) : obs.id;
  if (isProv) {
    if (!dataset.provinces[key]) dataset.provinces[key] = {};
    const b = dataset.provinces[key];
    if (!b.social) b.social = { segments: [], rate: null, province: key };
    return { bucket: b.social, path: `provinces.${key}.social` };
  }
  if (!dataset.cities[key]) dataset.cities[key] = { province: obs.province || '', housing: null };
  const c = dataset.cities[key];
  if (obs.kind === 'housing') {
    if (!c.housing) c.housing = { segments: [], rateRange: null };
    return { bucket: c.housing, path: `cities.${key}.housing` };
  }
  if (!c.social) c.social = { segments: [] }; // 城市级社保（个别城市单列，如深圳医保）
  return { bucket: c.social, path: `cities.${key}.social` };
}

function segSource(obs) {
  return {
    url: obs.url || null,
    title: obs.title || null,
    docNo: obs.docNo || null,
    publishedAt: obs.publishedAt || null,
    collectedAt: obs.collectedAt || new Date().toISOString(),
    via: obs.via || null,
    hash: obs.hash || null,
    evidence: obs.evidence || [],
    notes: obs.notes || [],
  };
}

/**
 * 把一条观测并入 dataset。
 * @returns {{action:'inserted'|'duplicate'|'updated'|'conflict', segment?:object, note?:string}}
 */
function mergeObservation(dataset, obs) {
  const { bucket } = targetBucket(dataset, obs);
  if (!Array.isArray(bucket.segments)) bucket.segments = [];

  const same = bucket.segments.find((s) => s.from === obs.from);
  if (same) {
    if (same.min === obs.min && same.max === obs.max) {
      same.checkedAt = new Date().toISOString();
      same.status = same.status === 'conflict' ? 'conflict' : (obs.status || same.status);
      same.sources = same.sources || [];
      if (obs.url && !same.sources.some((x) => x.url === obs.url)) same.sources.push(segSource(obs));
      return { action: 'duplicate', segment: same };
    }
    // 同期不同数字：保留原值，新值进 alt + 冲突队列
    same.alt = same.alt || [];
    if (!same.alt.some((a) => a.min === obs.min && a.max === obs.max && a.source && a.source.url === obs.url)) {
      same.alt.push({ min: obs.min, max: obs.max, source: segSource(obs) });
    }
    addConflict({
      key: `${obs.scope === 'province' ? 'P' : 'C'}:${obs.kind}:${obs.id}:${obs.from}`,
      kind: obs.kind,
      id: obs.id,
      from: obs.from,
      current: { min: same.min, max: same.max, url: (same.sources && same.sources[0] && same.sources[0].url) || null },
      incoming: { min: obs.min, max: obs.max, url: obs.url || null, title: obs.title || null, via: obs.via },
      at: new Date().toISOString(),
    });
    return { action: 'conflict', segment: same, note: '同一生效期出现不同数字，已进入复核队列' };
  }

  const segment = {
    from: obs.from,
    to: obs.to || null,
    min: obs.min,
    max: obs.max,
    basisYear: obs.basisYear || null,
    status: obs.status || 'suspect',
    confidence: obs.confidence || 'medium',
    checkedAt: new Date().toISOString(),
    sources: [segSource(obs)],
  };
  bucket.segments.push(segment);
  bucket.segments.sort((a, b) => (a.from < b.from ? -1 : 1));

  if (!segment.to) segment.to = inferTo(segment.from, obs.kind === 'social' ? 'social' : 'housing', bucket.segments);

  if (obs.rate) {
    if (obs.kind === 'social') bucket.rate = obs.rate;
    else bucket.rateRange = bucket.rateRange || [obs.rate.min, obs.rate.max];
  }
  return { action: 'inserted', segment };
}

/* ------------------------------------------------------------------ 冲突 */

function addConflict(rec) {
  ensureDir(DATA);
  let list = [];
  try { list = JSON.parse(fs.readFileSync(CONFLICTS, 'utf8')); } catch (e) { list = []; }
  const dup = list.find((x) => x.key === rec.key
    && x.incoming.min === rec.incoming.min && x.incoming.max === rec.incoming.max);
  if (dup) { dup.lastSeen = rec.at; dup.hits = (dup.hits || 1) + 1; }
  else list.push({ ...rec, hits: 1, lastSeen: rec.at });
  fs.writeFileSync(CONFLICTS, JSON.stringify(list, null, 2) + '\n');
}

function loadConflicts() {
  try { return JSON.parse(fs.readFileSync(CONFLICTS, 'utf8')); } catch (e) { return []; }
}

/* ------------------------------------------------------------------ 快照 */

function snapshot(dataset) {
  ensureDir(SNAPSHOTS);
  const body = JSON.stringify(dataset, null, 2);
  const hash = crypto.createHash('sha1').update(body).digest('hex').slice(0, 10);
  const file = path.join(SNAPSHOTS, `${today()}.json`);
  // 同一天多次运行：内容变了就加序号，不覆盖历史
  if (fs.existsSync(file)) {
    const old = fs.readFileSync(file, 'utf8');
    if (crypto.createHash('sha1').update(old).digest('hex').slice(0, 10) === hash) return file;
    const alt = path.join(SNAPSHOTS, `${today()}-${hash}.json`);
    fs.writeFileSync(alt, body);
    return alt;
  }
  fs.writeFileSync(file, body);
  return file;
}

function runDir(runId) {
  const d = path.join(RUNS, runId);
  ensureDir(d);
  return d;
}

/* ------------------------------------------------------------------ 覆盖 */

/** 生成年度覆盖报告：哪些城市拿到了 7-12 月基数、哪些还缺 */
function coverage(dataset, year) {
  const july = `${year}-07`;
  const jan = `${year}-01`;
  const housing = [];
  const social = [];

  Object.entries(dataset.cities || {}).forEach(([id, c]) => {
    const segs = (c.housing && c.housing.segments) || [];
    const hit = segs.find((s) => coversMonth(s, `${year}-12`)) || segs.find((s) => coversMonth(s, july));
    housing.push({ id, ok: !!hit, seg: hit || null, status: hit ? hit.status : null });
  });

  Object.entries(dataset.provinces || {}).forEach(([name, p]) => {
    const segs = (p.social && p.social.segments) || [];
    const hit = segs.find((s) => coversMonth(s, `${year}-12`)) || segs.find((s) => coversMonth(s, jan));
    social.push({ id: name, ok: !!hit, seg: hit || null, status: hit ? hit.status : null });
  });

  return {
    year,
    generatedAt: new Date().toISOString(),
    housing: { total: housing.length, ok: housing.filter((x) => x.ok).length, missing: housing.filter((x) => !x.ok).map((x) => x.id), items: housing },
    social: { total: social.length, ok: social.filter((x) => x.ok).length, missing: social.filter((x) => !x.ok).map((x) => x.id), items: social },
  };
}

module.exports = {
  DATA, OBS, DATASET, CONFLICTS, SNAPSHOTS, RUNS,
  loadDataset, saveDataset, emptyDataset,
  appendObservation, readObservations,
  mergeObservation, inferTo, coversMonth,
  addConflict, loadConflicts, snapshot, runDir, coverage,
  today, shiftDays, addMonths, ensureDir,
};
