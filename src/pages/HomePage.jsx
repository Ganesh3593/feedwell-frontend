import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const HomePage = () => {
  return (
    <div>

      {/* ===========================
          Hero Section
      =========================== */}
      <section className="hero-section">
        <div className="hero-content">

          <div className="hero-emoji">🍱</div>

          <h1 className="hero-title">
            Every Meal <span>Finds</span>
            <br />a Plate
          </h1>

          <p className="hero-subtitle">
            Rescue surplus food from restaurants
            at 40-60% discount. Save money,
            reduce waste, earn Green Score! 🌱
          </p>

          <div className="hero-buttons">
            <Link
              to="/food"
              className="hero-btn-primary">
              🍱 Browse Food
            </Link>
            <Link
              to="/register"
              className="hero-btn-secondary">
              🌱 Join Feedwell
            </Link>
          </div>

        </div>
      </section>

      {/* ===========================
          Stats Section
      =========================== */}
      <section className="stats-section">
        <div className="stats-container">

          <div className="stat-card">
            <div className="stat-emoji">🍱</div>
            <div className="stat-number">500+</div>
            <div className="stat-label">
              Meals Saved
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-emoji">🏪</div>
            <div className="stat-number">50+</div>
            <div className="stat-label">
              Restaurant Partners
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-emoji">👥</div>
            <div className="stat-number">1000+</div>
            <div className="stat-label">
              Happy Customers
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-emoji">🌱</div>
            <div className="stat-number">200kg</div>
            <div className="stat-label">
              CO2 Saved
            </div>
          </div>

        </div>
      </section>

      {/* ===========================
          How It Works Section
      =========================== */}
      <section className="how-section">
        <div className="section-header">
          <div className="section-tag">
            How It Works
          </div>
          <h2 className="section-title">
            3 Simple Steps
          </h2>
          <p className="section-subtitle">
            From restaurant to your plate
            in minutes!
          </p>
        </div>

        <div className="steps-container">

          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-emoji">🏪</div>
            <h3 className="step-title">
              Restaurant Lists Food
            </h3>
            <p className="step-desc">
              Partner restaurants list their
              surplus food at discounted prices
              before closing time.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-emoji">🛒</div>
            <h3 className="step-title">
              Customer Orders
            </h3>
            <p className="step-desc">
              Browse available food near you
              and order at 40-60% discount
              before it expires!
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-emoji">🌱</div>
            <h3 className="step-title">
              Earn Green Score
            </h3>
            <p className="step-desc">
              Every order earns you eco points.
              Track your environmental impact
              and save the planet!
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          Features Section
      =========================== */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-tag">
            Why Feedwell
          </div>
          <h2 className="section-title">
            Save Food. Save Money.
            Save Planet.
          </h2>
          <p className="section-subtitle">
            Join thousands of conscious
            consumers today!
          </p>
        </div>

        <div className="features-container">

          <div className="feature-card">
            <div className="feature-emoji">
              💰
            </div>
            <h3 className="feature-title">
              Save Money
            </h3>
            <p className="feature-desc">
              Get restaurant quality food
              at 40-60% discounted prices!
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-emoji">
              🌱
            </div>
            <h3 className="feature-title">
              Save Planet
            </h3>
            <p className="feature-desc">
              Reduce food waste and
              carbon footprint with
              every order!
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-emoji">
              ⚡
            </div>
            <h3 className="feature-title">
              Fast Delivery
            </h3>
            <p className="feature-desc">
              Fresh food delivered quickly
              right to your doorstep!
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-emoji">
              🏆
            </div>
            <h3 className="feature-title">
              Green Score
            </h3>
            <p className="feature-desc">
              Earn eco points on every
              order and track your
              environmental impact!
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          Footer
      =========================== */}
      <footer className="footer">
        <div className="footer-logo">
          🌱 Feedwell
        </div>
        <p className="footer-tagline">
          "Every meal finds a plate"
        </p>
        <p className="footer-copy">
          © 2025 Feedwell. All rights reserved.
          Made with 💚 for a better planet.
        </p>
      </footer>

    </div>
  );
};

export default HomePage;