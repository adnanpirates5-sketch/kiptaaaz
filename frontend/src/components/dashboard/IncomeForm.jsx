import React, { useState } from "react";
import { useTranslation } from "../theme/TranslationContext";
import CategoryModal from "./CategoryModal";

const categories = [
  { name: "Salary", icon: "💰" },
  { name: "Freelance", icon: "🖋️" },
  { name: "Investment", icon: "📈" },
  { name: "Gift", icon: "🎁" },
  { name: "Bonus", icon: "🏆" },
  { name: "Interest", icon: "🏦" },
  { name: "Rental", icon: "🏠" },
  { name: "Dividend", icon: "💵" },
  { name: "Side Hustle", icon: "🛠️" },
  { name: "Refund", icon: "🔄" },
  { name: "Cashback", icon: "💳" },
  { name: "Commission", icon: "📬" },
  { name: "Allowance", icon: "🧾" },
  { name: "Lottery", icon: "🎰" },
  { name: "Other", icon: "✨" },
];

const IncomeForm = ({ onAddIncome }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category || !amount || num <= 0) return;

    if (onAddIncome) {
      onAddIncome({ category, amount: num });
    }
    setCategory("");
    setAmount("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="premium-form">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('addIncome')}</h3>

        <button 
          type="button" 
          className="premium-input" 
          style={{ textAlign: 'left', cursor: 'pointer' }}
          onClick={() => setIsModalOpen(true)}
        >
          {category || t('selectCategory')}
        </button>

        <input
          type="number"
          className="premium-input"
          placeholder={t('amount')}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          required
        />
        <button type="submit" className="premium-btn success" style={{ width: '100%', backgroundColor: 'var(--success)' }}>
          {t('addIncome')}
        </button>
      </form>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSelectCategory={setCategory}
      />
    </>
  );
};

export default IncomeForm;