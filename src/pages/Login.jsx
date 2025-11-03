import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🔑 Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>Email Address</label>
            <input name="email" type="email" placeholder="Enter your email" required value={form.email} onChange={handle} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>Password</label>
            <input name="password" type="password" placeholder="Enter your password" required value={form.password} onChange={handle} />
          </div>
          <button className="btn" type="submit" style={{ width: '100%', margin: 0 }}>Login</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#718096' }}>
          Don't have an account? <a href="/register" style={{ color: '#667eea', fontWeight: 600 }}>Register here</a>
        </div>
      </div>
    </div>
  );
}
