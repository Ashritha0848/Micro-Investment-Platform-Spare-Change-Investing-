import React from "react";
import type { Investment } from "../types";

interface Props {
  investments: Investment[];
}

export const InvestmentsView: React.FC<Props> = ({ investments }) => {
  return (
    <div className="card">
      <h2>Investments</h2>
      {investments.length === 0 ? (
        <p className="muted">
          No investments yet. Generate a transaction to auto-invest your spare
          change immediately.
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Risk</th>
              <th>Expected p.a. Return</th>
              <th>Allocation (FD/MF/Gold/Stocks)</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id}>
                <td>{new Date(inv.date).toLocaleDateString()}</td>
                <td>{inv.amountInvested.toFixed(2)}</td>
                <td>{inv.riskLevel}</td>
                <td>{(inv.expectedReturnRate * 100).toFixed(1)}%</td>
                <td className="allocation">
                  {inv.allocation.fdPct}% / {inv.allocation.mutualFundsPct}% /{" "}
                  {inv.allocation.goldPct}% / {inv.allocation.stocksPct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

