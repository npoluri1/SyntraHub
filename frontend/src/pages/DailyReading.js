import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

function DailyReading() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();

  useEffect(() => {
    fetch(`/api/reading/history?user_id=${user?.id || 1}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div className="page-container"><div className="loading-pulse">Loading your reading history...</div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><Icon name="book" /> Daily Reading</h1>
        <p>Track your daily book summaries, streak, and progress</p>
      </div>

      <div className="reading-stats-row">
        <div className="stat-card glow-card">
          <div className="stat-icon"><Icon name="star" /></div>
          <div className="stat-value">{data?.streak || 0}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card glow-card">
          <div className="stat-icon"><Icon name="book" /></div>
          <div className="stat-value">{data?.history?.length || 0}</div>
          <div className="stat-label">Summaries Read</div>
        </div>
        <div className="stat-card glow-card">
          <div className="stat-icon"><Icon name="play" /></div>
          <div className="stat-value">{data?.upcoming?.length || 0}</div>
          <div className="stat-label">Active Books</div>
        </div>
      </div>

      {data?.upcoming?.length > 0 && (
        <section className="reading-section">
          <h2><Icon name="calendar" /> Today's Reading Queue</h2>
          <div className="upcoming-list">
            {data.upcoming.map((u, i) => (
              <div key={i} className="upcoming-card glow-card card-3d">
                <div className="upcoming-info">
                  <h3>{u.book_title}</h3>
                  <p className="upcoming-author">by {u.book_author}</p>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${u.progress}%` }}></div>
                  </div>
                  <p className="upcoming-meta">
                    Chapter {u.next_chapter} of {u.total_chapters} &middot; {u.progress}% complete
                  </p>
                </div>
                <button
                  className="btn btn-sm"
                  onClick={() => window.location.href = `/?page=reading`}
                >
                  <Icon name="play" /> Read Now
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="reading-section">
        <h2><Icon name="calendar" /> Reading Calendar (Last 30 Days)</h2>
        <div className="calendar-grid">
          {data?.calendar?.map((d, i) => (
            <div
              key={i}
              className={`calendar-day ${d.is_today ? 'today' : ''} ${d.has_reading ? 'read' : 'missed'}`}
              title={`${d.date}${d.has_reading ? ' - Read' : ' - Missed'}${d.is_today ? ' (Today)' : ''}`}
            >
              <span className="cal-date-num">{new Date(d.date + 'T00:00:00').getDate()}</span>
              <span className="cal-dot">{d.has_reading ? '📖' : d.is_today ? '📌' : '⬜'}</span>
            </div>
          ))}
        </div>
      </section>

      {data?.history?.length > 0 && (
        <section className="reading-section">
          <h2><Icon name="clock" /> Reading History</h2>
          <div className="history-list">
            {data.history.map((h, i) => (
              <div key={h.id || i} className="history-card glow-card card-3d fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="history-header">
                  <h3>{h.book_title}</h3>
                  <span className="history-date">{h.date}</span>
                </div>
                <p className="history-chapter">Chapter {h.chapter_number}{h.chapter_title ? `: ${h.chapter_title}` : ''}</p>
                <p className="history-summary">{h.summary}</p>
                {h.key_points?.length > 0 && (
                  <details className="history-details">
                    <summary>Key Takeaways ({h.key_points.length})</summary>
                    <ul>
                      {h.key_points.map((kp, j) => (
                        <li key={j}>{kp}</li>
                      ))}
                    </ul>
                  </details>
                )}
                <p className="history-meta">{h.reading_time_minutes} min read</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(!data?.history || data.history.length === 0) && (
        <div className="empty-reading glow-card">
          <Icon name="book" style={{ fontSize: '3rem', opacity: 0.5 }} />
          <h3>No reading history yet</h3>
          <p>Schedule a book from the Library to start receiving daily summaries!</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/?page=library'}>
            <Icon name="plus" /> Browse Library
          </button>
        </div>
      )}
    </div>
  );
}

export default DailyReading;
