import React from "react";
import { useTranslation } from "./theme/TranslationContext";
import "./UserGuide.css";

const UserGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="user-guide-modal-content">
      <h2 className="guide-title">{t('userGuideTitle')}</h2>
      <p className="guide-welcome">{t('userGuideWelcome')}</p>

      <div className="guide-grid">
        <section className="guide-card">
          <div className="guide-icon-wrapper">💰</div>
          <div className="guide-info">
            <h3>{t('ugIncomeExpenseTitle')}</h3>
            <p>{t('ugIncomeExpenseDesc')}</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">📊</div>
          <div className="guide-info">
            <h3>{t('ugBudgetingTitle')}</h3>
            <p>{t('ugBudgetingDesc')}</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">🤝</div>
          <div className="guide-info">
            <h3>{t('ugDebtTitle')}</h3>
            <p>{t('ugDebtTitleDesc')}</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">🎯</div>
          <div className="guide-info">
            <h3>{t('ugSavingsTitle')}</h3>
            <p>{t('ugSavingsTitleDesc')}</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">📈</div>
          <div className="guide-info">
            <h3>{t('ugAnalyticsTitle')}</h3>
            <p>{t('ugAnalyticsTitleDesc')}</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">⚙️</div>
          <div className="guide-info">
            <h3>{t('ugPersonalizationTitle')}</h3>
            <p>{t('ugPersonalizationTitleDesc')}</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">📥</div>
          <div className="guide-info">
            <h3>Export to CSV</h3>
            <p>Download your budget and debt data as CSV files for easy analysis and backup. Click the export button to save your financial records.</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">📧</div>
          <div className="guide-info">
            <h3>Email Notifications</h3>
            <p>Receive welcome emails on registration and login notifications for account security. Stay informed about your account activity.</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">😊</div>
          <div className="guide-info">
            <h3>Smart Emoji Indicators</h3>
            <p>Savings goals display relevant emojis based on their names. Type goal names and watch personalized emojis appear automatically!</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">🎨</div>
          <div className="guide-info">
            <h3>Premium UI Design</h3>
            <p>Enjoy a modern, Instagram-style interface with gradient backgrounds, smooth animations, and professional styling throughout the app.</p>
          </div>
        </section>

        <section className="guide-card">
          <div className="guide-icon-wrapper">🔒</div>
          <div className="guide-info">
            <h3>Secure Password Input</h3>
            <p>Toggle password visibility during login and registration. Your password input remains secure with easy-to-use visibility controls.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserGuide;