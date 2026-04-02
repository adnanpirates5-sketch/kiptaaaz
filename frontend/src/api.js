import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const financeAPI = {
  getIncomes: () => api.get('/finance/incomes'),
  addIncome: (income) => api.post('/finance/incomes', income),
  deleteIncome: (id) => api.delete(`/finance/incomes/${id}`),
  
  getExpenses: () => api.get('/finance/expenses'),
  addExpense: (expense) => api.post('/finance/expenses', expense),
  deleteExpense: (id) => api.delete(`/finance/expenses/${id}`),
  
  getDebts: () => api.get('/finance/debts'),
  addDebt: (debt) => api.post('/finance/debts', debt),
  deleteDebt: (id) => api.delete(`/finance/debts/${id}`),
  
  getBudgets: () => api.get('/finance/budgets'),
  addBudget: (budget) => api.post('/finance/budgets', budget),
  deleteBudget: (category) => api.delete(`/finance/budgets/${category}`),
};

export default api;