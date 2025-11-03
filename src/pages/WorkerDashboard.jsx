import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function WorkerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get('/workers/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <div className="empty-state-text">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <div className="empty-state-text">Failed to load dashboard</div>
      </div>
    );
  }

  const { stats, recentRequests } = dashboard;

  const StatCard = ({ icon, label, value, color = '#3b82f6' }) => (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color, marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ color: '#718096', fontSize: '0.875rem' }}>{label}</div>
    </div>
  );

  const getStatusColor = (status) => {
    const colors = {
      open: '#f59e0b',
      assigned: '#3b82f6',
      in_progress: '#8b5cf6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#718096';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>Worker Dashboard</h1>
          <p style={{ margin: 0, color: '#718096' }}>Track your performance and manage jobs</p>
        </div>
        {stats.isVerified && (
          <span style={{ 
            padding: '0.5rem 1rem', 
            background: '#10b981', 
            color: 'white', 
            borderRadius: '20px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ✅ Verified Worker
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard icon="💼" label="Total Jobs" value={stats.totalJobs} color="#3b82f6" />
        <StatCard icon="✅" label="Completed" value={stats.completedJobs} color="#10b981" />
        <StatCard icon="🚀" label="In Progress" value={stats.inProgressJobs} color="#8b5cf6" />
        <StatCard icon="📋" label="Assigned" value={stats.assignedJobs} color="#f59e0b" />
        <StatCard icon="💰" label="Total Earnings" value={`$${stats.totalEarnings}`} color="#059669" />
        <StatCard icon="⭐" label="Average Rating" value={stats.averageRating.toFixed(1)} color="#f59e0b" />
        <StatCard icon="💬" label="Total Reviews" value={stats.totalReviews} color="#6366f1" />
      </div>

      {/* Completion Rate */}
      {stats.totalJobs > 0 && (
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Completion Rate</h3>
          <div style={{ position: 'relative', height: '30px', background: '#e2e8f0', borderRadius: '15px', overflow: 'hidden' }}>
            <div style={{ 
              position: 'absolute',
              height: '100%',
              width: `${(stats.completedJobs / stats.totalJobs) * 100}%`,
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              {((stats.completedJobs / stats.totalJobs) * 100).toFixed(0)}%
            </div>
          </div>
          <p style={{ marginTop: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
            {stats.completedJobs} out of {stats.totalJobs} jobs completed
          </p>
        </div>
      )}

      {/* Recent Requests */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Recent Requests</h2>
        
        {recentRequests && recentRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentRequests.map(req => (
              <Link 
                key={req._id} 
                to={`/requests/${req._id}`}
                style={{ 
                  textDecoration: 'none',
                  padding: '1rem',
                  background: '#f7fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'transform 0.2s',
                  border: '1px solid #e2e8f0'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div>
                  <h3 style={{ margin: 0, marginBottom: '0.25rem', color: '#2d3748' }}>{req.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#718096' }}>
                    {req.requester?.name} • {req.requester?.location || 'No location'}
                  </p>
                  {req.price && (
                    <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', color: '#10b981' }}>
                      ${req.price}
                    </p>
                  )}
                </div>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  background: getStatusColor(req.status), 
                  color: 'white', 
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  {req.status.replace('_', ' ').toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No recent requests</div>
          </div>
        )}
      </div>
    </div>
  );
}
