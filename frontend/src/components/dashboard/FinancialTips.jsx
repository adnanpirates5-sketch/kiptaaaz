import React, { useState, useEffect } from 'react';

const tips = [
  "Track every expense, no matter how small. It adds up!",
  "Aim to save at least 20% of your monthly income.",
  "Always have an emergency fund covering 3-6 months of expenses.",
  "Review your subscriptions regularly and cancel those you don't use.",
  "Pay off high-interest debts first (the Avalanche Method).",
  "Automate your savings to ensure you pay yourself first.",
  "Compare prices before making large purchases.",
  "Plan your meals ahead of time to save on groceries and dining out.",
  "Set clear financial goals to stay motivated.",
  "Investing early is more important than investing a lot."
];

const FinancialTips = () => {
  const [currentTip, setCurrentTip] = useState("");

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
  }, []);

  return (
    <div className="section-card premium-card financial-tips">
      <div className="section-header">
        <h3>💡 Financial Tip of the Day</h3>
      </div>
      <div className="tip-content" style={{ padding: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
        "{currentTip}"
      </div>
    </div>
  );
};

export default FinancialTips;