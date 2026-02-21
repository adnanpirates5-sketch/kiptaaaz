import React, { useState } from "react";

const Register = ({ onSwitchToLogin, onBackHome }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(Account created for: ${ name });
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

                <button type="submit" className="start-btn">
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
        </div>
    );
};

export default Register;