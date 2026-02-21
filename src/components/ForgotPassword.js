import React, { useState } from "react";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Recovery link sent to " + email);
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Recover Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Recovery Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="start-btn">Send Recovery Link</button>
      </form>

      <p className="switch-text">
        <span onClick={onBackToLogin}>Back to Login</span>
      </p>
    </div>
  );
};

export default ForgotPassword;