import React from "react";

interface Props {
  summary: {
    totalSaved: number;
    totalInvested: number;
    estimatedValue: number;
    sixMonthProjection: number;
    oneYearProjection: number;
    dailySaving: number;
  };
  walletBalance: number;
  bankBalance: number;
}

export const Dashboard: React.FC<Props> = ({
  summary,
  walletBalance,
  bankBalance,
}) => {
  return (
    <div className="grid-three">
      <div className="card">
        <h2>Total Saved from Spare Change</h2>
        <p className="metric">₹{summary.totalSaved.toFixed(2)}</p>
        <p className="muted">
          Avg daily saving: ₹{summary.dailySaving.toFixed(2)}
        </p>
      </div>
      <div className="card">
        <h2>Invested via Auto-Invest</h2>
        <p className="metric">₹{summary.totalInvested.toFixed(2)}</p>
        <p className="muted">
          Current wallet: ₹{walletBalance.toFixed(2)} (instant auto-invest mode)
        </p>
      </div>
      <div className="card">
        <h2>Projected Growth</h2>
        <p className="muted">
          Bank balance: <strong>₹{bankBalance.toFixed(2)}</strong>
        </p>
        <p className="muted">
          6 months: <strong>₹{summary.sixMonthProjection.toFixed(2)}</strong>
        </p>
        <p className="muted">
          1 year: <strong>₹{summary.oneYearProjection.toFixed(2)}</strong>
        </p>
        <p className="muted">
          Portfolio estimated (1 year):{" "}
          <strong>₹{summary.estimatedValue.toFixed(2)}</strong>
        </p>
      </div>
    </div>
  );
};

