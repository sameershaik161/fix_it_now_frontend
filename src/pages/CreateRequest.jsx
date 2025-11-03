import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateRequest(){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('address', address);
      if (scheduledAt) fd.append('scheduledAt', scheduledAt);
      for (let i = 0; i < files.length; i++) fd.append('images', files[i]);

      const res = await api.post('/requests', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      nav('/my-requests');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🛠️ Create Service Request</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>Request Title *</label>
            <input required placeholder="e.g., Fix leaking kitchen sink" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>Description</label>
            <textarea placeholder="Describe the issue in detail..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>Service Address</label>
            <input placeholder="Enter the full address" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>Scheduled Date & Time (Optional)</label>
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>📸 Upload Images (Optional)</label>
            <input type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} />
            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>Upload photos to help workers understand the issue better</div>
          </div>
          <button className="btn" type="submit" style={{ width: '100%', margin: 0 }}>Submit Request</button>
        </form>
      </div>
    </div>
  );
}
