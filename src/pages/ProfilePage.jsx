import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/orderService';
import './Profile.css';

const getGreenLevel = (score) => {
  if (score >= 200) return { level: 'Earth Guardian', emoji: '🌍', max: 200 };
  if (score >= 101) return { level: 'Tree', emoji: '🌳', max: 200 };
  if (score >= 51) return { level: 'Sprout', emoji: '🌿', max: 100 };
  return { level: 'Seedling', emoji: '🌱', max: 50 };
};

const getRoleAvatar = (role) => {
  switch(role) {
    case 'CUSTOMER': return '👤';
    case 'PARTNER': return '🍽️';
    case 'ADMIN': return '⚙️';
    case 'DELIVERY': return '🚴';
    default: return '👤';
  }
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const result = await getMyOrders();
    setLoading(false);
    if (result.success) {
      setOrders(result.data);
    }
  };

  const greenScore = orders.reduce((sum, o) => o.status === 'DELIVERED' ? sum + o.greenPointsEarned : sum, 0);
  const totalSaved = orders.reduce((sum, o) => o.status === 'DELIVERED' ? sum + ((o.foodListing?.originalPrice - o.foodListing?.discountedPrice) * o.quantity) : sum, 0);

  const greenLevel = getGreenLevel(greenScore);
  const progressPercent = Math.min((greenScore / greenLevel.max) * 100, 100);

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{getRoleAvatar(user?.role)}</div>
        <h1 className="profile-name">{user?.name || user?.email?.split('@')[0]}</h1>
        <p className="profile-email">{user?.email}</p>
        <span className="role-badge">{user?.role}</span>
      </div>

      <div className="profile-container">
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
              <div className="impact-value">{orders.filter(o => o.status === 'DELIVERED').length}</div>
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
            <div className="stat-item-value">{orders.filter(o => o.status === 'DELIVERED').length}</div>
            <div className="stat-item-label">Delivered</div>
          </div>
        </div>

        {!loading && recentOrders.length > 0 && (
          <div className="recent-orders-card">
            <div className="card-title">
              <span>📋 Recent Orders</span>
              <Link to="/orders" className="view-all-link">View All →</Link>
            </div>
            {recentOrders.map(order => (
              <div key={order.id} className="recent-order-item">
                <div className="recent-order-emoji">🍱</div>
                <div className="recent-order-details">
                  <div className="recent-order-name">{order.foodListing?.name || 'Food Item'}</div>
                  <div className="recent-order-date">{new Date(order.createdAt).toLocaleDateString('en-IN')} • {order.status}</div>
                </div>
                <div className="recent-order-price">₹{order.totalPrice}</div>
              </div>
            ))}
          </div>
        )}

        <div className="profile-details-card">
          <div className="card-title">👤 Profile Details</div>
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
      </div>
    </div>
  );
};

export default ProfilePage;