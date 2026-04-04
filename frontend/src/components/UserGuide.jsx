import React from "react";
import { useTranslation } from "./theme/TranslationContext";
import "./UserGuide.css";

const UserGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="user-guide-content">
      <h2 className="guide-title">{t('userGuideTitle')}</h2>
      <p className="guide-welcome">{t('userGuideWelcome')}</p>

      <div className="guide-sections">
        <section className="guide-section">
          <div className="guide-icon">💰</div>
          <div className="guide-text">
            <h3>{t('ugIncomeExpenseTitle')}</h3>
            <p>{t('ugIncomeExpenseDesc')}</p>
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-icon">📊</div>
          <div className="guide-text">
            <h3>{t('ugBudgetingTitle')}</h3>
            <p>{t('ugBudgetingDesc')}</p>
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-icon">🤝</div>
          <div className="guide-text">
            <h3>{t('ugDebtTitle')}</h3>
            <p>{t('ugDebtTitleDesc')}</p>
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-icon">🎯</div>
          <div className="guide-text">
            <h3>{t('ugSavingsTitle')}</h3>
            <p>{t('ugSavingsTitleDesc')}</p>
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-icon">📈</div>
          <div className="guide-text">
            <h3>{t('ugAnalyticsTitle')}</h3>
            <p>{t('ugAnalyticsTitleDesc')}</p>
          </div>
        </section>

        <section className="guide-section">
          <div className="guide-icon">⚙️</div>
          <div className="guide-text">
            <h3>{t('ugPersonalizationTitle')}</h3>
            <p>{t('ugPersonalizationTitleDesc')}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserGuide;