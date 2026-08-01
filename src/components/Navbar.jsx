import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser, isAdmin, isPartner, isCustomer } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          🌱 Feedwell
        </Link>

        {/* Hamburger Menu */}
        <button 
          className="hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          
          {/* Public Links */}
          <Link to="/" className="nav-link">
            🏠 Home
          </Link>

          {!user && (
            <>
              <Link to="/food" className="nav-link">
                🍱 Browse Food
              </Link>
              <Link to="/donate" className="nav-link">
                🙏 Donate
              </Link>
            </>
          )}

          {/* Customer Links */}
          {user && isCustomer() && (
            <>
              <Link to="/food" className="nav-link">
                🍱 Browse Food
              </Link>
              <Link to="/donate" className="nav-link">
                🙏 Donate
              </Link>
              <Link to="/cart" className="nav-link">
                🛒 Cart
                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="nav-link">
                📦 Orders
              </Link>
            </>
          )}

          {/* Partner Links */}
          {user && isPartner() && (
            <>
              <Link to="/food" className="nav-link">
                🍱 Browse Food
              </Link>
            </>
          )}

          {/* Admin Links */}
          {user && isAdmin() && (
            <>
              <Link to="/food" className="nav-link">
                🍱 Browse Food
              </Link>
            </>
          )}

          {/* User Section */}
          {user && (
            <div className="user-section">
              <span className="user-email">
                👤 {user.email}
              </span>
              <Link to="/profile" className="nav-link">
                📋 Profile
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="nav-link admin-link">
                  ⚙️ Admin
                </Link>
              )}
              {isPartner() && (
                <Link to="/partner" className="nav-link partner-link">
                  🍽️ Dashboard
                </Link>
              )}
              <button 
                className="logout-btn" 
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}

          {/* Not Logged In */}
          {!user && (
            <div className="auth-section">
              <Link to="/login" className="nav-link login-link">
                🔑 Login
              </Link>
              <Link to="/register" className="nav-register-btn">
                📝 Register
              </Link>
            </div>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;