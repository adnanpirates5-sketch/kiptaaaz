import React from "react";
import { useTranslation } from "./theme/TranslationContext";

const Landing = ({ onGetStarted }) => {
  const { t } = useTranslation();

  return (
    <div className="app-card">
      <h1 className="app-title">{t('welcome')}</h1>
      <p className="app-subtitle">
        {t('subtitle')}
      </p>
      <button className="start-btn" onClick={onGetStarted}>
        {t('getStarted')}
      </button>
    </div>
  );
};

export default Landing;