/* ============================================================================
 * seeds.js — 已核实的「原文直达链接」
 * ----------------------------------------------------------------------------
 * 栏目发现不稳定时（列表页改版、站内检索要登录、公告沉到第 3 页），
 * 直接把已核实的公告 URL 钉在这里，采集就变成确定性的：
 *   命中种子 → 抓正文 → 抽取 → 校验，不再依赖列表页。
 *
 * 结构：{ 城市或省名: { housing|social: { 政策年度: [url, ...] }, 政策年度: [...] } }
 *   - 直接给年度的写法对「公积金 / 社保」通用；
 *   - 分 kind 的写法用于两者公告不同页的情况（上海就是这样：公积金局的 2740 与人社局的 7546 必须分开）。
 * 采集成功后 run.js 会把新拿到的 URL 写进 data/seeds-learned.json，
 * 与这里人工钉住的分开存，避免自动学习覆盖人工结论。
 * ==========================================================================*/
'use strict';

const SEEDS = {
  // 杭州：年度调整通知（正文是扫描版 PDF，由 AI 读 PDF 取数，不落盘）
  '杭州': {
    2026: ['https://gjj.hangzhou.gov.cn/col/col1229468386/art/2026/art_09cee14331fb44f2967fca0b8ac2ce27.html'],
    2025: ['https://gjj.hangzhou.gov.cn/col/col1229468386/art/2025/art_19b51666b8ea4f7c9543a4d8bc2839db.html'],
  },
  // 广州：2026 / 2025 年度缴存调整通知（HTML 正文）
  '广州': {
    2026: ['http://gjj.gz.gov.cn/gg/tzgg/content/post_10879601.html'],
    2025: ['http://gjj.gz.gov.cn/gg/tzgg/content/post_10338393.html'],
  },
  // 上海：公积金与人社局的公告是两套页面，必须按 kind 分开钉
  '上海': {
    housing: {
      2026: [
        'https://www.shzfgjj.cn/html/newxxgk/zcwj/gfxwj/228478.html',
        'https://www.shzfgjj.cn/html/newxxgk/zcjd/228480.html',
      ],
      2025: ['https://www.shzfgjj.cn/html/newxxgk/zcjd/228183.html'],
    },
  },
  // 省级社保条目在 registry 里带「市/省」后缀，种子键要跟它一致
  '上海市': {
    social: {
      2026: ['https://rsj.sh.gov.cn/tgsgg_17341/20260818/t0035_1443203.html'],
      2025: ['https://rsj.sh.gov.cn/tgsgg_17341/20250918/t0035_1435637.html'],
    },
  },
  '北京市': {
    social: {
      2025: ['https://rsj.beijing.gov.cn/xxgk/2024zcwj/202509/t20250918_4204880.html'],
    },
  },
  // 天津：政策文件库正式通知（津公积金委〔2026〕3号，下限 2510 / 上限 28917，2026-07-01 起）
  '天津': {
    housing: {
      2026: ['https://gk.tj.gov.cn/zcwjk/zfgjj/zcwj/202607/t20260717_7337480.html'],
    },
  },
};

function seedsFor(id, year, kind) {
  const rec = SEEDS[id];
  if (!rec) return [];
  const byKind = kind && rec[kind];
  if (byKind) return byKind[year] || byKind[String(year)] || [];
  return rec[year] || rec[String(year)] || [];
}

module.exports = { SEEDS, seedsFor };
