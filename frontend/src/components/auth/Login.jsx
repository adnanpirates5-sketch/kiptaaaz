import React, { useState } from "react";
import "./Auth.css";

const Login = ({ onSwitchToRegister, onBackHome, onForgotPassword, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    // Try to get existing name from localStorage if they registered before
    const existingUser = JSON.parse(localStorage.getItem('user'));
    const name = (existingUser && existingUser.email === email) ? existingUser.name : email.split('@')[0];
    
    const userData = { name, email };
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify(userData));
    onLoginSuccess();
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Please enter your details to sign in</p>
        </div>
        
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