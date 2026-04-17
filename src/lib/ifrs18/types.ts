export type StatementType = "Profit or Loss" | "Balance Sheet" | "Cash Flow";

export type PnlCategory =
  | "Operating"
  | "Investing"
  | "Financing"
  | "Income Tax"
  | "Discontinued Operations";

export type BsCategory =
  | "Non-current Assets"
  | "Current Assets"
  | "Equity"
  | "Non-current Liabilities"
  | "Current Liabilities";

export type CfCategory = "CF - Operating" | "CF - Investing" | "CF - Financing";

export type EntityType =
  | "General (non-financial)"
  | "Banking / Lending"
  | "Insurance"
  | "Investment Entity";

export interface LineItem {
  account: string;
  amounts: number[]; // one per period
  statement: StatementType;
  category: string;
}

export interface ParsedTable {
  headers: string[]; // ["Account", "2026", "2025"]
  rows: { account: string; amounts: number[] }[];
}

export interface MpmDefinition {
  name: string;
  description: string;
  rationale: string;
  reconcileFrom: string;
  adjustments: { item: string; amount: number; taxEffect: number; nciEffect: number }[];
}

export const PNL_CATEGORIES: PnlCategory[] = [
  "Operating",
  "Investing",
  "Financing",
  "Income Tax",
  "Discontinued Operations",
];

export const BS_CATEGORIES: BsCategory[] = [
  "Non-current Assets",
  "Current Assets",
  "Equity",
  "Non-current Liabilities",
  "Current Liabilities",
];

export const CF_CATEGORIES: CfCategory[] = [
  "CF - Operating",
  "CF - Investing",
  "CF - Financing",
];
