import React, { useState } from "react";
import { useTranslation } from "../theme/TranslationContext";
import CategoryModal from "./CategoryModal";
import { useCurrency } from "../theme/useCurrency";

const categories = [
  { name: "Food", icon: "🍔", key: "food" },
  { name: "Transport", icon: "🚗", key: "transport" },
  { name: "Entertainment", icon: "🎬", key: "entertainment" },
  { name: "Shopping", icon: "🛍️", key: "shopping" },
  { name: "Bills", icon: "💡", key: "bills" },
  { name: "Health", icon: "💊", key: "health" },
  { name: "Education", icon: "📚", key: "education" },
  { name: "Travel", icon: "✈️", key: "travel" },
  { name: "Subscriptions", icon: "📺", key: "subscriptions" },
  { name: "Gifts", icon: "🎁", key: "gifts" },
  { name: "Charity", icon: "🙏", key: "charity" },
  { name: "Pet", icon: "🐶", key: "pet" },
  { name: "Maintenance", icon: "🛠️", key: "maintenance" },
  { name: "Fuel", icon: "⛽", key: "fuel" },
  { name: "Other", icon: "✨", key: "other" },
  { name: "Custom", icon: "➕", key: "customCategory" },
];

const ExpenseForm = ({ onAddExpense }) => {
  const { t } = useTranslation();
  const { currency, convertToBase } = useCurrency();
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    const finalCategory = isCustom ? customCategory : category;

    if (!finalCategory || !amount || num <= 0) return;

    if (onAddExpense) {
      onAddExpense({ category: finalCategory, amount: convertToBase(num) });
    }
    setCategory("");
    setCustomCategory("");
    setAmount("");
    setIsCustom(false);
  };

  const handleSelectCategory = (cat) => {
    if (cat === "Custom") {
      setIsCustom(true);
      setCategory("Custom");
    } else {
      setIsCustom(false);
      setCategory(cat);
    }
  };

  const getCategoryTranslation = (catName) => {
    if (catName === "Custom") return t('custom');
    const cat = categories.find(c => c.name === catName);
    return cat ? t(cat.key) : catName;
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
          {category ? getCategoryTranslation(category) : t('selectCategory')}
        </button>

        {isCustom && (
          <input
            type="text"
            className="premium-input animate-fade-in"
            placeholder={t('enterCategoryName')}
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
        )}

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
        <button type="submit" className="premium-btn danger" style={{ width: '100%', backgroundColor: 'var(--danger)' }}>
          {t('addExpense')}
        </button>
      </form>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSelectCategory={handleSelectCategory}
      />
    </>
  );
};

export default ExpenseForm;