import React, { useState } from "react";
import { useTranslation } from "../theme/TranslationContext";
import CategoryModal from "./CategoryModal";
import { useCurrency } from "../theme/useCurrency";

const categories = [
  { name: "Salary", icon: "💰", key: "salary" },
  { name: "Freelance", icon: "🖋️", key: "freelance" },
  { name: "Investment", icon: "📈", key: "investment" },
  { name: "Gift", icon: "🎁", key: "gift" },
  { name: "Bonus", icon: "🏆", key: "bonus" },
  { name: "Interest", icon: "🏦", key: "interest" },
  { name: "Rental", icon: "🏠", key: "rental" },
  { name: "Dividend", icon: "💵", key: "dividend" },
  { name: "Side Hustle", icon: "🛠️", key: "sideHustle" },
  { name: "Refund", icon: "🔄", key: "refund" },
  { name: "Cashback", icon: "💳", key: "cashback" },
  { name: "Commission", icon: "📬", key: "commission" },
  { name: "Allowance", icon: "🧾", key: "allowance" },
  { name: "Lottery", icon: "🎰", key: "lottery" },
  { name: "Other", icon: "✨", key: "other" },
];

const IncomeForm = ({ onAddIncome }) => {
  const { t } = useTranslation();
  const { currency, convertToBase } = useCurrency();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category || !amount || num <= 0) return;

    if (onAddIncome) {
      onAddIncome({ category, amount: convertToBase(num) });
    }
    setCategory("");
    setAmount("");
  };

  const getCategoryTranslation = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? t(cat.key) : catName;
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
          {category ? getCategoryTranslation(category) : t('selectCategory')}
        </button>

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{currency}</span>
          <input
            type="number"
            className="premium-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder={t('amount')}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
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