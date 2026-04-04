import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./theme/TranslationContext";

const TermsConditions = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="terms-container" style={{ padding: '40px', maxWidth: '800px', margin: '100px auto', background: 'var(--card-bg)', borderRadius: '15px', boxShadow: 'var(--shadow-lg)' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ marginBottom: '20px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
                ← {t('backToHome')}
            </button>
            <h2>{t('termsConditions')}</h2>
            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {t('termsDesc')}
            </p>
            {/* Add the full Terms and Conditions content here */}
        </div>
    );
};

export default TermsConditions;