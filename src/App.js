import React from "react";
import "./App.css";

function App() {
  const scrollToFeatures = () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-wrapper">
      {/* Landing Section */}
      <div className="app-card">
        <h1 className="app-title">Welcome to Kipta</h1>
        <p className="app-subtitle">
          Track your expenses. Understand your spending.
        </p>
        <button className="start-btn" onClick={scrollToFeatures}>
          Get Started
        </button>
      </div>

      {/* Features Section */}
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
    </div>
  );
}

export default App;