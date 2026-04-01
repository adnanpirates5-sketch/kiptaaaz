import { useState, useEffect } from 'react';

export const useCurrency = () => {
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || '৳');

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return { currency, changeCurrency };
};