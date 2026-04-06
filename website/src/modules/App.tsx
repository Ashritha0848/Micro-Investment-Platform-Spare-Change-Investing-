import React, { useMemo, useState } from "react";
import { Dashboard } from "./Dashboard";
import { TransactionForm } from "./TransactionForm";
import { WalletView } from "./WalletView";
import { InvestmentsView } from "./InvestmentsView";
import { GoalsView } from "./GoalsView";
import { HistoryView } from "./HistoryView";
import { FakeAuth } from "./FakeAuth";
import { createGoal, generateTransaction, loginUser } from "../api";
import type {
  Investment,
  InvestmentGoal,
  Transaction,
  User,
} from "../types";

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [bankBalance, setBankBalance] = useState(50000);
  const [lifetimeSaved, setLifetimeSaved] = useState(0);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [goals, setGoals] = useState<InvestmentGoal[]>([]);
  const [riskProfile, setRiskProfile] = useState<User["riskProfile"]>("moderate");
  const [notifications, setNotifications] = useState<string[]>([]);

  const applyServerState = (state: {
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
  }) => {
    setTransactions(state.transactions);
    setInvestments(state.investments);
    setGoals(state.goals);
    setNotifications(state.notifications);
    setWalletBalance(state.walletBalance);
    setBankBalance(state.bankBalance);
    setLifetimeSaved(state.summary.totalSaved);
  };

  const handleLogin = async (payload: {
    name: string;
    phone: string;
    aadhaar: string;
    pan: string;
    riskProfile: User["riskProfile"];
  }) => {
    const { user: loggedInUser, state } = await loginUser(payload);
    setUser(loggedInUser);
    setRiskProfile(loggedInUser.riskProfile);
    applyServerState(state);
  };

  const handleGenerateTransaction = async () => {
    if (!user) return null;
    try {
      const result = await generateTransaction(user.id);
      applyServerState(result.state);
      const tx = result.state.transactions[0];
      if (!tx) return null;
      return {
        amount: tx.amount,
        rounded: tx.roundedAmount,
        spare: tx.spareChange,
        category: tx.category,
        step: result.smartRoundStep,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate transaction";
      setNotifications((prev) => [message, ...prev].slice(0, 5));
      return null;
    }
  };

  const handleCreateGoal = async (name: string, targetAmount: number) => {
    if (!user) return;
    const { state } = await createGoal({ userId: user.id, name, targetAmount });
    applyServerState(state);
  };

  const summary = useMemo(() => {
    const totalInvested = investments.reduce(
      (sum, inv) => sum + inv.amountInvested,
      0
    );
    const estimatedValue = investments.reduce((sum, inv) => {
      const years = 1; // simple 1-year projection
      const projected =
        inv.amountInvested * (1 + inv.expectedReturnRate * years);
      return sum + projected;
    }, 0);

    const dailySaving =
      transactions.length > 0
        ? lifetimeSaved /
          new Set(transactions.map((t) => t.date.slice(0, 10))).size
        : 0;

    const sixMonthProjection = dailySaving * 30 * 6;
    const oneYearProjection = dailySaving * 365;

    return {
      totalSaved: lifetimeSaved,
      totalInvested,
      estimatedValue,
      sixMonthProjection,
      oneYearProjection,
      dailySaving,
    };
  }, [investments, lifetimeSaved, transactions]);

  if (!user) {
    return <FakeAuth onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>SpareChange Micro-Invest</h1>
          <p className="subtitle">
            Turn your daily spends into effortless investments.
          </p>
        </div>
        <div className="user-chip">
          <span>{user.name}</span>
          <span className="risk-pill">{riskProfile.toUpperCase()} RISK</span>
        </div>
      </header>

      <main className="layout">
        <section className="layout-main">
          <Dashboard
            summary={summary}
            walletBalance={walletBalance}
            bankBalance={bankBalance}
          />
          <div className="grid-two">
            <TransactionForm onGenerateTransaction={handleGenerateTransaction} />
            <WalletView balance={walletBalance} notifications={notifications} />
          </div>
          <InvestmentsView investments={investments} />
          <HistoryView transactions={transactions} investments={investments} />
        </section>
        <aside className="layout-side">
          <GoalsView goals={goals} onCreateGoal={handleCreateGoal} />
        </aside>
      </main>
    </div>
  );
};

