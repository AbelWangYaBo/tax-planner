/* ============================================================================
 * lib/validate.js — 采集结果的合理性闸门
 * ----------------------------------------------------------------------------
 * 抽取成功 ≠ 数据正确。这一层只做「能不能信」的判断，不改数字：
 *
 *   1 结构合法  上限 > 下限，上限 ≥ 5000，上下限比值落在常识区间
 *   2 口径校验  社保上下限应约等于 300%/60% = 5.0 倍
 *   3 同比校验  与上一年度同口径相比，变动超过阈值（默认 25%）就降级待复核
 *   4 冲突校验  同一生效期出现两套数字 → 冲突，保留原值并进复核队列
 *
 * 注意：公积金上下限不一定 5 倍——下限常是最低工资、上限是社平 3 倍，
 * 比值取决于城市工资水平，不能套 5 倍规则。
 * ==========================================================================*/
'use strict';

function yoyChange(cur, prev) {
  if (!cur || !prev || !Number.isFinite(cur) || !Number.isFinite(prev)) return null;
  return (cur - prev) / prev;
}

/**
 * @param {object} obs  本次观测 {kind, min, max}
 * @param {object} ctx  {prevSegment, sameFromSegment}
 * @returns {{status:'verified'|'suspect'|'conflict', notes:string[], score:number}}
 */
function validate(obs, ctx = {}) {
  const notes = [];
  let score = 100;

  const { min, max } = obs;
  const kind = obs.kind === 'social' ? 'social' : 'housing';

  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) {
    return { status: 'conflict', notes: ['上下限缺失或非正数'], score: 0 };
  }
  if (max <= min) { notes.push('上限不大于下限'); score -= 60; }
  if (max < 5000) { notes.push('上限低于 5000，疑似把月缴存额当成基数'); score -= 50; }
  if (max > 120000) { notes.push('上限高于 12 万，疑似单位/年度口径错误'); score -= 40; }

  const ratio = max / min;
  if (kind === 'social') {
    if (ratio < 4.3 || ratio > 5.7) {
      notes.push(`社保上下限比值 ${ratio.toFixed(2)}，偏离 60%~300% 口径（约 5.0）`);
      score -= 45;
    } else if (ratio < 4.8 || ratio > 5.2) {
      notes.push(`社保上下限比值 ${ratio.toFixed(2)}，接近但未落在 4.8~5.2`);
      score -= 12;
    }
  } else if (ratio < 1.8 || ratio > 8) {
    notes.push(`公积金上下限比值 ${ratio.toFixed(2)} 异常`);
    score -= 30;
  }

  // 与上一年度同比
  const prevSeg = ctx.prevSegment;
  if (prevSeg && prevSeg.max) {
    const dMax = yoyChange(max, prevSeg.max);
    const dMin = yoyChange(min, prevSeg.min);
    if (dMax != null && Math.abs(dMax) > 0.25) {
      notes.push(`上限同比 ${(dMax * 100).toFixed(1)}%（${prevSeg.max} → ${max}），超过 25% 阈值`);
      score -= 25;
    }
    if (dMin != null && Math.abs(dMin) > 0.30) {
      notes.push(`下限同比 ${(dMin * 100).toFixed(1)}%（${prevSeg.min} → ${min}），超过 30% 阈值`);
      score -= 15;
    }
  }

  // 抽取置信度参与打分
  const conf = obs.confidence;
  if (conf === 'high') score += 0;
  else if (conf === 'medium') score -= 15;
  else if (conf === 'low') score -= 40;

  // 同一生效期已有不同数字 → 冲突
  if (ctx.sameFromSegment) {
    const s = ctx.sameFromSegment;
    if (s.min !== min || s.max !== max) {
      notes.push(`同一生效期已存在 ${s.min}~${s.max}，本次抓到 ${min}~${max}`);
      return { status: 'conflict', notes, score: 0 };
    }
  }

  const status = score >= 70 ? 'verified' : (score >= 45 ? 'suspect' : 'conflict');
  return { status, notes, score };
}

module.exports = { validate, yoyChange };
