import type { Investment, InvestmentGoal, Transaction, User } from "./types";

const API_BASE = "http://localhost:4000/api";

export interface AppStateDto {
  transactions: Transaction[];
  investments: Investment[];
  goals: InvestmentGoal[];
  notifications: string[];
  walletBalance: number;
  bankBalance: number;
  summary: {
    totalSaved: number;
    totalInvested: number;
    estimatedValue: number;
    sixMonthProjection: number;
    oneYearProjection: number;
    dailySaving: number;
  };
}

export async function loginUser(payload: {
  name: string;
  phone: string;
  aadhaar: string;
  pan: string;
  riskProfile: "conservative" | "moderate" | "aggressive";
}): Promise<{ user: User; state: AppStateDto }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function generateTransaction(userId: string): Promise<{
  smartRoundStep: number;
  state: AppStateDto;
}> {
  const res = await fetch(`${API_BASE}/transactions/auto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Transaction failed");
  }
  return res.json();
}

export async function createGoal(payload: {
  userId: string;
  name: string;
  targetAmount: number;
}): Promise<{ state: AppStateDto }> {
  const res = await fetch(`${API_BASE}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Goal creation failed");
  return res.json();
}

