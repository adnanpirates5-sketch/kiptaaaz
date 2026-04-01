import React, { useState } from "react";
import { useTranslation } from "../contexts/TranslationContext";

const Login = ({
  onSwitchToRegister,
  onBackHome,
  onForgotPassword,
  onLoginSuccess
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login successful");
    onLoginSuccess();
  };

  return (
    <div className="form-card">
      <h2 className="form-title">{t('loginToKipta')}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t('email')}
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t('password')}
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="start-btn">
          {t('login')}
        </button>
      </form>

      <p className="switch-text">
        <span onClick={onForgotPassword}>{t('forgotPassword')}</span>
      </p>

      <p className="switch-text">
        {t('noAccount')}
      </p>

      <p className="switch-text">
        <span onClick={onBackHome}>{t('backToHome')}</span>
      </p>
    </div>
  );
};

export default Login;