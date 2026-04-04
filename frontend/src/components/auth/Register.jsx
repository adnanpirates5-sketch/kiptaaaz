import React, { useState } from "react";
import "./Auth.css";
import { authAPI } from "../../api";
import { useTranslation } from "../theme/TranslationContext";

const Register = ({ onSwitchToLogin, onBackHome, onRegisterSuccess }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authAPI.register({ name, email, password });
      // Backend now returns token and user for auto-login
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onRegisterSuccess();
    } catch (err) {
      setError(err.response?.data?.message || t('registrationFailed'));
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('createAccountTitle')}</h2>
          <p>{t('joinKipta')}</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('fullName')}</label>
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
            <label>{t('emailAddress')}</label>
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
            <label>{t('password')}</label>
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
            {t('registerBtn')}
          </button>
          <button type="button" className="premium-btn secondary" onClick={onBackHome}>
            {t('backToHome')}
          </button>
        </form>

        <div className="auth-footer">
          {t('haveAccountPrompt')}{" "}
          <button className="auth-link" onClick={onSwitchToLogin}>
            {t('login')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;