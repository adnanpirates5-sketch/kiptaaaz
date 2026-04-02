import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import CategorySummary from "./CategorySummary";
import IncomeCategorySummary from "./IncomeCategorySummary";
import { useTranslation } from "../theme/TranslationContext";
import { useCurrency } from "../theme/useCurrency";

const Stats = ({ incomes, expenses }) => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [merged, setMerged] = useState(false);

  // Prepare data for merged chart
  const allCategories = new Set([...incomes.map(i => i.category), ...expenses.map(e => e.category)]);
  const mergedData = Array.from(allCategories).map(cat => {
    const income = incomes.filter(i => i.category === cat).reduce((sum, i) => sum + i.amount, 0);
    const expense = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { category: cat, income, expense, balance: income - expense };
  });

  // Prepare data for bar charts
  const expenseBarData = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.category === exp.category);
    if (existing) {
      existing.amount += exp.amount;
    } else {
      acc.push({ category: exp.category, amount: exp.amount });
    }
    return acc;
  }, []);

  const incomeBarData = incomes.reduce((acc, inc) => {
    const existing = acc.find(item => item.category === inc.category);
    if (existing) {
      existing.amount += inc.amount;
    } else {
      acc.push({ category: inc.category, amount: inc.amount });
    }
    return acc;
  }, []);

  return (
    <div className="stats-section">
      <div className="stats-header">
        <h3>{t('stats')}</h3>
        <button
          className="premium-btn merge-btn"
          onClick={() => setMerged(!merged)}
        >
          {merged ? 'Separate Graphs' : 'Merge Graphs'}
        </button>
      </div>

      {merged ? (
        <div className="merged-charts">
          <div className="chart-card">
            <h4>Income vs Expenses by Category</h4>
            <BarChart width={600} height={300} data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${value}`} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expense" fill="#f87171" name="Expense" />
            </BarChart>
          </div>
          <div className="chart-card">
            <h4>Balance by Category (Income - Expense)</h4>
            <BarChart width={600} height={300} data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${value}`} />
              <Bar dataKey="balance" fill="#3b82f6" name="Balance" />
            </BarChart>
          </div>
        </div>
      ) : (
        <div className="stats-charts">
          <div className="chart-card">
            <h4>Income by Category (Pie)</h4>
            <IncomeCategorySummary incomes={incomes} />
          </div>
          <div className="chart-card">
            <h4>Expenses by Category (Pie)</h4>
            <CategorySummary expenses={expenses} />
          </div>
          <div className="chart-card">
            <h4>Expenses by Category (Bar)</h4>
            <BarChart width={400} height={300} data={expenseBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${value}`} />
              <Bar dataKey="amount" fill="#f87171" />
            </BarChart>
          </div>
          <div className="chart-card">
            <h4>Income by Category (Bar)</h4>
            <BarChart width={400} height={300} data={incomeBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${value}`} />
              <Bar dataKey="amount" fill="#10b981" />
            </BarChart>
          </div>
          <div className="chart-card">
            <h4>Income Trend (Line)</h4>
            <LineChart width={400} height={300} data={incomeBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${value}`} />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </div>
          <div className="chart-card">
            <h4>Expense Trend (Line)</h4>
            <LineChart width={400} height={300} data={expenseBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => `${currency} ${value}`} />
              <Line type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;