import React from "react";

const Features = () => {
  return (
    <div id="features" className="features-section">
      <h2>Why Kipta?</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Track Spending</h3>
          <p>Log your expenses and income quickly and easily.</p>
        </div>
        <div className="feature-card">
          <h3>Smart Categorization</h3>
          <p>Automatically sort your transactions into categories.</p>
        </div>
        <div className="feature-card">
          <h3>Dashboard Overview</h3>
          <p>See your financial health at a glance with charts.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;