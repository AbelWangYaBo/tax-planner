/* tax-core 自检脚本：node test.js */
const T = require('./tax-core.js');
const C = require('./cities.js');

let pass = 0, fail = 0;
const failures = [];

function eq(name, actual, expected, tol = 0.005) {
  const ok = Math.abs(actual - expected) <= tol;
  if (ok) { pass++; }
  else { fail++; failures.push(`${name}: 期望 ${expected}，实际 ${actual}`); }
}

function eqs(name, actual, expected) {
  if (actual === expected) pass++;
  else { fail++; failures.push(`${name}: 期望 "${expected}"，实际 "${actual}"`); }
}

function ok(name, cond, detail) {
  if (cond) pass++;
  else { fail++; failures.push(`${name}${detail ? ' — ' + detail : ''}`); }
}

function section(t) { console.log(`\n—— ${t} ——`); }

/* ---------------------------------------------------------------- */
section('1. 税率表边界');

// 年度综合所得税率表（速算扣除数校验：跨档连续性）
eq('annualTax(0)', T.annualTax(0), 0);
eq('annualTax(36000)', T.annualTax(36000), 1080);
eq('annualTax(36001)', T.annualTax(36001), 1080.1);
eq('annualTax(144000)', T.annualTax(144000), 11880);
eq('annualTax(144001)', T.annualTax(144001), 11880.2);
eq('annualTax(300000)', T.annualTax(300000), 43080);
eq('annualTax(960000)', T.annualTax(960000), 250080);
eq('annualTax(1000000)', T.annualTax(1000000), 268080);

// 年终奖单独计税：除 12 查表，速算扣除数只扣一次
eq('bonus(36000)', T.bonusSeparateTax(36000), 1080);          // 3000/月 → 3%
eq('bonus(36001)', T.bonusSeparateTax(36001), 3390.1);        // 3000.08/月 → 10%，23210.1 的跳变
eq('bonus(144000)', T.bonusSeparateTax(144000), 14190);      // 12000/月 → 10%，144000×10%−210
eq('bonus(144001)', T.bonusSeparateTax(144001), 27390.2);    // 20%，跳变 13,200.2
eq('bonus(300000)', T.bonusSeparateTax(300000), 58590);       // 20%
eq('bonus(960000)', T.bonusSeparateTax(960000), 328840);      // 35%
eq('bonus(1200000)', T.bonusSeparateTax(1200000), 524840);    // 45%

// 股票期权式跳变：再多 1 元，多缴 23,210 元——这正是「盲区」成因
eq('bonus 盲区跳变量', T.bonusSeparateTax(36001) - T.bonusSeparateTax(36000), 2310.1);

section('2. 劳务 / 稿酬 / 特许权使用费');

eq('incomeAmount(3000)', T.incomeAmount(3000), 2200);         // 减 800
eq('incomeAmount(4000)', T.incomeAmount(4000), 3200);
eq('incomeAmount(4001)', T.incomeAmount(4001), 3200.8);       // 减 20%
eq('incomeAmount(10000)', T.incomeAmount(10000), 8000);

eq('laborWithhold(3000)', T.laborWithhold(3000), 440);        // 2200×20%
eq('laborWithhold(10000)', T.laborWithhold(10000), 1600);     // 8000×20%
eq('laborWithhold(30000)', T.laborWithhold(30000), 5200);     // 24000×30%−2000
eq('laborWithhold(100000)', T.laborWithhold(100000), 25000);  // 80000×40%−7000

eq('royaltyAmount(10000)', T.royaltyAmount(10000), 5600);     // 8000×70%
eq('royaltyWithhold(10000)', T.royaltyWithhold(10000), 1120); // 5600×20%
eq('licenseWithhold(10000)', T.licenseWithhold(10000), 1600); // 8000×20%

section('3. 累计预扣法');

// 月薪 28,500，社保公积金 22.5%（= 6,412.5），专项附加扣除 3,000/月
const w = T.simulateWage({
  monthly: 28500, months: 12,
  socialMonthly: 6412.5, specialMonthly: 3000, otherMonthly: 0,
});
eq('工资累计收入', w.income, 342000);
eq('社保累计', w.social, 76950);
const expectAnnual = T.annualTax(342000 - 60000 - 76950 - 36000);
eq('汇算应纳', expectAnnual, 16890);
eq('预扣累计 == 汇算应纳', w.tax, expectAnnual);

// 逐月预扣递增（累计预扣的特征）
ok('逐月预扣金额非递减', w.rows[11].tax >= w.rows[0].tax,
   `12月 ${w.rows[11].tax} vs 1月 ${w.rows[0].tax}`);

section('4. 年终奖方案寻优（断点枚举 vs 暴力扫描）');

let opts = 0;
for (const B of [0, 1000, 30000, 36000, 36001, 100000, 144000, 200000, 500000, 1000000]) {
  for (const base of [0, 20000, 100000, 200000, 500000]) {
    const fast = T.optimizeSplit(B, base);
    const slow = T.scanOptimal(B, base, Math.max(1, Math.floor(B / 3000) || 1));
    ok(
      `optimizeSplit 不劣于暴力扫描 B=${B} base=${base}`,
      fast.totalTax <= slow.totalTax + 0.01,
      `fast=${fast.totalTax.toFixed(2)} slow=${slow.totalTax.toFixed(2)}`
    );
    opts++;
  }
}
console.log(`  共验证组合 ${opts} 组`);

// 最优方案税负 <= 二选一
const b1 = T.optimizeSplit(100000, 150000);
const aSep = T.bonusSeparateTax(100000) + T.annualTax(150000);
const aInc = T.annualTax(150000 + 100000);
ok('最优拆分 <= 全部单独', b1.totalTax <= aSep + 0.01, `${b1.totalTax} vs ${aSep}`);
ok('最优拆分 <= 全部并入', b1.totalTax <= aInc + 0.01, `${b1.totalTax} vs ${aInc}`);

/* 构造一个「拆分明显更优」的例子
 * base=36000（3% 档顶）、B=100000：
 *   全部单独 1080+1080=2160? 否 —— 实际 9790+1080=10870
 *   全部并入 annualTax(136000)=11080
 *   拆分 x=36000：1080 + annualTax(100000) = 1080+7480 = 8560
 */
const B2 = 100000, base2 = 36000;
const f2 = T.optimizeSplit(B2, base2);
const sep2 = T.bonusSeparateTax(B2) + T.annualTax(base2);
const inc2 = T.annualTax(base2 + B2);
console.log(`  样例 B=${B2} base=${base2}: 单独 ${sep2.toFixed(2)} / 并入 ${inc2.toFixed(2)} / 最优 ${f2.totalTax.toFixed(2)} (拆 ${f2.x})`);
ok('该样例确实存在优于二选一的拆分', f2.totalTax < Math.min(sep2, inc2) - 1);
eq('该样例最优解', f2.totalTax, 8560);
eq('该样例拆分点', f2.x, 36000);

// 12.6 数据覆盖度与年度
eq('覆盖 31 个省级行政区', C.DATA.provinces.length, 31);
ok('城市数不少于 330', C.TOTAL_CITIES >= 330, String(C.TOTAL_CITIES));
eqs('社保数据年度', String(C.DATA.socialYear), '2026');
ok('公积金已收录主要城市', C.HOUSING_CITIES >= 20, String(C.HOUSING_CITIES));
ok('北京公积金有上下限', !!C.getCity('北京').housing);
ok('石家庄社保继承省级', C.getCity('石家庄').social.min === C.getCity('唐山').social.min);

section('5. 盲区');

const zones = T.blindZones();
console.log('  ' + zones.map(z => `${z.from}–${z.to}`).join('  |  '));
eq('盲区 36000 上界', zones[0].to, 38566);
eq('盲区 144000 上界', zones[1].to, 160500);
eq('盲区 300000 上界', zones[2].to, 318333);
eq('盲区 420000 上界', zones[3].to, 447500);
eq('盲区 660000 上界', zones[4].to, 706538);
eq('盲区 960000 上界', zones[5].to, 1120000);

// 盲区内「多发反而少得」
for (const z of zones) {
  const mid = Math.floor((z.from + z.to) / 2);
  const netAtFrom = z.from - T.bonusSeparateTax(z.from);
  const netAtMid = mid - T.bonusSeparateTax(mid);
  ok(`盲区 ${z.from} 内多发少得`, netAtMid < netAtFrom,
     `${mid} 到手 ${netAtMid.toFixed(0)} vs ${z.from} 到手 ${netAtFrom.toFixed(0)}`);
}

// 便捷构造：单个主工作任职单位
function one(emp, extra) {
  return Object.assign({ employers: [Object.assign({ type: 'primary', months: 12 }, emp)] }, extra || {});
}

section('6. 端到端场景');

// 6.1 纯工资，无奖金 → 汇算应补退 = 0
const r1 = T.compute(one({ monthly: 28500 }, { specialMonthly: 3000 }));
eq('无奖金时补退为 0', r1.optimal.settle, 0);
eq('无奖金时总税额', r1.optimal.totalTax, 16890);
eq('到手收入', r1.optimal.net, 342000 - 76950 - 16890);

// 6.2 两处任职 → 必然补税
const r2 = T.compute({
  employers: [
    { type: 'primary', monthly: 20000, months: 12, social: { rate: 0.22 }, housing: { rate: 0 } },
    { type: 'secondary', monthly: 12000, months: 12 },
  ],
  specialMonthly: 2000,
});
ok('两处任职产生补税', r2.plans[0].settle > 0, `补 ${r2.plans[0].settle}`);
console.log(`  两处任职：收入 ${r2.totalIncome}，应纳 ${r2.plans[0].totalTax}，补税 ${r2.plans[0].settle}`);

// 6.3 年终奖落盲区 → 应触发 danger 提示
const r3 = T.compute(one({ monthly: 20000, bonus: 37000 }, { specialMonthly: 2000 }));
ok('盲区告警触发', r3.alerts.some(a => a.level === 'danger' && a.title.includes('盲区')), JSON.stringify(r3.alerts.map(a=>a.title)));

// 6.4 方案 A 的补退应为 0（预缴即最终）
eq('方案A补退为0', r3.plans[0].settle, 0);

// 6.5 全部并入 → 补退税 = 并入税差
const r3b = r3.plans[1];
const expectSettle = T.annualTax(r3.base.baseTaxable + r3.bonusPool)
  - (r3.base.baseWithheld + T.bonusSeparateTax(r3.bonusPool));
eq('方案B补退公式校验', r3b.settle, expectSettle);

// 6.6 股权激励单独计税
const r4 = T.compute(one({ monthly: 20000 }, { equity: 300000, specialMonthly: 2000 }));
eq('股权激励单独计税', r4.equityTax, T.annualTax(300000));
ok('股权激励不进入综合所得', Math.abs(
  r4.base.baseTaxable - T.compute(one({ monthly: 20000 }, { specialMonthly: 2000 })).base.baseTaxable
) < 0.01);

// 6.7 劳务报酬跨档补税
const r5 = T.compute(one({ monthly: 30000 }, {
  labor: { total: 200000, count: 4 },
  specialMonthly: 3000,
}));
console.log(`  劳务 20万(4笔)：预扣 ${r5.labor.tax}，汇算补退 ${r5.optimal.settle}`);
ok('劳务报酬预扣率高于最终税率 → 退税', r5.optimal.settle < 0, `settle=${r5.optimal.settle}`);

section('7. 不变量');

const cases = [
  { base: 0, B: 50000 },
  { base: 50000, B: 200000 },
  { base: 400000, B: 700000 },
];
for (const c of cases) {
  const f = T.optimizeSplit(c.B, c.base);
  ok(`拆分点落在 [0,B] 内 base=${c.base}`, f.x >= 0 && f.x <= c.B, `x=${f.x}`);
  ok(`拆分为非负税额 base=${c.base}`, f.totalTax >= 0);
}

// 三方案总税额排序：最优最小
const sorted = [...r3.plans].sort((a, b) => a.totalTax - b.totalTax);
eq('最优方案 = 方案中最小', r3.optimal.totalTax, sorted[0].totalTax);
ok('缺口字段一致', sorted[0].gapToBest === 0);

// 7.1 方案 C 只在存在中间拆分点时出现，避免与 A/B 重复
const corner = T.compute(one({ monthly: 28500, bonus: 100000 }, { specialMonthly: 3000 }));
eq('端点最优时只有 2 个方案', corner.plans.length, 2);
eqs('端点最优标记在方案 A', corner.optimal.key, 'separate');
ok('方案列表不含重复项', new Set(corner.plans.map((p) => p.totalTax)).size >= 1);

const splitCase = T.compute(one({ monthly: 28500, bonus: 37000 }, { specialMonthly: 3000 }));
eq('存在拆分点时 3 个方案', splitCase.plans.length, 3);
eqs('拆分场景最优为方案 C', splitCase.optimal.key, 'optimal');
ok('方案 C 是真正的中间拆分',
   splitCase.optimal.separatePart > 0 && splitCase.optimal.includedPart > 0,
   `${splitCase.optimal.separatePart} + ${splitCase.optimal.includedPart}`);

const noBonus = T.compute(one({ monthly: 28500 }));
eq('无奖金时仍返回 2 个方案', noBonus.plans.length, 2);
eqs('无奖金 optKind', noBonus.optKind, 'none');

section('8. 年中入职（减除费用差异）');

// 只任职 7 个月：预缴按 5,000×7 扣，汇算按全年 60,000 扣，应产生退税
const mid = T.compute(one({ monthly: 30000, months: 7, social: { rate: 0.20 }, housing: { rate: 0 } },
  { specialMonthly: 2000, otherAnnual: 12000 }));
eq('7 个月预缴', mid.primary.sim.tax, 8180);
eq('7 个月汇算应纳', mid.plans[0].compTax, 5680);
eq('7 个月应退税', mid.plans[0].settle, -2500);

// 满 12 个月、无其他所得 → 补退必须为 0（检验排除分位漂移）
const full = T.compute(one({ monthly: 30000, social: { rate: 0.20 }, housing: { rate: 0 } },
  { specialMonthly: 2000, otherAnnual: 12000 }));
eq('满 12 个月补退为 0', full.plans[0].settle, 0);

section('9. 社保 / 公积金分离与基数上下限');

// 9.1 公积金比例独立可写
const h1 = T.compute(one({ monthly: 20000, social: { rate: 0.105 }, housing: { rate: 0.05 } }));
eq('社保月缴', h1.social.monthly, 2100);
eq('公积金个人月缴', h1.housing.monthly, 1000);
eq('公积金个人年缴', h1.housing.employee, 12000);
eq('公积金单位年缴', h1.housing.employer, 12000);
eq('公积金双边合计', h1.housing.total, 24000);
eq('专项扣除合计', h1.base.socialTotal, 3100 * 12);

// 9.2 公积金单列为额外项：不计入到手现金，计入综合价值
eq('到手现金不含公积金', h1.optimal.net, h1.totalIncome - 3100 * 12 - h1.optimal.totalTax);
eq('公积金双边计入综合价值', h1.optimal.totalValue, h1.optimal.net + 24000);
eq('公积金仍是税前扣除项', h1.base.baseDeduction, 60000 + 3100 * 12);

// 9.3 基数上限封顶
const h2 = T.compute(one({ monthly: 60000, social: { rate: 0.105, cap: 36921 }, housing: { rate: 0.12, cap: 36921 } }));
eq('社保基数按上限封顶', h2.social.base, 36921);
eq('社保月缴按封顶基数', h2.social.monthly, T.round2(36921 * 0.105));
eqs('社保封顶标记', h2.social.clamp, 'cap');
eq('公积金基数按上限封顶', h2.housing.base, 36921);
eqs('公积金封顶标记', h2.housing.clamp, 'cap');

// 9.4 基数下限保底
const h3 = T.compute(one({ monthly: 3000, social: { rate: 0.105, floor: 7000 }, housing: { rate: 0.12, floor: 7000 } }));
eq('社保基数按下限保底', h3.social.base, 7000);
eqs('社保保底标记', h3.social.clamp, 'floor');
eq('保底下月缴高于按工资', h3.social.monthly, T.round2(7000 * 0.105));

// 9.5 指定基数（不按实际工资）
const h4 = T.compute(one({ monthly: 30000, social: { rate: 0.105, baseMode: 'manual', base: 15000 } }));
eq('指定基数生效', h4.social.base, 15000);
eq('指定基数月缴', h4.social.monthly, T.round2(15000 * 0.105));

// 9.6 封顶后扣除变少、应纳税所得额变高
const noCap = T.compute(one({ monthly: 60000, social: { rate: 0.105 }, housing: { rate: 0.12 } }));
ok('封顶后应纳税所得额更高', h2.base.baseTaxable > noCap.base.baseTaxable,
   `封顶 ${h2.base.baseTaxable} vs 未封顶 ${noCap.base.baseTaxable}`);

// 9.7 红包笔数默认 0 的处理
const h5 = T.compute(one({ monthly: 20000 }, { labor: { total: 10000, count: 0 } }));
eq('笔数 0 按 1 笔处理', h5.labor.installments, 1);
eq('笔数 0 预扣正确', h5.labor.tax, T.laborWithhold(10000));

const h6 = T.compute(one({ monthly: 20000 }, { labor: { total: 0, count: 0 } }));
eq('无劳务收入时预扣为 0', h6.labor.tax, 0);
eq('无劳务收入时收入额为 0', h6.labor.gross, 0);

// 9.9 选「指定」但未填基数时，回落到按工资
const h7 = T.compute(one({ monthly: 20000, social: { rate: 0.105, baseMode: 'manual', base: 0 } }));
eq('指定基数未填则按工资', h7.social.base, 20000);

section('10. 多任职单位（换工作 / 多处任职）');

// 10.1 换工作：两段任职各按实际月数预扣，合计不超过 12
const jc = T.compute({
  employers: [
    { type: 'primary', monthly: 30000, months: 6, social: { rate: 0.105 }, housing: { rate: 0.12 } },
    { type: 'change', monthly: 40000, months: 6, social: { rate: 0.105 }, housing: { rate: 0.12 } },
  ],
});
eq('换工作：工资收入合计', jc.base.wageIncome, (30000 + 40000) * 6);
// 两家单位各自从零起算累计预扣，汇算合并后税率上台阶 → 必然补税
ok('换工作产生补税', jc.plans[0].settle > 0, `补 ${jc.plans[0].settle}`);
eq('换工作补税额', jc.plans[0].settle, 13470);

// 10.2 多处任职：第二处不缴社保公积金
const sec = T.compute({
  employers: [
    { type: 'primary', monthly: 20000, months: 12, social: { rate: 0.105 }, housing: { rate: 0.12 } },
    { type: 'secondary', monthly: 10000, months: 12 },
  ],
});
eq('多处任职：第二处无社保', sec.employers[1].socialTotal, 0);
ok('多处任职：第二处无公积金', sec.employers[1].housingTotal === 0);
eq('多处任职：个人公积金只来自主工作', sec.housing.employee, T.round2(20000 * 0.12 * 12));
eq('多处任职：单位公积金只来自主工作', sec.housing.employer, T.round2(20000 * 0.12 * 12));
ok('多处任职：因重复扣除 5,000 而补税', sec.plans[0].settle > 0, `补 ${sec.plans[0].settle}`);

// 10.3 各单位奖金合并进奖金池（单独计税一年只能用一次）
const mb = T.compute({
  employers: [
    { type: 'primary', monthly: 20000, months: 12, bonus: 50000 },
    { type: 'change', monthly: 25000, months: 12, bonus: 30000 },
  ],
});
eq('奖金池合并', mb.bonusPool, 80000);

// 10.4 专项附加扣除只扣一次
eq('专项附加只在主工作扣除',
   mb.employers[0].sim.special, 0);
const sp = T.compute({
  employers: [
    { type: 'primary', monthly: 20000, months: 12 },
    { type: 'change', monthly: 25000, months: 12 },
  ],
  specialMonthly: 2000,
});
eq('专项附加扣除仅计一次', sp.base.specialTotal, 24000);

// 10.5 空任职列表兜底
const empty = T.compute({ employers: [] });
eq('空任职列表不报错', empty.totalIncome, 0);

section('11. 公积金双边');

const bi = T.compute(one({ monthly: 20000, social: { rate: 0.105 }, housing: { rate: 0.12, employerRate: 0.05 } }));
eq('个人按 12% 缴存', bi.housing.employee, T.round2(20000 * 0.12 * 12));
eq('单位按 5% 缴存', bi.housing.employer, T.round2(20000 * 0.05 * 12));
eq('双边合计', bi.housing.total, T.round2(20000 * (0.12 + 0.05) * 12));

// 关键：单位缴存不进个人工资，绝不能税前扣除
eq('税前扣除只含个人部分', bi.base.socialTotal, T.round2((20000 * 0.105 + 20000 * 0.12) * 12));
const onlyPersonal = T.compute(one({ monthly: 20000, social: { rate: 0.105 }, housing: { rate: 0.12, employerRate: 0.12 } }));
eq('单位比例不影响税额', bi.optimal.totalTax, onlyPersonal.optimal.totalTax);

// 默认：单位比例未填则与个人一致
const same = T.compute(one({ monthly: 20000, housing: { rate: 0.08 } }));
eq('单位比例默认等于个人', same.housing.employer, same.housing.employee);

// 现金到手不受单位缴存影响
eq('到手现金只看个人缴存', bi.optimal.net, bi.totalIncome - bi.base.socialTotal - bi.optimal.totalTax);

section('12. 定位：最近城市匹配');

// 12.1 主要城市有坐标（未收录坐标的城市不参与最近城市匹配）
const withCoord = Object.keys(C.INDEX).filter((id) => Number.isFinite(C.INDEX[id].lat));
ok('至少 30 个城市有坐标', withCoord.length >= 30, String(withCoord.length));
ok('每个省至少有一个带坐标的城市',
   C.DATA.provinces.every((pv) => pv.cities.some((c) => Number.isFinite(c.lat))),
   C.DATA.provinces.filter((pv) => !pv.cities.some((c) => Number.isFinite(c.lat))).map((p) => p.name).join(','));

// 12.2 典型坐标命中正确城市
const hits = [
  ['北京天安门', 39.9087, 116.3975, '北京'],
  ['上海人民广场', 31.2304, 121.4737, '上海'],
  ['杭州西湖', 30.2592, 120.1300, '杭州'],
  ['深圳福田', 22.5431, 114.0579, '深圳'],
  ['苏州工业园区', 31.3177, 120.6750, '苏州'],
  ['石家庄', 38.0428, 114.5149, '石家庄'],
  ['哈尔滨', 45.8038, 126.5349, '哈尔滨'],
  ['乌鲁木齐', 43.8256, 87.6168, '乌鲁木齐'],
];
for (const [name, lat, lng, expectId] of hits) {
  const r = C.nearestCity(lat, lng);
  eqs('定位命中 ' + name, r.city.id, expectId);
  ok('定位距离合理 ' + name, r.km < 30, `${r.km.toFixed(1)} km`);
}

// 12.3 昆山应归苏州而非上海
eqs('昆山归苏州', C.nearestCity(31.3857, 120.9807).city.id, '苏州');

// 12.4 非法输入返回 null
ok('无坐标返回 null', C.nearestCity(null, undefined) === null);
ok('NaN 返回 null', C.nearestCity(NaN, 120) === null);

// 12.5 球面距离量级正确（北京—上海约 1060–1080 km）
const d = C.haversine(39.9042, 116.4074, 31.2304, 121.4737);
ok('北京—上海距离量级正确', d > 1000 && d < 1120, d.toFixed(0) + ' km');

section('13. 公积金按金额缴存');

const amt = T.compute(one({
  monthly: 15000,
  social: { rate: 0.105 },
  housing: { mode: 'amount', monthly: 3000, employerMonthly: 3000 },
}));
eqs('缴存方式记录为 amount', amt.housing.mode, 'amount');
eq('个人月缴按金额', amt.housing.monthly, 3000);
eq('单位月缴按金额', amt.housing.employerMonthly, 3000);
eq('个人年缴', amt.housing.employee, 36000);
eq('单位年缴', amt.housing.employer, 36000);
eq('双边合计', amt.housing.total, 72000);
eq('按金额时无缴存基数', amt.housing.base, 0);
eq('按金额时比例为 0', amt.housing.rate, 0);

// 关键场景：缴存基数与实际工资不一致（如低薪高缴），按金额填报不受上下限约束
const bigAmt = T.compute(one({
  monthly: 15000,
  housing: { mode: 'amount', monthly: 8000, employerMonthly: 8000, floor: 1000, cap: 5000 },
}));
eq('按金额不受基数上限截断', bigAmt.housing.monthly, 8000);

// 个人金额仍是税前专项扣除
eq('个人缴存计入专项扣除', amt.base.socialTotal, T.round2(15000 * 0.105 * 12) + 36000);

// 单位金额只进账户，不影响税额与到手
const amtHi = T.compute(one({
  monthly: 15000, social: { rate: 0.105 },
  housing: { mode: 'amount', monthly: 3000, employerMonthly: 9000 },
}));
eq('单位金额不影响税额', amtHi.optimal.totalTax, amt.optimal.totalTax);
eq('单位金额到账更多', amtHi.housing.total, 36000 + 108000);
eq('单位金额不影响到手现金', amtHi.optimal.net, amt.optimal.net);

// 按比例模式行为不变
const rateMode = T.compute(one({ monthly: 15000, housing: { rate: 0.12 } }));
eqs('默认缴存方式为 rate', rateMode.housing.mode, 'rate');
eq('按比例个人月缴', rateMode.housing.monthly, T.round2(15000 * 0.12));

// 单位比例缺省时与个人一致
const linked = T.compute(one({ monthly: 20000, housing: { rate: 0.08 } }));
eq('单位比例缺省等于个人', linked.housing.employer, linked.housing.employee);

section('14. 逐月收入（销售 / 补助）与缴费基数');

const inc = [8000, 12000, 30000, 8000, 8000, 45000, 8000, 9000, 8000, 60000, 8000, 8000];
const incSum = inc.reduce((a, b) => a + b, 0);   // 212,000

// 14.1 逐月收入驱动累计预扣
const sales = T.compute({
  employers: [{
    type: 'primary', monthly: 0, baseMonthly: 12000, months: 12, incomes: inc,
    social: { rate: 0.105 }, housing: { rate: 0.12 },
  }],
});
eq('年工资收入 = 逐月合计', sales.base.wageIncome, incSum);
eq('逐月收入被记录', sales.primary.incomes.length, 12);

// 14.2 关键：社保基数用「核定基数」，不是月均收入
eq('社保基数取核定值', sales.social.base, 12000);
eq('社保月缴按核定基数', sales.social.monthly, 1260);
ok('核定基数 ≠ 月均收入', Math.abs(sales.social.base - incSum / 12) > 100,
   `基数 ${sales.social.base} vs 月均 ${(incSum / 12).toFixed(2)}`);

// 14.3 未给核定基数时，退回逐月收入的月均
const auto = T.compute(one({ monthly: 0, months: 12, incomes: inc, social: { rate: 0.105 } }));
eq('未核定基数则按月均', auto.social.base, T.round2(incSum / 12));

// 14.4 月数可由逐月数据推断
const inferred = T.compute({ employers: [{ type: 'primary', monthly: 0, incomes: [1000, 2000, 3000] }] });
eq('月数由逐月数据推断', inferred.primary.months, 3);
eq('推断月数下的收入合计', inferred.base.wageIncome, 6000);

// 14.5 逐月收入不等于「月均 × 月数」的税负（累计预扣对波动敏感）
const flat = T.compute(one({ monthly: incSum / 12, months: 12, social: { rate: 0.105 }, housing: { rate: 0.12 } }));
ok('波动收入与等额收入的预扣不同',
   Math.abs(sales.withheld.wage - flat.withheld.wage) > 1,
   `波动 ${sales.withheld.wage} vs 均摊 ${flat.withheld.wage}`);

// 14.6 补助已并入逐月金额（UI 侧求和后传入），引擎只需处理合计
const withAllowance = T.compute({
  employers: [{ type: 'primary', monthly: 0, months: 1, incomes: [9000 + 1000 + 500] }],
});
eq('补助计入工资收入', withAllowance.base.wageIncome, 10500);

// 14.7 补助计入个税，但不计入社保 / 公积金基数（多数单位的实际做法）
const withAllow = T.compute(one({
  monthly: 28500,        // 月税前合计 = 基本工资 25500 + 补助 3000
  baseMonthly: 25500,    // 缴费基数只取基本工资
  months: 12,
  social: { rate: 0.105 },
  housing: { rate: 0.12 },
}));
eq('社保基数只取基本工资', withAllow.social.base, 25500);
eq('社保月缴按基本工资', withAllow.social.monthly, T.round2(25500 * 0.105));
eq('公积金基数只取基本工资', withAllow.housing.base, 25500);
eq('个税仍按含补助的工资', withAllow.base.wageIncome, 28500 * 12);
ok('社保基数低于税前工资', withAllow.social.base < 28500);

// 对照：若单位把补助也计入基数，则基数 = 税前工资
const withAllowInBase = T.compute(one({
  monthly: 28500, baseMonthly: 28500, months: 12, social: { rate: 0.105 }, housing: { rate: 0.12 },
}));
ok('两种口径的社保月缴不同',
   withAllowInBase.social.monthly > withAllow.social.monthly,
   `含补助 ${withAllowInBase.social.monthly} vs 不含 ${withAllow.social.monthly}`);

section('15. 合法节税建议');

// 15.1 未填其他扣除 → 建议用足个人养老金
const s1 = T.compute(one({ monthly: 28500, months: 12 }, { specialMonthly: 3000 }));
const pension = s1.suggestions.find((x) => x.id === 'pension');
ok('建议用足个人养老金', !!pension);
eq('个人养老金节税额', pension && pension.saving, 2400);

// 15.2 已填满 12,000 → 不再重复建议
const s2 = T.compute(one({ monthly: 28500, months: 12 }, { specialMonthly: 3000, otherAnnual: 12000 }));
ok('已用足则不重复建议', !s2.suggestions.find((x) => x.id === 'pension'));

// 15.3 公积金低于 12% → 建议提高
const s3 = T.compute(one(
  { monthly: 28500, months: 12, social: { rate: 0.105 }, housing: { rate: 0.08 } },
  { specialMonthly: 3000, otherAnnual: 12000 }
));
const hSug = s3.suggestions.find((x) => x.id === 'housing');
ok('建议提高公积金比例', !!hSug);
eq('公积金建议节税额', hSug && hSug.saving, 2736);

// 15.4 已是 12% → 不再建议
const s4 = T.compute(one(
  { monthly: 28500, months: 12, social: { rate: 0.105 }, housing: { rate: 0.12 } },
  { specialMonthly: 3000, otherAnnual: 12000 }
));
ok('已到 12% 则不建议', !s4.suggestions.find((x) => x.id === 'housing'));

// 15.5 有金额的建议按节税额降序排在前面
const savList = s3.suggestions.map((x) => x.saving).filter((v) => typeof v === 'number' && v > 0);
let desc = true;
for (let i = 1; i < savList.length; i++) if (savList[i - 1] < savList[i]) desc = false;
ok('建议按节税额降序', desc, savList.join(','));

// 15.6 拆分场景：给拆分建议，且不重复给盲区建议
const s5 = T.compute(one({ monthly: 28500, bonus: 37000 }, { specialMonthly: 3000 }));
ok('给出年终奖拆分建议', !!s5.suggestions.find((x) => x.id === 'bonus-split'));
ok('不与盲区建议重复', !s5.suggestions.find((x) => x.id === 'bonus-blind'));

// 15.7 专项附加为零时提示补充
const s6 = T.compute(one({ monthly: 28500 }));
ok('未填专项附加时提示', !!s6.suggestions.find((x) => x.id === 'special'));

// 15.8 有退税时给出提醒
const s7 = T.compute(one({ monthly: 30000, months: 7 }, { specialMonthly: 2000 }));
ok('退税场景有提醒', !!s7.suggestions.find((x) => x.id === 'refund'));

// 15.9 应纳税所得额为 0 时不虚构节税额
const s8 = T.compute(one({ monthly: 4000 }));
const zero = s8.suggestions.find((x) => x.id === 'zero');
ok('零应纳税所得额给出说明', !!zero);
ok('零应纳税所得额不虚报节税', !s8.suggestions.some((x) => x.id === 'pension'));

section('16. 年中基数调整');

const midYear = T.compute(one({
  monthly: 30000, months: 12,
  social: { rate: 0.105, adjustMonth: 7, prev: { floor: 5510, cap: 27549 }, curr: { floor: 5521, cap: 27603 } },
  housing: { rate: 0.12, adjustMonth: 7, prev: { floor: 2500, cap: 39828 }, curr: { floor: 2500, cap: 41697 } },
}));
eq('1 月社保按调整前基数', midYear.primary.socialByMonth[0], T.round2(27549 * 0.105));
eq('7 月社保按调整后基数', midYear.primary.socialByMonth[6], T.round2(27603 * 0.105));
ok('上下半年月缴不同', midYear.primary.socialByMonth[0] !== midYear.primary.socialByMonth[6]);
eq('社保年缴为逐月求和', midYear.base.socialInsuranceTotal,
   T.round2(midYear.primary.socialByMonth.reduce((a, b) => a + b, 0)));
eq('公积金年缴为逐月求和', midYear.housing.employee,
   T.round2(midYear.primary.housingByMonth.reduce((a, b) => a + b, 0)));

// 调整月为 1 时，全年同一基数
const janAdj = T.compute(one({
  monthly: 30000, months: 12,
  social: { rate: 0.105, adjustMonth: 1, prev: { floor: 5510, cap: 27549 }, curr: { floor: 5521, cap: 27603 } },
}));
ok('1 月调整则全年一致',
   janAdj.primary.socialByMonth.every((v) => v === janAdj.primary.socialByMonth[0]));

// 未提供两段时退回单一 floor/cap（向后兼容）
const legacyBase = T.compute(one({ monthly: 30000, months: 12, social: { rate: 0.105, floor: 5000, cap: 20000 } }));
eq('兼容单一上下限', legacyBase.primary.socialByMonth[0], T.round2(20000 * 0.105));

// 逐月预扣累计会体现年中变化
ok('年中调整影响预扣税额',
   Math.abs(midYear.withheld.wage - legacyBase.withheld.wage) > 1);

// 城市数据自带两段
const bjCity = C.getCity('北京');
ok('北京社保有调整前后两段', bjCity.social.prev.min !== bjCity.social.curr.min);
eqs('北京社保调整月', String(bjCity.social.adjustMonth), '7');
ok('广州公积金比例上限 12%', C.getCity('广州').housingRates[1] === 0.12);

/* ---------------------------------------------------------------- */
console.log(`\n${'='.repeat(50)}`);
console.log(`通过 ${pass} 项，失败 ${fail} 项`);
if (fail) {
  console.log('\n失败明细：');
  failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
} else {
  console.log('全部通过 ✓');
}
