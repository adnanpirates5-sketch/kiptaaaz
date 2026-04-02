import React, { useState } from "react";
import "./Auth.css";
import { authAPI } from "../../api";

const Login = ({ onSwitchToRegister, onBackHome, onForgotPassword, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Please enter your details to sign in</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="premium-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="premium-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="forgot-password" onClick={onForgotPassword}>
              Forgot password?
            </span>
          </div>
          
          <button type="submit" className="premium-btn">
            Sign in
          </button>
          <button type="button" className="premium-btn secondary" onClick={onBackHome}>
            Back to Home
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <button className="auth-link" onClick={onSwitchToRegister}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;