import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'user',
    phone: '',
    location: '',
    skills: ''
  });
  const { register } = useContext(AuthContext);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data - convert skills string to array for workers
      const payload = {
        ...form,
        skills: form.role === 'worker' && form.skills 
          ? form.skills.split(',').map(s => s.trim()).filter(s => s)
          : []
      };
      
      await register(payload);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>✨ Create Account</h2>
        {error && <div className="error" style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '0.75rem', 
          borderRadius: '6px', 
          marginBottom: '1rem',
          border: '1px solid #fcc'
        }}>{error}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>
              Full Name *
            </label>
            <input name="name" placeholder="Enter your full name" required value={form.name} onChange={handle} />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>
              Email Address *
            </label>
            <input name="email" type="email" placeholder="Enter your email" required value={form.email} onChange={handle} />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>
              Password *
            </label>
            <input name="password" type="password" placeholder="Create a strong password" required value={form.password} onChange={handle} />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>
              Account Type *
            </label>
            <select name="role" value={form.role} onChange={handle} style={{ width: '100%' }}>
              <option value="user">👤 User (Request Services)</option>
              <option value="worker">🔧 Worker (Provide Services)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>
              Phone Number
            </label>
            <input 
              name="phone" 
              type="tel" 
              placeholder="Enter your phone number" 
              value={form.phone} 
              onChange={handle} 
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: 500 }}>
              Location
            </label>
            <input 
              name="location" 
              placeholder="Enter your city/area" 
              value={form.location} 
              onChange={handle} 
            />
          </div>

          {form.role === 'worker' && (
            <div style={{ 
              marginBottom: '1rem', 
              padding: '1rem', 
              background: '#eff6ff', 
              borderRadius: '8px',
              border: '1px solid #bfdbfe'
            }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e40af', fontWeight: 600 }}>
                🔧 Skills (for Workers) *
              </label>
              <input 
                name="skills" 
                placeholder="e.g., plumber, electrician, carpenter" 
                value={form.skills} 
                onChange={handle}
                required={form.role === 'worker'}
                style={{ borderColor: '#bfdbfe' }}
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#1e40af', fontSize: '0.875rem' }}>
                Enter skills separated by commas
              </small>
            </div>
          )}
          
          <button className="btn" type="submit" style={{ width: '100%', margin: 0 }}>
            Create Account
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#718096' }}>
          Already have an account? <a href="/login" style={{ color: '#667eea', fontWeight: 600 }}>Login here</a>
        </div>
      </div>
    </div>
  );
}
