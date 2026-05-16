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
        <h1><Icon name="bell" /> Notification Logs</h1>
      </div>
      
      {loading ? (
        <p className="loading">Loading logs...</p>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <h3>No notifications recorded</h3>
          <p>Your daily reading updates will appear here once they are sent.</p>
        </div>
      ) : (
        <div className="notification-table-container">
          <table className="notification-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Status</th>
                <th>Time</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className={log.status === 'failed' ? 'row-error' : ''}>
                  <td>
                    <span className={`badge badge-${log.channel}`}>{log.channel.toUpperCase()}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${log.status}`}>
                      {log.status === 'sent' ? '✅ Sent' : '❌ Failed'}
                    </span>
                  </td>
                  <td>{new Date(log.sent_at).toLocaleString()}</td>
                  <td>{log.error_message || 'No errors reported'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsPage;
