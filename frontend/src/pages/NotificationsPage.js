import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import Icon from '../components/Icon';

const NotificationsPage = () => {
  const { user } = useApp();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api(`/api/reading/notifications?user_id=${user?.id || 1}`);
        setLogs(data);
      } catch (e) {
        console.error("Failed to fetch notifications:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  return (
    <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1><Icon name="bell" /> Notifications</h1>
      </div>
      
      {loading ? (
        <p className="loading">Loading logs...</p>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <h3>No notifications yet</h3>
          <p>Your daily reading updates will appear here.</p>
        </div>
      ) : (
        <div className="history-list">
          {logs.map(log => (
            <motion.div key={log.id} className="history-card glow-card" initial={{ y: 20 }} animate={{ y: 0 }}>
              <div className="history-header">
                <span className={`badge badge-${log.status}`}>{log.channel.toUpperCase()}</span>
                <span className="history-date">{new Date(log.sent_at).toLocaleString()}</span>
              </div>
              <p>Status: {log.status}</p>
              {log.error_message && <p className="error-text">Error: {log.error_message}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsPage;
