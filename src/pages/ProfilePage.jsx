import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, getRestaurantOrders } from '../services/orderService';
import { getMyListings } from '../services/foodService';
import api from '../services/api';
import './Profile.css';

const getGreenLevel = (score) => {
  if (score >= 200) return { level: 'Earth Guardian', emoji: '🌍', max: 200 };
  if (score >= 101) return { level: 'Tree', emoji: '🌳', max: 200 };
  if (score >= 51) return { level: 'Sprout', emoji: '🌿', max: 100 };
  return { level: 'Seedling', emoji: '🌱', max: 50 };
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'CUSTOMER') {
        const result = await getMyOrders();
        if (result.success) setOrders(result.data || []);
      } else if (user?.role === 'PARTNER') {
        // Partner Data Fetching
        const listingsRes = await getMyListings();
        const ordersRes = await getRestaurantOrders();
        
        if (listingsRes.success) {
          const allListings = Array.isArray(listingsRes.data) ? listingsRes.data : [];
          setListings(allListings.filter(l => l.status !== 'REMOVED'));
        }
        
        if (ordersRes.success) setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);

        try {
          const restRes = await api.get('/restaurants/my');
          setRestaurant(restRes.data);
        } catch (err) {
          setRestaurant(null);
        }
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
    }
    setLoading(false);
  };

  // Calculations for Customer
  const greenScore = orders.reduce((sum, o) => o.status === 'DELIVERED' ? sum + (o.greenPointsEarned || 0) : sum, 0);
  const totalSaved = orders.reduce((sum, o) => o.status === 'DELIVERED' ? sum + (((o.foodListing?.originalPrice || 0) - (o.foodListing?.discountedPrice || 0)) * o.quantity) : sum, 0);
  const greenLevel = getGreenLevel(greenScore);
  const progressPercent = Math.min((greenScore / greenLevel.max) * 100, 100);

  // Calculations for Partner
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="profile-page">
      {/* 1. Profile Header (Owner & Account Details) */}
      <div className="profile-header">
        <div className="profile-avatar">{user?.role === 'PARTNER' ? '🍽️' : '👤'}</div>
        <h1 className="profile-name">{user?.name || user?.email?.split('@')[0]}</h1>
        <p className="profile-email">{user?.email}</p>
        <span className="role-badge">{user?.role}</span>
      </div>

      <div className="profile-container">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            {/* ================= PARTNER PROFILE SECTION ================= */}
            {user?.role === 'PARTNER' && (
              <>
                {/* 2. Restaurant Profile Card */}
                <div className="profile-details-card" style={{ marginBottom: '24px' }}>
                  <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🏪 Restaurant Profile</span>
                    {restaurant && (
                      <span className={`status-badge ${restaurant.status === 'APPROVED' ? 'badge-available' : 'badge-pending'}`}>
                        {restaurant.status}
                      </span>
                    )}
                  </div>

                  {restaurant ? (
                    <div style={{ padding: '10px 0' }}>
                      <h3 style={{ margin: '0 0 12px 0', color: '#2d6a4f', fontSize: '20px' }}>{restaurant.name}</h3>
                      <p style={{ margin: '6px 0' }}><strong>🍽️ Cuisine:</strong> {restaurant.cuisine || 'N/A'}</p>
                      <p style={{ margin: '6px 0' }}><strong>📍 Address:</strong> {restaurant.address || 'N/A'}</p>
                      <p style={{ margin: '6px 0' }}><strong>📞 Contact:</strong> {restaurant.phone || 'N/A'}</p>
                      {restaurant.fssaiLicense && (
                        <p style={{ margin: '6px 0' }}><strong>🏛️ FSSAI License:</strong> {restaurant.fssaiLicense}</p>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: '#e63946', padding: '10px 0' }}>
                      ⚠️ Restaurant details not added yet! Please register on Partner Dashboard.
                    </p>
                  )}
                </div>

                {/* 3. Business Overview Stats */}
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-item-emoji">🍱</div>
                    <div className="stat-item-value">{listings.length}</div>
                    <div className="stat-item-label">Total Listings</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-item-emoji">📦</div>
                    <div className="stat-item-value">{deliveredOrders.length}</div>
                    <div className="stat-item-label">Delivered Orders</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-item-emoji">💰</div>
                    <div className="stat-item-value">₹{Math.round(totalRevenue)}</div>
                    <div className="stat-item-label">Total Revenue</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-item-emoji">🙏</div>
                    <div className="stat-item-value">{listings.filter(l => l.status === 'DONATED').length}</div>
                    <div className="stat-item-label">Donated Items</div>
                  </div>
                </div>

                {/* 4. Quick Action Link */}
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <Link 
                    to="/partner/dashboard" 
                    className="add-food-btn" 
                    style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '12px 30px', fontSize: '16px' }}
                  >
                    ⚙️ Go to Partner Dashboard
                  </Link>
                </div>
              </>
            )}

            {/* ================= CUSTOMER PROFILE SECTION ================= */}
            {user?.role === 'CUSTOMER' && (
              <>
                <div className="green-score-card">
                  <div className="green-score-header">
                    <h3 className="green-score-title">🌱 Green Score</h3>
                    <span className="green-level-badge">{greenLevel.emoji} {greenLevel.level}</span>
                  </div>

                  <div className="green-score-display">
                    <div className="green-score-number">{greenScore}</div>
                    <div className="green-score-info">
                      <p className="green-score-label">{greenScore} / {greenLevel.max} points to next level</p>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <p className="progress-text">{Math.round(progressPercent)}% to {greenLevel.level}</p>
                    </div>
                  </div>

                  <div className="green-impact">
                    <div className="impact-item">
                      <div className="impact-emoji">🌿</div>
                      <div className="impact-value">{(greenScore * 0.016).toFixed(1)}kg</div>
                      <div className="impact-label">CO2 Saved</div>
                    </div>
                    <div className="impact-item">
                      <div className="impact-emoji">🍱</div>
                      <div className="impact-value">{deliveredOrders.length}</div>
                      <div className="impact-label">Meals Rescued</div>
                    </div>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-item-emoji">📦</div>
                    <div className="stat-item-value">{orders.length}</div>
                    <div className="stat-item-label">Total Orders</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-item-emoji">💰</div>
                    <div className="stat-item-value">₹{Math.round(totalSaved)}</div>
                    <div className="stat-item-label">Money Saved</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-item-emoji">🌱</div>
                    <div className="stat-item-value">{greenScore}</div>
                    <div className="stat-item-label">Green Points</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-item-emoji">✅</div>
                    <div className="stat-item-value">{deliveredOrders.length}</div>
                    <div className="stat-item-label">Delivered</div>
                  </div>
                </div>
              </>
            )}

            {/* Profile Account Details Card for all roles */}
            <div className="profile-details-card" style={{ marginTop: '24px' }}>
              <div className="card-title">👤 Account Details</div>
              <div className="detail-item">
                <div className="detail-icon">📧</div>
                <div className="detail-content">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{user?.email}</div>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">🎭</div>
                <div className="detail-content">
                  <div className="detail-label">Role</div>
                  <div className="detail-value">{user?.role}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;