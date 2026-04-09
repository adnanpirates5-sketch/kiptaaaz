import React, { useState } from "react";
import { useTranslation } from "../theme/TranslationContext";
import { authAPI } from "../../api";
import "./Auth.css";

const ForgotPassword = ({ onBackToLogin }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.data.message || t('recoveryEmailSent'));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || t('failedToSendRecoveryLink'));
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('recoverAccount')}</h2>
          <p>{t('enterEmailForReset')}</p>
        </div>

        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
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

          <button type="submit" className="premium-btn" disabled={loading}>
            {loading ? t('sending') : t('sendRecoveryLink')}
          </button>
        </form>

        <div className="auth-footer">
          <button className="auth-link" onClick={onBackToLogin}>
            {t('backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;