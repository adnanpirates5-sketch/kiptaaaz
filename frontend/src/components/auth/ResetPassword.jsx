import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "../theme/TranslationContext";
import { authAPI } from "../../api";
import "./Auth.css";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(token, password);
      setMessage(response.data.message || t('passwordResetSuccess'));
      setLoading(false);
      setTimeout(() => {
        window.location.href = '/'; // Redirect to home/login
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || t('failedToResetPassword'));
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('resetPassword')}</h2>
          <p>{t('enterNewPassword')}</p>
        </div>

        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('newPassword')}</label>
            <input
              type="password"
              className="premium-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('confirmNewPassword')}</label>
            <input
              type="password"
              className="premium-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="premium-btn" disabled={loading}>
            {loading ? t('resetting') : t('resetPasswordBtn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
