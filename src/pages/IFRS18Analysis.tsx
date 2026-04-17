import { useEffect, useState, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, FileSpreadsheet, BarChart3, Building2, DollarSign, FileText, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { LineItem, EntityType, ParsedTable, PnlCategory, MpmDefinition } from "@/lib/ifrs18/types";
import { PNL_CATEGORIES, BS_CATEGORIES, CF_CATEGORIES } from "@/lib/ifrs18/types";
import { detectAndClassify, classifyPnlItem, classifyBsItem, classifyCfItem } from "@/lib/ifrs18/classifier";
import { parseFile } from "@/lib/ifrs18/parsers";
import { type Ifrs18State, INITIAL_STATE, pnlItems, bsItems, cfItems, catSum, totalSum, saveState, loadState, clearState } from "@/lib/ifrs18/store";

const COLORS: Record<string, string> = {
  Operating: "#22c55e", Investing: "#3b82f6", Financing: "#f59e0b",
  "Income Tax": "#ef4444", "Discontinued Operations": "#8b5cf6",
};

export default function IFRS18Analysis() {
  const [state, setState] = useState<Ifrs18State>(() => loadState() || INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { document.title = "IFRS 18 Analysis Tool"; }, []);
  useEffect(() => { saveState(state); }, [state]);

  const update = useCallback((patch: Partial<Ifrs18State>) => setState((s) => ({ ...s, ...patch })), []);

  const pnl = useMemo(() => pnlItems(state), [state.items]);
  const bs = useMemo(() => bsItems(state), [state.items]);
  const cf = useMemo(() => cfItems(state), [state.items]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setLoading(true);
    setError(null);
    try {
      const allItems: LineItem[] = [];
      let headers: string[] = [];
      for (const file of Array.from(files)) {
        const tables = await parseFile(file);
        for (const table of tables) {
          if (!headers.length) headers = table.headers.slice(1);
          const classified = detectAndClassify(table, state.entityType);
          allItems.push(...classified);
        }
      }
      update({ items: allItems, periodHeaders: headers });
    } catch (e: any) {
      setError(e.message || "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }

  function updateCategory(idx: number, newCat: string) {
    const items = [...state.items];
    items[idx] = { ...items[idx], category: newCat };
    update({ items });
  }

  const tabs = [
    { id: "input", label: "Data Input", icon: Upload },
    { id: "classify", label: "Classification", icon: FileSpreadsheet },
    { id: "pnl", label: "Income Statement", icon: BarChart3 },
    { id: "bs", label: "Balance Sheet", icon: Building2 },
    { id: "cf", label: "Cash Flow", icon: DollarSign },
    { id: "transition", label: "Transition", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back
            </a>
            <h1 className="text-lg font-semibold">IFRS 18 Conversion Tool</h1>
          </div>
          <div className="flex items-center gap-3">
            <Select value={state.entityType} onValueChange={(v) => update({ entityType: v as EntityType })}>
              <SelectTrigger className="w-[200px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["General (non-financial)", "Banking / Lending", "Insurance", "Investment Entity"] as EntityType[]).map((e) => (
                  <SelectItem key={e} value={e} className="text-xs">{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => { clearState(); update(INITIAL_STATE); }}>Clear</Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="text-xs py-2 flex flex-col gap-1">
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="input">
            <DataInputTab loading={loading} error={error} state={state} onFiles={handleFiles} />
          </TabsContent>
          <TabsContent value="classify">
            <ClassificationTab state={state} pnl={pnl} bs={bs} cf={cf} onUpdateCategory={updateCategory} />
          </TabsContent>
          <TabsContent value="pnl">
            <PnlTab pnl={pnl} headers={state.periodHeaders} mpms={state.mpms} onMpmsChange={(m) => update({ mpms: m })} />
          </TabsContent>
          <TabsContent value="bs">
            <BsTab bs={bs} headers={state.periodHeaders} />
          </TabsContent>
          <TabsContent value="cf">
            <CfTab cf={cf} pnl={pnl} headers={state.periodHeaders} entityType={state.entityType} />
          </TabsContent>
          <TabsContent value="transition">
            <TransitionTab pnl={pnl} cf={cf} headers={state.periodHeaders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 1: Data Input
// ═══════════════════════════════════════════════════════════════════════════

function DataInputTab({ loading, error, state, onFiles }: {
  loading: boolean; error: string | null; state: Ifrs18State; onFiles: (f: FileList | null) => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Upload Financial Statements</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload Excel, CSV, PDF, or Word files. The tool automatically identifies whether
            data is from the Income Statement, Balance Sheet, or Cash Flow Statement.
          </p>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input type="file" accept=".xlsx,.xls,.csv,.pdf,.docx" multiple
              onChange={(e) => onFiles(e.target.files)} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">{loading ? "Processing..." : "Click to upload or drag files here"}</p>
              <p className="text-xs text-muted-foreground">Excel (.xlsx), CSV, PDF, Word (.docx)</p>
            </label>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {state.items.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Loaded Data</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {(["Profit or Loss", "Balance Sheet", "Cash Flow"] as const).map((s) => {
                const count = state.items.filter((i) => i.statement === s).length;
                return (
                  <div key={s} className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">{s}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 2: Classification
// ═══════════════════════════════════════════════════════════════════════════

function ClassificationTab({ state, pnl, bs, cf, onUpdateCategory }: {
  state: Ifrs18State; pnl: LineItem[]; bs: LineItem[]; cf: LineItem[];
  onUpdateCategory: (idx: number, cat: string) => void;
}) {
  if (!state.items.length) return <p className="text-muted-foreground">Load data first.</p>;

  const allItems = state.items;
  const renderSection = (title: string, items: LineItem[], categories: string[]) => {
    if (!items.length) return null;
    return (
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">{title} ({items.length} items)</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Account</th>
                <th className="text-left py-2 font-medium w-48">Category</th>
                {state.periodHeaders.map((h) => <th key={h} className="text-right py-2 font-medium w-28">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const globalIdx = allItems.indexOf(item);
                return (
                  <tr key={globalIdx} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2">{item.account}</td>
                    <td className="py-2">
                      <select value={item.category} onChange={(e) => onUpdateCategory(globalIdx, e.target.value)}
                        className="w-full text-xs border rounded px-2 py-1 bg-background">
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    {item.amounts.map((a, i) => (
                      <td key={i} className={`py-2 text-right tabular-nums ${a < 0 ? "text-red-600" : ""}`}>
                        {a.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      {renderSection("Income Statement — IFRS 18 Categories", pnl, PNL_CATEGORIES as unknown as string[])}
      {renderSection("Balance Sheet", bs, BS_CATEGORIES as unknown as string[])}
      {renderSection("Cash Flow Statement", cf, CF_CATEGORIES as unknown as string[])}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 3: P&L Analysis
// ═══════════════════════════════════════════════════════════════════════════

function PnlTab({ pnl, headers, mpms, onMpmsChange }: {
  pnl: LineItem[]; headers: string[]; mpms: MpmDefinition[]; onMpmsChange: (m: MpmDefinition[]) => void;
}) {
  const [subTab, setSubTab] = useState("impact");
  if (!pnl.length) return <p className="text-muted-foreground">No P&L data loaded.</p>;

  const operating = catSum(pnl, "Operating");
  const investing = catSum(pnl, "Investing");
  const financing = catSum(pnl, "Financing");
  const tax = catSum(pnl, "Income Tax");
  const disc = catSum(pnl, "Discontinued Operations");
  const total = totalSum(pnl);

  const chartData = [
    { name: "Operating", value: operating },
    { name: "Investing", value: investing },
    { name: "Financing", value: financing },
    { name: "Income Tax", value: tax },
  ].filter((d) => d.value !== 0);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {["impact", "aggregation", "statement", "mpm"].map((t) => (
          <Button key={t} variant={subTab === t ? "default" : "outline"} size="sm" onClick={() => setSubTab(t)}>
            {t === "impact" ? "Impact Assessment" : t === "aggregation" ? "Aggregation" : t === "statement" ? "IFRS 18 Statement" : "MPM Disclosures"}
          </Button>
        ))}
      </div>

      {subTab === "impact" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Operating Profit", value: operating },
              { label: "Investing", value: investing },
              { label: "Financing", value: financing },
              { label: "Income Tax", value: tax },
              { label: "Total P&L", value: total },
            ].map((m) => (
              <Card key={m.label}>
                <CardContent className="pt-4 pb-3 text-center">
                  <div className={`text-lg font-bold tabular-nums ${m.value < 0 ? "text-red-600" : ""}`}>{m.value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Mandatory Subtotals (IFRS 18)</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: "Operating Profit / (Loss)", val: operating, comp: "Operating only" },
                    { label: "Profit Before Financing & Tax", val: operating + investing, comp: "Operating + Investing" },
                    { label: "Profit / (Loss)", val: total, comp: "All categories" },
                  ].map((r) => (
                    <tr key={r.label} className="border-b">
                      <td className="py-2 font-medium">{r.label}</td>
                      <td className="py-2 text-right tabular-nums font-bold">{r.val.toLocaleString()}</td>
                      <td className="py-2 text-right text-xs text-muted-foreground">{r.comp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">P&L by IFRS 18 Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v.toLocaleString()} />
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                  <Bar dataKey="value">
                    {chartData.map((d) => (
                      <Cell key={d.name} fill={COLORS[d.name] || "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Items Outside Operating</CardTitle></CardHeader>
            <CardContent>
              {pnl.filter((i) => i.category !== "Operating").length === 0 ? (
                <p className="text-sm text-muted-foreground">All items classified as Operating.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-2">Account</th><th className="text-left py-2">Category</th><th className="text-right py-2">Amount</th></tr></thead>
                  <tbody>
                    {pnl.filter((i) => i.category !== "Operating").map((item, j) => (
                      <tr key={j} className="border-b last:border-0">
                        <td className="py-2">{item.account}</td>
                        <td className="py-2"><span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: COLORS[item.category] + "20", color: COLORS[item.category] }}>{item.category}</span></td>
                        <td className="py-2 text-right tabular-nums">{item.amounts[0]?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {subTab === "aggregation" && <AggregationSection items={pnl} />}

      {subTab === "statement" && (
        <Card>
          <CardHeader><CardTitle className="text-base">IFRS 18 Income Statement</CardTitle></CardHeader>
          <CardContent>
            <IfrsStatement items={pnl} headers={headers} />
          </CardContent>
        </Card>
      )}

      {subTab === "mpm" && <MpmSection pnl={pnl} mpms={mpms} onChange={onMpmsChange} />}
    </div>
  );
}

function AggregationSection({ items }: { items: LineItem[] }) {
  const [threshold, setThreshold] = useState(5);
  const revenue = items.filter((i) => (i.amounts[0] || 0) > 0).reduce((s, i) => s + i.amounts[0], 0);
  const expenses = items.filter((i) => (i.amounts[0] || 0) < 0).reduce((s, i) => s + Math.abs(i.amounts[0]), 0);
  const base = Math.max(revenue, expenses);
  const thresh = base * threshold / 100;

  const material = items.filter((i) => Math.abs(i.amounts[0] || 0) >= thresh);
  const immaterial = items.filter((i) => Math.abs(i.amounts[0] || 0) < thresh);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Materiality Threshold</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <input type="range" min={1} max={20} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {threshold}% of {base.toLocaleString()} = <strong>{thresh.toLocaleString()}</strong>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Material Items — Present Separately ({material.length})</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable items={material} />
        </CardContent>
      </Card>

      {immaterial.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Aggregation Candidates ({immaterial.length})</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable items={immaterial} />
            <div className="mt-4 space-y-1">
              {PNL_CATEGORIES.map((cat) => {
                const catItems = immaterial.filter((i) => i.category === cat);
                if (catItems.length < 2) return null;
                const sum = catItems.reduce((s, i) => s + (i.amounts[0] || 0), 0);
                return (
                  <p key={cat} className="text-sm">
                    <strong>{cat}</strong>: {catItems.map((i) => i.account).join(", ")} → "Other {cat.toLowerCase()} items" ({sum.toLocaleString()})
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function IfrsStatement({ items, headers }: { items: LineItem[]; headers: string[] }) {
  const cats: PnlCategory[] = ["Operating", "Investing", "Financing", "Income Tax", "Discontinued Operations"];
  const totals: Record<string, number[]> = {};

  const rows: { label: string; amounts: (number | null)[]; style: string }[] = [];
  for (const cat of cats) {
    const catItems = items.filter((i) => i.category === cat);
    const catTotal = headers.map((_, pi) => catItems.reduce((s, i) => s + (i.amounts[pi] || 0), 0));
    totals[cat] = catTotal;

    if (!catItems.length && !["Operating", "Income Tax"].includes(cat)) continue;

    rows.push({ label: cat, amounts: Array(headers.length).fill(null), style: "header" });
    for (const item of catItems) {
      rows.push({ label: `    ${item.account}`, amounts: item.amounts, style: "item" });
    }
    if (catItems.length > 1) {
      rows.push({ label: `  Total ${cat}`, amounts: catTotal, style: "subtotal" });
    }
    rows.push({ label: "", amounts: Array(headers.length).fill(null), style: "blank" });

    if (cat === "Operating") {
      rows.push({ label: "OPERATING PROFIT / (LOSS)", amounts: catTotal, style: "mandatory" });
      rows.push({ label: "", amounts: Array(headers.length).fill(null), style: "blank" });
    } else if (cat === "Investing") {
      const combined = headers.map((_, i) => (totals["Operating"]?.[i] || 0) + (totals["Investing"]?.[i] || 0));
      rows.push({ label: "PROFIT BEFORE FINANCING AND INCOME TAXES", amounts: combined, style: "mandatory" });
      rows.push({ label: "", amounts: Array(headers.length).fill(null), style: "blank" });
    }
  }

  const totalAmounts = headers.map((_, i) => Object.values(totals).reduce((s, t) => s + (t[i] || 0), 0));
  rows.push({ label: "PROFIT / (LOSS) FOR THE PERIOD", amounts: totalAmounts, style: "mandatory" });

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">Line Item</th>
          {headers.map((h) => <th key={h} className="text-right py-2 w-28">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={
            r.style === "header" ? "bg-muted/50 font-semibold" :
            r.style === "mandatory" ? "bg-green-50 font-bold border-t-2 border-b-2 border-green-300" :
            r.style === "subtotal" ? "font-semibold border-t" :
            r.style === "blank" ? "h-3" : "hover:bg-muted/30"
          }>
            <td className="py-1.5">{r.label}</td>
            {r.amounts.map((a, j) => (
              <td key={j} className={`py-1.5 text-right tabular-nums ${a !== null && a < 0 ? "text-red-600" : ""}`}>
                {a !== null ? a.toLocaleString() : ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MpmSection({ pnl, mpms, onChange }: { pnl: LineItem[]; mpms: MpmDefinition[]; onChange: (m: MpmDefinition[]) => void }) {
  const operating = catSum(pnl, "Operating");
  const total = totalSum(pnl);

  function addMpm() {
    onChange([...mpms, {
      name: "Adjusted EBITDA", description: "", rationale: "",
      reconcileFrom: "Operating Profit / (Loss)",
      adjustments: [{ item: "Add back: Depreciation", amount: 0, taxEffect: 0, nciEffect: 0 }],
    }]);
  }

  function updateMpm(idx: number, patch: Partial<MpmDefinition>) {
    const updated = [...mpms];
    updated[idx] = { ...updated[idx], ...patch };
    onChange(updated);
  }

  function removeMpm(idx: number) {
    onChange(mpms.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Management-Defined Performance Measures</CardTitle>
            <Button size="sm" onClick={addMpm}>Add MPM</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            IFRS 18 requires disclosure of MPMs with description, rationale, reconciliation, tax effect, and NCI effect.
          </p>
          {mpms.length === 0 && <p className="text-sm text-muted-foreground italic">No MPMs defined.</p>}
        </CardContent>
      </Card>

      {mpms.map((mpm, i) => {
        const start = mpm.reconcileFrom.includes("Operating") ? operating : total;
        const adjTotal = mpm.adjustments.reduce((s, a) => s + a.amount, 0);
        const mpmVal = start + adjTotal;
        return (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <input value={mpm.name} onChange={(e) => updateMpm(i, { name: e.target.value })}
                  className="text-base font-semibold bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none" />
                <Button variant="ghost" size="sm" onClick={() => removeMpm(i)}>Remove</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Reconcile from</label>
                <select value={mpm.reconcileFrom}
                  onChange={(e) => updateMpm(i, { reconcileFrom: e.target.value })}
                  className="w-full text-sm border rounded px-2 py-1 mt-1 bg-background">
                  <option>Operating Profit / (Loss)</option>
                  <option>Profit / (Loss)</option>
                </select>
              </div>
              <p className="text-sm font-medium">{mpm.reconcileFrom}: {start.toLocaleString()}</p>
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left py-1">Item</th><th className="text-right py-1 w-24">Amount</th><th className="text-right py-1 w-24">Tax</th></tr></thead>
                <tbody>
                  {mpm.adjustments.map((adj, j) => (
                    <tr key={j} className="border-b">
                      <td className="py-1"><input value={adj.item} onChange={(e) => {
                        const adjs = [...mpm.adjustments]; adjs[j] = { ...adjs[j], item: e.target.value }; updateMpm(i, { adjustments: adjs });
                      }} className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none text-sm" /></td>
                      <td className="py-1"><input type="number" value={adj.amount} onChange={(e) => {
                        const adjs = [...mpm.adjustments]; adjs[j] = { ...adjs[j], amount: +e.target.value }; updateMpm(i, { adjustments: adjs });
                      }} className="w-full text-right bg-transparent border rounded px-1 text-sm" /></td>
                      <td className="py-1"><input type="number" value={adj.taxEffect} onChange={(e) => {
                        const adjs = [...mpm.adjustments]; adjs[j] = { ...adjs[j], taxEffect: +e.target.value }; updateMpm(i, { adjustments: adjs });
                      }} className="w-full text-right bg-transparent border rounded px-1 text-sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button variant="outline" size="sm" onClick={() => {
                const adjs = [...mpm.adjustments, { item: "", amount: 0, taxEffect: 0, nciEffect: 0 }];
                updateMpm(i, { adjustments: adjs });
              }}>Add adjustment</Button>
              <div className="text-lg font-bold pt-2">{mpm.name}: {mpmVal.toLocaleString()}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 4: Balance Sheet
// ═══════════════════════════════════════════════════════════════════════════

function BsTab({ bs, headers }: { bs: LineItem[]; headers: string[] }) {
  if (!bs.length) return <p className="text-muted-foreground">No Balance Sheet data loaded.</p>;

  const assetCats = ["Non-current Assets", "Current Assets"];
  const liabCats = ["Non-current Liabilities", "Current Liabilities"];

  const totalAssets = bs.filter((i) => assetCats.includes(i.category)).reduce((s, i) => s + (i.amounts[0] || 0), 0);
  const totalEquity = catSum(bs, "Equity");
  const totalLiab = bs.filter((i) => liabCats.includes(i.category)).reduce((s, i) => s + (i.amounts[0] || 0), 0);
  const imbalance = totalAssets + totalEquity + totalLiab;

  return (
    <div className="space-y-6">
      {Math.abs(imbalance) > 1 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-4">
            <p className="text-sm text-yellow-800">
              Balance check: Assets ({totalAssets.toLocaleString()}) + Equity ({totalEquity.toLocaleString()}) + Liabilities ({totalLiab.toLocaleString()}) = {imbalance.toLocaleString()}. Expected ~0.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">IFRS 18 Balance Sheet</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b"><th className="text-left py-2">Line Item</th>
              {headers.map((h) => <th key={h} className="text-right py-2 w-28">{h}</th>)}</tr>
            </thead>
            <tbody>
              {BS_CATEGORIES.map((cat) => {
                const catItems = bs.filter((i) => i.category === cat);
                if (!catItems.length) return null;
                const catTotal = headers.map((_, pi) => catItems.reduce((s, i) => s + (i.amounts[pi] || 0), 0));
                return (
                  <Fragment key={cat}>
                    <tr className="bg-muted/50 font-semibold">
                      <td className="py-1.5">{cat}</td>
                      {headers.map((_, j) => <td key={j} className="py-1.5" />)}
                    </tr>
                    {catItems.map((item, k) => (
                      <tr key={k} className="hover:bg-muted/30">
                        <td className="py-1.5 pl-6">{item.account}</td>
                        {item.amounts.map((a, j) => (
                          <td key={j} className={`py-1.5 text-right tabular-nums ${a < 0 ? "text-red-600" : ""}`}>{a.toLocaleString()}</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="font-semibold border-t">
                      <td className="py-1.5 pl-3">Total {cat}</td>
                      {catTotal.map((t, j) => (
                        <td key={j} className={`py-1.5 text-right tabular-nums ${t < 0 ? "text-red-600" : ""}`}>{t.toLocaleString()}</td>
                      ))}
                    </tr>
                    <tr className="h-2" />
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 5: Cash Flow
// ═══════════════════════════════════════════════════════════════════════════

function CfTab({ cf, pnl, headers, entityType }: {
  cf: LineItem[]; pnl: LineItem[]; headers: string[]; entityType: EntityType;
}) {
  if (!cf.length && !pnl.length) return <p className="text-muted-foreground">No data loaded.</p>;

  const isFinancial = entityType !== "General (non-financial)";

  const changes = [
    { area: "Starting point", ias7: "Profit before tax", ifrs18: "Operating profit" },
    { area: "Interest paid", ias7: "Choice: Operating or Financing", ifrs18: isFinancial ? "Operating (main business)" : "Financing (mandatory)" },
    { area: "Dividends paid", ias7: "Choice: Operating or Financing", ifrs18: isFinancial ? "Operating (main business)" : "Financing (mandatory)" },
    { area: "Interest received", ias7: "Choice: Operating or Investing", ifrs18: isFinancial ? "Operating (main business)" : "Investing (mandatory)" },
    { area: "Dividends received", ias7: "Choice: Operating or Investing", ifrs18: isFinancial ? "Operating (main business)" : "Investing (mandatory)" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">IFRS 18 Changes to Cash Flow Statement</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Area</th><th className="text-left py-2">IAS 7 / IAS 1</th><th className="text-left py-2">IFRS 18</th></tr></thead>
            <tbody>
              {changes.map((c) => (
                <tr key={c.area} className="border-b">
                  <td className="py-2 font-medium">{c.area}</td>
                  <td className="py-2 text-muted-foreground">{c.ias7}</td>
                  <td className="py-2 font-medium">{c.ifrs18}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {cf.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Cash Flow Classification</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Account</th><th className="text-left py-2 w-36">Activity</th>
              {headers.map((h) => <th key={h} className="text-right py-2 w-28">{h}</th>)}</tr></thead>
              <tbody>
                {cf.map((item, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2">{item.account}</td>
                    <td className="py-2 text-xs">{item.category.replace("CF - ", "")}</td>
                    {item.amounts.map((a, j) => (
                      <td key={j} className={`py-2 text-right tabular-nums ${a < 0 ? "text-red-600" : ""}`}>{a.toLocaleString()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 6: Transition
// ═══════════════════════════════════════════════════════════════════════════

function TransitionTab({ pnl, cf, headers }: { pnl: LineItem[]; cf: LineItem[]; headers: string[] }) {
  if (!pnl.length) return <p className="text-muted-foreground">No P&L data loaded.</p>;

  const total = totalSum(pnl);
  const catTotals = PNL_CATEGORIES.map((cat) => ({ cat, val: catSum(pnl, cat) }));

  function downloadCsv() {
    let csv = "Account,IFRS 18 Category," + headers.join(",") + "\n";
    for (const item of pnl) {
      csv += `"${item.account}","${item.category}",${item.amounts.join(",")}\n`;
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ifrs18_transition.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">P&L Transition Reconciliation</CardTitle>
            <Button variant="outline" size="sm" onClick={downloadCsv}><Download className="w-3 h-3 mr-1" /> Export CSV</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            IFRS 18 is a presentation change only — total P&L ({total.toLocaleString()}) is unchanged.
          </p>

          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">IFRS 18 Subtotal</th><th className="text-right py-2">Amount</th></tr></thead>
            <tbody>
              <tr className="border-b font-medium bg-green-50"><td className="py-2">Operating Profit</td><td className="py-2 text-right tabular-nums">{catSum(pnl, "Operating").toLocaleString()}</td></tr>
              {catTotals.filter((c) => c.cat !== "Operating").map((c) => (
                <tr key={c.cat} className="border-b"><td className="py-2 pl-4">{c.cat}</td><td className="py-2 text-right tabular-nums">{c.val.toLocaleString()}</td></tr>
              ))}
              <tr className="font-bold bg-green-50 border-t-2"><td className="py-2">Profit / (Loss)</td><td className="py-2 text-right tabular-nums">{total.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Line-by-Line Mapping</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Account</th><th className="text-left py-2">IFRS 18 Category</th>
            {headers.map((h) => <th key={h} className="text-right py-2 w-28">{h}</th>)}</tr></thead>
            <tbody>
              {pnl.map((item, i) => (
                <tr key={i} className={`border-b ${item.category !== "Operating" ? "bg-amber-50" : ""}`}>
                  <td className="py-1.5">{item.account}</td>
                  <td className="py-1.5"><span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: (COLORS[item.category] || "#94a3b8") + "20", color: COLORS[item.category] || "#94a3b8" }}>{item.category}</span></td>
                  {item.amounts.map((a, j) => (
                    <td key={j} className={`py-1.5 text-right tabular-nums ${a < 0 ? "text-red-600" : ""}`}>{a.toLocaleString()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Transition Disclosure Note</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The entity has applied IFRS 18 'Presentation and Disclosure in Financial Statements'
            for the first time. The comparative period has been restated. The adoption has no impact
            on recognised amounts — it affects only the presentation and classification of items in
            the statement of profit or loss and the statement of cash flows. The three new mandatory
            subtotals are: Operating Profit, Profit Before Financing and Income Taxes, and Profit
            for the Period.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared components
// ═══════════════════════════════════════════════════════════════════════════

function SimpleTable({ items }: { items: LineItem[] }) {
  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b"><th className="text-left py-1.5">Account</th><th className="text-left py-1.5">Category</th><th className="text-right py-1.5">Amount</th><th className="text-right py-1.5">% of Base</th></tr></thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i} className="border-b last:border-0">
            <td className="py-1.5">{item.account}</td>
            <td className="py-1.5 text-xs">{item.category}</td>
            <td className="py-1.5 text-right tabular-nums">{item.amounts[0]?.toLocaleString()}</td>
            <td className="py-1.5 text-right tabular-nums text-muted-foreground">{/* calculated in parent */}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Fragment helper for BS tab
function Fragment({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
