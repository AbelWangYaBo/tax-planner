/* ============================================================================
 * build-cities.js — 由 data/dataset.json 生成 ../cities.js
 * ----------------------------------------------------------------------------
 * cities.js 是「产物」，不是手工维护的数据表。真源是：
 *   data/observations.jsonl → data/dataset.json（生效时间段）
 *
 * 生成规则：
 *   1 有官方数据（含当年 12 月所在时间段）→ 用官方数字，标记 official
 *   2 没有 → 回落到 cities.legacy.js 的旧口径，标记 legacy（界面会提示待核验）
 *   3 引擎只认 [前下限, 前上限, 后下限, 后上限, 调整月]，
 *      所以把「1 月所属段」和「12 月所属段」压成两段，调整月取后一段的起始月
 *
 * 用法：node build-cities.js [--year=2026]
 * ==========================================================================*/
'use strict';

const fs = require('fs');
const path = require('path');
const store = require('./lib/store');

const ROOT = path.join(__dirname, '..');
const LEGACY_FILE = path.join(ROOT, 'cities.legacy.js');
const OUT_FILE = path.join(ROOT, 'cities.js');

const argv = process.argv.slice(2);
// --official-only：只用官方核验过的数字，其余一律留空（界面上显示「缺」）。
// 默认关闭 = 官方优先、没核验的沿用旧口径并标 legacy，避免老城市直接算不出来。
const OFFICIAL_ONLY = argv.includes('--official-only');
const arg = (k, d) => {
  const hit = argv.find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.split('=').slice(1).join('=') : d;
};

// 首次运行时把现有 cities.js 备份为 legacy（之后永远以 legacy 为回落基线）
if (!fs.existsSync(LEGACY_FILE)) {
  fs.copyFileSync(OUT_FILE, LEGACY_FILE);
  console.log('已备份现有 cities.js → cities.legacy.js');
}

const LEGACY = require(LEGACY_FILE);
const dataset = store.loadDataset();

function covers(seg, date) {
  return seg.from <= date && (!seg.to || seg.to >= date);
}

function pickTriple(segs, year) {
  if (!segs || !segs.length) return null;
  const jan = segs.find((s) => covers(s, `${year}-01-01`));
  const dec = segs.find((s) => covers(s, `${year}-12-01`));
  if (!dec) return null;
  // 缺上一年度时，1–6 月只能拿今年的数字顶着用，但**调整月必须保留真实生效月**，
  // 否则 7 月切换这件事就被抹成「1 月起就是新基数」，历史口径会失真。
  const prev = jan || dec;
  let month = Number(String(dec.from).slice(5, 7)) || 1;
  if (!String(dec.from).startsWith(String(year))) month = 1;
  if (jan && String(dec.from).startsWith(`${year}-01`)) month = 1;
  return {
    values: [prev.min, prev.max, dec.min, dec.max, month],
    official: true,
    prevMissing: !jan,
    segments: segs,
    current: dec,
  };
}

function metaOf(triple) {
  if (!triple || !triple.official) return { status: 'legacy', checkedAt: null };
  const cur = triple.current;
  const src = (cur.sources && cur.sources[0]) || {};
  return {
    status: cur.status === 'verified' ? 'official' : (cur.status || 'official'),
    checkedAt: cur.checkedAt || null,
    from: cur.from,
    to: cur.to,
    basisYear: cur.basisYear || null,
    prevMissing: !!triple.prevMissing,
    doc: src.docNo || null,
    source: src.url || null,
    title: src.title ? String(src.title).replace(/\s+/g,' ').slice(0, 46) : null,
    via: src.via || null,
    segments: triple.segments.map((s) => ({ from: s.from, to: s.to, min: s.min, max: s.max, status: s.status })),
  };
}

const year = Number(arg('year', (dataset.policyYears && dataset.policyYears.length)
  ? Math.max(...dataset.policyYears) : new Date().getFullYear()));

const provinces = [];
let housingOfficial = 0;
let socialOfficial = 0;

LEGACY.DATA.provinces.forEach((p) => {
  const legacySocial = p.cities[0] && p.cities[0].social ? p.cities[0].social : null;
  const provBucket = dataset.provinces && dataset.provinces[p.name] ? dataset.provinces[p.name].social : null;
  const triple = provBucket ? pickTriple(provBucket.segments, year) : null;

  let socialArr;
  let socialMeta;
  if (triple) {
    socialArr = triple.values;
    socialMeta = metaOf(triple);
    socialOfficial++;
  } else if (legacySocial && !OFFICIAL_ONLY) {
    socialArr = [
      legacySocial.prev.min, legacySocial.prev.max,
      legacySocial.curr.min, legacySocial.curr.max,
      legacySocial.adjustMonth,
    ];
    socialMeta = { status: 'legacy', checkedAt: null };
  } else {
    socialArr = [0, 0, 0, 0, 1];
    socialMeta = { status: 'missing', checkedAt: null };
  }

  const cities = p.cities.map((c) => {
    const legacyHousing = c.housing
      ? [c.housing.prev.min, c.housing.prev.max, c.housing.curr.min, c.housing.curr.max, c.housing.adjustMonth]
      : null;
    let note = (c.housing && c.housing.note) || '';
    const cityBucket = dataset.cities && dataset.cities[c.id] ? dataset.cities[c.id].housing : null;
    const hTriple = cityBucket ? pickTriple(cityBucket.segments, year) : null;

    let housing = null;
    let rates = c.housingRates || null;
    let hMeta = { status: 'missing', checkedAt: null };

    if (hTriple) {
      housing = hTriple.values.slice(0, 5);
      if (cityBucket.rateRange) rates = cityBucket.rateRange.slice(0, 2);
      hMeta = metaOf(hTriple);
      note = hTriple.prevMissing
        ? `缺 ${year - 1} 年度原文，1–6 月暂按 ${year} 年度基数计算`
        : '';
      housingOfficial++;
    } else if (legacyHousing && !OFFICIAL_ONLY) {
      housing = legacyHousing;
      hMeta = { status: 'legacy', checkedAt: null, note };
    }

    return {
      id: c.id,
      name: c.name,
      province: p.name,
      social: {
        prev: { min: socialArr[0], max: socialArr[1] },
        curr: { min: socialArr[2], max: socialArr[3] },
        adjustMonth: socialArr[4],
        meta: socialMeta,
        segments: socialMeta.segments || [],
      },
      housing: housing ? {
        prev: { min: housing[0], max: housing[1] },
        curr: { min: housing[2], max: housing[3] },
        adjustMonth: housing[4],
        note,
        meta: hMeta,
        segments: hMeta.segments || [],
      } : null,
      housingRates: rates,
      lat: c.lat,
      lng: c.lng,
    };
  });

  provinces.push({ name: p.name, social: socialArr, socialMeta, cities });
});

const DATA = {
  socialYear: year,
  prevYear: year - 1,
  verifiedAt: `${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  dataUpdatedAt: dataset.updatedAt || null,
  official: {
    housing: housingOfficial,
    social: socialOfficial,
    note: 'official = 已从地方政务站原文抽取并核验；legacy = 尚未核验的历史口径，界面会提示',
  },
  provinces,
};

const body = `/* ============================================================================
 * cities.js — 社保 / 住房公积金 缴费基数数据（自动生成，请勿手改）
 * ----------------------------------------------------------------------------
 * 由 collector/build-cities.js 依据 data/dataset.json 生成。
 * 数据模型是「生效时间段」，这里压成引擎需要的两段：
 *   social: [调整前下限, 调整前上限, 调整后下限, 调整后上限, 调整月份]
 *   housing[城市]: [前下限, 前上限, 后下限, 后上限, 月份]
 *   housingRates[城市]: [比例下限, 比例上限]
 *
 * 每个省/城市还带 meta：status(official|legacy|missing)、文号、原文 URL、
 * 抓取时间与历史时间段，页面据此标注「官方核验」还是「沿用旧口径」。
 *
 * 覆盖：${provinces.length} 个省级行政区 / ${provinces.reduce((n, p) => n + p.cities.length, 0)} 个地级行政区
 * 官方核验：公积金 ${housingOfficial} 城，社保 ${socialOfficial} 省
 * 数据时间：${DATA.dataUpdatedAt || '尚未采集'}
 * ==========================================================================*/
(function (root) {
  'use strict';

  const DATA = ${JSON.stringify(DATA, null, 2)};

  const INDEX = {};

  DATA.provinces.forEach((prov) => {
    prov.cities.forEach((city) => { INDEX[city.id] = city; });
  });

  const TOTAL_CITIES = Object.keys(INDEX).length;
  const HOUSING_CITIES = Object.keys(INDEX).filter((id) => INDEX[id].housing).length;

  function getCity(id) { return INDEX[id] || null; }

  function defaultHousingRate(city) {
    if (!city || !city.housingRates) return 0.12;
    return Math.min(Math.max(0.12, city.housingRates[0]), city.housingRates[1]);
  }

  function provinceOf(cityId) {
    const c = getCity(cityId);
    return c ? c.province : '';
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function nearestCity(lat, lng) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    let best = null;
    let bestKm = Infinity;
    Object.keys(INDEX).forEach((id) => {
      const c = INDEX[id];
      if (!Number.isFinite(c.lat) || !Number.isFinite(c.lng)) return;
      const km = haversine(lat, lng, c.lat, c.lng);
      if (km < bestKm) { bestKm = km; best = c; }
    });
    return best ? { city: best, km: bestKm } : null;
  }

  const API = {
    DATA, INDEX, TOTAL_CITIES, HOUSING_CITIES,
    getCity, defaultHousingRate, provinceOf, nearestCity, haversine,
    metaOf: (id) => {
      const c = getCity(id);
      return c ? { social: c.social.meta, housing: c.housing ? c.housing.meta : null } : null;
    },
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.CityData = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;

fs.writeFileSync(OUT_FILE, body);
console.log(`已生成 cities.js：${provinces.length} 省 / ${provinces.reduce((n, p) => n + p.cities.length, 0)} 城，官方核验 公积金 ${housingOfficial} / 社保 ${socialOfficial}（数据年度 ${year}）`);
