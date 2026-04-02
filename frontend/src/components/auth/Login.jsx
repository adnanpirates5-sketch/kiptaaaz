import React, { useState } from "react";
import { useTranslation } from "../theme/TranslationContext";
import "./Auth.css";

const Login = ({
  onSwitchToRegister,
  onBackHome,
  onForgotPassword,
  onLoginSuccess
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-content">
            <h2>Welcome Back!</h2>
            <p>Sign in to continue your financial journey with Kiptaaz</p>
            <div className="visual-features">
              <div className="feature">
                <span className="feature-icon">🔐</span>
                <span>Secure Login</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Access Dashboard</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Track Goals</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="premium-card auth-card">
            <div className="auth-header">
              <h1 className="premium-title">{t('loginToKipta')}</h1>
              <p className="auth-subtitle">Enter your credentials to access your account</p>
            </div>

            <form className="premium-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder={t('email')}
                  className="premium-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder={t('password')}
                  className="premium-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="premium-btn auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🔐</span>
                    {t('loginBtn')}
                  </>
                )}
              </button>
            </form>

            <div className="auth-links">
              <button
                className="link-btn"
                onClick={onForgotPassword}
              >
                {t('forgotPassword')}
              </button>
            </div>

            <div className="auth-footer">
              <p>{t('noAccount')}</p>
              <button
                className="premium-btn ghost switch-btn"
                onClick={onSwitchToRegister}
              >
                Create Account
              </button>
            </div>

            <button
              className="back-home-btn"
              onClick={onBackHome}
            >
              <span className="btn-icon">🏠</span>
              {t('backToHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;