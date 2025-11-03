import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function WorkerProfile(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadWorker();
    loadReviews();
  }, [id]);

  const loadWorker = async () => {
    try {
      const res = await api.get(`/workers/${id}`);
      setWorker(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load worker profile');
      navigate('/workers');
    }
  };

  const loadReviews = async () => {
    try {
      const res = await api.get(`/reviews/worker/${id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        workerId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      alert('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      loadWorker();
      loadReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if(!worker) return (
    <div className="empty-state">
      <div className="empty-state-icon">⏳</div>
      <div className="empty-state-text">Loading worker profile...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '1rem', background: '#718096' }}>
        ← Back
      </button>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>{worker.name}</h1>
            {worker.isVerified && (
              <span style={{ 
                display: 'inline-block',
                padding: '0.25rem 0.75rem', 
                background: '#10b981', 
                color: 'white', 
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                ✅ Verified
              </span>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {worker.rating?.toFixed(1) || '0.0'} ⭐
            </div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              {worker.ratingsCount || 0} review{worker.ratingsCount !== 1 ? 's' : ''}
            </div>
            {worker.completedJobs > 0 && (
              <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                {worker.completedJobs} jobs completed
              </div>
            )}
          </div>
        </div>

        {worker.skills && worker.skills.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#4a5568', display: 'block', marginBottom: '0.5rem' }}>🔧 Skills:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {worker.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag" style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {worker.location && (
          <div style={{ marginBottom: '0.5rem', color: '#4a5568' }}>
            <strong>📍 Location:</strong> {worker.location}
          </div>
        )}

        {worker.phone && (
          <div style={{ marginBottom: '0.5rem', color: '#4a5568' }}>
            <strong>📞 Phone:</strong> {worker.phone}
          </div>
        )}

        {worker.bio && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
            <strong style={{ color: '#2d3748' }}>About:</strong>
            <p style={{ marginTop: '0.5rem', color: '#4a5568', lineHeight: 1.6 }}>{worker.bio}</p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>💬 Reviews</h2>
          {user && user._id !== id && (
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn"
              style={{ background: showReviewForm ? '#718096' : '#3b82f6' }}
            >
              {showReviewForm ? 'Cancel' : '✍️ Write Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} style={{ 
            marginBottom: '2rem', 
            padding: '1.5rem', 
            background: '#f7fafc', 
            borderRadius: '8px' 
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Rating
              </label>
              <select 
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: '1px solid #e2e8f0' 
                }}
                required
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Good)</option>
                <option value="3">⭐⭐⭐ (3 - Average)</option>
                <option value="2">⭐⭐ (2 - Poor)</option>
                <option value="1">⭐ (1 - Very Poor)</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Comment
              </label>
              <textarea 
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows="4"
                placeholder="Share your experience..."
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: '1px solid #e2e8f0' 
                }}
              />
            </div>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(r => (
              <div key={r._id} style={{ 
                padding: '1rem', 
                background: '#f7fafc', 
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>
                    {r.author?.name || 'Anonymous'}
                  </span>
                  <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                    {'⭐'.repeat(r.rating)}
                  </span>
                </div>
                {r.comment && (
                  <p style={{ margin: 0, color: '#4a5568', lineHeight: 1.6 }}>{r.comment}</p>
                )}
                <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-text">No reviews yet</div>
            <p style={{ color: '#718096', marginTop: '1rem' }}>Be the first to review this worker!</p>
          </div>
        )}
      </div>
    </div>
  );
}
