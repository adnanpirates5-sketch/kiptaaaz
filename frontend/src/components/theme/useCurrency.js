import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const EXCHANGE_RATE = 122.82; // 1 USD = 122.82 BDT

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || '৳');

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const convert = (amount) => {
    if (currency === '$') {
      return (amount || 0) / EXCHANGE_RATE;
    }
    return (amount || 0);
  };

  const convertToBase = (amount) => {
    if (currency === '$') {
      return (amount || 0) * EXCHANGE_RATE;
    }
    return (amount || 0);
  };

  const toBase = (amount, fromCurrency) => {
    if (fromCurrency === '$') {
      return (amount || 0) * EXCHANGE_RATE;
    }
    return (amount || 0);
  };

  const formatAmount = (amount) => {
    const converted = convert(amount);
    return `${currency} ${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, convert, convertToBase, toBase, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Return fallback for components used outside Provider during development
    return { 
      currency: localStorage.getItem('currency') || '৳',
      changeCurrency: (newCurrency) => localStorage.setItem('currency', newCurrency),
      convert: (a) => a,
      convertToBase: (a) => a,
      toBase: (a, c) => (c === '$' ? a * EXCHANGE_RATE : a),
      formatAmount: (a) => `৳ ${a}`
    };
  }
  return context;
};

export { EXCHANGE_RATE };
