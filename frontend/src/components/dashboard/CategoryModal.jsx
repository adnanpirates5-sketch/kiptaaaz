import React from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "../theme/TranslationContext";
import "./CategoryModal.css";

const CategoryModal = ({ isOpen, onClose, categories, onSelectCategory }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{t('selectCategory')}</h3>
        <div className="categories-grid">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="category-btn"
              onClick={() => {
                onSelectCategory(cat.name);
                onClose();
              }}
            >
              <span className="icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
        <button className="close-btn" onClick={onClose}>
          {t('close') || 'Close'}
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CategoryModal;