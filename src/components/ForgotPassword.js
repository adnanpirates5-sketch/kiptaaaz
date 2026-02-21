import React, { useState } from "react";

const ForgotPassword = ({ onBackToLogin }) => {
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Recovery link sent to: ${recoveryEmail}`);
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Recover Your Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Recovery Email Address"
          className="input-field"
          value={recoveryEmail}
          onChange={(e) => setRecoveryEmail(e.target.value)}
          required
        />

        <button type="submit" className="start-btn">
          Send Recovery Link
        </button>
      </form>

      <p className="switch-text">
        <span onClick={onBackToLogin}>Back to Login</span>
      </p>
    </div>
  );
};

export default ForgotPassword;