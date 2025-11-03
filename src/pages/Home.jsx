import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Smart Home Service Platform</h1>
        <p className="hero-subtitle">Find local repair workers, create service requests, upload pics, and track progress.</p>
        <div className="hero-actions">
          <Link to="/workers" className="hero-btn primary">Find Workers</Link>
          <Link to="/create-request" className="hero-btn secondary">Create Request</Link>
        </div>
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔧</div>
          <h3>Expert Workers</h3>
          <p>Connect with verified local professionals for all your home service needs.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📸</div>
          <h3>Visual Requests</h3>
          <p>Upload photos to help workers understand your needs before they arrive.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Progress</h3>
          <p>Monitor your service requests in real-time from start to completion.</p>
        </div>
      </div>
    </div>
  );
}
