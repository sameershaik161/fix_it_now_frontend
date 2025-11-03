import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../api/axios';
import { toast } from 'react-toastify';

const RequestCard = ({ req, reload, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!req) return null;

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/requests/${req._id}`);
      toast.success('Request deleted successfully');
      if (onDelete) onDelete(req._id);
      if (reload) reload();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error(error.response?.data?.message || 'Failed to delete request');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="card" style={{ 
      position: 'relative',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '1.5rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      borderLeft: `4px solid ${getStatusColor(req.status)}`,
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    }}>
      {/* Overlay link for the card */}
      <Link 
        to={`/requests/${req._id}`}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 0,
          borderRadius: '8px'
        }} 
      />
      
      {/* Card header with title and status */}
      <div className="request-header" style={{ 
        position: 'relative', 
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 className="request-title" style={{ 
          margin: 0,
          color: '#2d3748',
          fontSize: '1.25rem',
          fontWeight: '600',
          flex: 1,
          marginRight: '1rem'
        }}>
          {req.title}
        </h3>
        <span style={{ 
          padding: '0.25rem 0.75rem', 
          background: getStatusColor(req.status), 
          color: 'white', 
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'capitalize',
          whiteSpace: 'nowrap'
        }}>
          {req.status.replace('_', ' ')}
        </span>
      </div>
      
      {/* Request description */}
      <p style={{ 
        color: '#4a5568', 
        marginBottom: '1rem', 
        position: 'relative', 
        zIndex: 1,
        lineHeight: '1.6'
      }}>
        {req.description?.substring(0, 120)}{req.description?.length > 120 ? '...' : ''}
      </p>
      
      {/* Request details */}
      <div className="request-details" style={{ 
        position: 'relative', 
        zIndex: 1,
        marginBottom: '1rem',
        '& > div': {
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#4a5568'
        }
      }}>
        {req.address && (
          <div>
            <span style={{ color: '#718096' }}>📍</span>
            <span>{req.address}</span>
          </div>
        )}
        <div>
          <span style={{ color: '#718096' }}>👤</span>
          <span>Requester: {req.requester?.name || 'Unknown'}</span>
        </div>
        {req.worker && (
          <div>
            <span style={{ color: '#718096' }}>🔧</span>
            <span>Worker: {req.worker?.name}</span>
          </div>
        )}
        {req.price && (
          <div>
            <span style={{ color: '#718096' }}>💰</span>
            <span>${req.price}</span>
          </div>
        )}
        {req.scheduledAt && (
          <div>
            <span style={{ color: '#718096' }}>📅</span>
            <span>{new Date(req.scheduledAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      {/* Image indicator */}
      {req.images?.length > 0 && (
        <div style={{ 
          marginTop: '0.5rem', 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#718096',
          fontSize: '0.875rem'
        }}>
          <span>📸</span>
          <span>{req.images.length} image{req.images.length !== 1 ? 's' : ''} attached</span>
        </div>
      )}
      
      {/* Action buttons */}
      <div style={{ 
        marginTop: '1.25rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid #e2e8f0',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        gap: '0.75rem'
      }}>
        <Link 
          to={`/requests/${req._id}`}
          className="btn"
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'opacity 0.2s, transform 0.2s',
            ':hover': {
              opacity: 0.9,
              transform: 'translateY(-1px)'
            }
          }}
        >
          View Details →
        </Link>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirm(true);
          }}
          disabled={isDeleting}
          style={{
            padding: '0.5rem 1rem',
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s',
            ':hover': {
              background: '#fee2e2',
              transform: 'translateY(-1px)'
            },
            ':disabled': {
              opacity: 0.7,
              cursor: 'not-allowed',
              transform: 'none'
            }
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1a202c' }}>Confirm Deletion</h3>
            <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this request? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f3f4f6',
                  color: '#4b5563',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  ':hover': {
                    background: '#e5e7eb'
                  }
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  ':hover': {
                    background: '#b91c1c'
                  },
                  ':disabled': {
                    background: '#fca5a5',
                    cursor: 'not-allowed'
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

RequestCard.propTypes = {
  req: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['open', 'assigned', 'in_progress', 'completed', 'cancelled']).isRequired,
    address: PropTypes.string,
    requester: PropTypes.shape({
      name: PropTypes.string,
    }),
    worker: PropTypes.shape({
      name: PropTypes.string,
    }),
    price: PropTypes.number,
    scheduledAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  reload: PropTypes.func,
  onDelete: PropTypes.func,
};

export default RequestCard;
