import React from "react";
import type { Investment, Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  investments: Investment[];
}

export const HistoryView: React.FC<Props> = ({
  transactions,
  investments,
}) => {
  return (
    <div className="card">
      <h2>History</h2>
      <div className="history-layout">
        <div>
          <h3 className="section-title">Transactions</h3>
          {transactions.length === 0 ? (
            <p className="muted">No transactions recorded yet.</p>
          ) : (
            <table className="table compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount (₹)</th>
                  <th>Spare (₹)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.category}</td>
                    <td>{tx.amount.toFixed(2)}</td>
                    <td>{tx.spareChange.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <h3 className="section-title">Investments</h3>
          {investments.length === 0 ? (
            <p className="muted">No investments yet.</p>
          ) : (
            <table className="table compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id}>
                    <td>{new Date(inv.date).toLocaleDateString()}</td>
                    <td>{inv.amountInvested.toFixed(2)}</td>
                    <td>{inv.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

