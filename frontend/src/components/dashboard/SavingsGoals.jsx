import React, { useState, useEffect } from 'react';
import { useCurrency } from '../theme/useCurrency';
import { useTranslation } from '../theme/TranslationContext';
import { financeAPI } from '../../api';
import './SavingsGoals.css';

// Function to get emoji based on goal name
const getEmojiForGoal = (goalName) => {
  if (!goalName) return '🎯';
  
  const name = goalName.toLowerCase();
  const emojiMap = {
    car: '🚗',
    vehicle: '🚗',
    bike: '🏍️',
    motorcycle: '🏍️',
    vacation: '✈️',
    travel: '🌍',
    trip: '✈️',
    holiday: '🏖️',
    house: '🏠',
    home: '🏠',
    apartment: '🏢',
    property: '🏠',
    education: '📚',
    school: '📚',
    course: '📚',
    college: '🎓',
    university: '🎓',
    wedding: '💒',
    phone: '📱',
    mobile: '📱',
    laptop: '💻',
    computer: '💻',
    iphone: '📱',
    savings: '💰',
    emergency: '🆘',
    'emergency fund': '🆘',
    health: '⚕️',
    medical: '⚕️',
    hospital: '🏥',
    fitness: '💪',
    gym: '🏋️',
    investment: '📈',
    business: '💼',
    startup: '🚀',
    furniture: '🛋️',
    appliance: '🔧',
    kitchen: '🍳',
    baby: '👶',
    gift: '🎁',
    clothes: '👕',
    shopping: '🛍️',
    food: '🍕',
    restaurant: '🍽️',
    book: '📖',
    music: '🎵',
    game: '🎮',
    pet: '🐕',
    dog: '🐕',
    cat: '🐱',
    garden: '🌱',
    plant: '🌿',
    debt: '💳',
    loan: '💰',
  };

  // Check for keywords in goal name
  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (name.includes(keyword)) {
      return emoji;
    }
  }
  
  // Default emoji if no match found
  return '🎯';
};

const SavingsGoals = () => {
  const { currency: globalCurrency, convert, toBase } = useCurrency();
  const { t } = useTranslation();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '', deadline: '' });
  const [selectedCurrency, setSelectedCurrency] = useState(globalCurrency);

  const formatValue = (value) => {
    const convertedValue = convert(value);
    return `${globalCurrency} ${convertedValue.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

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
        target: toBase(parseFloat(newGoal.target), selectedCurrency),
        current: toBase(parseFloat(newGoal.current || 0), selectedCurrency),
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
      const msg = err.response?.data?.message || err.message;
      setError(`${t('errorAddingGoal') || 'Failed to add goal'}: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await financeAPI.deleteSavingsGoal(id);
      setGoals(goals.filter(g => (g._id || g.id) !== id));
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError(t('errorDeletingGoal') || 'Failed to delete goal');
    }
  };

  const handleUpdateProgress = async (id, amount, goalCurrency) => {
    if (!amount || isNaN(amount)) return;
    const goal = goals.find(g => (g._id || g.id) === id);
    if (!goal) return;

    try {
      // Convert the added amount to base currency before adding
      const addedAmountBase = toBase(parseFloat(amount), goalCurrency);
      const newCurrent = Math.min(goal.target, goal.current + addedAmountBase);
      
      const res = await financeAPI.updateSavingsGoal(id, { current: newCurrent });
      setGoals(goals.map(g => ((g._id || g.id) === id ? res.data : g)));
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

      {error && (
        <div className="error-message" style={{ 
          color: 'var(--danger)', 
          marginBottom: '1rem', 
          padding: '1rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--danger)'
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <form className="goal-form section-card premium-card" onSubmit={handleAddGoal}>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('goalName')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="e.g., New Car, Vacation" 
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  style={{ flex: 1 }}
                  required
                />
                {newGoal.name && (
                  <span style={{ fontSize: '1.75rem', minWidth: '40px', textAlign: 'center' }}>
                    {getEmojiForGoal(newGoal.name)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('currency')}</label>
              <div className="currency-selector" style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '2px', width: 'fit-content' }}>
                <button 
                  type="button"
                  onClick={() => setSelectedCurrency('৳')}
                  style={{ 
                    border: 'none', 
                    background: selectedCurrency === '৳' ? 'var(--primary)' : 'transparent',
                    color: selectedCurrency === '৳' ? '#fff' : 'var(--text-secondary)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                >৳</button>
                <button 
                  type="button"
                  onClick={() => setSelectedCurrency('$')}
                  style={{ 
                    border: 'none', 
                    background: selectedCurrency === '$' ? 'var(--primary)' : 'transparent',
                    color: selectedCurrency === '$' ? '#fff' : 'var(--text-secondary)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                >$</button>
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('targetAmount')} ({selectedCurrency})</label>
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
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('currentSavings')} ({selectedCurrency})</label>
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
                value={newGoal.deadline || ''}
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
            const goalId = goal._id || goal.id;
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goalId} className="goal-card section-card premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="goal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{getEmojiForGoal(goal.name)}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{goal.name}</h3>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteGoal(goalId)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
                </div>
                <div className="goal-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span className="amount" style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                    {formatValue(goal.current)} / {formatValue(goal.target)}
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
                    <div className="mini-currency-selector" style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                      <button 
                        className={`mini-btn ${globalCurrency === '৳' ? 'active' : ''}`}
                        style={{ padding: '2px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem' }}
                        id={`curr-bdt-${goalId}`}
                        onClick={(e) => {
                          const parent = e.currentTarget.parentElement;
                          parent.querySelectorAll('button').forEach(b => b.style.background = 'transparent');
                          e.currentTarget.style.background = 'var(--primary)';
                          e.currentTarget.style.color = '#fff';
                        }}
                      >৳</button>
                      <button 
                        className={`mini-btn ${globalCurrency === '$' ? 'active' : ''}`}
                        style={{ padding: '2px 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem' }}
                        id={`curr-usd-${goalId}`}
                        onClick={(e) => {
                          const parent = e.currentTarget.parentElement;
                          parent.querySelectorAll('button').forEach(b => b.style.background = 'transparent');
                          e.currentTarget.style.background = 'var(--primary)';
                          e.currentTarget.style.color = '#fff';
                        }}
                      >$</button>
                    </div>
                    <input 
                      type="number" 
                      className="premium-input"
                      placeholder={t('addSavings')} 
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', flex: 1 }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const selector = e.currentTarget.previousElementSibling;
                          const isUsd = selector.querySelector('button:last-child').style.background === 'var(--primary)';
                          handleUpdateProgress(goalId, e.target.value, isUsd ? '$' : '৳');
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      className="premium-btn" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling;
                        const selector = input.previousElementSibling;
                        // Check which button is highlighted
                        const bdtBtn = selector.querySelector('button:first-child');
                        const usdBtn = selector.querySelector('button:last-child');
                        
                        // Default to global if none selected yet via click
                        let goalCurr = globalCurrency;
                        if (usdBtn.style.background.includes('var(--primary)')) goalCurr = '$';
                        else if (bdtBtn.style.background.includes('var(--primary)')) goalCurr = '৳';

                        handleUpdateProgress(goalId, input.value, goalCurr);
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