import React, { useState } from "react";

interface Props {
  onGenerateTransaction: () => Promise<{
    amount: number;
    rounded: number;
    spare: number;
    category: string;
    step: number;
  } | null>;
}

export const TransactionForm: React.FC<Props> = ({ onGenerateTransaction }) => {
  const [latestGenerated, setLatestGenerated] = useState<{
    amount: number;
    rounded: number;
    spare: number;
    category: string;
    step: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const generated = await onGenerateTransaction();
    if (!generated) return;
    setLatestGenerated(generated);
  };

  return (
    <div className="card">
      <h2>Auto Transaction Generator</h2>
      <p className="muted">
        No manual amount entry. Click below and the system will generate a
        daily expense and calculate spare change automatically.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <button type="submit" className="btn-primary">
          Generate expense & calculate spare
        </button>
      </form>
      {latestGenerated && (
        <div className="generated-preview">
          <p>
            Generated Amount: <strong>₹{latestGenerated.amount}</strong> (
            {latestGenerated.category})
          </p>
          <p>
            Smart round step: <strong>₹{latestGenerated.step}</strong>
          </p>
          <p>
            Rounded Amount: <strong>₹{latestGenerated.rounded}</strong>
          </p>
          <p>
            Spare Change: <strong>₹{latestGenerated.spare}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

