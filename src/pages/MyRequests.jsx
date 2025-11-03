import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import RequestCard from '../components/RequestCard';

export default function MyRequests(){
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests');
      setRequests(res.data.requests || res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>My Service Requests</h2>
      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Loading requests...</div>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">No requests found</div>
          <p style={{ color: '#718096', marginTop: '1rem' }}>Create your first service request to get started</p>
        </div>
      ) : (
        <div>
          {requests.map(r => <RequestCard key={r._id} req={r} reload={load} />)}
        </div>
      )}
    </div>
  );
}
