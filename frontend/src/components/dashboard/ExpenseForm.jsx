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

    onAddExpense({ category, amount: num });
    setCategory("");
    setAmount("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form expense-form">
        <h3>{t('addExpense')}</h3>

        <button type="button" className="select-category-btn" onClick={() => setIsModalOpen(true)}>
          {category || t('selectCategory')}
        </button>

        <input
          type="number"
          placeholder={t('amount')}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          required
        />
        <button type="submit">{t('addExpense')}</button>
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