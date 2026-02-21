import React, { useState } from "react";
import Modal from "./Modal";
import "./Register.css";

const Register = ({ onSwitchToLogin, onBackHome, onRegisterSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isChecked) {
      alert("You must agree to the Terms and Conditions.");
      return;
    }
    alert("Account created successfully");
    onRegisterSuccess();
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
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
            I agree to the{" "}
            <span className="terms-link" onClick={() => setIsModalOpen(true)}>
              Terms and Conditions
            </span>
          </label>
        </div>

        <button type="submit" className="start-btn" disabled={!isChecked}>
          Register
        </button>
      </form>

      <p className="switch-text">
        Already have an account?{" "}
        <span onClick={onSwitchToLogin}>Login</span>
      </p>

      <p className="switch-text">
        <span onClick={onBackHome}>Back to Home</span>
      </p>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Terms and Conditions</h2>
        <p>Use responsibly. Demo frontend only.</p>
      </Modal>
    </div>
  );
};

export default Register;