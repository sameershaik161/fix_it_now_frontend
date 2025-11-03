import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

export default function Header(){
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      // Poll for notifications every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notification count:', err);
    }
  };

  return (
    <header className="header">
      <div className="brand"><Link to="/">🏠 FixItNow</Link></div>
      <nav>
        <Link to="/workers">🔧 Workers</Link>
        {user && user.role === 'worker' && <Link to="/worker-dashboard">📊 Dashboard</Link>}
        {user && user.role === 'user' && <Link to="/create-request">➕ Create Request</Link>}
        {user && <Link to="/my-requests">📋 My Requests</Link>}
        {user && (
          <Link to="/notifications" style={{ position: 'relative', display: 'inline-block' }}>
            🔔 Notifications
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        )}
        {!user && <Link to="/register">✨ Register</Link>}
        {!user && <Link to="/login">🔑 Login</Link>}
        {user && <button className="link-as-button" onClick={logout}>👋 Logout</button>}
      </nav>
    </header>
  );
}
