import { useState, useMemo, useCallback } from "react";
import type { Holding } from "../types";

type SortField = keyof Pick<
  Holding,
  | "symbol"
  | "name"
  | "quantity"
  | "averageCost"
  | "currentPrice"
  | "currentValue"
  | "unrealizedGainLoss"
  | "unrealizedGainLossPct"
>;

type SortDir = "asc" | "desc";

function fmt2(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "--";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "--";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function pnlClass(n: number | null | undefined): string {
  if (n == null || isNaN(n) || n === 0) return "text-gray-700";
  return n > 0 ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold";
}

const COLUMNS: { key: SortField; label: string; right?: boolean }[] = [
  { key: "symbol", label: "Symbol" },
  { key: "name", label: "Name" },
  { key: "quantity", label: "Qty", right: true },
  { key: "averageCost", label: "Avg Cost", right: true },
  { key: "currentPrice", label: "Price", right: true },
  { key: "currentValue", label: "Value", right: true },
  { key: "unrealizedGainLoss", label: "P/L $", right: true },
  { key: "unrealizedGainLossPct", label: "P/L %", right: true },
];

interface Props {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: Props) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("symbol");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return holdings;
    return holdings.filter(
      (h) =>
        h.symbol.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q)
    );
  }, [holdings, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = Number(av);
      const bn = Number(bv);
      return sortDir === "asc" ? an - bn : bn - an;
    });
  }, [filtered, sortField, sortDir]);

  const totals = useMemo(() => {
    const totalCost = holdings.reduce((s, h) => s + h.totalCost, 0);
    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const totalPnl = totalValue - totalCost;
    const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
    return { totalCost, totalValue, totalPnl, totalPnlPct };
  }, [holdings]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
    },
    [sortField]
  );

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search holdings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:text-gray-800 ${
                    col.right ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                  {sortField === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : " ⇅"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-gray-400">
                  {search ? "No holdings match your search." : "No holdings yet."}
                </td>
              </tr>
            ) : (
              sorted.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 font-mono font-bold text-blue-700">{h.symbol}</td>
                  <td className="px-4 py-2 text-gray-700 max-w-[160px] truncate">{h.name}</td>
                  <td className="px-4 py-2 text-right font-mono">{h.quantity.toLocaleString("en-US")}</td>
                  <td className="px-4 py-2 text-right font-mono">${fmt2(h.averageCost)}</td>
                  <td className="px-4 py-2 text-right font-mono">${fmt2(h.currentPrice)}</td>
                  <td className="px-4 py-2 text-right font-mono">${fmt2(h.currentValue)}</td>
                  <td className={`px-4 py-2 text-right font-mono ${pnlClass(h.unrealizedGainLoss)}`}>
                    {h.unrealizedGainLoss >= 0 ? "+" : ""}${fmt2(Math.abs(h.unrealizedGainLoss))}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${pnlClass(h.unrealizedGainLossPct)}`}>
                    {fmtPct(h.unrealizedGainLossPct)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot className="border-t-2 border-gray-300 bg-gray-50">
              <tr className="font-semibold">
                <td className="px-4 py-2 text-xs text-gray-500" colSpan={3}>
                  {holdings.length} position{holdings.length !== 1 ? "s" : ""}
                </td>
                <td className="px-4 py-2 text-right font-mono text-xs">${fmt2(totals.totalCost)}</td>
                <td />
                <td className="px-4 py-2 text-right font-mono text-xs">${fmt2(totals.totalValue)}</td>
                <td className={`px-4 py-2 text-right font-mono text-xs ${pnlClass(totals.totalPnl)}`}>
                  {totals.totalPnl >= 0 ? "+" : ""}${fmt2(Math.abs(totals.totalPnl))}
                </td>
                <td className={`px-4 py-2 text-right font-mono text-xs ${pnlClass(totals.totalPnlPct)}`}>
                  {fmtPct(totals.totalPnlPct)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
