/**
 * Document parsers for financial statements.
 * Extracts tables from Excel, CSV, PDF, and Word files — all client-side.
 */

import type { ParsedTable } from "./types";

// ─── Number parsing ─────────────────────────────────────────────────────────

export function cleanNumber(value: string | null | undefined): number | null {
  if (!value) return null;
  let s = value.trim();
  if (!s || ["-", "—", "–", "n/a", "N/A", "nil", "Nil"].includes(s)) return 0;

  let negative = false;
  if (s.startsWith("(") && s.endsWith(")")) {
    negative = true;
    s = s.slice(1, -1);
  } else if (s.startsWith("-") || s.startsWith("–") || s.startsWith("—")) {
    negative = true;
    s = s.slice(1);
  }

  // Remove currency symbols, spaces, thousands separators
  s = s.replace(/[£$€¥₹\s',\u00a0\u2009]/g, "");
  if (s.endsWith("-")) {
    negative = true;
    s = s.slice(0, -1);
  }
  if (!s) return 0;

  const val = parseFloat(s);
  if (isNaN(val)) return null;
  return negative ? -val : val;
}

function isNumberLike(value: string): boolean {
  if (!value || ["-", "—", "–"].includes(value.trim())) return false;
  const n = cleanNumber(value);
  return n !== null && n !== 0;
}

function isHeaderValue(value: string): boolean {
  const s = value.trim();
  if (!s) return false;
  if (/^(FY|CY|PY)?\s*\d{4}$/i.test(s)) return true;
  const headers = [
    "amount", "total", "note", "notes", "current", "prior", "year", "period",
    "restated", "audited", "unaudited", "budget", "actual", "forecast",
    "eur", "usd", "gbp", "chf", "000", "million", "m", "$m", "£m", "thousands",
  ];
  return headers.includes(s.toLowerCase()) || /^\d{4}\/\d{2,4}$/.test(s);
}

// ─── Table standardisation ──────────────────────────────────────────────────

function standardiseTable(rawRows: string[][]): ParsedTable | null {
  // Remove empty rows/cols
  let rows = rawRows.filter((r) => r.some((c) => c.trim()));
  if (rows.length < 2) return null;

  // Find max cols
  const maxCols = Math.max(...rows.map((r) => r.length));
  rows = rows.map((r) => {
    while (r.length < maxCols) r.push("");
    return r;
  });

  if (maxCols < 2) return null;

  // Detect header row (first 3 rows)
  let headerIdx = -1;
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    const nonFirst = rows[i].slice(1);
    const headerLike = nonFirst.filter((v) => isHeaderValue(v) || !v.trim()).length;
    const hasBigNum = nonFirst.some(
      (v) => isNumberLike(v) && Math.abs(cleanNumber(v) || 0) >= 100 && !/^\d{4}$/.test(v.trim())
    );
    if (headerLike >= nonFirst.length * 0.5 && !hasBigNum) {
      headerIdx = i;
      break;
    }
  }

  let headers: string[];
  let dataRows: string[][];

  if (headerIdx >= 0) {
    headers = rows[headerIdx].map((h) => h.trim());
    headers[0] = "Account";
    for (let i = 1; i < headers.length; i++) {
      if (!headers[i]) headers[i] = `Column ${i}`;
    }
    dataRows = rows.slice(headerIdx + 1);
  } else {
    headers = ["Account", ...Array.from({ length: maxCols - 1 }, (_, i) => `Column ${i + 1}`)];
    dataRows = rows;
  }

  // Deduplicate header names
  const seen = new Map<string, number>();
  for (let i = 1; i < headers.length; i++) {
    const name = headers[i];
    if (seen.has(name)) {
      const count = seen.get(name)! + 1;
      seen.set(name, count);
      headers[i] = `${name}_${count}`;
    } else {
      seen.set(name, 0);
    }
  }

  // Parse rows
  const parsed: { account: string; amounts: number[] }[] = [];
  for (const row of dataRows) {
    const account = (row[0] || "").trim();
    if (!account) continue;
    const amounts = row.slice(1).map((v) => cleanNumber(v) ?? 0);
    // Skip if all amounts are zero and account looks like junk
    if (amounts.every((a) => a === 0) && /^(for\s+the|year\s+ended|as\s+at)/i.test(account))
      continue;
    parsed.push({ account, amounts });
  }

  if (parsed.length < 2) return null;

  // Drop all-zero columns
  const colCount = parsed[0].amounts.length;
  const keepCols: number[] = [];
  for (let c = 0; c < colCount; c++) {
    if (parsed.some((r) => r.amounts[c] !== 0)) keepCols.push(c);
  }

  return {
    headers: ["Account", ...keepCols.map((c) => headers[c + 1])],
    rows: parsed.map((r) => ({
      account: r.account,
      amounts: keepCols.map((c) => r.amounts[c]),
    })),
  };
}

// ─── Excel parser ───────────────────────────────────────────────────────────

export async function parseExcel(file: File): Promise<ParsedTable[]> {
  const XLSX = await import("xlsx");
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: "array" });

  const tables: ParsedTable[] = [];
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rawRows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    const table = standardiseTable(rawRows.map((r) => (r as unknown[]).map(String)));
    if (table) tables.push(table);
  }
  return tables;
}

// ─── CSV parser ─────────────────────────────────────────────────────────────

export async function parseCsv(file: File): Promise<ParsedTable[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const rawRows = lines.map((line) => {
    // Handle quoted CSV fields
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  });

  const table = standardiseTable(rawRows);
  return table ? [table] : [];
}

// ─── PDF parser ─────────────────────────────────────────────────────────────

const NUM_TOKEN = /\([\s£$€¥]*[\d,]+\.?\d*\)|[-–—][\s£$€¥]*[\d,]+\.?\d*|[\d,]+\.?\d*/g;

function parseFinancialLine(line: string): { account: string; amounts: number[] } | null {
  line = line.trim();
  if (line.length < 5) return null;

  const matches = [...line.matchAll(NUM_TOKEN)];
  if (!matches.length) return null;

  // Find real numbers (skip years in description area)
  const realNums: { start: number; val: number }[] = [];
  for (const m of matches) {
    const val = cleanNumber(m[0]);
    if (val === null) continue;
    // Skip 4-digit numbers that look like years early in the line
    if (/^\d{4}$/.test(m[0].trim()) && m.index! < line.length * 0.3) continue;
    realNums.push({ start: m.index!, val });
  }
  if (!realNums.length) return null;

  let desc = line.slice(0, realNums[0].start).trim().replace(/[\s.\-–—:]+$/, "");
  if (desc.length < 2) return null;

  return { account: desc, amounts: realNums.map((n) => n.val) };
}

export async function parsePdf(file: File): Promise<ParsedTable[]> {
  const pdfjsLib = await import("pdfjs-dist");

  // Set worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  const allRows: { account: string; amounts: number[] }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // Group text items by y-position into lines
    const lineMap = new Map<number, { x: number; text: string }[]>();
    for (const item of textContent.items) {
      if (!("str" in item)) continue;
      const y = Math.round(item.transform[5] / 3) * 3; // snap to 3pt grid
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push({ x: item.transform[4], text: item.str });
    }

    // Sort lines top-to-bottom (higher y = higher on page in PDF coords)
    const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);

    for (const y of sortedYs) {
      const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      // Join with spacing based on x-gaps
      let lineText = "";
      let prevEnd = 0;
      for (const item of items) {
        const gap = item.x - prevEnd;
        if (gap > 10) lineText += "  "; // double space for column separation
        else if (gap > 2) lineText += " ";
        lineText += item.text;
        prevEnd = item.x + item.text.length * 4; // approximate
      }

      const parsed = parseFinancialLine(lineText);
      if (parsed) allRows.push(parsed);
    }
  }

  if (allRows.length < 3) return [];

  // Normalise column count (pad shorter rows)
  const maxAmounts = Math.max(...allRows.map((r) => r.amounts.length));
  const normalised = allRows.map((r) => ({
    account: r.account,
    amounts: [...r.amounts, ...Array(maxAmounts - r.amounts.length).fill(0)],
  }));

  const headers = ["Account", ...Array.from({ length: maxAmounts }, (_, i) => `Column ${i + 1}`)];

  return [{ headers, rows: normalised }];
}

// ─── Word parser ────────────────────────────────────────────────────────────

export async function parseWord(file: File): Promise<ParsedTable[]> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();

  // Extract raw text — mammoth gives us HTML, but for table extraction
  // we need to parse the HTML tables
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  // Parse HTML tables
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const htmlTables = doc.querySelectorAll("table");

  const tables: ParsedTable[] = [];

  for (const htmlTable of htmlTables) {
    const rawRows: string[][] = [];
    for (const tr of htmlTable.querySelectorAll("tr")) {
      const cells = [...tr.querySelectorAll("td, th")].map((c) => c.textContent?.trim() || "");
      rawRows.push(cells);
    }
    const table = standardiseTable(rawRows);
    if (table) tables.push(table);
  }

  // Fallback: parse text line-by-line
  if (!tables.length) {
    const textResult = await mammoth.extractRawText({ arrayBuffer });
    const rows: { account: string; amounts: number[] }[] = [];
    for (const line of textResult.value.split("\n")) {
      const parsed = parseFinancialLine(line);
      if (parsed) rows.push(parsed);
    }
    if (rows.length >= 3) {
      const maxAmounts = Math.max(...rows.map((r) => r.amounts.length));
      tables.push({
        headers: ["Account", ...Array.from({ length: maxAmounts }, (_, i) => `Column ${i + 1}`)],
        rows: rows.map((r) => ({
          account: r.account,
          amounts: [...r.amounts, ...Array(maxAmounts - r.amounts.length).fill(0)],
        })),
      });
    }
  }

  return tables;
}

// ─── Universal file parser ──────────────────────────────────────────────────

export async function parseFile(file: File): Promise<ParsedTable[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) return parseCsv(file);
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return parseExcel(file);
  if (name.endsWith(".pdf")) return parsePdf(file);
  if (name.endsWith(".docx")) return parseWord(file);
  throw new Error(`Unsupported file type: ${name}`);
}
