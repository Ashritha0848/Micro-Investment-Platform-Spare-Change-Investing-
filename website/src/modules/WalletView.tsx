import React from "react";

interface Props {
  balance: number;
  notifications: string[];
}

export const WalletView: React.FC<Props> = ({ balance, notifications }) => {
  return (
    <div className="card">
      <h2>Spare Change Wallet</h2>
      <p className="wallet-balance">₹{balance.toFixed(2)}</p>
      <p className="muted">
        Spare change is auto-invested immediately after each transaction.
      </p>
      <h3 className="section-title">Recent events</h3>
      <ul className="notifications">
        {notifications.length === 0 && (
          <li className="muted">No recent activity yet.</li>
        )}
        {notifications.map((n, idx) => (
          <li key={idx}>{n}</li>
        ))}
      </ul>
    </div>
  );
};

