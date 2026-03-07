import React from "react";

const Landing = ({ onGetStarted }) => {
  return (
    <div className="app-card">
      <h1 className="app-title">Welcome to Kipta</h1>
      <p className="app-subtitle">
        Track your expenses. Understand your spending.
      </p>
      <button className="start-btn" onClick={onGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default Landing;