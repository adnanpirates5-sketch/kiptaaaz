import React, { useState, useEffect } from 'react';
import { useCurrency } from '../theme/useCurrency';
import { useTranslation } from '../theme/TranslationContext';
import { financeAPI } from '../../api';
import './SavingsGoals.css';

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

    const targetNum = parseFloat(newGoal.target);
    const currentNum = parseFloat(newGoal.current || 0);

    // Limit maximum amount to 1 billion
    if (targetNum > 1000000000 || currentNum > 1000000000) {
      alert(t('amountTooLarge') || 'Amount is too large. Maximum allowed is 1,000,000,000.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const goalData = {
        name: newGoal.name,
        target: toBase(targetNum, selectedCurrency),
        current: toBase(currentNum, selectedCurrency),
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

  const getGoalEmoji = (goalName) => {
    if (!goalName) return '🎯';
    const name = goalName.toLowerCase();
    
    // Travel-related
    if (name.includes('vacation') || name.includes('trip') || name.includes('travel') || name.includes('holiday') || name.includes('tour') || name.includes('beach') || name.includes('cruise')) return '🏖️';
    
    // Vehicle-related
    if (name.includes('car') || name.includes('vehicle') || name.includes('bike') || name.includes('motorcycle') || name.includes('auto') || name.includes('truck') || name.includes('tesla') || name.includes('jeep')) return '🚗';
    
    // Property-related
    if (name.includes('house') || name.includes('home') || name.includes('apartment') || name.includes('property') || name.includes('real estate') || name.includes('condo') || name.includes('villa')) return '🏠';
    
    // Wedding-related
    if (name.includes('wedding') || name.includes('marriage') || name.includes('honeymoon') || name.includes('nuptial') || name.includes('engagement')) return '💍';
    
    // Education-related
    if (name.includes('education') || name.includes('school') || name.includes('course') || name.includes('learning') || name.includes('university') || name.includes('college') || name.includes('tuition') || name.includes('degree')) return '🎓';
    
    // Finance-related
    if (name.includes('investment') || name.includes('stock') || name.includes('fund') || name.includes('portfolio') || name.includes('crypto') || name.includes('trading')) return '📈';
    
    // Emergency funds
    if (name.includes('emergency') || name.includes('urgent') || name.includes('crisis') || name.includes('rainy day')) return '🆘';
    
    // Technology
    if (name.includes('laptop') || name.includes('computer') || name.includes('phone') || name.includes('gadget') || name.includes('tech') || name.includes('iphone') || name.includes('ipad') || name.includes('drone') || name.includes('console') || name.includes('gaming')) return '💻';
    
    // Family/Children
    if (name.includes('baby') || name.includes('child') || name.includes('kid') || name.includes('family') || name.includes('infant')) return '👶';
    
    // Health & Wellness
    if (name.includes('health') || name.includes('fitness') || name.includes('gym') || name.includes('medical') || name.includes('surgery') || name.includes('wellness') || name.includes('treatment') || name.includes('diet')) return '💪';
    
    // Sport & Recreation
    if (name.includes('sport') || name.includes('skiing') || name.includes('swimming') || name.includes('diving') || name.includes('climbing') || name.includes('hiking') || name.includes('golf') || name.includes('tennis')) return '⚽';
    
    // Food & Dining
    if (name.includes('restaurant') || name.includes('dining') || name.includes('food') || name.includes('culinary') || name.includes('cook') || name.includes('chef')) return '🍽️';
    
    // Entertainment
    if (name.includes('concert') || name.includes('movie') || name.includes('entertainment') || name.includes('cinema') || name.includes('festival') || name.includes('theater') || name.includes('music')) return '🎬';
    
    // Pet-related
    if (name.includes('pet') || name.includes('dog') || name.includes('cat') || name.includes('puppy') || name.includes('kitten')) return '🐕';
    
    // Garden & Nature
    if (name.includes('garden') || name.includes('plant') || name.includes('landscaping') || name.includes('outdoor')) return '🌱';
    
    // Art & Creativity
    if (name.includes('art') || name.includes('paint') || name.includes('drawing') || name.includes('creative') || name.includes('design') || name.includes('craft')) return '🎨';
    
    // Photography
    if (name.includes('camera') || name.includes('photography') || name.includes('photo')) return '📷';
    
    // Business & Work
    if (name.includes('business') || name.includes('startup') || name.includes('office') || name.includes('work') || name.includes('professional')) return '💼';
    
    // Jewelry & Accessories
    if (name.includes('jewelry') || name.includes('watch') || name.includes('necklace') || name.includes('ring') || name.includes('bracelet')) return '💎';
    
    // Fashion & Clothing
    if (name.includes('fashion') || name.includes('clothes') || name.includes('wardrobe') || name.includes('shoe') || name.includes('designer') || name.includes('brand')) return '👗';
    
    // Books & Knowledge
    if (name.includes('book') || name.includes('library') || name.includes('reading') || name.includes('knowledge') || name.includes('literature')) return '📚';
    
    // Music & Instruments
    if (name.includes('music') || name.includes('guitar') || name.includes('piano') || name.includes('instrument') || name.includes('violin') || name.includes('drum')) return '🎸';
    
    // Furniture & Home Decor
    if (name.includes('furniture') || name.includes('decor') || name.includes('interior') || name.includes('bedding') || name.includes('sofa')) return '🛋️';
    
    // Fitness Equipment
    if (name.includes('weights') || name.includes('treadmill') || name.includes('equipment') || name.includes('trainer')) return '🏋️';
    
    // Travel Specific
    if (name.includes('flight') || name.includes('airfare') || name.includes('hotel') || name.includes('accommodation')) return '✈️';
    
    // Celebration & Occasions
    if (name.includes('birthday') || name.includes('anniversary') || name.includes('celebration') || name.includes('party') || name.includes('gift')) return '🎉';
    
    // Savings Goal (generic)
    if (name.includes('saving') || name.includes('goal') || name.includes('target') || name.includes('fund')) return '💰';
    
    // Default emoji
    return '⭐';
  };

  const handleUpdateProgress = async (id, amount, goalCurrency) => {
    if (!amount || isNaN(amount)) return;
    const goal = goals.find(g => (g._id || g.id) === id);
    if (!goal) return;

    const amountNum = parseFloat(amount);
    // Limit maximum amount to 1 billion
    if (amountNum > 1000000000) {
      alert(t('amountTooLarge') || 'Amount is too large. Maximum allowed is 1,000,000,000.');
      return;
    }

    try {
      // Convert the added amount to base currency before adding
      const addedAmountBase = toBase(amountNum, goalCurrency);
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="e.g., New Car, Vacation" 
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  required
                  style={{ flex: 1 }}
                />
                {newGoal.name && <span style={{ fontSize: '1.75rem' }}>{getGoalEmoji(newGoal.name)}</span>}
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
                max="1000000000"
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
                max="1000000000"
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
                <div className="goal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <span style={{ fontSize: '1.5rem' }}>{getGoalEmoji(goal.name)}</span>
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
                      max="1000000000"
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