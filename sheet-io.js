/* ============================================================================
 * sheet-io.js — 表格导入导出（零依赖）
 * ----------------------------------------------------------------------------
 * 支持：
 *   - CSV 导出（带 UTF-8 BOM，Excel / WPS 双击可开）
 *   - CSV 导入（处理引号、逗号、BOM、CRLF）
 *   - XLSX 导入（自行解析 ZIP 中央目录 + 原生 DecompressionStream 解压）
 *
 * 不引入任何第三方库，也不发起网络请求。
 * XLSX 解析只读取第一个工作表的单元格文本，足以应付工资明细模板。
 * ==========================================================================*/
(function (root) {
  'use strict';

  /* ========================= CSV ========================= */

  function buildCsv(headers, rows) {
    const esc = (v) => {
      const s = String(v == null ? '' : v);
      return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines = [headers.map(esc).join(',')];
    rows.forEach((r) => lines.push(r.map(esc).join(',')));
    return new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  }

  function parseCsvText(text) {
    const clean = String(text || '').replace(/^\ufeff/, '');
    const rows = [];
    let row = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (inQuotes) {
        if (ch === '"') {
          if (clean[i + 1] === '"') { cur += '"'; i++; }
          else inQuotes = false;
        } else cur += ch;
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cur); cur = '';
      } else if (ch === '\n') {
        row.push(cur); cur = '';
        rows.push(row); row = [];
      } else if (ch === '\r') {
        // 交给 \n 处理
      } else {
        cur += ch;
      }
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
  }

  /* ========================= ZIP ========================= */

  async function unzip(buffer) {
    const u8 = new Uint8Array(buffer);
    const dv = new DataView(buffer);

    // 从尾部找 End of Central Directory
    let eocd = -1;
    const min = Math.max(0, u8.length - 65558);
    for (let i = u8.length - 22; i >= min; i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('不是有效的 xlsx 文件');

    const count = dv.getUint16(eocd + 10, true);
    let off = dv.getUint32(eocd + 16, true);
    const out = {};

    for (let i = 0; i < count; i++) {
      if (dv.getUint32(off, true) !== 0x02014b50) break;
      const method = dv.getUint16(off + 10, true);
      const compSize = dv.getUint32(off + 20, true);
      const nameLen = dv.getUint16(off + 28, true);
      const extraLen = dv.getUint16(off + 30, true);
      const cmtLen = dv.getUint16(off + 32, true);
      const localOff = dv.getUint32(off + 42, true);
      const name = new TextDecoder().decode(u8.subarray(off + 46, off + 46 + nameLen));

      const lNameLen = dv.getUint16(localOff + 26, true);
      const lExtraLen = dv.getUint16(localOff + 28, true);
      const start = localOff + 30 + lNameLen + lExtraLen;

      out[name] = { method, data: u8.subarray(start, start + compSize) };
      off += 46 + nameLen + extraLen + cmtLen;
    }
    return out;
  }

  async function entryText(entry) {
    if (!entry) return '';
    if (entry.method === 0) return new TextDecoder().decode(entry.data);
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('当前浏览器不支持解压 xlsx，请改用 CSV 导入');
    }
    const stream = new Blob([entry.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Response(stream).text();
  }

  /* ========================= XLSX ========================= */

  function colIndex(ref) {
    const m = /^([A-Z]+)/.exec(String(ref || '').toUpperCase());
    if (!m) return 0;
    let n = 0;
    for (let i = 0; i < m[1].length; i++) n = n * 26 + (m[1].charCodeAt(i) - 64);
    return n - 1;
  }

  function byTag(node, tag) {
    return Array.prototype.slice.call(node.getElementsByTagName(tag));
  }

  function parseSharedStrings(xml) {
    if (!xml) return [];
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return byTag(doc, 'si').map((si) =>
      byTag(si, 't').map((t) => t.textContent || '').join('')
    );
  }

  function parseSheetRows(xml, shared) {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const sheetData = byTag(doc, 'sheetData')[0];
    if (!sheetData) return [];

    return byTag(sheetData, 'row').map((rowEl) => {
      const cells = [];
      byTag(rowEl, 'c').forEach((c) => {
        const idx = colIndex(c.getAttribute('r'));
        const type = c.getAttribute('t');
        let val = '';
        if (type === 'inlineStr') {
          val = byTag(c, 't').map((t) => t.textContent || '').join('');
        } else {
          const vEl = byTag(c, 'v')[0];
          val = vEl ? (vEl.textContent || '') : '';
          if (type === 's') val = shared[Number(val)] || '';
        }
        cells[idx] = val;
      });
      for (let i = 0; i < cells.length; i++) if (cells[i] === undefined) cells[i] = '';
      return cells;
    }).filter((r) => r.some((c) => String(c).trim() !== ''));
  }

  async function parseXlsxBuffer(buffer) {
    const entries = await unzip(buffer);
    const sheet = entries['xl/worksheets/sheet1.xml'];
    if (!sheet) throw new Error('xlsx 中未找到工作表');
    const shared = parseSharedStrings(await entryText(entries['xl/sharedStrings.xml']));
    return parseSheetRows(await entryText(sheet), shared);
  }

  /* ========================= 统一入口 ========================= */

  async function parseFile(file) {
    if (!file) throw new Error('未选择文件');
    if (/\.xlsx$/i.test(file.name)) {
      return parseXlsxBuffer(await file.arrayBuffer());
    }
    if (/\.csv$/i.test(file.name) || /\.txt$/i.test(file.name)) {
      return parseCsvText(await file.text());
    }
    throw new Error('仅支持 .csv 或 .xlsx 文件');
  }

  const API = { buildCsv, parseCsvText, parseXlsxBuffer, parseFile };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.SheetIO = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
