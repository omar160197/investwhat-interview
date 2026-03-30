import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHoldings } from "./api/client";
import { HoldingsTable } from "./components/HoldingsTable";
import { AddTransactionForm } from "./components/AddTransactionForm";

export function App() {
  const [showForm, setShowForm] = useState(false);

  const {
    data: holdings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["holdings"],
    queryFn: fetchHoldings,
    refetchInterval: false,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">InvestWhat</h1>
          <p className="text-xs text-gray-500">Portfolio Manager</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-8 space-y-8">
        {/* Add Transaction panel */}
        {showForm && (
          <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-4">New Transaction</h2>
            <AddTransactionForm />
          </section>
        )}

        {/* Holdings */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Holdings</h2>
            <div className="flex items-center gap-3">
              {/* Refreshing indicator — should appear after every data update, not just initial load */}
              {isLoading && (
                <span className="text-xs text-blue-500 animate-pulse">Refreshing…</span>
              )}
              {!isLoading && (
                <span className="text-xs text-gray-400">
                  {holdings.length} position{holdings.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="py-12 text-center text-gray-400 text-sm">Loading holdings...</div>
          )}

          {isError && (
            <div className="py-6 text-center text-red-500 text-sm">
              Failed to load holdings: {(error as Error).message}
            </div>
          )}

          {!isLoading && !isError && <HoldingsTable holdings={holdings} />}
        </section>
      </main>
    </div>
  );
}
