import React, { useState } from "react";
import type { InvestmentGoal } from "../types";

interface Props {
  goals: InvestmentGoal[];
  onCreateGoal: (name: string, targetAmount: number) => void;
}

export const GoalsView: React.FC<Props> = ({ goals, onCreateGoal }) => {
  const [name, setName] = useState("Goa trip");
  const [target, setTarget] = useState("10000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(target);
    if (!name.trim() || isNaN(value) || value <= 0) return;
    onCreateGoal(name, value);
  };

  return (
    <div className="card sticky">
      <h2>Goals</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Goal name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Target amount (₹)
          <input
            type="number"
            min="0"
            step="100"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </label>
        <button type="submit" className="btn-secondary">
          Add goal
        </button>
      </form>
      <ul className="goals-list">
        {goals.length === 0 && (
          <li className="muted">No goals yet. Create your first goal.</li>
        )}
        {goals.map((g) => {
          const progress =
            g.targetAmount === 0
              ? 0
              : Math.min(100, (g.allocatedAmount / g.targetAmount) * 100);
          return (
            <li key={g.id} className="goal-item">
              <div className="goal-header">
                <span>{g.name}</span>
                <span className="muted">
                  ₹{g.allocatedAmount.toFixed(0)} / ₹{g.targetAmount.toFixed(0)}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

