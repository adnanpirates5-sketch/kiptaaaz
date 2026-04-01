import React, { useState } from "react";
import { useTranslation } from "../theme/TranslationContext";

const ForgotPassword = ({ onBackToLogin }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        // For testing, show the reset token
        if (data.resetToken) {
          alert('Reset token (for testing): ' + data.resetToken);
        }
      }
    } catch (err) {
      alert('Failed to send recovery link: ' + err.message);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">{t('recoverAccount')}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t('recoveryEmail')}
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="start-btn">{t('sendRecoveryLink')}</button>
      </form>

      <p className="switch-text">
        <span onClick={onBackToLogin}>Back to Login</span>
      </p>
    </div>
  );
};

export default ForgotPassword;