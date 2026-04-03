import React from "react";
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
    const navigate = useNavigate();

    return (
        <div className="terms-container" style={{ padding: '40px', maxWidth: '800px', margin: '100px auto', background: 'var(--card-bg)', borderRadius: '15px', boxShadow: 'var(--shadow-lg)' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ marginBottom: '20px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
                ← Back
            </button>
            <h2>Terms and Conditions</h2>
            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                These terms and conditions govern your use of this website and services.
                Please read them carefully before proceeding. By using our website, you agree
                to these terms.
            </p>
            {/* Add the full Terms and Conditions content here */}
        </div>
    );
};

export default TermsConditions;