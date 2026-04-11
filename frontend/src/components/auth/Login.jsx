import React, { useState } from "react";
import "./Auth.css";
import { authAPI } from "../../api";
import { useTranslation } from "../theme/TranslationContext";

const Login = ({ onSwitchToRegister, onBackHome, onForgotPassword, onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await authAPI.login({ email, password });
      
      // Check if 2FA is required
      if (res.data.requires2FA) {
        setError("Two-Factor Authentication is enabled. Please check your email for the verification code.");
        return;
      }
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Show success message about email
      setSuccess('✓ Login successful! A confirmation email has been sent to your inbox.');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        onLoginSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('loginFailed'));
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('welcomeBack')}</h2>
          <p>{t('enterDetails')}</p>
        </div>
        
        {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center', fontWeight: '600', padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--radius-md)' }}>{success}</div>}
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="premium-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? t('hidePassword') : t('showPassword')}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            <span className="forgot-password" onClick={onForgotPassword}>
              {t('forgotPassword')}
            </span>
          </div>
          
          <button type="submit" className="premium-btn">
            {t('loginBtn')}
          </button>
          <button type="button" className="premium-btn secondary" onClick={onBackHome}>
            {t('backToHome')}
          </button>
        </form>

        <div className="auth-footer">
          {t('noAccountPrompt')}{" "}
          <button className="auth-link" onClick={onSwitchToRegister}>
            {t('register')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;