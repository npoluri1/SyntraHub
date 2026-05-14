import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

const RewardsPage = () => {
  const { USER_ID } = useApp();
  const [balance, setBalance] = useState({ balance: 0, total_earned: 0, total_spent: 0 });
  const [credits, setCredits] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (tab === 'overview') { loadBalance(); loadCredits(); loadAchievements(); }
    else if (tab === 'redeem') loadRedemptions();
    else if (tab === 'leaderboard') loadLeaderboard();
  }, [tab]);

  const loadBalance = async () => {
    try { setBalance(await api(`/api/rewards/credits/balance?user_id=${USER_ID}`)); }
    catch (e) { setBalance({ balance: 0, total_earned: 0, total_spent: 0 }); }
  };

  const loadCredits = async () => {
    try { setCredits(await api(`/api/rewards/credits?user_id=${USER_ID}`)); }
    catch (e) { setCredits([]); }
  };

  const loadAchievements = async () => {
    try { setAchievements(await api(`/api/rewards/achievements?user_id=${USER_ID}`)); }
    catch (e) { setAchievements([]); }
  };

  const loadLeaderboard = async () => {
    try { setLeaderboard(await api('/api/rewards/leaderboard')); }
    catch (e) { setLeaderboard([]); }
  };

  const loadRedemptions = async () => {
    try { setRedemptions(await api(`/api/rewards/redeem?user_id=${USER_ID}`)); }
    catch (e) { setRedemptions([]); }
  };

  const handleQuest = async (action) => {
    try {
      await api(`/api/rewards/quests?action=${action}&credits=10&user_id=${USER_ID}`, { method: 'POST' });
      loadBalance();
      loadCredits();
      loadAchievements();
    } catch (e) { console.error(e); }
  };

  const handleRedeem = async (type, cost) => {
    try {
      await api('/api/rewards/redeem', {
        method: 'POST',
        body: JSON.stringify({ reward_type: type, credits_spent: cost }),
      });
      loadBalance();
      loadRedemptions();
    } catch (e) { alert('Redeem failed: ' + e.message); }
  };

  const quests = [
    { k: 'daily_login', l: 'Daily Login', c: 5 },
    { k: 'share_content', l: 'Share Content', c: 10 },
    { k: 'invite_friend', l: 'Invite Friend', c: 25 },
    { k: 'watch_video', l: 'Watch Video', c: 5 },
    { k: 'make_purchase', l: 'Make Purchase', c: 20 },
  ];

  const rewards = [
    { k: 'gift_card_10', l: '$10 Gift Card', c: 200 },
    { k: 'premium_month', l: '1 Month Premium', c: 500 },
    { k: 'merchandise', l: 'Exclusive Merch', c: 1000 },
  ];

  return (
    <div className="page page-3d">
      <div className="page-header">
        <h1 className="page-title text-3d-strong">Earn-to-<span>Earn</span></h1>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>🏆 Overview</button>
        <button className={`tab ${tab === 'redeem' ? 'active' : ''}`} onClick={() => setTab('redeem')}>🎁 Redeem</button>
        <button className={`tab ${tab === 'leaderboard' ? 'active' : ''}`} onClick={() => setTab('leaderboard')}>📊 Leaderboard</button>
      </div>

      {tab === 'overview' && (
        <div>
          <div className="card card-3d" style={{ padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: '700' }}>{balance.balance}</h2>
            <p>Credits Available</p>
            <p style={{ fontSize: '12px', opacity: 0.7 }}>Earned: {balance.total_earned} · Spent: {balance.total_spent}</p>
          </div>

          <div className="card card-3d" style={{ padding: '16px', marginBottom: '16px' }}>
            <h3>Daily Quests</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {quests.map(q => (
                <button key={q.k} className="btn btn-secondary" onClick={() => handleQuest(q.k)}>
                  {q.l} (+{q.c})
                </button>
              ))}
            </div>
          </div>

          {achievements.length > 0 && (
            <div className="card card-3d" style={{ padding: '16px', marginBottom: '16px' }}>
              <h3>Achievements</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {achievements.map(a => (
                  <span key={a.id} className="badge">{a.icon} {a.achievement}</span>
                ))}
              </div>
            </div>
          )}

          <div className="card card-3d" style={{ padding: '16px' }}>
            <h3>Recent Credits</h3>
            {credits.slice(0, 10).map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>{t.description || t.action}</span>
                <span style={{ color: '#4caf50' }}>+{t.credits}</span>
              </div>
            ))}
            {credits.length === 0 && <p className="loading">Complete quests to earn credits</p>}
          </div>
        </div>
      )}

      {tab === 'redeem' && (
        <div>
          <div className="grid-3">
            {rewards.map(r => (
              <div key={r.k} className="card card-3d" style={{ padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎁</div>
                <h3>{r.l}</h3>
                <p>{r.c} credits</p>
                <button className="btn btn-primary" style={{ marginTop: '8px' }}
                  disabled={balance.balance < r.c}
                  onClick={() => handleRedeem(r.k, r.c)}>
                  {balance.balance >= r.c ? 'Redeem' : 'Not enough credits'}
                </button>
              </div>
            ))}
          </div>

          {redemptions.length > 0 && (
            <div className="card card-3d" style={{ padding: '16px', marginTop: '16px' }}>
              <h3>Redemption History</h3>
              {redemptions.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span>{r.reward_type}</span>
                  <span>-{r.credits_spent} credits · {r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div>
          <div className="card card-3d" style={{ padding: '16px' }}>
            <h3>Top Earners</h3>
            {leaderboard.map((entry, i) => (
              <div key={entry.user_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700', width: '24px' }}>#{entry.rank}</span>
                  <div>
                    <strong>{entry.name}</strong>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>{entry.achievements} achievements</p>
                  </div>
                </div>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#ffd700' }}>{entry.total_credits}</span>
              </div>
            ))}
            {leaderboard.length === 0 && <p className="loading">No data yet</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;
