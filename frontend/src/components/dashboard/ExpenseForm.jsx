import React, { useState } from "react";
import { useTranslation } from "../theme/TranslationContext";
import CategoryModal from "./CategoryModal";

const categories = [
  { name: "Food", icon: "🍔" },
  { name: "Transport", icon: "🚗" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Bills", icon: "💡" },
  { name: "Health", icon: "💊" },
  { name: "Education", icon: "📚" },
  { name: "Travel", icon: "✈️" },
  { name: "Subscriptions", icon: "📺" },
  { name: "Gifts", icon: "🎁" },
  { name: "Charity", icon: "🙏" },
  { name: "Pet", icon: "🐶" },
  { name: "Maintenance", icon: "🛠️" },
  { name: "Fuel", icon: "⛽" },
  { name: "Other", icon: "✨" },
];

const ExpenseForm = ({ onAddExpense }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!category || !amount || num <= 0) return;

    if (onAddExpense) {
      onAddExpense({ category, amount: num });
    }
    setCategory("");
    setAmount("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="premium-form">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('addExpense')}</h3>

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
        <button type="submit" className="premium-btn danger" style={{ width: '100%', backgroundColor: 'var(--danger)' }}>
          {t('addExpense')}
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

export default ExpenseForm;