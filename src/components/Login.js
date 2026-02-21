import React, { useState } from "react";

const Login = ({ onSwitchToRegister, onBackHome, onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logged in as: ${email}`);
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Login to Kipta</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="start-btn">
          Login
        </button>
      </form>

      <p className="switch-text">
        <span onClick={onForgotPassword}>Forgot Password?</span>
      </p>

      <p className="switch-text">
        Don't have an account?{" "}
        <span onClick={onSwitchToRegister}>Register</span>
      </p>

      <p className="switch-text">
        <span onClick={onBackHome}>Back to Home</span>
      </p>
    </div>
  );
};

export default Login;