import React, { useState } from "react";
import Modal from "../Modal";
import "./Register.css";
import { useTranslation } from "../theme/TranslationContext";
import "./Auth.css";

const Register = ({ onSwitchToLogin, onBackHome, onRegisterSuccess }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!isChecked) {
      alert("You must agree to the Terms and Conditions.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onRegisterSuccess();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Registration failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-visual">
            <div className="visual-content">
              <h2>Join Kiptaaz Today!</h2>
              <p>Start your journey towards financial freedom with our comprehensive budgeting tools</p>
              <div className="visual-features">
                <div className="feature">
                  <span className="feature-icon">🎯</span>
                  <span>Set Financial Goals</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <span>Track Expenses</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">💰</span>
                  <span>Save Money</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-form-section">
            <div className="premium-card auth-card">
              <div className="auth-header">
                <h1 className="premium-title">{t('createAccount')}</h1>
                <p className="auth-subtitle">Create your account to get started</p>
              </div>

              <form className="premium-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder={t('fullName')}
                    className="premium-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

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
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="premium-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                <div className="form-group">
                  <div className="terms-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                      />
                      <span>
                        {t('agreeTerms')}{" "}
                        <button
                          type="button"
                          className="terms-link"
                          onClick={() => setIsModalOpen(true)}
                        >
                          Terms and Conditions
                        </button>
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="premium-btn auth-submit-btn"
                  disabled={!isChecked || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✨</span>
                      {t('registerBtn')}
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>{t('haveAccount')}</p>
                <button
                  className="premium-btn ghost switch-btn"
                  onClick={onSwitchToLogin}
                >
                  Sign In
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Terms and Conditions</h2>
        <p>Terms and conditions content will be displayed here...</p>
      </Modal>
    </>
  );
};

export default Register;