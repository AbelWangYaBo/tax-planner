# AI 识别队列

这些公告的正文是 PDF / 附件，按你的要求**不下载到本地、不做本地 OCR**。
请用具备 PDF 解析 / 识图能力的工具（例如 web_fetch 读取 PDF 链接）读取原文，
把正文文本按 `data/ai-ingest.jsonl` 的格式回灌：

```json
{"id":"杭州","kind":"housing","year":2026,"url":"<公告或 PDF 链接>","text":"<原文>","via":"ai"}
```

然后执行 `node run.js --ingest=data/ai-ingest.jsonl`。

待识别 3 篇。

- [ ] **上海** 公积金 2025 · https://www.shzfgjj.cn/html/newxxgk/xxgknb/img/20260129152954324.pdf
- [ ] **西安** 公积金 2025 · https://zfgjj.xa.gov.cn/web_files/zfgjj/file/2025/07/11/202507111432037598194.docx
- [ ] **太原** 公积金 2025 · http://zfgjj.taiyuan.gov.cn/u/cms/site98/202507/02162449ua7r.docx
