import React, { useState, useEffect } from 'react';
import { useCurrency } from '../theme/useCurrency';
import { useTranslation } from '../theme/TranslationContext';
import { financeAPI } from '../../api';
import './SavingsGoals.css';

const SavingsGoals = () => {
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '', deadline: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await financeAPI.getSavingsGoals();
      setGoals(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(t('errorFetchingGoals') || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    setLoading(true);
    setError(null);
    try {
      const goalData = {
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: parseFloat(newGoal.current || 0),
      };
      if (newGoal.deadline) {
        goalData.deadline = newGoal.deadline;
      }
      
      const res = await financeAPI.addSavingsGoal(goalData);
      setGoals([...goals, res.data]);
      setNewGoal({ name: '', target: '', current: '', deadline: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding goal:', err);
      setError(t('errorAddingGoal') || 'Failed to add goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await financeAPI.deleteSavingsGoal(id);
      setGoals(goals.filter(g => g._id !== id));
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError(t('errorDeletingGoal') || 'Failed to delete goal');
    }
  };

  const handleUpdateProgress = async (id, amount) => {
    if (!amount || isNaN(amount)) return;
    const goal = goals.find(g => g._id === id);
    if (!goal) return;

    try {
      const newCurrent = Math.min(goal.target, goal.current + parseFloat(amount));
      const res = await financeAPI.updateSavingsGoal(id, { current: newCurrent });
      setGoals(goals.map(g => (g._id === id ? res.data : g)));
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(t('errorUpdatingGoal') || 'Failed to update goal');
    }
  };

  return (
    <div className="savings-goals animate-fade-in">
      <div className="section-header">
        <h2 className="premium-title">{t('savingsGoals')}</h2>
        <button className={`premium-btn ${showForm ? 'danger' : ''}`} onClick={() => setShowForm(!showForm)}>
          {showForm ? t('cancel') : t('newGoal')}
        </button>
      </div>

      {error && <div className="error-message" style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>{error}</div>}

      {showForm && (
        <form className="goal-form section-card premium-card" onSubmit={handleAddGoal}>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('goalName')}</label>
              <input 
                type="text" 
                className="premium-input"
                placeholder="e.g., New Car, Vacation" 
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('targetAmount')} ({currency})</label>
              <input 
                type="number" 
                className="premium-input"
                placeholder="0.00" 
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                required
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('currentSavings')} ({currency})</label>
              <input 
                type="number" 
                className="premium-input"
                placeholder="0.00" 
                value={newGoal.current}
                onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('deadline')} ({t('optional')})</label>
              <input 
                type="date" 
                className="premium-input"
                value={newGoal.deadline ? newGoal.deadline.split('T')[0] : ''}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="premium-btn" disabled={loading} style={{ marginTop: '1.5rem', width: '200px' }}>
            {loading ? t('adding...') || 'Adding...' : `🎯 ${t('addGoal')}`}
          </button>
        </form>
      )}

      {loading && !showForm && <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading...') || 'Loading...'}</div>}

      <div className="goals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {!loading && goals.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', gridColumn: '1/-1', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>{t('noGoals')}</p>
          </div>
        ) : (
          goals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal._id} className="goal-card section-card premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="goal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{goal.name}</h3>
                  <button className="delete-btn" onClick={() => handleDeleteGoal(goal._id)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
                </div>
                <div className="goal-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span className="amount" style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                    {currency} {goal.current.toLocaleString()} / {currency} {goal.target.toLocaleString()}
                  </span>
                  <span className="percent" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.875rem' }}>{progress.toFixed(0)}%</span>
                </div>
                <div className="progress-bar" style={{ width: '100%', height: '0.75rem', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div className="progress-fill" style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--success)', borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }}></div>
                </div>
                {goal.deadline && (
                  <div className="deadline" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📅 {t('targetDate')}: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                )}
                <div className="update-progress" style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="number" 
                      className="premium-input"
                      placeholder={t('addSavings')} 
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateProgress(goal._id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      className="premium-btn" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling;
                        handleUpdateProgress(goal._id, input.value);
                        input.value = '';
                      }}
                    >
                      {t('add')}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{t('enterAmountAdd')}</p>
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