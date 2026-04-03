import React, { useState, useEffect } from 'react';
import './SavingsGoals.css';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '', deadline: '' });

  useEffect(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    const goal = {
      id: Date.now(),
      ...newGoal,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current || 0),
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
    setNewGoal({ name: '', target: '', current: '', deadline: '' });
    setShowForm(false);
  };

  const handleDeleteGoal = (id) => {
    const updatedGoals = goals.filter(g => g.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
  };

  const handleUpdateProgress = (id, amount) => {
    const updatedGoals = goals.map(g => {
      if (g.id === id) {
        return { ...g, current: Math.min(g.target, g.current + parseFloat(amount)) };
      }
      return g;
    });
    setGoals(updatedGoals);
    localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
  };

  return (
    <div className="savings-goals animate-fade-in">
      <div className="section-header">
        <h2 className="premium-title">Savings Goals</h2>
        <button className="premium-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {showForm && (
        <form className="goal-form section-card premium-card" onSubmit={handleAddGoal}>
          <div className="form-grid">
            <div className="form-group">
              <label>Goal Name</label>
              <input 
                type="text" 
                placeholder="e.g., New Car, Vacation" 
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Target Amount ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Current Savings ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={newGoal.current}
                onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Deadline (Optional)</label>
              <input 
                type="date" 
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="premium-btn" style={{ marginTop: '1rem' }}>Add Goal</button>
        </form>
      )}

      <div className="goals-grid">
        {goals.length === 0 ? (
          <p className="no-data">No savings goals yet. Start planning your future!</p>
        ) : (
          goals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="goal-card section-card premium-card">
                <div className="goal-header">
                  <h3>{goal.name}</h3>
                  <button className="delete-btn" onClick={() => handleDeleteGoal(goal.id)}>×</button>
                </div>
                <div className="goal-stats">
                  <span className="amount">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                  <span className="percent">{progress.toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                {goal.deadline && (
                  <div className="deadline">
                    📅 Target Date: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                )}
                <div className="update-progress">
                  <input 
                    type="number" 
                    placeholder="Add amount" 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateProgress(goal.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <span>Press Enter to add savings</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;