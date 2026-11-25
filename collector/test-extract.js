/* ============================================================================
 * test-extract.js — 抽取器回归（真实语料，逐条可复现）
 * ----------------------------------------------------------------------------
 * 这些句子都是从政务站原文里摘的（换行已按页面 flatten 处理），
 * 每条都对应一个曾经踩过的坑，改抽取规则后先跑这个：
 *
 *   node test-extract.js
 * ==========================================================================*/
'use strict';

const { extractNotice } = require('./lib/extract');

const CASES = [
  {
    name: '北京 2026（上限/下限分句）',
    kind: 'housing', year: 2026,
    text: '2026住房公积金年度缴存基数上限为36348元，月缴存基数下限为2540元。',
    expect: { upper: 36348, lower: 2540 },
  },
  {
    name: '南京 2026（括号写法 3倍）',
    kind: 'housing', year: 2026,
    text: '缴存基数的上限为南京市上一年度职工月平均工资的3倍(42400元)，缴存基数下限为2660元。',
    expect: { upper: 42400, lower: 2660 },
  },
  {
    name: '成都 2026（下限隔着长串区名）',
    kind: 'housing', year: 2026,
    text: '缴存基数上限为32969元。缴存基数下限按区域分为：四川天府新区、成都高新区、锦江区、青羊区、金牛区、武侯区、成华区、龙泉驿区、青白江区、新都区、温江区、双流区、郫都区、新津区为2330元。',
    expect: { upper: 32969, lower: 2330 },
  },
  {
    name: '济南 2026',
    kind: 'housing', year: 2026,
    text: '自2026年7月1日起，住房公积金缴存基数上限为33902元，下限为2400元。',
    expect: { upper: 33902, lower: 2400 },
  },
  {
    name: '贵阳（排除月缴存额 6094/214）',
    kind: 'housing', year: 2026,
    text: '缴存基数上限为25392元，下限为2130元；按12%比例计算，月缴存额上限为6094元，月缴存额下限为214元。',
    expect: { upper: 25392, lower: 2130 },
  },
  {
    name: '郑州 2026',
    kind: 'housing', year: 2026,
    text: '2026年度住房公积金缴存基数上限为28849元，缴存基数下限为2350元。',
    expect: { upper: 28849, lower: 2350 },
  },
  {
    // 这条是上海 2026 真实页面的两句并列：前一句是「2025年度上限(37302元)」，
    // 后一句才是本年度的 37731/2740。早先版本会挑到 37302，上限错一年。
    name: '上海 2026（跨年度并列，不能取上年数字）',
    kind: 'housing', year: 2026,
    text: '上述单位中,若有填报工资大于2025年度缴存基数上限(37302元)的职工,市公积金中心将根据2026年度缴存基数上限自动为该职工重新核定缴存基数。住房公积金缴存基数最高不超过37731元,最低不低于2740元。',
    expect: { upper: 37731, lower: 2740 },
  },
  {
    name: '广州 2026（不低于最低工资 + 3倍）',
    kind: 'housing', year: 2026,
    text: '缴存基数不低于本市最低工资标准（现行标准为2500元），不高于本市上一年度职工月平均工资的3倍，即41697元。',
    expect: { upper: 41697, lower: 2500 },
  },
  {
    name: '上海社保 2026',
    kind: 'social', year: 2026,
    text: '2026年7月1日起，本市社保缴费基数的上限调整为37731元/月，下限调整为7546元/月。',
    expect: { upper: 37731, lower: 7546 },
  },
  {
    name: '杭州 2026（PDF 文本，市区与郊县两个下限）',
    kind: 'housing', year: 2026,
    text: '自2026年7月1日起，我市住房公积金缴存基数上限调整为42151元；市区下限调整为2660元，桐庐、淳安、建德下限调整为2430元。',
    expect: { upper: 42151, lower: 2660 },
  },
];

let pass = 0;
let fail = 0;
CASES.forEach((c) => {
  const r = extractNotice(c.text, { kind: c.kind, year: c.year });
  const ok = r.ok && r.upper === c.expect.upper && r.lower === c.expect.lower;
  if (ok) { pass += 1; console.log(`  ✓ ${c.name}  →  ${r.lower}~${r.upper}`); } else {
    fail += 1;
    console.log(`  ✗ ${c.name}  期望 ${c.expect.lower}~${c.expect.upper}，实际 ${r.lower}~${r.upper}（${r.reason}）`);
  }
});

console.log(`\n抽取回归：通过 ${pass} 项，失败 ${fail} 项`);
process.exit(fail ? 1 : 0);
