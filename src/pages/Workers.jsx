import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import WorkerCard from '../components/WorkerCard';

export default function Workers(){
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    skills: '',
    location: '',
    minRating: '',
    sort: '-rating'
  });

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.skills) params.skills = filters.skills;
      if (filters.location) params.location = filters.location;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.sort) params.sort = filters.sort;
      
      const res = await api.get('/workers', { params });
      setWorkers(res.data.workers || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    load();
  };

  const handleReset = () => {
    setFilters({
      search: '',
      skills: '',
      location: '',
      minRating: '',
      sort: '-rating'
    });
    setTimeout(() => load(), 100);
  };

  return (
    <div>
      <h2>Find Expert Workers</h2>
      
      <div className="filters-container" style={{ 
        background: '#f7fafc', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginBottom: '2rem' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            placeholder="Search by name" 
            value={filters.search} 
            onChange={e => handleFilterChange('search', e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          />
          <input 
            placeholder="Skills (e.g., plumber, electrician)" 
            value={filters.skills} 
            onChange={e => handleFilterChange('skills', e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          />
          <input 
            placeholder="Location" 
            value={filters.location} 
            onChange={e => handleFilterChange('location', e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          />
          <select 
            value={filters.minRating} 
            onChange={e => handleFilterChange('minRating', e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          >
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
          <select 
            value={filters.sort} 
            onChange={e => handleFilterChange('sort', e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
          >
            <option value="-rating">Highest Rated</option>
            <option value="rating">Lowest Rated</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleSearch} className="btn" style={{ flex: 1 }}>
            🔍 Search
          </button>
          <button onClick={handleReset} className="btn" style={{ flex: 1, background: '#718096' }}>
            🔄 Reset
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Loading workers...</div>
        </div>
      ) : workers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">No workers found</div>
          <p style={{ color: '#718096', marginTop: '1rem' }}>Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '1rem', color: '#718096' }}>
            Found {workers.length} worker{workers.length !== 1 ? 's' : ''}
          </p>
          <div className="grid">
            {workers.map(w => <WorkerCard key={w._id} worker={w} />)}
          </div>
        </>
      )}
    </div>
  );
}
