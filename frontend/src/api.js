import axios from 'axios';

const API_URL = '/api';

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

// Better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.patch('/auth/profile/update', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
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
  updateDebt: (id, updates) => api.patch(`/finance/debts/${id}`, updates),
  deleteDebt: (id) => api.delete(`/finance/debts/${id}`),
  
  getBudgets: () => api.get('/finance/budgets'),
  addBudget: (budget) => api.post('/finance/budgets', budget),
  deleteBudget: (category) => api.delete(`/finance/budgets/${category}`),
  
  getSavingsGoals: () => api.get('/finance/savings-goals'),
  addSavingsGoal: (goal) => api.post('/finance/savings-goals', goal),
  updateSavingsGoal: (id, updates) => api.patch(`/finance/savings-goals/${id}`, updates),
  deleteSavingsGoal: (id) => api.delete(`/finance/savings-goals/${id}`),
};

export const reviewAPI = {
  getReviews: () => api.get('/reviews'),
  addReview: (review) => api.post('/reviews', review),
};

export default api;