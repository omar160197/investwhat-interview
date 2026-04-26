import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "../api/client";
import type { CreateTransactionInput, TransactionType } from "../types";

const KNOWN_STOCKS: Record<string, string> = {
  AAPL: "Apple Inc.",
  TSLA: "Tesla Inc.",
  MSFT: "Microsoft Corp.",
  GOOGL: "Alphabet Inc.",
  AMZN: "Amazon.com Inc.",
  NVDA: "NVIDIA Corp.",
  META: "Meta Platforms Inc.",
  NFLX: "Netflix Inc.",
};

const TRANSACTION_TYPES: TransactionType[] = ["BUY", "SELL", "DIVIDEND", "OPENING_BALANCE"];

interface FormState {
  symbol: string;
  type: TransactionType;
  date: string;
  quantity: string;
  unitPrice: string;
  fee: string;
}

const DEFAULT_FORM: FormState = {
  symbol: "AAPL",
  type: "BUY",
  date: new Date().toISOString().split("T")[0],
  quantity: "",
  unitPrice: "",
  fee: "0",
};

export function AddTransactionForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const qty = parseFloat(form.quantity);
    const price = parseFloat(form.unitPrice);
    const fee = parseFloat(form.fee) || 0;

    if (isNaN(qty) || qty <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }
    if (isNaN(price) || price < 0) {
      setError("Unit price must be a non-negative number.");
      return;
    }

    const input: CreateTransactionInput = {
      symbol: form.symbol.toUpperCase(),
      name: KNOWN_STOCKS[form.symbol.toUpperCase()] ?? form.symbol.toUpperCase(),
      type: form.type,
      date: form.date,
      quantity: qty,
      unitPrice: price,
      fee,
    };

    setLoading(true);
    try {
      await addTransaction(input);
      setSuccess(true);
      setForm(DEFAULT_FORM);

      await queryClient.invalidateQueries({ queryKey: ["holdings"] });
    } catch (err: any) {
      const message = err?.message || "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Symbol */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Symbol</label>
          <select
            value={form.symbol}
            onChange={(e) => set("symbol", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(KNOWN_STOCKS).map((sym) => (
              <option key={sym} value={sym}>
                {sym} — {KNOWN_STOCKS[sym]}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value as TransactionType)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TRANSACTION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
          <input
            type="number"
            placeholder="e.g. 5"
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            min="0.000001"
            step="any"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Unit Price */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price ($)</label>
          <input
            type="number"
            placeholder="e.g. 170.00"
            value={form.unitPrice}
            onChange={(e) => set("unitPrice", e.target.value)}
            min="0"
            step="any"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Fee */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fee ($)</label>
          <input
            type="number"
            value={form.fee}
            onChange={(e) => set("fee", e.target.value)}
            min="0"
            step="any"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded px-4 py-3 text-sm text-red-700">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded px-4 py-3 text-sm text-green-700">
          Transaction added successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded text-sm transition-colors"
      >
        {loading ? "Saving..." : "Add Transaction"}
      </button>
    </form>
  );
}
