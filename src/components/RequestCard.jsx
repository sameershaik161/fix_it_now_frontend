import React from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function RequestCard({ req, reload }) {
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
    <div className="card" style={{ position: 'relative' }}>
      <Link 
        to={`/requests/${req._id}`}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 0 
        }} 
      />
      
      <div className="request-header" style={{ position: 'relative', zIndex: 1 }}>
        <h3 className="request-title">{req.title}</h3>
        <span style={{ 
          padding: '0.25rem 0.75rem', 
          background: getStatusColor(req.status), 
          color: 'white', 
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          {req.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      
      <p style={{ color: '#4a5568', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
        {req.description?.substring(0, 100)}{req.description?.length > 100 ? '...' : ''}
      </p>
      
      <div className="request-details" style={{ position: 'relative', zIndex: 1 }}>
        {req.address && <div><strong>📍 Address:</strong> {req.address}</div>}
        <div><strong>👤 Requester:</strong> {req.requester?.name || 'Unknown'}</div>
        {req.worker && <div><strong>🔧 Worker:</strong> {req.worker?.name}</div>}
        {req.price && <div><strong>💰 Price:</strong> ${req.price}</div>}
        {req.scheduledAt && (
          <div><strong>📅 Scheduled:</strong> {new Date(req.scheduledAt).toLocaleDateString()}</div>
        )}
      </div>
      
      {req.images?.length > 0 && (
        <div style={{ marginTop: '1rem', position: 'relative', zIndex: 1 }}>
          <small style={{ color: '#718096' }}>📸 {req.images.length} image{req.images.length !== 1 ? 's' : ''} attached</small>
        </div>
      )}
      
      <div style={{ 
        marginTop: '1rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid #e2e8f0',
        position: 'relative',
        zIndex: 1
      }}>
        <Link 
          to={`/requests/${req._id}`}
          className="btn"
          style={{ width: '100%', textAlign: 'center', display: 'block' }}
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
