/* ============================================================================
 * tax-core.js — 中国大陆居民个人 个税测算与年终奖方案寻优引擎
 * ----------------------------------------------------------------------------
 * 法规依据：
 *   1.《中华人民共和国个人所得税法》及实施条例
 *   2. 财政部 税务总局公告 2023 年第 30 号
 *      全年一次性奖金单独计税，执行至 2027-12-31
 *   3. 财政部 税务总局公告 2023 年第 25 号
 *      上市公司股权激励单独计税（全额适用综合所得税率表），执行至 2027-12-31
 *   4. 国家税务总局公告 2018 年第 61 号（累计预扣法）
 *   5. 个人所得税扣缴申报管理办法（试行）（劳务/稿酬/特许权预扣）
 * ----------------------------------------------------------------------------
 * 设计原则：
 *   - 纯函数，无副作用，浏览器 / Node 双端可用
 *   - 所有金额单位为「元」，内部按分（2 位小数）四舍五入，与税务实务一致
 *   - 税率表集中定义，政策到期可整体替换
 * ==========================================================================*/
(function (root) {
  'use strict';

  /* ========================= 1. 税率表 ========================= */

  // 综合所得年度税率表（也用于累计预扣预缴、股权激励单独计税）
  const ANNUAL_TABLE = [
    { limit: 36000,    rate: 0.03, quick: 0 },
    { limit: 144000,   rate: 0.10, quick: 2520 },
    { limit: 300000,   rate: 0.20, quick: 16920 },
    { limit: 420000,   rate: 0.25, quick: 31920 },
    { limit: 660000,   rate: 0.30, quick: 52920 },
    { limit: 960000,   rate: 0.35, quick: 85920 },
    { limit: Infinity, rate: 0.45, quick: 181920 },
  ];

  // 按月换算后的综合所得税率表（全年一次性奖金单独计税专用）
  const MONTHLY_TABLE = [
    { limit: 3000,     rate: 0.03, quick: 0 },
    { limit: 12000,    rate: 0.10, quick: 210 },
    { limit: 25000,    rate: 0.20, quick: 1410 },
    { limit: 35000,    rate: 0.25, quick: 2660 },
    { limit: 55000,    rate: 0.30, quick: 4410 },
    { limit: 80000,    rate: 0.35, quick: 7160 },
    { limit: Infinity, rate: 0.45, quick: 15160 },
  ];

  // 劳务报酬预扣预缴率表
  const LABOR_TABLE = [
    { limit: 20000,    rate: 0.20, quick: 0 },
    { limit: 50000,    rate: 0.30, quick: 2000 },
    { limit: Infinity, rate: 0.40, quick: 7000 },
  ];

  const BASIC_DEDUCTION_MONTH = 5000;
  const BASIC_DEDUCTION_YEAR = 60000;
  const ROYALTY_FACTOR = 0.7;          // 稿酬收入额减按 70% 计算
  const COST_DEDUCT_THRESHOLD = 4000;  // 劳务报酬等减除费用门槛
  const COST_DEDUCT_RATE = 0.2;
  const COST_DEDUCT_FIXED = 800;

  // 年终奖税率跳档临界点（奖金 ÷ 12 触达月度表各级上限）
  const BONUS_BREAKPOINTS = [36000, 144000, 300000, 420000, 660000, 960000];

  /* ========================= 2. 基础工具 ========================= */

  function round2(n) {
    if (!Number.isFinite(n)) return 0;
    return (n >= 0 ? Math.round(n * 100) : -Math.round(-n * 100)) / 100;
  }

  function pickBracket(table, x) {
    for (let i = 0; i < table.length; i++) if (x <= table[i].limit) return table[i];
    return table[table.length - 1];
  }

  function nextBracket(table, x) {
    for (let i = 0; i < table.length; i++) {
      if (x <= table[i].limit) return table[i + 1] || table[i];
    }
    return table[table.length - 1];
  }

  // 通用：应纳税额 = 应纳税所得额 × 税率 − 速算扣除数
  function applyTable(table, x) {
    if (!(x > 0)) return 0;
    const b = pickBracket(table, x);
    return x * b.rate - b.quick;
  }

  /* ========================= 3. 单项税额计算 ========================= */

  // 综合所得年度应纳税额
  function annualTax(taxable) {
    return Math.max(0, applyTable(ANNUAL_TABLE, Math.max(0, taxable)));
  }

  // 全年一次性奖金「单独计税」应纳税额
  // 关键：除以 12 只是为了查表定税率，速算扣除数只扣一次
  function bonusSeparateTax(bonus) {
    if (!(bonus > 0)) return 0;
    const b = pickBracket(MONTHLY_TABLE, bonus / 12);
    return Math.max(0, bonus * b.rate - b.quick);
  }

  // 股权激励单独计税：全额适用综合所得年度税率表，不除以 12
  function equityTax(total) {
    return Math.max(0, applyTable(ANNUAL_TABLE, total));
  }

  // 劳务报酬 / 特许权使用费「收入额」：≤4000 减 800，>4000 减 20%
  function incomeAmount(gross) {
    if (!(gross > 0)) return 0;
    return gross <= COST_DEDUCT_THRESHOLD
      ? Math.max(0, gross - COST_DEDUCT_FIXED)
      : gross * (1 - COST_DEDUCT_RATE);
  }

  // 稿酬「收入额」：先按上述规则减除费用，再减按 70%
  function royaltyAmount(gross) {
    return incomeAmount(gross) * ROYALTY_FACTOR;
  }

  function laborWithhold(gross) {
    return Math.max(0, applyTable(LABOR_TABLE, incomeAmount(gross)));
  }
  function royaltyWithhold(gross) {
    return incomeAmount(gross) * ROYALTY_FACTOR * 0.2;
  }
  function licenseWithhold(gross) {
    return incomeAmount(gross) * 0.2;
  }

  /* ========================= 4. 工资薪金累计预扣 ========================= */

  /**
   * 按累计预扣法逐月模拟一个雇主的工资预扣。
   * 累计预扣预缴应纳税所得额
   *   = 累计收入 − 累计减除费用(5000×月数) − 累计专项扣除 − 累计专项附加扣除 − 累计其他扣除
   * 本月应预扣税额
   *   = 累计应纳税所得额 × 预扣率 − 速算扣除数 − 累计已预扣税额
   */
  function simulateWage(o) {
    const months = Math.max(0, Math.floor(o.months || 0));
    const incomes = Array.isArray(o.incomes) ? o.incomes : null;
    const rows = [];
    let cumIncome = 0, cumSocial = 0, cumSpecial = 0, cumOther = 0, cumTax = 0;

    const socialByMonth = Array.isArray(o.socialByMonth) ? o.socialByMonth : null;

    for (let m = 1; m <= months; m++) {
      // 支持逐月录入（销售等浮动收入）：incomes[m-1] 优先于固定月薪
      const base = incomes && Number.isFinite(incomes[m - 1]) ? incomes[m - 1] : (o.monthly || 0);
      const monthIncome = base + (m === months ? (o.extraLastMonth || 0) : 0);
      cumIncome += monthIncome;
      // 社保/公积金基数年中会调整，按当月取值
      cumSocial += socialByMonth ? (socialByMonth[m - 1] || 0) : (o.socialMonthly || 0);
      cumSpecial += o.specialMonthly || 0;
      cumOther += o.otherMonthly || 0;

      const cumDeduct = BASIC_DEDUCTION_MONTH * m + cumSocial + cumSpecial + cumOther;
      const taxable = Math.max(0, cumIncome - cumDeduct);
      const due = annualTax(taxable);
      const tax = round2(Math.max(0, due - cumTax));
      cumTax = round2(cumTax + tax);

      rows.push({
        month: m,
        income: round2(monthIncome),
        cumIncome: round2(cumIncome),
        cumDeduct: round2(cumDeduct),
        taxable: round2(taxable),
        due: round2(due),
        tax,
        cumTax,
      });
    }

    return {
      months,
      income: round2(cumIncome),
      social: round2(cumSocial),
      special: round2(cumSpecial),
      other: round2(cumOther),
      tax: cumTax,
      rows,
    };
  }

  /* ========================= 5. 按笔数预扣 ========================= */

  /**
   * 劳务报酬 / 稿酬 / 特许权使用费按「每次」预扣。
   * 给定年度总额与笔数，按等分模拟每笔，逐笔累计税额与收入额。
   * 注：笔数会影响预扣税额（800 元固定减除的门槛效应），但不影响汇算收入额之外的结论。
   */
  function withholdByCount(total, count, taxFn, amountFn) {
    if (!(total > 0)) {
      return { gross: 0, amount: 0, tax: 0, installments: 0, each: 0 };
    }
    const n = Math.max(1, Math.floor(count || 1));
    const each = total / n;
    let tax = 0, amount = 0;
    for (let i = 0; i < n; i++) {
      tax += taxFn(each);
      amount += amountFn(each);
    }
    return {
      gross: round2(total),
      amount: round2(amount),
      tax: round2(tax),
      installments: n,
      each: round2(each),
    };
  }

  /* ========================= 6. 年终奖方案寻优 ========================= */

  /**
   * 在 [0, B] 上枚举「单独计税部分 x」，使
   *   总税额(x) = 单独计税税(x) + 综合所得年度税(base + B − x)
   * 最小。
   *
   * 为什么可以只查断点：
   *   两个税函数在各税率区间内都是 x 的一次函数，因此总税额在相邻断点之间是线性的；
   *   线性函数的最小值必在端点取得。断点来源只有两类：
   *     a) x 自身跨过月度税率表界限 → x = 36000 / 144000 / … / 960000
   *     b) 并入后的应纳税所得额跨过年度表界限 → base + B − x = 36000 / …
   */
  function optimizeSplit(B, baseTaxable) {
    if (!(B > 0)) return { x: 0, totalTax: annualTax(baseTaxable) };

    const cands = new Set();
    cands.add(round2(0));
    cands.add(round2(B));

    // a) 单独计税部分自身跨档
    for (const t of BONUS_BREAKPOINTS) if (t > 0 && t < B) cands.add(round2(t));

    // b) 并入部分推动综合所得跨档
    for (const t of BONUS_BREAKPOINTS) {
      const x = round2(baseTaxable + B - t);
      if (x > 0 && x < B) cands.add(x);
    }

    let best = null;
    for (const x of cands) {
      const total = bonusSeparateTax(x) + annualTax(Math.max(0, baseTaxable + B - x));
      if (!best || total < best.totalTax - 1e-6) best = { x, totalTax: total };
    }
    return best;
  }

  // 暴力扫描，仅用于自检与验证「断点枚举」的正确性
  function scanOptimal(B, baseTaxable, step) {
    const s = step || 1;
    let best = { x: 0, totalTax: Infinity };
    for (let x = 0; x <= B + 1e-9; x += s) {
      const xx = Math.min(x, B);
      const total = bonusSeparateTax(xx) + annualTax(Math.max(0, baseTaxable + B - xx));
      if (total < best.totalTax) best = { x: xx, totalTax: total };
    }
    return best;
  }

  /* ========================= 7. 年终奖「盲区」 ========================= */

  /**
   * 税率跳档导致「多发不如少发」的区间。
   * 以临界点 T 为基准，求使得税额后收入等于 T 处税额后收入的奖金上限 U：
   *   U × (1 − r) + quick = T − tax(T)
   *   => U = (T − tax(T) − quick) / (1 − r)
   */
  function blindZones() {
    return BONUS_BREAKPOINTS.map((t) => {
      const taxAtT = bonusSeparateTax(t);
      const afterTaxAtT = t - taxAtT;
      const nb = nextBracket(MONTHLY_TABLE, t / 12);
      const upper = (afterTaxAtT - nb.quick) / (1 - nb.rate);
      return {
        from: t,
        to: Math.floor(upper),
        width: Math.floor(upper) - t,
        rate: nb.rate,
        quick: nb.quick,
        taxAtFrom: round2(taxAtT),
        taxJustAbove: round2((t + 1) * nb.rate - nb.quick),
      };
    });
  }

  /* ========================= 8. 输入归一化 ========================= */

  /**
   * 缴费基数：先按「实际工资」或「指定基数」取值，再按当地上下限保底 / 封顶。
   * 各城市社保与公积金的上下限不同，因此两者各自独立配置。
   */
  function resolveBase(monthly, cfg) {
    // 「指定基数」未填（≤0）时回落到按工资，避免误操作让缴费额归零
    let base = cfg.baseMode === 'manual' && cfg.base > 0 ? cfg.base : monthly;
    let clamp = null;
    if (cfg.floor > 0 && base < cfg.floor) { base = cfg.floor; clamp = 'floor'; }
    if (cfg.cap > 0 && base > cfg.cap) { base = cfg.cap; clamp = 'cap'; }
    return { base: Math.max(0, round2(base)), clamp };
  }

  function ratio01(v, d) {
    const x = Number(v);
    if (!Number.isFinite(x)) return d;
    return Math.min(1, Math.max(0, x));
  }

  /**
   * 单个任职单位归一化。
   *   primary   主工作：缴纳社保公积金、可填奖金、享受专项附加扣除
   *   change    换工作：与主工作同等处理（独立基数、独立奖金），不再重复享受专项附加扣除
   *   secondary 多处任职：只取得工资，社保公积金不重复缴纳
   */
  function normalizeEmployer(raw, idx) {
    const e = raw || {};
    const nn = (v) => { const x = Number(v); return Number.isFinite(x) ? Math.max(0, x) : 0; };

    const type = e.type === 'secondary' ? 'secondary'
      : e.type === 'change' ? 'change' : 'primary';
    const hasSocial = type !== 'secondary';

    const monthly = nn(e.monthly);

    // 逐月录入的收入（已含基本工资 + 奖金提成 + 补助）
    const incomesRaw = Array.isArray(e.incomes) ? e.incomes : null;
    const incomes = incomesRaw ? incomesRaw.map((v) => nn(v)) : null;

    // 缴费基数：社保/公积金按「上年度月平均工资」核定，与当月收入无关。
    // baseMonthly 为该核定基数；未提供时退回月薪（或逐月收入的月均）。
    const baseMonthly = nn(e.baseMonthly) > 0
      ? nn(e.baseMonthly)
      : (incomes && incomes.length ? incomes.reduce((a, b) => a + b, 0) / incomes.length : monthly);

    const monthsRaw = e.months === '' || e.months == null
      ? (incomes ? incomes.length : 12)
      : Number(e.months);
    const months = Number.isFinite(monthsRaw)
      ? Math.min(12, Math.max(0, Math.floor(monthsRaw)))
      : 12;

    let socialRate = 0, socialEmployerRate = 0, housingRate = 0, housingEmployerRate = 0;
    let housingMode = 'rate';
    let socialBase = 0, housingBase = 0;
    let socialClamp = null, housingClamp = null;
    let socialMonthly = 0, housingMonthly = 0, housingEmployerMonthly = 0;
    let socialByMonth = null, socialBaseByMonth = null, housingByMonth = null, housingEmployerByMonth = null;

    if (hasSocial) {
      const sCfg = e.social || {};
      const hCfg = e.housing || {};

      housingMode = hCfg.mode === 'amount' ? 'amount' : 'rate';
      socialRate = ratio01(sCfg.rate, 0.105);
      // 单位社保比例：各地差异大（养老 16% + 医疗 ~9.8% + 失业 + 工伤 + 生育），
      // 未填时给一个可改的常见合计值，用于「公司用工成本」测算
      socialEmployerRate = ratio01(sCfg.employerRate, 0.275);

      const sb = resolveBase(baseMonthly, {
        baseMode: sCfg.baseMode, base: nn(sCfg.base), floor: nn(sCfg.floor), cap: nn(sCfg.cap),
      });
      socialBase = sb.base; socialClamp = sb.clamp;
      socialMonthly = round2(socialBase * socialRate);

      // 年中基数调整：按月份分别取调整前 / 后的上下限
      const sAdj = Math.min(12, Math.max(1, Math.floor(nn(sCfg.adjustMonth) || 7)));
      const sPrev = sCfg.prev || { floor: nn(sCfg.floor), cap: nn(sCfg.cap) };
      const sCurr = sCfg.curr || { floor: nn(sCfg.floor), cap: nn(sCfg.cap) };
      socialByMonth = [];
      socialBaseByMonth = [];
      for (let m = 1; m <= 12; m++) {
        const lim = m < sAdj ? sPrev : sCurr;
        const b = resolveBase(baseMonthly, {
          baseMode: sCfg.baseMode, base: nn(sCfg.base),
          floor: nn(lim.floor), cap: nn(lim.cap),
        });
        socialBaseByMonth.push(b.base);
        socialByMonth.push(round2(b.base * socialRate));
      }
      socialBase = resolveBase(baseMonthly, {
        baseMode: sCfg.baseMode, base: nn(sCfg.base),
        floor: nn(sCurr.floor), cap: nn(sCurr.cap),
      }).base;

      if (housingMode === 'amount') {
        // 按金额缴纳：直接给定双边月缴额，不套用比例与基数上下限。
        // 用于「缴存基数与实际收入不一致」的场景，例如低薪高缴、或差额由个人承担。
        housingMonthly = round2(nn(hCfg.monthly));                 // 个人缴存（税前扣除）
        housingEmployerMonthly = round2(nn(hCfg.employerMonthly)); // 单位缴存（进个人账户）
        housingRate = 0;
        housingEmployerRate = 0;
        housingBase = 0;
        housingClamp = null;
        housingByMonth = new Array(12).fill(housingMonthly);
        housingEmployerByMonth = new Array(12).fill(housingEmployerMonthly);
      } else {
        housingRate = ratio01(hCfg.rate, 0.12);

        // 单位缴存比例：未填则与个人一致（多数城市公积金双边比例相同）
        const empRateIn = hCfg.employerRate;
        housingEmployerRate = (empRateIn === undefined || empRateIn === null
          || !Number.isFinite(Number(empRateIn)))
          ? housingRate
          : ratio01(empRateIn, housingRate);

        const hAdj = Math.min(12, Math.max(1, Math.floor(nn(hCfg.adjustMonth) || sAdj)));
        const hPrev = hCfg.prev || { floor: nn(hCfg.floor), cap: nn(hCfg.cap) };
        const hCurr = hCfg.curr || { floor: nn(hCfg.floor), cap: nn(hCfg.cap) };

        housingByMonth = [];
        housingEmployerByMonth = [];
        for (let m = 1; m <= 12; m++) {
          const lim = m < hAdj ? hPrev : hCurr;
          const b = resolveBase(baseMonthly, {
            baseMode: hCfg.baseMode, base: nn(hCfg.base),
            floor: nn(lim.floor), cap: nn(lim.cap),
          });
          housingByMonth.push(round2(b.base * housingRate));
          housingEmployerByMonth.push(round2(b.base * housingEmployerRate));
          if (m === 1) { housingBase = b.base; housingClamp = b.clamp; }
        }
        housingMonthly = housingByMonth[0];
        housingEmployerMonthly = housingEmployerByMonth[0];
      }
    }

    return {
      index: idx,
      type,
      hasSocial,
      monthly,
      baseMonthly: round2(baseMonthly),
      incomes,
      months,
      socialRate,
      socialEmployerRate,
      socialBaseByMonth,
      housingMode,
      housingRate,
      housingEmployerRate,
      socialBase,
      housingBase,
      socialClamp,
      housingClamp,
      socialMonthly,
      housingMonthly,
      housingEmployerMonthly,
      socialByMonth,
      housingByMonth,
      housingEmployerByMonth,
      nSalary: hasSocial ? nn(e.nSalary) : 0,
      nSalaryAsBonus: hasSocial && !!e.nSalaryAsBonus,
      bonus: hasSocial ? nn(e.bonus) : 0,
    };
  }

  function normalize(input) {
    const i = input || {};
    const nn = (v) => { const x = Number(v); return Number.isFinite(x) ? Math.max(0, x) : 0; };
    const cnt = (o) => Math.max(1, Math.floor(Number(o.count) || 0) || 1);

    let list = Array.isArray(i.employers) ? i.employers.filter(Boolean) : [];
    if (!list.length) list = [{ type: 'primary' }];
    const employers = list.map((e, idx) => normalizeEmployer(e, idx));
    if (!employers.some((e) => e.type === 'primary')) employers[0].type = 'primary';

    const primary = employers.find((e) => e.type === 'primary');

    const specialMonthly = nn(i.specialMonthly);
    const otherAnnual = nn(i.otherAnnual);
    // 抵扣方式：monthly = 单位按月预扣（每月到手更高）；annual = 平时不扣、汇算统一扣除（每月到手更低，汇算退税）
    const specialDefer = i.specialDefer === true || i.specialDefer === 'true';

    const labor = i.labor || {};
    const royalty = i.royalty || {};
    const license = i.license || {};

    return {
      employers,
      primary,
      specialMonthly,
      otherAnnual,
      specialDefer,
      otherMonthly: otherAnnual / Math.max(1, primary.months),
      labor: { total: nn(labor.total), count: cnt(labor) },
      royalty: { total: nn(royalty.total), count: cnt(royalty) },
      license: { total: nn(license.total), count: cnt(license) },
      equity: nn(i.equity),
    };
  }

  /* ========================= 9. 主计算 ========================= */

  function compute(input) {
    const c = normalize(input);

    /* ---- 9.1 各任职单位工资预扣 ---- */
    const employers = c.employers.map((e) => {
      const isPrimary = e.type === 'primary';
      // 合并社保与公积金为「当月专项扣除」
      const combinedByMonth = (e.socialByMonth && e.housingByMonth)
        ? e.socialByMonth.map((v, i) => round2(v + (e.housingByMonth[i] || 0)))
        : null;

      const simOpts = {
        monthly: e.monthly,
        incomes: e.incomes,
        months: e.months,
        socialByMonth: combinedByMonth,
        socialMonthly: round2(e.socialMonthly + e.housingMonthly),
        extraLastMonth: e.nSalaryAsBonus ? 0 : e.nSalary,
      };
      const sim = simulateWage(Object.assign({}, simOpts, {
        specialMonthly: isPrimary ? (c.specialDefer ? 0 : c.specialMonthly) : 0,
        otherMonthly: isPrimary ? (c.specialDefer ? 0 : c.otherMonthly) : 0,
      }));
      // 反向口径（仅用于「如果不按月抵扣，每月到手会少多少」的对照列）
      const simAlt = simulateWage(Object.assign({}, simOpts, {
        specialMonthly: isPrimary ? (c.specialDefer ? c.specialMonthly : 0) : 0,
        otherMonthly: isPrimary ? (c.specialDefer ? c.otherMonthly : 0) : 0,
      }));

      // 逐月到手：收入 − 本月预扣 − 个人社保 − 个人公积金（专项附加只影响税，不减现金）
      const attachNet = (s2, alt) => {
        s2.rows.forEach((row, i) => {
          const deduct = round2((e.socialByMonth || [])[i] || 0) + round2((e.housingByMonth || [])[i] || 0);
          row.deduct = deduct;
          row.net = round2(row.income - row.tax - deduct);
          if (alt) row.netAlt = round2(row.income - alt.rows[i].tax - deduct);
        });
      };
      attachNet(sim, simAlt);

      // 单位成本：按当月社保基数 × 单位比例（与个人部分同源，年中调整同步生效）
      const employerSocialByMonth = (e.socialBaseByMonth || []).map((b) => round2(b * e.socialEmployerRate));
      return Object.assign({}, e, {
        sim,
        simAlt,
        employerSocialByMonth,
        employerSocialTotal: round2(
          employerSocialByMonth.slice(0, e.months).reduce((a, b) => a + b, 0)
        ),
        // 只有「个人」缴存部分可税前扣除；按月求和以反映年中调整
        socialTotal: round2(
          (e.socialByMonth || []).slice(0, e.months).reduce((a, b) => a + b, 0)
          + (e.housingByMonth || []).slice(0, e.months).reduce((a, b) => a + b, 0)
        ),
        housingTotal: round2((e.housingByMonth || []).slice(0, e.months).reduce((a, b) => a + b, 0)),
        housingEmployerTotal: round2((e.housingEmployerByMonth || []).slice(0, e.months).reduce((a, b) => a + b, 0)),
        bonus: round2(e.bonus + (e.nSalaryAsBonus ? e.nSalary : 0)),
      });
    });

    const primaryEmp = employers.find((e) => e.type === 'primary') || employers[0];

    /* ---- 9.2 其他所得预扣 ---- */
    const labor = withholdByCount(c.labor.total, c.labor.count, laborWithhold, incomeAmount);
    const royalty = withholdByCount(c.royalty.total, c.royalty.count, royaltyWithhold, royaltyAmount);
    const license = withholdByCount(c.license.total, c.license.count, licenseWithhold, incomeAmount);

    /* ---- 9.3 奖金池：各任职单位奖金合并（全年一次性奖金单独计税一年只能用一次） ---- */
    const bonusPool = round2(employers.reduce((s, e) => s + e.bonus, 0));

    /* ---- 9.4 综合所得（不含奖金） ---- */
    const wageIncome = round2(employers.reduce((s, e) => s + e.sim.income, 0));
    const socialTotal = round2(employers.reduce((s, e) => s + e.socialTotal, 0));
    const housingEmployeeTotal = round2(employers.reduce((s, e) => s + e.housingTotal, 0));
    const housingEmployerTotal = round2(employers.reduce((s, e) => s + e.housingEmployerTotal, 0));
    // 公积金账户实际到账 = 个人 + 单位（双边）
    const housingTotal = round2(housingEmployeeTotal + housingEmployerTotal);
    // 专项附加扣除只扣一次；「汇算统一扣除」时平时不预扣，年度总额仍按填报月额 × 任职月数计入
    const specialTotal = c.specialDefer
      ? round2(c.specialMonthly * primaryEmp.months)
      : round2(primaryEmp.sim.special);
    const otherTotal = c.specialDefer ? round2(c.otherAnnual) : round2(primaryEmp.sim.other);

    const baseIncomeAmount = round2(wageIncome + labor.amount + royalty.amount + license.amount);
    const baseDeduction = round2(BASIC_DEDUCTION_YEAR + socialTotal + specialTotal + otherTotal);
    const baseTaxable = Math.max(0, round2(baseIncomeAmount - baseDeduction));

    const socialInsuranceTotal = round2(socialTotal - housingEmployeeTotal);

    // 综合所得已预缴（不含奖金）
    const baseWithheld = round2(
      employers.reduce((s, e) => s + e.sim.tax, 0) + labor.tax + royalty.tax + license.tax
    );

    /* ---- 9.5 股权激励（单独计税，最终税负） ---- */
    const equityTaxAmount = round2(equityTax(c.equity));

    /* ---- 9.6 预缴口径：默认按「年终奖全部单独计税」预扣 ---- */
    const bonusWithheldAtSource = round2(bonusSeparateTax(bonusPool));

    const totalIncome = round2(
      wageIncome + bonusPool + labor.gross + royalty.gross + license.gross + c.equity
    );

    const ctx = {
      baseTaxable,
      baseWithheld,
      bonusWithheldAtSource,
      equityTax: equityTaxAmount,
      socialTotal,
      housingTotal,
      totalIncome,
    };

    /* ---- 9.7 三种方案 ---- */
    const mkPlan = (key, label, desc, x) => {
      const sepTax = round2(bonusSeparateTax(x));
      const included = round2(bonusPool - x);
      const compTaxable = Math.max(0, round2(baseTaxable + included));
      const compTax = round2(annualTax(compTaxable));
      const totalTax = round2(compTax + sepTax + equityTaxAmount);
      const withheld = round2(baseWithheld + bonusWithheldAtSource + equityTaxAmount);
      const settle = round2(totalTax - withheld); // >0 补税，<0 退税
      const net = round2(totalIncome - socialTotal - totalTax);      // 到手现金
      const totalValue = round2(net + housingTotal);                  // 现金 + 公积金账户（双边）
      return {
        key, label, desc,
        separatePart: round2(x),
        includedPart: included,
        bonusSepTax: sepTax,
        compTaxable,
        compTax,
        totalTax,
        settle,
        net,
        housing: housingTotal,
        totalValue,
        effectiveRate: totalIncome > 0 ? totalTax / totalIncome : 0,
      };
    };

    const planSeparate = mkPlan('separate', '方案 A · 全部单独计税', '年终奖全额按全年一次性奖金单独计税', bonusPool);
    const planIncluded = mkPlan('included', '方案 B · 全部并入综合所得', '年终奖全额计入综合所得，一并适用年度税率表', 0);
    const opt = optimizeSplit(bonusPool, baseTaxable);

    // 最优点可能落在端点（等价于 A 或 B）。只有存在真正的中间拆分点时，
    // 才单独列出「方案 C」，否则直接在某一个端点上标记最优，避免出现重复行。
    const EPS = 0.005;
    let optKind;
    if (bonusPool <= EPS) optKind = 'none';
    else if (opt.x <= EPS) optKind = 'included';
    else if (opt.x >= bonusPool - EPS) optKind = 'separate';
    else optKind = 'split';

    let planOptimal;
    let plans;
    if (optKind === 'split') {
      planOptimal = mkPlan(
        'optimal',
        '方案 C · 拆分发放',
        '单独计税 ' + fmt(opt.x) + ' 元 + 并入综合所得 ' + fmt(bonusPool - opt.x) + ' 元（需事前安排）',
        opt.x
      );
      plans = [planSeparate, planIncluded, planOptimal];
    } else {
      planOptimal = optKind === 'included' ? planIncluded : planSeparate;
      plans = [planSeparate, planIncluded];
    }

    const bestTotal = Math.min(...plans.map((p) => p.totalTax));
    plans.forEach((p) => { p.gapToBest = round2(p.totalTax - bestTotal); });

    /* ---- 结论 ---- */
    const minTwo = Math.min(planSeparate.totalTax, planIncluded.totalTax);
    const gain = round2(minTwo - planOptimal.totalTax);
    let conclusion;
    if (bonusPool <= EPS) {
      conclusion = '本年度未填写年终奖，不涉及奖金计税方式的选择。';
    } else if (optKind === 'split') {
      conclusion =
        `存在拆分空间：单独计税 ${fmt(planOptimal.separatePart)} 元 + 并入综合所得 ${fmt(planOptimal.includedPart)} 元，` +
        `比二选一最省方案再少缴 ${fmt(gain)} 元。` +
        `注意：一次性奖金不能在汇算阶段追溯拆分，该结构须在奖金发放前确定。`;
    } else if (optKind === 'separate') {
      conclusion =
        `「全部单独计税」比「全部并入」少缴 ${fmt(planIncluded.totalTax - planSeparate.totalTax)} 元，` +
        `且当年不存在更省的拆分点。`;
    } else {
      conclusion =
        `「全部并入综合所得」比「全部单独计税」少缴 ${fmt(planSeparate.totalTax - planIncluded.totalTax)} 元，` +
        `且当年不存在更省的拆分点。`;
    }

    /* ---- 9.8 提示 ---- */
    const alerts = buildAlerts({
      bonusPool, baseTaxable, plans, planSeparate, planIncluded, planOptimal, c,
      socialTotal, totalIncome, employers, primaryEmp, labor, royalty, license,
    });

    /* ---- 9.9 合法节税建议 ---- */
    const suggestions = buildSuggestions({
      base: { baseTaxable, socialTotal, specialTotal, otherTotal },
      housing: { mode: primaryEmp.housingMode, rate: primaryEmp.housingRate, base: primaryEmp.housingBase },
      primary: { months: primaryEmp.months },
      optKind, plans, optimal: planOptimal, bonusPool, blindZones: blindZones(),
    });

    /* ---- 9.7b 公司用工成本（单位视角，不含残保金等） ---- */
    const employerSocialTotal = round2(employers.reduce((s, e) => s + (e.employerSocialTotal || 0), 0));
    const employerCost = {
      payroll: round2(wageIncome + bonusPool),           // 应付工资总额（含年终奖、n 薪）
      social: employerSocialTotal,
      housing: housingEmployerTotal,
      total: round2(wageIncome + bonusPool + employerSocialTotal + housingEmployerTotal),
      ratio: round2((employerSocialTotal + housingEmployerTotal) / Math.max(1, wageIncome + bonusPool)),
      perMonth: round2((wageIncome + bonusPool + employerSocialTotal + housingEmployerTotal) / Math.max(1, primaryEmp.months)),
    };

    return {
      input: c,
      employers,
      employerCost,
      primary: primaryEmp,
      labor, royalty, license,
      bonusPool,
      equityTax: equityTaxAmount,
      base: {
        wageIncome,
        socialTotal,                 // 专项扣除合计（社保 + 公积金个人）
        housingTotal,                // 公积金双边
        housingEmployeeTotal,
        housingEmployerTotal,
        socialInsuranceTotal,
        specialTotal,
        otherTotal,
        baseIncomeAmount,
        baseDeduction,
        baseTaxable,
        baseWithheld,
      },
      withheld: {
        wage: round2(employers.reduce((s, e) => s + e.sim.tax, 0)),
        labor: labor.tax,
        royalty: royalty.tax,
        license: license.tax,
        bonus: bonusWithheldAtSource,
        equity: equityTaxAmount,
        total: round2(baseWithheld + bonusWithheldAtSource + equityTaxAmount),
      },
      totalIncome,
      housing: {
        monthly: round2(primaryEmp.housingMonthly),
        employerMonthly: round2(primaryEmp.housingEmployerMonthly),
        employee: housingEmployeeTotal,
        employer: housingEmployerTotal,
        total: housingTotal,
        snsTotal: socialInsuranceTotal,
        mode: primaryEmp.housingMode,
        rate: primaryEmp.housingRate,
        employerRate: primaryEmp.housingEmployerRate,
        base: primaryEmp.housingBase,
        clamp: primaryEmp.housingClamp,
      },
      social: {
        monthly: round2(primaryEmp.socialMonthly),
        rate: primaryEmp.socialRate,
        base: primaryEmp.socialBase,
        clamp: primaryEmp.socialClamp,
      },
      plans,
      optimal: planOptimal,
      optKind,
      conclusion,
      blindZones: blindZones(),
      alerts,
      suggestions,
    };
  }

  /* ========================= 10. 提示生成 ========================= */

  function buildAlerts(o) {
    const out = [];

    // 盲区命中
    if (o.bonusPool > 0) {
      for (const z of blindZones()) {
        if (o.bonusPool > z.from && o.bonusPool <= z.to) {
          out.push({
            level: 'danger',
            title: '年终奖落入税率盲区',
            text:
              `年终奖 ${fmt(o.bonusPool)} 元 落在 ${fmt(z.from)}–${fmt(z.to)} 元的盲区内，` +
              `税额后收入反而不如只发 ${fmt(z.from)} 元。建议调整为 ${fmt(z.from)} 元，` +
              `或将超出部分并入综合所得发放。`,
          });
        }
        if (o.bonusPool === z.from) {
          out.push({
            level: 'warn',
            title: '年终奖正好踩在临界点',
            text: `年终奖 ${fmt(z.from)} 元 是税率跳档临界点，再增加 1 元将多缴约 ${fmt(z.taxJustAbove - z.taxAtFrom)} 元税。`,
          });
        }
      }
    }

    // 拆分显著优于二选一
    if (o.bonusPool > 0 && o.planOptimal.separatePart > 0 && o.planOptimal.includedPart > 0) {
      const gain = round2(Math.min(o.planSeparate.totalTax, o.planIncluded.totalTax) - o.planOptimal.totalTax);
      if (gain > 1) {
        out.push({
          level: 'success',
          title: '存在更优的奖金发放结构',
          text:
            `将年终奖拆为「单独计税 ${fmt(o.planOptimal.separatePart)} 元 + 并入综合所得 ${fmt(o.planOptimal.includedPart)} 元」，` +
            `比直接在 A/B 中二选一少缴 ${fmt(gain)} 元。该结构需在奖金发放或申报前安排。`,
        });
      }
    }

    // 年内换工作
    if (o.employers && o.employers.some((e) => e.type === 'change')) {
      out.push({
        level: 'warn',
        title: '年内换过工作，通常会补税',
        text:
          '两段任职各自从零起算累计预扣，年度汇算合并后适用税率上台阶，' +
          '而减除费用全年只能扣 6 万，因此多数换工作场景会产生补税，请预留资金。',
      });
    }

    // 多处任职
    if (o.employers && o.employers.length > 1) {
      out.push({
        level: 'warn',
        title: '存在两处以上工资薪金',
        text:
          '两处任职各自按 5,000 元/月减除费用预扣，年度汇算时只能扣除一次，' +
          '通常会产生补税，请预留资金。',
      });
    }

    // 劳务报酬并入综合所得
    if (o.labor.gross > 0) {
      out.push({
        level: 'info',
        title: '劳务报酬需并入综合所得汇算',
        text:
          '劳务报酬按次预扣（20%/30%/40%），年度汇算时并入综合所得统一适用年度税率表。' +
          '预扣率通常高于最终适用税率，多缴部分会退，但若同时存在多处工资薪金，也可能转为补税。',
      });
    }

    // 政策时效
    const now = new Date();
    const deadline = new Date('2027-12-31T23:59:59+08:00');
    if (now < deadline) {
      const days = Math.ceil((deadline - now) / 86400000);
      out.push({
        level: 'info',
        title: '优惠政策时效',
        text: `年终奖单独计税与股权激励单独计税政策执行至 2027-12-31（距今约 ${days} 天），到期后规则可能变化。`,
      });
    }

    // 缴费基数上下限命中提示
    if (o.employers) {
      const notes = [];
      o.employers.forEach((e) => {
        if (!e.hasSocial) return;
        const tag = o.employers.length > 1 ? `第 ${e.index + 1} 段任职：` : '';
        if (e.socialClamp === 'cap') notes.push(`${tag}社保基数已按上限 ${fmt(e.socialBase)} 元封顶`);
        if (e.socialClamp === 'floor') notes.push(`${tag}社保基数已按下限 ${fmt(e.socialBase)} 元保底`);
        if (e.housingClamp === 'cap') notes.push(`${tag}公积金基数已按上限 ${fmt(e.housingBase)} 元封顶`);
        if (e.housingClamp === 'floor') notes.push(`${tag}公积金基数已按下限 ${fmt(e.housingBase)} 元保底`);
      });
      if (notes.length) {
        out.push({
          level: 'info',
          title: '缴费基数已按上下限调整',
          text: notes.join('；') + '。各城市标准不同，请核对当地公布值。',
        });
      }
    }

    return out;
  }

  /* ========================= 11. 合法节税建议 ========================= */

  /**
   * 基于测算结果生成可执行的节税建议。
   * 全部为确定性规则，离线计算，不联网、不上传数据。
   * 每条建议的 saving 为「再增加该扣除后可少缴的税额」，用
   * annualTax(基数) − annualTax(基数 − 新增扣除) 精确计算，而非简单乘边际税率。
   */
  function buildSuggestions(r) {
    const out = [];
    const base = r.base.baseTaxable;
    const months = r.primary ? r.primary.months : 12;

    const saveFrom = (extra) => {
      if (!(extra > 0)) return 0;
      return round2(annualTax(base) - annualTax(Math.max(0, base - extra)));
    };

    if (base <= 0) {
      out.push({
        id: 'zero', tag: 'info',
        title: '当前应纳税所得额为 0',
        detail: '再增加扣除不会产生额外节税，可把额度留到收入更高的年度。',
        saving: 0,
      });
    }

    // 1. 个人养老金
    const pensionGap = Math.max(0, round2(12000 - r.base.otherTotal));
    if (base > 0 && pensionGap > 0) {
      const sv = saveFrom(pensionGap);
      if (sv > 0) {
        out.push({
          id: 'pension', tag: 'strong',
          title: '用足个人养老金（每年 12,000 元扣除限额）',
          detail: '当前其他扣除 ' + fmt(r.base.otherTotal) + ' 元，还可再扣 ' + fmt(pensionGap) + ' 元。',
          saving: sv,
          note: '需开立个人养老金账户并实际缴存；资金锁定至退休，领取时按 3% 单独计税。',
        });
      }
    }

    // 2. 公积金缴存比例
    if (base > 0 && r.housing.mode === 'rate' && r.housing.base > 0 && r.housing.rate < 0.12) {
      const extra = round2(r.housing.base * (0.12 - r.housing.rate) * months);
      const sv = saveFrom(extra);
      if (extra > 0 && sv > 0) {
        out.push({
          id: 'housing', tag: 'strong',
          title: '把公积金个人缴存比例提高到 12%',
          detail: '当前 ' + (r.housing.rate * 100).toFixed(1) + '%，提到 12% 后每年多扣除 '
            + fmt(extra) + ' 元。',
          saving: sv,
          note: '多缴的钱仍进你自己的公积金账户，不是损失；但当月到手现金会减少，且需单位同意并按同比例配缴。超过 12% 的部分不得税前扣除。',
        });
      }
    }

    // 3. 专项附加扣除
    if (r.base.specialTotal <= 0) {
      out.push({
        id: 'special', tag: 'check',
        title: '专项附加扣除还没有填写',
        detail: '子女教育 2,000/月/孩 · 3 岁以下婴幼儿照护 2,000/月/孩 · 赡养老人 3,000/月 · '
          + '住房贷款利息 1,000/月 · 住房租金 1,500/月 · 继续教育 400/月 · 大病医疗按实际自付。',
        saving: null,
        note: '按实际符合条件的项目申报即可，虚列属于违法。',
      });
    } else {
      out.push({
        id: 'special-check', tag: 'check',
        title: '复核专项附加扣除是否用足',
        detail: '当前填了 ' + fmt(r.base.specialTotal) + ' 元/年。常被遗漏的项：赡养老人、'
          + '3 岁以下婴幼儿照护、继续教育、大病医疗（汇算时可补扣）。',
        saving: null,
        note: '夫妻双方可协商由适用税率更高的一方扣除子女教育、房贷利息等项目，合计更省。',
      });
    }

    // 4. 年终奖拆分
    if (r.optKind === 'split') {
      const pA = r.plans.find((p) => p.key === 'separate');
      const pB = r.plans.find((p) => p.key === 'included');
      const gain = round2(Math.min(pA.totalTax, pB.totalTax) - r.optimal.totalTax);
      if (gain > 0) {
        out.push({
          id: 'bonus-split', tag: 'strong',
          title: '年终奖拆分发放',
          detail: '单独计税 ' + fmt(r.optimal.separatePart) + ' 元 + 并入综合所得 '
            + fmt(r.optimal.includedPart) + ' 元，比二选一再省 ' + fmt(gain) + ' 元。',
          saving: gain,
          note: '必须在奖金发放前确定结构，汇算阶段无法追溯拆分。',
        });
      }
    }

    // 5. 年终奖盲区（存在拆分方案时已由第 4 条覆盖，避免两条建议重复）
    if (r.bonusPool > 0 && r.optKind !== 'split') {
      for (const z of blindZones()) {
        if (r.bonusPool > z.from && r.bonusPool <= z.to) {
          // 「减少发放金额」会同时少拿奖金，净收益要扣掉差额，不能只看少缴的税
          const taxCut = round2(bonusSeparateTax(r.bonusPool) - bonusSeparateTax(z.from));
          const netGain = round2(taxCut - (r.bonusPool - z.from));
          out.push({
            id: 'bonus-blind', tag: 'strong',
            title: '把年终奖调出税率盲区',
            detail: '当前 ' + fmt(r.bonusPool) + ' 元落在 ' + fmt(z.from) + '–' + fmt(z.to)
              + ' 元盲区内。调整为 ' + fmt(z.from) + ' 元：少缴税 ' + fmt(taxCut)
              + ' 元，但同时也少拿 ' + fmt(r.bonusPool - z.from) + ' 元奖金，净多到手 '
              + fmt(netGain) + ' 元。',
            saving: netGain > 0 ? netGain : 0,
            note: '若不想减少奖金总额，可把超出部分改为并入综合所得发放，或递延到下一年度。',
          });
          break;
        }
      }
    }

    // 6. 汇算退税提醒
    if (r.optimal.settle < -0.005) {
      out.push({
        id: 'refund', tag: 'info',
        title: '年度汇算可以退税 ' + fmt(-r.optimal.settle) + ' 元',
        detail: '平时预缴的税额高于全年应纳税额，记得在次年 3 月 1 日至 6 月 30 日办理汇算。',
        saving: 0,
      });
    }

    // 7. 其他法定扣除清单
    out.push({
      id: 'checklist', tag: 'check',
      title: '其他可以核对的法定扣除',
      detail: '企业年金（个人缴费不超过上年月均工资 4% 的部分可扣）、商业健康保险（2,400 元/年）、'
        + '公益慈善捐赠（不超过应纳税所得额 30% 的部分）、大病医疗（自付超 1.5 万元部分，年度限额 8 万元）。',
      saving: null,
      note: '是否适用取决于单位是否开办、是否实际发生，按真实情况填写。',
    });

    // 有明确金额的排前面
    out.sort((a, b) => (b.saving || 0) - (a.saving || 0));
    return out;
  }

  function fmt(n) {
    return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ========================= 11. 导出 ========================= */

  const API = {
    ANNUAL_TABLE,
    MONTHLY_TABLE,
    LABOR_TABLE,
    BONUS_BREAKPOINTS,
    round2,
    pickBracket,
    annualTax,
    bonusSeparateTax,
    equityTax,
    incomeAmount,
    royaltyAmount,
    laborWithhold,
    royaltyWithhold,
    licenseWithhold,
    simulateWage,
    withholdByCount,
    optimizeSplit,
    scanOptimal,
    blindZones,
    normalize,
    compute,
    fmt,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.TaxCore = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
