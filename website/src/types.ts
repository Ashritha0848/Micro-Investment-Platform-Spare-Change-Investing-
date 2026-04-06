export type RiskProfile = "conservative" | "moderate" | "aggressive";

export interface User {
  id: string;
  name: string;
  phone: string;
  aadhaarMasked: string;
  panMasked: string;
  riskProfile: RiskProfile;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  roundedAmount: number;
  spareChange: number;
  category: string;
  date: string;
}

export interface Investment {
  id: string;
  userId: string;
  amountInvested: number;
  date: string;
  expectedReturnRate: number;
  currentValue: number;
  riskLevel: RiskProfile;
  allocation: {
    fdPct: number;
    mutualFundsPct: number;
    goldPct: number;
    stocksPct: number;
  };
  goalId?: string | null;
}

export interface InvestmentGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  targetDate: string | null;
  allocatedAmount: number;
}

