import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BookCard from '../components/BookCard';
import TypingText from '../components/TypingText';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const Dashboard = () => {
  const { dashboard, dailyReading, schedules, cart, selectedCurrency,
    currencies, trendingTopics, dailyInsight, handleSendNotification, setPage } = useApp();

  const pct = (c, t) => t ? Math.round((c / t) * 100) : 0;
  const activeSchedules = schedules.filter(s => s.is_active).length;
  const chaptersRead = schedules.reduce((s, x) => s + (x.current_chapter || 0), 0);

  const currencySymbol = currencies.find(c => c.code === selectedCurrency)?.symbol || '$';

  if (!dashboard) {
    return <div className="page"><div className="loading">Loading...</div></div>;
  }

  return (
    <motion.div 
      className="page page-3d"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title text-3d-strong">⚔️ SyntraHub</h1>
      </motion.div>

      <motion.div className="stats-grid" variants={itemVariants}>
        <div className="stat-card stat-card-3d float-3d" onClick={() => setPage('library')}>
          <div className="stat-icon card-shine" style={{ background: '#e8f0fe' }}>📚</div>
          <div className="stat-info"><h3>{dashboard.total_books}</h3><p>Books</p></div>
        </div>
        <div className="stat-card stat-card-3d float-delayed-1" onClick={() => setPage('library')}>
          <div className="stat-icon card-shine" style={{ background: '#e8f8ee' }}>💻</div>
          <div className="stat-info"><h3>{dashboard.total_electronics}</h3><p>Electronics</p></div>
        </div>
        <div className="stat-card stat-card-3d float-delayed-2" onClick={() => setPage('library')}>
          <div className="stat-icon card-shine" style={{ background: '#fef5e8' }}>👕</div>
          <div className="stat-info"><h3>{dashboard.total_clothing}</h3><p>Clothing</p></div>
        </div>
        <div className="stat-card stat-card-3d float-3d" onClick={() => setPage('cart')}>
          <div className="stat-icon card-shine" style={{ background: '#f0e8fe' }}>🛒</div>
          <div className="stat-info"><h3>{cart.total_items}</h3><p>Cart Items</p></div>
        </div>
      </motion.div>

      {trendingTopics && trendingTopics.length > 0 && (
        <motion.div className="trending-bar" variants={itemVariants}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
            🔥 Trending
          </span>
          {trendingTopics.map(t => (
            <div key={t.id} className="trending-chip" style={{ borderColor: t.color + '30' }}>
              {t.icon} {t.name}
              <div className="heat-bar">
                <div className="heat-fill" style={{ width: t.heat + '%', background: t.color }} />
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <motion.div className="mid-stats" variants={itemVariants}>
        <div className="stat-card-sm card-3d-tilt shadow-3d">
          <span className="stat-label">Media Items</span>
          <span className="stat-value">{dashboard.total_media}</span>
        </div>
        <div className="stat-card-sm card-3d-tilt shadow-3d">
          <span className="stat-label">Podcasts</span>
          <span className="stat-value">{dashboard.total_podcasts}</span>
        </div>
        <div className="stat-card-sm card-3d-tilt shadow-3d">
          <span className="stat-label">Chapters Read</span>
          <span className="stat-value">{chaptersRead}</span>
        </div>
        <div className="stat-card-sm card-3d-tilt shadow-3d">
          <span className="stat-label">Categories</span>
          <span className="stat-value">{dashboard.total_categories}</span>
        </div>
      </motion.div>

      {dailyReading ? (
        <motion.div className="daily-reading-card parallax-section card-3d" variants={itemVariants}>
          <div className="parallax-layer parallax-layer-back" style={{
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,113,227,0.12), transparent 70%)',
            top: '-10%', right: '-15%',
          }} />
          <div className="parallax-layer parallax-layer-front" style={{
            width: 250, height: 250, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(48,209,88,0.08), transparent 70%)',
            bottom: '-5%', left: '-5%',
          }} />
          <div className="reading-header">
            <div>
              <h2>{dailyReading.book_title}</h2>
              <p className="reading-meta">
                Chapter {dailyReading.chapter_number} · {dailyReading.reading_time_minutes} min read
              </p>
            </div>
            <div className="progress-ring">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4"/>
                <circle cx="32" cy="32" r="28" fill="none" stroke="#0071e3" strokeWidth="4"
                  strokeDasharray={`${2*Math.PI*28}`}
                  strokeDashoffset={`${2*Math.PI*28*(1-dailyReading.progress/100)}`}
                  transform="rotate(-90 32 32)" strokeLinecap="round"/>
                <text x="32" y="32" textAnchor="middle" dominantBaseline="central" fontSize="15"
                  fontWeight="700" fill="#fff">{Math.round(dailyReading.progress)}%</text>
              </svg>
            </div>
          </div>
          <div className="reading-summary">
            <p><TypingText text={dailyReading.summary} speed={20} /></p>
          </div>
          {dailyReading.key_points?.length > 0 && (
            <div className="reading-points">
              <h3>Key Takeaways</h3>
              <ul>{dailyReading.key_points.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          )}
          <div className="reading-actions">
            <button className="btn btn-primary btn-lg" onClick={handleSendNotification}>
              Send to My Phone
            </button>
            <button className="btn btn-outline" onClick={() => setPage('settings')}>
              Notification Settings
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div className="empty-state" variants={itemVariants}>
          <div className="empty-icon">📖</div>
          <h3>Welcome to SyntraHub</h3>
          <p>Browse our worldwide library, discover podcasts and videos, schedule daily reading, or shop for books with global shipping.</p>
          <div className="empty-actions">
            <button className="btn btn-primary" onClick={() => setPage('library')}>Browse Library</button>
            <button className="btn btn-outline" onClick={() => setPage('media')}>Explore Media</button>
          </div>
        </motion.div>
      )}

      <motion.h2 className="section-title text-3d" variants={itemVariants}>Featured Books</motion.h2>
      <motion.div className="books-grid" variants={containerVariants}>
        {dashboard.featured_books?.map(b => (
          <motion.div key={b.id} variants={itemVariants}>
            <BookCard book={b} catalogView={true} showActions={true} />
          </motion.div>
        ))}
      </motion.div>

      {dashboard.recent_orders?.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="section-title">Recent Orders</h2>
          <div className="orders-mini-list">
            {dashboard.recent_orders.map(order => (
              <div key={order.id} className="order-mini-card">
                <div className="order-mini-info">
                  <strong>#{order.order_number}</strong>
                  <span className={`order-status status-${order.status}`}>{order.status}</span>
                </div>
                <span className="order-mini-total">{currencySymbol}{order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
