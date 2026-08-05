import React from 'react';
import { Link } from 'react-router-dom';
import './HomeDonation.css';

const HomeDonationSection = () => {
  return (
    <div className="home-donation-wrapper">

      {/* Main Header */}
      <div className="home-donation-header">
        <div className="home-donation-emoji">🙏</div>
        <h2 className="home-donation-title">Donate Surplus Food</h2>
        <p className="home-donation-subtitle">
          Connect unsold food with those who need it most! Every meal matters. 💚
        </p>
      </div>

      {/* Impact Stats Section */}
      <h3 className="home-section-subtitle">🌍 Our Donation Impact</h3>
      <div className="home-impact-grid">
        <div className="home-impact-item">
          <div className="home-impact-emoji">🍱</div>
          <div className="home-impact-number">200+</div>
          <div className="home-impact-label">Meals Donated</div>
        </div>
        <div className="home-impact-item">
          <div className="home-impact-emoji">🏛️</div>
          <div className="home-impact-number">5+</div>
          <div className="home-impact-label">NGO Partners</div>
        </div>
        <div className="home-impact-item">
          <div className="home-impact-emoji">👶</div>
          <div className="home-impact-number">100+</div>
          <div className="home-impact-label">Children Fed</div>
        </div>
        <div className="home-impact-item">
          <div className="home-impact-emoji">🌱</div>
          <div className="home-impact-number">50kg</div>
          <div className="home-impact-label">Food Waste Saved</div>
        </div>
      </div>

      {/* How It Works Section */}
      <h3 className="home-section-subtitle">How Donation Works</h3>
      <div className="home-how-steps">
        <div className="home-how-step">
          <div className="home-how-emoji">🍱</div>
          <h4 className="home-how-title">Partner Lists Food</h4>
          <p className="home-how-desc">
            Restaurant partner has unsold food near closing time
          </p>
        </div>
        <div className="home-how-step">
          <div className="home-how-emoji">🤝</div>
          <h4 className="home-how-title">Selects Center</h4>
          <p className="home-how-desc">
            Partner selects NGO, Orphanage or Shelter Home to donate food
          </p>
        </div>
        <div className="home-how-step">
          <div className="home-how-emoji">🚗</div>
          <h4 className="home-how-title">Center Collects</h4>
          <p className="home-how-desc">
            Donation center collects food and distributes to those in need! 🙏
          </p>
        </div>
      </div>

      {/* Route Redirect Button */}
      <div className="home-donation-cta">
        <Link to="/donations" className="home-donation-btn">
          Donate Surplus Food Now ➔
        </Link>
      </div>

    </div>
  );
};

export default HomeDonationSection;