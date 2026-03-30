import type { Holding, CreateTransactionInput } from "../types";

const BASE = "/api";

export async function fetchHoldings(): Promise<Holding[]> {
  const res = await fetch(`${BASE}/holdings`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to fetch holdings");
  }
  return res.json();
}

export async function addTransaction(
  input: CreateTransactionInput
): Promise<void> {
  const res = await fetch(`${BASE}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to add transaction");
  }
}
