import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const res = await api.get(`/requests/${id}`);
      setRequest(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to load request');
      navigate('/my-requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    
    setStatusUpdating(true);
    try {
      await api.put(`/requests/${id}/status`, { status: newStatus });
      alert('Status updated successfully!');
      loadRequest();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAssignSelf = async () => {
    if (!confirm('Accept this service request?')) return;
    
    setStatusUpdating(true);
    try {
      await api.put(`/requests/${id}/assign`);
      alert('Request accepted! You have been assigned.');
      loadRequest();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to assign');
    } finally {
      setStatusUpdating(false);
    }
  };

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

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <div className="empty-state-text">Loading request...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <div className="empty-state-text">Request not found</div>
      </div>
    );
  }

  const isRequester = user?._id === request.requester?._id;
  const isWorker = user?._id === request.worker?._id;
  const canAssignSelf = user?.role === 'worker' && request.status === 'open' && !request.worker;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '1rem', background: '#718096' }}>
        ← Back
      </button>

      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>{request.title}</h1>
            <span style={{ 
              display: 'inline-block',
              padding: '0.25rem 0.75rem', 
              background: getStatusColor(request.status), 
              color: 'white', 
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {request.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          {request.price && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>Price</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                ${request.price}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            {request.description || 'No description provided'}
          </p>
        </div>

        {request.address && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>📍 Address</h3>
            <p style={{ color: '#4a5568' }}>{request.address}</p>
          </div>
        )}

        {request.scheduledAt && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>📅 Scheduled Date</h3>
            <p style={{ color: '#4a5568' }}>
              {new Date(request.scheduledAt).toLocaleString()}
            </p>
          </div>
        )}

        {request.images && request.images.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>📸 Images</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {request.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={`http://localhost:5000${img}`} 
                  alt={`Request ${idx + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(`http://localhost:5000${img}`, '_blank')}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>👤 Requester</h3>
            <p style={{ margin: '0.25rem 0', fontWeight: '600' }}>{request.requester?.name}</p>
            {request.requester?.phone && (
              <p style={{ margin: '0.25rem 0', color: '#718096' }}>📞 {request.requester.phone}</p>
            )}
            {request.requester?.location && (
              <p style={{ margin: '0.25rem 0', color: '#718096' }}>📍 {request.requester.location}</p>
            )}
          </div>

          {request.worker && (
            <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>🔧 Assigned Worker</h3>
              <p style={{ margin: '0.25rem 0', fontWeight: '600' }}>{request.worker.name}</p>
              {request.worker.phone && (
                <p style={{ margin: '0.25rem 0', color: '#718096' }}>📞 {request.worker.phone}</p>
              )}
              {request.worker.rating > 0 && (
                <p style={{ margin: '0.25rem 0', color: '#718096' }}>
                  ⭐ {request.worker.rating} ({request.worker.ratingsCount} reviews)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {canAssignSelf && (
            <button 
              onClick={handleAssignSelf} 
              className="btn"
              disabled={statusUpdating}
              style={{ background: '#10b981' }}
            >
              ✅ Accept This Request
            </button>
          )}

          {isWorker && request.status === 'assigned' && (
            <button 
              onClick={() => handleStatusUpdate('in_progress')} 
              className="btn"
              disabled={statusUpdating}
            >
              🚀 Start Working
            </button>
          )}

          {isWorker && request.status === 'in_progress' && (
            <button 
              onClick={() => handleStatusUpdate('completed')} 
              className="btn"
              disabled={statusUpdating}
              style={{ background: '#10b981' }}
            >
              ✅ Mark as Completed
            </button>
          )}

          {isRequester && ['open', 'assigned'].includes(request.status) && (
            <button 
              onClick={() => handleStatusUpdate('cancelled')} 
              className="btn"
              disabled={statusUpdating}
              style={{ background: '#ef4444' }}
            >
              ❌ Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
