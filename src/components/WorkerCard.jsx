import React from 'react';
import { Link } from 'react-router-dom';

export default function WorkerCard({ worker }){
  return (
    <div className="card small">
      <div className="worker-head">
        <strong>{worker.name}</strong>
        <div style={{ fontSize: '0.875rem', color: '#667eea', marginTop: '0.25rem' }}>
          {worker.skills?.slice(0, 3).join(' • ')}
          {worker.skills?.length > 3 && ' ...'}
        </div>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>
          <strong>📍</strong> {worker.location || 'Not specified'}
        </div>
        <div style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600 }}>
          <strong>⭐</strong> {worker.rating?.toFixed?.(1) || '0.0'} / 5.0
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link to={`/workers/${worker._id}`} style={{ 
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'all 0.3s',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>View Profile →</Link>
      </div>
    </div>
  );
}
