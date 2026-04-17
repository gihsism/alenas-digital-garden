/**
 * Simple reactive store for the IFRS 18 tool state.
 * Uses React useState in the page component — this file provides helpers.
 */

import type { LineItem, EntityType, MpmDefinition, ParsedTable } from "./types";

export interface Ifrs18State {
  // Data
  items: LineItem[];
  periodHeaders: string[]; // e.g. ["2026", "2025"]
  entityType: EntityType;
  // Analysis
  mpms: MpmDefinition[];
  // UI
  activeStep: number;
}

export const INITIAL_STATE: Ifrs18State = {
  items: [],
  periodHeaders: [],
  entityType: "General (non-financial)",
  mpms: [],
  activeStep: 0,
};

// Helpers

export function pnlItems(state: Ifrs18State): LineItem[] {
  return state.items.filter((i) => i.statement === "Profit or Loss");
}

export function bsItems(state: Ifrs18State): LineItem[] {
  return state.items.filter((i) => i.statement === "Balance Sheet");
}

export function cfItems(state: Ifrs18State): LineItem[] {
  return state.items.filter((i) => i.statement === "Cash Flow");
}

export function catSum(items: LineItem[], category: string, periodIdx = 0): number {
  return items.filter((i) => i.category === category).reduce((s, i) => s + (i.amounts[periodIdx] || 0), 0);
}

export function totalSum(items: LineItem[], periodIdx = 0): number {
  return items.reduce((s, i) => s + (i.amounts[periodIdx] || 0), 0);
}

// Persistence — save to localStorage
const STORAGE_KEY = "ifrs18_state";

export function saveState(state: Ifrs18State) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded or private mode */ }
}

export function loadState(): Ifrs18State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Ifrs18State;
  } catch {
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
