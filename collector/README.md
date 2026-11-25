# 社保 / 公积金基数采集流水线

只访问**地方政务站原文**（各地公积金管理中心、人社厅/局），抓年度「缴存基数上下限」公告，
按**生效时间段**入库，带文号与原文链接，供个税工具与审计复核使用。

- 不经过网易 / 新浪 / 聚合站 / 博客 —— 这些站点的数字互相抄错（南京 2026 上限就并存 32400 与 42400 两套）。
- 不下载 PDF、不做本地 OCR。正文是扫描件的，只把 PDF 链接进「AI 识别队列」，
  由具备 PDF 解析能力的调用方读取后把**文本**回灌（KB 级，不占存储）。

## 一条命令跑完

```bash
node collector/run.js --kind=all --year=2026 --prev=2025     # 公积金 + 社保，两年
node collector/run.js --kind=housing --only=上海,北京          # 只跑指定城市
node collector/run.js --kind=social --only=广东,浙江            # 只跑省份社保
node collector/run.js --rebuild                              # 用 observations.jsonl 重放重建
node collector/run.js --ingest=data/ai-ingest.jsonl           # 回灌 AI 读到的 PDF 文本
node collector/build-cities.js                               # 生成引擎用的 cities.js
node collector/server.js                                     # 起本地服务（页面上的「检查更新」按钮）
node collector/report.js                                     # 生成 data/COVERAGE.md 覆盖报告
node collector/test-extract.js                               # 抽取器回归（10 段真实原文）
```

常用参数：`--pages=N` 列表翻页数、`--delay=毫秒` 请求间隔、`--no-cdp` 只用 HTTP、`--max-candidates=N`。

## 数据模型：按生效时间段存，不是一个城市一组数

```json
{
  "kind": "housing", "id": "杭州", "policyYear": 2026,
  "from": "2026-07-01", "to": "2027-06-30",
  "min": 2660, "max": 42151,
  "docNo": "杭公积金〔2026〕21号",
  "source": "https://gjj.hangzhou.gov.cn/…",
  "status": "verified", "confidence": "high", "via": "ai-pdf",
  "evidence": "缴存基数上限为 42151 元…市区下限 2660 元",
  "fetchedAt": "2026-11-23T03:20:11.402Z"
}
```

这样做的原因：**7 月前后用的是两个年度的基数**，各地切换月份不同（杭州/北京/广州 7 月、
南宁 1 月、上海公积金 7 月、部分省份社保 1 月）。引擎按月份取段，切换时间就成了数据而不是假设。

## 三层存储，互不覆盖

| 文件 | 作用 | 写入方式 |
|---|---|---|
| `data/observations.jsonl` | 每次观测一条，只追加 | 永不重写，`--rebuild` 的唯一依据 |
| `data/dataset.json` | 合并后的当前口径（城市/省份 → segments[]） | 每轮结束重写 |
| `data/snapshots/<日期>[-hash].json` | 每轮快照，按内容 hash 去重 | 同日多次跑且内容不同则加 hash 后缀 |
| `data/conflicts.json` | 同期不同数字的复核队列（保留原值 + alt） | 只追加 |

历史数据因此是不可变的：某年公告被改、站点下线，旧观测仍可追溯。

## 抽取与校验

抽取不是「找数字」，是「找基数语境里的数字」：

1. 必须含「基数 / 缴存基数 / 缴费基数」语境；「月缴存额」紧邻（前 16 字）重罚 —— 上海曾被抽成 `384–3774`。
2. `3倍(42400元)` 这类括号写法加分；「上下限」里的「下限」用负向后行断言排除。
3. 特殊人群下限（领取基本生活费、灵活就业、新调入职工）降权。
4. 句子先 flatten 换行再按中文句读切 —— OCR/PDF 版式会把「上限为 42151」和「元；下限…」拆成两行。
5. 执行期识别「2026年7月1日至2027年6月30日」「2026年7月-2027年6月」「自…起」。

校验闸门（`lib/validate.js`）：

- 上限 > 下限、上限 ≥ 5000、上下限比值下限；
- **社保上下限比值应≈5.0（300%/60%）**，偏离 4.3–5.7 降级（公积金不套这条）；
- 与上一年度同比涨跌超过 25%/30% 降级；
- 同期已有不同数字 → `conflict`，进复核队列，不悄悄覆盖。

年度核对是硬闸门：公告执行期起始年 ≠ 目标年度时**不入库**（成都曾因此把 2026 的公告写成 2025 的数据），
宁可留空等补，也不让历史失真。

## PDF 正文：AI 识别队列（不下载）

```
run.js 抽不出数字 + 页面挂附件
   → 只把最相关的一篇附件 URL 写进 data/ai-queue.json / ai-queue.md
   → 用 web_fetch（或任何能解析 PDF 的 AI 能力）读原文，返回纯文本
   → 文本按 JSONL 写入 data/ai-ingest.jsonl
   → node run.js --ingest=data/ai-ingest.jsonl   # 走同一套抽取、校验、合并
```

附件排序按语义：文件名含「基数/缴存/调整/通知」的优先，含「决定书/处罚/名单/统计表」的排后
（深圳曾把《责令限期缴存决定书》排到第一位，白读一遍）。队列累计保存，已识别的标 `done`。

## 页面上的「一键更新」

`index.html` 顶部有数据版本与「检查更新」按钮：

- 直接双击打开：按钮提示需要本地服务，测算功能不受影响；
- `node collector/server.js` 后访问 `http://127.0.0.1:8787`：点按钮 → `POST /api/refresh`
  → 页面轮询 `/api/status` 显示进度 → 跑完自动刷新。**Alt + 点击 = 全量更新**，默认只更新当前城市。

## 模块

```
run.js          主流程：候选（种子→登记栏目→首页发现）→ 正文 → 抽取 → 校验 → 合并 → 快照
registry.js    43 个公积金城市 + 31 个省社保，含候选站点数组与已登记栏目（年更主要改这里）
seeds.js       已核实原文直达链接（按 kind 分开，避免公积金/社保串页）
lib/net.js     HTTP→CDP 回落、正文容器识别、附件发现（不下载）
lib/extract.js 公告列表筛选 / 上下限 / 执行期 / 比例 / 文号抽取
lib/validate.js 合理性闸门与冲突判定
lib/store.js   追加观测、合并、快照、冲突、覆盖统计
build-cities.js 压成引擎格式（两段基数 + 调整月）并写 meta
report.js      覆盖报告：已核验 / 尚缺 / 冲突 / 队列 → data/COVERAGE.md
test-extract.js 抽取器回归（10 段真实语料，改规则先跑这个）
server.js      静态服务 + health/status/queue/refresh
cdp.js         浏览器渲染（JS 站、反爬站）
```

## 已知边界

- 部分站点 DNS 不通或返回 403/412（南京 403、成都 412、合肥/青岛/宁波等多地域名解析失败），
  这类城市靠 CDP 或人工种子补，流水线会记为「缺」而不是编造数字。
- 站点改版只影响「分类发现」，已学到的原文链接（`data/seeds-learned.json`）仍可复用。
- 社保持续按省抓，省级口径与城市口径不同（省会城市常另有市级文件）。
