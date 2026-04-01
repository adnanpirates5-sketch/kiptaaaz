import React, { useState } from "react";
import Modal from "../Modal";
import "./Register.css";
import { useTranslation } from "../theme/TranslationContext";

const Register = ({ onSwitchToLogin, onBackHome, onRegisterSuccess }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      alert("You must agree to the Terms and Conditions.");
      return;
    }

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
        alert(data.message);
        onRegisterSuccess();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">{t('createAccount')}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('fullName')}
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <div className="terms-checkbox">
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            {t('agreeTerms')}{" "}
            <span className="terms-link" onClick={() => setIsModalOpen(true)}>
              Terms and Conditions
            </span>
          </label>
        </div>

        <button type="submit" className="start-btn" disabled={!isChecked}>
          {t('registerBtn')}
        </button>
      </form>

      <p className="switch-text">
        {t('haveAccount')}
      </p>

      <p className="switch-text">
        <span onClick={onBackHome}>{t('backToHome')}</span>
      </p>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Terms and Conditions</h2>
        <p>Use responsibly. Demo frontend only.</p>
      </Modal>
    </div>
  );
};

export default Register;