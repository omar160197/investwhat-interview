import type { Holding, CreateTransactionInput } from "../types";

const BASE = "/api";

export async function fetchHoldings(): Promise<Holding[]> {
  try {
    const res = await fetch(`${BASE}/holdings`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Unable to load holdings. Please check your connection and try again.");
    }
    return res.json();
  } catch (err: any) {
    if (err instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }
    throw err;
  }
}

export async function addTransaction(
  input: CreateTransactionInput
): Promise<void> {
  try {
    const res = await fetch(`${BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Unable to add transaction. Please verify your input and try again.");
    }
  } catch (err: any) {
    if (err instanceof TypeError) {
      throw new Error("Network error. Please check your connection and try again.");
    }
    throw err;
  }
}
