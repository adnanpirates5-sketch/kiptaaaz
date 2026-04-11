import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useCurrency } from "../theme/useCurrency";
import { useTranslation } from "../theme/TranslationContext";

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
];

const categories = [
  { name: "Food", key: "food" },
  { name: "Transport", key: "transport" },
  { name: "Entertainment", key: "entertainment" },
  { name: "Shopping", key: "shopping" },
  { name: "Bills", key: "bills" },
  { name: "Health", key: "health" },
  { name: "Education", key: "education" },
  { name: "Travel", key: "travel" },
  { name: "Subscriptions", key: "subscriptions" },
  { name: "Gifts", key: "gifts" },
  { name: "Charity", key: "charity" },
  { name: "Pet", key: "pet" },
  { name: "Maintenance", key: "maintenance" },
  { name: "Fuel", key: "fuel" },
  { name: "Other", key: "other" },
];

const CategorySummary = ({ expenses }) => {
  const { currency, convert } = useCurrency();
  const { t } = useTranslation();

  const getCategoryTranslation = (catName) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? t(cat.key) : catName;
  };

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const data = Object.keys(categoryTotals).map((cat) => ({
    name: getCategoryTranslation(cat),
    value: convert(categoryTotals[cat]),
  }));

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        <p>{t('noExpenseData')}</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${currency} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategorySummary;