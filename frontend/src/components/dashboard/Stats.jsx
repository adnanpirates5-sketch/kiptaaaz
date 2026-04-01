import React from "react";
import CategorySummary from "./CategorySummary";
import IncomeCategorySummary from "./IncomeCategorySummary";
import { useTranslation } from "../theme/TranslationContext";

const Stats = ({ incomes, expenses }) => {
  const { t } = useTranslation();

  return (
    <div className="stats-section">
      <h3>{t('stats')}</h3>
      <div className="stats-charts">
        <IncomeCategorySummary incomes={incomes} />
        <CategorySummary expenses={expenses} />
      </div>
    </div>
  );
};

export default Stats;