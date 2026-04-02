import React, { useState } from "react";
import "./Auth.css";

const Register = ({ onSwitchToLogin, onBackHome, onRegisterSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate registration
    const userData = { name, email };
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify(userData));
    onRegisterSuccess();
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join Kiptaaz to start managing your finances</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="premium-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          </div>
          
          <button type="submit" className="premium-btn">
            Sign up
          </button>
          <button type="button" className="premium-btn secondary" onClick={onBackHome}>
            Back to Home
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <button className="auth-link" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;