/* ============================================================================
 * registry.js — 官方站点清单（人工维护，年更时改这里）
 * ----------------------------------------------------------------------------
 * 只登记两类「一手来源」：
 *   social  省人社厅 / 省医保局 —— 社保缴费基数上下限
 *   housing 市住房公积金管理中心 —— 公积金缴存基数上下限
 *
 * 明令不收录：新闻站、财经媒体、聚合表格站、百科。历史上正是因为用了这些源，
 * 才出现南京 32400/42400 两套数字打架、上海被写成「月缴存额 384~3774」。
 *
 * 字段：
 *   id          城市 / 省名（与 cities.js 对齐）
 *   province    所属省级行政区
 *   kind        housing | social
 *   sites       候选官方站点，按顺序尝试（站点迁移时改这里）
 *   columns     已知的「通知公告 / 政策文件」列表页（留空则由爬虫从首页发现）
 *   search      站内搜索模板，{q} 会被替换（可选）
 * ==========================================================================*/
'use strict';

/* ---------------- 住房公积金：市级 ---------------- */
const HOUSING = [
  { id: '北京', province: '北京市', sites: ['https://gjj.beijing.gov.cn/'],
    columns: ['https://gjj.beijing.gov.cn/web/zwgk61/tzgg/index.html'] },
  { id: '上海', province: '上海市', sites: ['https://www.shzfgjj.cn/'] },
  { id: '天津', province: '天津市', sites: ['https://www.zfgjj.cn/'] },
  { id: '重庆', province: '重庆市', sites: ['https://www.cqgjj.cn/'] },
  { id: '广州', province: '广东省', sites: ['http://gjj.gz.gov.cn/'],
    columns: ['http://gjj.gz.gov.cn/gg/tzgg/index.html'] },
  { id: '深圳', province: '广东省', sites: ['https://zjj.sz.gov.cn/ztfw/zfgjj/'] },
  { id: '杭州', province: '浙江省', sites: ['https://gjj.hangzhou.gov.cn/'],
    columns: ['https://gjj.hangzhou.gov.cn/col/col1229468386/index.html'] },
  { id: '南京', province: '江苏省', sites: ['https://gjj.nanjing.gov.cn/'] },
  { id: '苏州', province: '江苏省', sites: ['https://gjj.suzhou.gov.cn/'] },
  { id: '无锡', province: '江苏省', sites: ['https://gjj.wx.gov.cn/', 'https://zfgjj.wuxi.gov.cn/'] },
  { id: '武汉', province: '湖北省', sites: ['https://gjj.wuhan.gov.cn/'] },
  { id: '成都', province: '四川省', sites: ['https://cdzfgjj.chengdu.gov.cn/'] },
  { id: '西安', province: '陕西省', sites: ['https://zfgjj.xa.gov.cn/'] },
  { id: '郑州', province: '河南省', sites: ['https://zzgjj.zhengzhou.gov.cn/'] },
  { id: '长沙', province: '湖南省', sites: ['https://gjj.changsha.gov.cn/', 'http://zfgjj.changsha.gov.cn/'] },
  { id: '厦门', province: '福建省', sites: ['http://gjj.xm.gov.cn/'] },
  { id: '福州', province: '福建省', sites: ['http://zfgjj.fuzhou.gov.cn/'] },
  { id: '合肥', province: '安徽省', sites: ['https://gjj.hefei.gov.cn/', 'https://zfgjj.hefei.gov.cn/'] },
  { id: '青岛', province: '山东省', sites: ['https://gjj.qingdao.gov.cn/', 'http://zfgjj.qingdao.gov.cn/'] },
  { id: '济南', province: '山东省', sites: ['https://gjj.jinan.gov.cn/'] },
  { id: '宁波', province: '浙江省', sites: ['https://zjj.ningbo.gov.cn/', 'http://zfgjj.ningbo.gov.cn/'] },
  { id: '昆明', province: '云南省', sites: ['http://zfgjj.km.gov.cn/', 'https://gjj.km.gov.cn/'] },
  { id: '贵阳', province: '贵州省', sites: ['https://gjj.guiyang.gov.cn/'] },
  { id: '南宁', province: '广西壮族自治区', sites: ['https://gjj.nanning.gov.cn/'] },
  { id: '海口', province: '海南省', sites: ['https://gjj.haikou.gov.cn/', 'http://zfgjj.haikou.gov.cn/'] },
  { id: '太原', province: '山西省', sites: ['http://zfgjj.taiyuan.gov.cn/', 'https://gjj.taiyuan.gov.cn/'] },
  { id: '石家庄', province: '河北省', sites: ['https://gjj.sjz.gov.cn/', 'http://zfgjj.sjz.gov.cn/'] },
  { id: '沈阳', province: '辽宁省', sites: ['https://gjj.shenyang.gov.cn/', 'http://zfgjj.shenyang.gov.cn/'] },
  { id: '长春', province: '吉林省', sites: ['https://gjj.cc.jl.gov.cn/'] },
  { id: '哈尔滨', province: '黑龙江省', sites: ['https://gjj.harbin.gov.cn/'] },
  { id: '南昌', province: '江西省', sites: ['https://gjj.nc.gov.cn/'] },
  { id: '兰州', province: '甘肃省', sites: ['https://gjj.lanzhou.gov.cn/'] },
  { id: '西宁', province: '青海省', sites: ['http://zfgjj.xining.gov.cn/'] },
  { id: '银川', province: '宁夏回族自治区', sites: ['https://gjj.yinchuan.gov.cn/'] },
  { id: '乌鲁木齐', province: '新疆维吾尔自治区', sites: ['https://gjj.urumqi.gov.cn/'] },
  { id: '拉萨', province: '西藏自治区', sites: ['https://gjj.lasa.gov.cn/'] },
  { id: '呼和浩特', province: '内蒙古自治区', sites: ['https://gjj.huhhot.gov.cn/'] },
  { id: '东莞', province: '广东省', sites: ['https://zjj.dg.gov.cn/'] },
  { id: '佛山', province: '广东省', sites: ['https://fszfgjj.foshan.gov.cn/'] },
  { id: '珠海', province: '广东省', sites: ['https://zjj.zhuhai.gov.cn/'] },
  { id: '中山', province: '广东省', sites: ['https://zjj.zs.gov.cn/'] },
  { id: '温州', province: '浙江省', sites: ['https://zjj.wenzhou.gov.cn/'] },
  { id: '大连', province: '辽宁省', sites: ['https://zjj.dl.gov.cn/'] },
];

/* ---------------- 社会保险：省级 ---------------- */
const SOCIAL = [
  { id: '北京市', province: '北京市', sites: ['https://rsj.beijing.gov.cn/'] },
  { id: '上海市', province: '上海市', sites: ['https://rsj.sh.gov.cn/'] },
  { id: '天津市', province: '天津市', sites: ['https://hrss.tj.gov.cn/'] },
  { id: '重庆市', province: '重庆市', sites: ['https://rlsbj.cq.gov.cn/'] },
  { id: '河北省', province: '河北省', sites: ['https://rst.hebei.gov.cn/'] },
  { id: '山西省', province: '山西省', sites: ['https://rst.shanxi.gov.cn/'] },
  { id: '内蒙古自治区', province: '内蒙古自治区', sites: ['https://rst.nmg.gov.cn/'] },
  { id: '辽宁省', province: '辽宁省', sites: ['https://rst.ln.gov.cn/'] },
  { id: '吉林省', province: '吉林省', sites: ['https://hrss.jl.gov.cn/'] },
  { id: '黑龙江省', province: '黑龙江省', sites: ['https://hrss.hlj.gov.cn/'] },
  { id: '江苏省', province: '江苏省', sites: ['https://jshrss.jiangsu.gov.cn/'] },
  { id: '浙江省', province: '浙江省', sites: ['https://hrss.zj.gov.cn/'] },
  { id: '安徽省', province: '安徽省', sites: ['https://hrss.ah.gov.cn/'] },
  { id: '福建省', province: '福建省', sites: ['https://rst.fujian.gov.cn/'] },
  { id: '江西省', province: '江西省', sites: ['https://hrss.jiangxi.gov.cn/'] },
  { id: '山东省', province: '山东省', sites: ['https://hrss.shandong.gov.cn/'] },
  { id: '河南省', province: '河南省', sites: ['https://hrss.henan.gov.cn/'] },
  { id: '湖北省', province: '湖北省', sites: ['https://rst.hubei.gov.cn/'] },
  { id: '湖南省', province: '湖南省', sites: ['http://rst.hunan.gov.cn/'] },
  { id: '广东省', province: '广东省', sites: ['https://hrss.gd.gov.cn/'] },
  { id: '广西壮族自治区', province: '广西壮族自治区', sites: ['https://rst.gxzf.gov.cn/'] },
  { id: '海南省', province: '海南省', sites: ['https://hrss.hainan.gov.cn/'] },
  { id: '四川省', province: '四川省', sites: ['https://rst.sc.gov.cn/'] },
  { id: '贵州省', province: '贵州省', sites: ['https://rst.guizhou.gov.cn/'] },
  { id: '云南省', province: '云南省', sites: ['https://hrss.yn.gov.cn/'] },
  { id: '西藏自治区', province: '西藏自治区', sites: ['https://hrss.xizang.gov.cn/'] },
  { id: '陕西省', province: '陕西省', sites: ['https://rst.shaanxi.gov.cn/'] },
  { id: '甘肃省', province: '甘肃省', sites: ['https://rst.gansu.gov.cn/'] },
  { id: '青海省', province: '青海省', sites: ['https://hrss.qinghai.gov.cn/'] },
  { id: '宁夏回族自治区', province: '宁夏回族自治区', sites: ['https://hrss.nx.gov.cn/'] },
  { id: '新疆维吾尔自治区', province: '新疆维吾尔自治区', sites: ['https://rst.xinjiang.gov.cn/'] },
];

// 省级社保的补充来源：部分省由医保局单独公布医保缴费基数，列在这里供扩展
const SOCIAL_EXTRA = [
  { id: '深圳市', province: '广东省', sites: ['https://hsa.sz.gov.cn/'], kind: 'social' },
];

function all() {
  return [
    ...HOUSING.map((x) => ({ ...x, kind: 'housing', scope: 'city' })),
    ...SOCIAL.map((x) => ({ ...x, kind: 'social', scope: 'province' })),
  ];
}

module.exports = { HOUSING, SOCIAL, SOCIAL_EXTRA, all };
