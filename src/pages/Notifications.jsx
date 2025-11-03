import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? { unreadOnly: 'true' } : {};
      const res = await api.get('/notifications', { params });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      loadNotifications();
    } catch (err) {
      console.error(err);
      alert('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    if (!confirm('Delete this notification?')) return;
    try {
      await api.delete(`/notifications/${id}`);
      loadNotifications();
    } catch (err) {
      console.error(err);
      alert('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      request_assigned: '👷',
      status_update: '📊',
      new_review: '⭐',
      worker_verified: '✅',
      general: '🔔'
    };
    return icons[type] || '🔔';
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Notifications</h1>
          {unreadCount > 0 && (
            <p style={{ margin: 0, color: '#718096' }}>
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {notifications.length > 0 && unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn" style={{ background: '#10b981' }}>
            ✅ Mark All Read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setFilter('all')}
          className="btn"
          style={{ 
            background: filter === 'all' ? '#3b82f6' : '#e2e8f0',
            color: filter === 'all' ? 'white' : '#2d3748'
          }}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className="btn"
          style={{ 
            background: filter === 'unread' ? '#3b82f6' : '#e2e8f0',
            color: filter === 'unread' ? 'white' : '#2d3748'
          }}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Loading notifications...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <div className="empty-state-text">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </div>
          <p style={{ color: '#718096', marginTop: '1rem' }}>
            You'll receive notifications about your service requests here
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map(notif => (
            <div 
              key={notif._id}
              style={{ 
                background: notif.isRead ? 'white' : '#eff6ff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: notif.isRead ? '4px solid #e2e8f0' : '4px solid #3b82f6',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>
                  {getNotificationIcon(notif.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{notif.title}</h3>
                    <span style={{ fontSize: '0.875rem', color: '#718096', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                      {getTimeAgo(notif.createdAt)}
                    </span>
                  </div>
                  
                  <p style={{ margin: 0, color: '#4a5568', lineHeight: '1.6' }}>
                    {notif.message}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    {notif.relatedRequest && (
                      <Link 
                        to={`/requests/${notif.relatedRequest}`}
                        className="btn"
                        style={{ 
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          background: '#3b82f6'
                        }}
                      >
                        View Request →
                      </Link>
                    )}
                    
                    {!notif.isRead && (
                      <button 
                        onClick={() => markAsRead(notif._id)}
                        className="btn"
                        style={{ 
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          background: '#10b981'
                        }}
                      >
                        Mark as Read
                      </button>
                    )}
                    
                    <button 
                      onClick={() => deleteNotification(notif._id)}
                      className="btn"
                      style={{ 
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        background: '#ef4444'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
