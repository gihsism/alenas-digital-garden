/**
 * IFRS 18 classification engine.
 * - Statement-type detection (whole-table scoring)
 * - P&L classification into 5 IFRS 18 categories
 * - BS classification into 5 standard groupings
 * - CF activity classification
 */

import type {
  StatementType,
  PnlCategory,
  BsCategory,
  CfCategory,
  EntityType,
  LineItem,
  ParsedTable,
} from "./types";

// ─── P&L classification keywords ────────────────────────────────────────────

const PNL_RULES: Record<PnlCategory, string[]> = {
  Operating: [
    "revenue", "sales", "turnover", "cost of sales", "cost of goods",
    "cost of revenue", "gross profit", "selling", "distribution", "marketing",
    "administrative", "admin", "general expense", "staff cost", "employee",
    "wages", "salaries", "depreciation", "amortisation", "amortization",
    "impairment", "write-down", "write-off", "research", "development", "r&d",
    "other operating", "operating expense", "operating income",
    "restructuring", "warranty", "bad debt", "expected credit loss", "ecl",
    "inventory write", "rent expense", "lease expense",
    "foreign exchange", "fx gain", "fx loss",
    "gain on disposal of ppe", "loss on disposal of ppe",
    "pension service cost", "defined benefit service",
    "other income", "other expense", "insurance revenue", "insurance service",
  ],
  Investing: [
    "dividend income", "dividend received", "interest income", "interest received",
    "investment income", "rental income", "fair value gain", "fair value loss",
    "gain on disposal of investment", "loss on disposal of investment",
    "gain on disposal of subsidiary", "share of profit", "share of loss",
    "equity method", "revaluation gain", "revaluation loss",
  ],
  Financing: [
    "interest expense", "interest paid", "finance cost", "finance charge",
    "borrowing cost", "loan interest", "bond interest", "lease interest",
    "unwinding of discount", "fair value change on financial liabilit",
    "bank charge", "commitment fee", "net interest on defined benefit",
    "exchange difference on borrowing", "exchange loss on borrowing",
    "exchange gain on borrowing", "fx on debt", "fx on loan",
    "foreign exchange loss on borrowing", "foreign exchange gain on borrowing",
  ],
  "Income Tax": [
    "income tax", "tax expense", "tax benefit", "current tax", "deferred tax",
    "withholding tax",
  ],
  "Discontinued Operations": ["discontinued", "held for sale"],
};

const FINANCIAL_OVERRIDES: Record<string, string[]> = {
  "Banking / Lending": [
    "interest income", "interest expense", "loan interest", "net interest",
    "fee income", "commission income", "trading income", "trading loss",
    "fair value change on financial", "expected credit loss", "ecl",
  ],
  Insurance: [
    "insurance revenue", "insurance service", "net insurance", "reinsurance",
    "investment income",
  ],
  "Investment Entity": [
    "dividend income", "interest income", "fair value gain", "fair value loss",
    "investment income", "rental income",
    "gain on disposal of investment", "loss on disposal of investment",
  ],
};

// ─── BS classification keywords ─────────────────────────────────────────────

const BS_RULES: Record<BsCategory, string[]> = {
  "Non-current Assets": [
    "property plant", "ppe", "land and building", "intangible", "goodwill",
    "software", "investment property", "right-of-use", "rou asset",
    "biological asset", "deferred tax asset", "long-term investment",
    "equity investment", "investment in associate", "investment in joint venture",
    "financial asset",
  ],
  "Current Assets": [
    "inventory", "inventories", "stock", "trade receivable", "accounts receivable",
    "other receivable", "loan receivable", "prepayment", "prepaid", "advance",
    "contract asset", "cash", "bank balance", "term deposit",
    "short-term investment", "tax receivable", "tax refund",
  ],
  Equity: [
    "share capital", "ordinary share", "common stock", "share premium",
    "additional paid-in", "retained earning", "accumulated profit",
    "accumulated loss", "reserve", "revaluation reserve", "hedging reserve",
    "translation reserve", "other comprehensive", "oci", "treasury",
    "non-controlling interest", "minority interest",
  ],
  "Non-current Liabilities": [
    "long-term borrowing", "bond payable", "debenture", "lease liabilit",
    "deferred tax liabilit", "pension liabilit", "defined benefit liabilit",
    "defined benefit obligation", "long-term payable",
    "other non-current liabilit", "provision", "provisions",
  ],
  "Current Liabilities": [
    "trade payable", "accounts payable", "accrual", "accrued",
    "short-term borrowing", "overdraft", "current portion",
    "tax payable", "income tax payable", "contract liabilit",
    "deferred revenue", "unearned revenue", "dividend payable",
    "other payable", "other current liabilit",
  ],
};

// ─── Statement-type detection signals ───────────────────────────────────────

const PNL_SIGNALS = [
  "revenue", "turnover", "cost of sales", "gross profit", "operating profit",
  "profit before tax", "profit for the year", "loss for the year", "ebitda",
  "selling expense", "distribution cost", "administrative expense",
  "other operating income", "other operating expense",
  "finance cost", "finance income", "income tax expense", "tax expense",
  "depreciation", "amortisation", "amortization", "impairment",
  "employee benefit", "staff cost", "interest income", "interest expense",
  "dividend income", "share of profit", "share of loss", "discontinued operation",
  "restructuring", "fair value gain", "fair value loss", "rental income",
  "foreign exchange gain", "foreign exchange loss", "unwinding of discount",
  "depreciation - ppe", "interest expense - bank", "interest expense - lease",
  "impairment of trade receivable", "gain on disposal of investment property",
  "fair value gain on equity", "rental income from investment property",
  "gain on disposal of investment", "current income tax",
  "selling & distribution", "employee benefits expense",
];

const BS_SIGNALS = [
  "total assets", "total liabilities", "total equity", "net assets",
  "property plant and equipment", "ppe", "intangible asset", "goodwill",
  "right-of-use asset", "investment property",
  "trade receivable", "accounts receivable", "inventory", "inventories",
  "cash and cash equivalent", "prepayment", "contract asset", "deferred tax asset",
  "share capital", "ordinary share", "retained earning", "other reserve",
  "non-controlling interest", "treasury share",
  "trade payable", "accounts payable", "borrowing", "bank loan",
  "lease liabilit", "deferred tax liabilit", "provision",
  "pension liabilit", "contract liabilit", "deferred revenue",
  "accrued expense", "current portion of", "bond payable", "dividend payable",
];

const CF_SIGNALS = [
  "cash flow from operating", "cash from operating",
  "cash flow from investing", "cash from investing",
  "cash flow from financing", "cash from financing",
  "net cash from", "net cash used in",
  "net increase in cash", "net decrease in cash",
  "cash at beginning", "cash at end", "cash and cash equivalents at",
  "operating activities", "investing activities", "financing activities",
  "purchase of ppe", "purchase of property",
  "proceeds from disposal", "proceeds from sale of",
  "proceeds from borrowing", "repayment of borrowing",
  "payment of lease", "lease payment",
  "dividends paid", "interest paid", "interest received",
  "dividends received", "tax paid", "income tax paid",
  "proceeds from issue of share", "acquisition of subsidiary",
  "purchase of investment", "changes in working capital", "adjustments for",
];

// ─── Classification functions ───────────────────────────────────────────────

function longestMatch(text: string, keywords: string[]): number {
  let best = 0;
  for (const kw of keywords) {
    if (text.includes(kw) && kw.length > best) best = kw.length;
  }
  return best;
}

export function classifyPnlItem(
  description: string,
  entityType: EntityType = "General (non-financial)"
): PnlCategory {
  const d = description.toLowerCase().trim();

  // Financial entity overrides
  if (entityType !== "General (non-financial)") {
    const overrides = FINANCIAL_OVERRIDES[entityType] || [];
    for (const kw of overrides) {
      if (d.includes(kw)) return "Operating";
    }
  }

  // Check non-operating first (Operating is residual)
  const priority: PnlCategory[] = [
    "Discontinued Operations",
    "Income Tax",
    "Financing",
    "Investing",
    "Operating",
  ];
  for (const cat of priority) {
    for (const kw of PNL_RULES[cat]) {
      if (d.includes(kw)) return cat;
    }
  }
  return "Operating";
}

export function classifyBsItem(description: string): BsCategory {
  const d = description.toLowerCase().trim();
  let bestCat: BsCategory = "Non-current Assets";
  let bestLen = 0;
  for (const [cat, keywords] of Object.entries(BS_RULES) as [BsCategory, string[]][]) {
    for (const kw of keywords) {
      if (d.includes(kw) && kw.length > bestLen) {
        bestCat = cat;
        bestLen = kw.length;
      }
    }
  }
  return bestCat;
}

export function classifyCfItem(description: string): CfCategory {
  const d = description.toLowerCase();
  const cfFinancing = [
    "proceeds from borrowing", "repayment of borrowing", "payment of lease",
    "lease payment", "dividends paid", "interest paid", "proceeds from issue",
    "share buyback", "financing activities",
  ];
  const cfInvesting = [
    "purchase of ppe", "purchase of property", "purchase of equipment",
    "purchase of intangible", "purchase of investment",
    "proceeds from disposal", "proceeds from sale", "acquisition of subsidiary",
    "disposal of subsidiary", "interest received", "dividends received",
    "investing activities",
  ];
  for (const kw of cfFinancing) if (d.includes(kw)) return "CF - Financing";
  for (const kw of cfInvesting) if (d.includes(kw)) return "CF - Investing";
  return "CF - Operating";
}

// ─── Table-level statement detection ────────────────────────────────────────

function scoreRow(account: string): StatementType {
  const d = account.toLowerCase();
  const pnl = longestMatch(d, PNL_SIGNALS);
  const bs = longestMatch(d, BS_SIGNALS);
  const cf = longestMatch(d, CF_SIGNALS);

  if (cf > pnl && cf > bs) return "Cash Flow";
  if (bs > pnl && bs > cf) return "Balance Sheet";
  if (pnl > 0) return "Profit or Loss";
  return "Profit or Loss";
}

function countSignals(accounts: string[], signals: string[]): number {
  let count = 0;
  for (const acct of accounts) {
    const d = acct.toLowerCase();
    if (signals.some((s) => d.includes(s))) count++;
  }
  return count;
}

export function detectAndClassify(
  table: ParsedTable,
  entityType: EntityType = "General (non-financial)"
): LineItem[] {
  const accounts = table.rows.map((r) => r.account);
  const n = Math.max(accounts.length, 1);

  // Table-level scoring
  const pnlScore = countSignals(accounts, PNL_SIGNALS) / n;
  const bsScore = countSignals(accounts, BS_SIGNALS) / n;
  const cfScore = countSignals(accounts, CF_SIGNALS) / n;

  const scores = { "Profit or Loss": pnlScore, "Balance Sheet": bsScore, "Cash Flow": cfScore };
  const dominant = (Object.entries(scores) as [StatementType, number][])
    .sort((a, b) => b[1] - a[1])[0];
  const runnerUp = (Object.entries(scores) as [StatementType, number][])
    .sort((a, b) => b[1] - a[1])[1];

  // If clearly one type, tag all rows
  const tagAll = dominant[1] >= 0.6 && runnerUp[1] < 0.4;

  return table.rows.map((row) => {
    const stmt: StatementType = tagAll ? dominant[0] : scoreRow(row.account);
    let category: string;
    if (stmt === "Profit or Loss") category = classifyPnlItem(row.account, entityType);
    else if (stmt === "Balance Sheet") category = classifyBsItem(row.account);
    else category = classifyCfItem(row.account);

    return {
      account: row.account,
      amounts: row.amounts,
      statement: stmt,
      category,
    };
  });
}
