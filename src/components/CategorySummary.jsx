import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6B6B"];

const CategorySummary = ({ expenses }) => {
  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  // Convert to array for chart
  const data = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
  }));

  if (data.length === 0) {
    return <p>Add expenses to see category breakdown.</p>;
  }

  return (
    <div className="category-summary">
      <h3>Spending by Category</h3>
      <div className="chart-container">
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ৳ ${entry.value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `৳ ${value}`} />
          <Legend />
        </PieChart>
      </div>
      <ul className="category-list">
        {data.map((cat) => (
          <li key={cat.name}>
            <span>{cat.name}</span>
            <span>৳ {cat.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySummary;