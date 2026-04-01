import React, { useState } from "react";
import { useTranslation } from "../theme/TranslationContext";

const Login = ({
  onSwitchToRegister,
  onBackHome,
  onForgotPassword,
  onLoginSuccess
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert(data.message);
        onLoginSuccess();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
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
          {t('loginBtn')}
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