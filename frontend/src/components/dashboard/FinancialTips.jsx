import React, { useState, useEffect } from 'react';
import { useTranslation } from '../theme/TranslationContext';

const FinancialTips = () => {
  const { t, language } = useTranslation();
  const [currentTip, setCurrentTip] = useState("");

  useEffect(() => {
    const tips = t('tips');
    if (Array.isArray(tips)) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setCurrentTip(randomTip);
    } else {
      setCurrentTip(tips);
    }
  }, [t, language]);

  return (
    <div className="section-card premium-card financial-tips">
      <div className="section-header">
        <h3>💡 {t('financialTip')}</h3>
      </div>
      <div className="tip-content" style={{ padding: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
        "{currentTip}"
      </div>
    </div>
  );
};

export default FinancialTips;