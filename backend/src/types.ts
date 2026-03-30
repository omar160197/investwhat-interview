export type TransactionType =
  | "BUY"
  | "SELL"
  | "DIVIDEND"
  | "SPLIT"
  | "OPENING_BALANCE";

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: TransactionType;
  date: string;
  quantity: number;
  unitPrice: number;
  fee: number;
  totalAmount: number;
  createdAt: string;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  totalCost: number;
  currentPrice: number;
  currentValue: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPct: number;
}

export interface FIFOLot {
  txnId: string;
  date: string;
  quantity: number;
  price: number;
  remaining: number;
}

export interface HoldingComputed {
  symbol: string;
  totalQuantity: number;
  averageCost: number;
  totalCost: number;
  realizedGainLoss: number;
  lots: FIFOLot[];
}

export interface CreateTransactionInput {
  symbol: string;
  name: string;
  type: TransactionType;
  date: string;
  quantity: number;
  unitPrice: number;
  fee?: number;
}
