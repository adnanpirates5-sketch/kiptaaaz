import React, { useState } from "react";
import Modal from "./Modal";  // Import the Modal component
import "./Register.css";  // Ensure that CSS is still linked

const Register = ({ onSwitchToLogin, onBackHome }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for managing the modal visibility

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isChecked) {
            alert("You must agree to the Terms and Conditions.");
            return;
        }
        alert(`Account created for: ${name}`);
    };

    const openModal = () => {
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
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

                {/* Terms and Conditions Checkbox */}
                <div className="terms-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                        />
                        I agree to the{" "}
                        <span
                            className="terms-link"
                            onClick={openModal}  // Open the modal when clicked
                        >
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

            {/* Modal for Terms and Conditions */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Terms and Conditions</h2>
                <p>
                    By using this website, you agree to use the Service solely for personal financial management and expense tracking. We are not responsible for any financial decisions made based on the information provided on this platform.
                </p>
                <p>
                    Your data will be stored securely, but we are not liable for any data loss or breaches. We reserve the right to modify these Terms at any time.
                </p>
                <p>
                    Please read these Terms carefully and contact us if you have any questions.
                </p>
            </Modal>
        </div>
    );
};

export default Register;