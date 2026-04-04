import React from "react";
import { useTranslation } from './theme/TranslationContext';

const Features = () => {
  const { t } = useTranslation();
  return (
    <div id="features" className="features-section">
      <h2>{t('whyKipta')}</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>{t('trackSpending')}</h3>
          <p>{t('trackSpendingDesc')}</p>
        </div>
        <div className="feature-card">
          <h3>{t('smartCategorization')}</h3>
          <p>{t('smartCategorizationDesc')}</p>
        </div>
        <div className="feature-card">
          <h3>{t('dashboardOverview')}</h3>
          <p>{t('dashboardOverviewDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default Features;