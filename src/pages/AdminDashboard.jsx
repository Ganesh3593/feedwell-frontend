import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if admin on mount
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, restsRes, ordersRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/restaurants/all'),
        api.get('/orders/all')
      ]);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setRestaurants(Array.isArray(restsRes.data) ? restsRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setUsers([]);
      setRestaurants([]);
      setOrders([]);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/restaurants/${id}/approve`);
      fetchAllData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/restaurants/${id}/reject`);
      fetchAllData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN');
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'CUSTOMER': return 'badge-customer';
      case 'PARTNER': return 'badge-partner';
      case 'ADMIN': return 'badge-admin';
      default: return 'badge-customer';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'PENDING': return 'badge-pending';
      case 'APPROVED': return 'badge-approved';
      case 'REJECTED': return 'badge-rejected';
      case 'PLACED': return 'badge-placed';
      case 'DELIVERED': return 'badge-delivered';
      case 'PREPARING': return 'badge-preparing';
      default: return 'badge-pending';
    }
  };

  const usersArray = Array.isArray(users) ? users : [];
  const restaurantsArray = Array.isArray(restaurants) ? restaurants : [];
  const ordersArray = Array.isArray(orders) ? orders : [];

  return (
    <div className="admin-page">
      {/* NAVBAR */}
      <div className="admin-navbar">
        <div className="admin-navbar-content">
          {/* <h2>🌱 Feedwell Admin</h2> */}
          <div className="admin-navbar-right">
             </div>
        </div>
      </div>

      <div className="admin-header">
        <div className="admin-header-top">
          <div>
            <h1 className="admin-title">⚙️ Admin Dashboard</h1>
            <p className="admin-subtitle">Manage Feedwell platform</p>
          </div>
          <div className="admin-badge">👤 Admin Panel</div>
        </div>
      </div>

      <div className="admin-container">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            {/* STATS */}
            <div className="admin-stats">
              <div className="admin-stat-card">
                <div className="admin-stat-icon icon-green">👥</div>
                <div className="admin-stat-info">
                  <div className="admin-stat-number">{usersArray.length}</div>
                  <div className="admin-stat-label">Total Users</div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon icon-blue">🏪</div>
                <div className="admin-stat-info">
                  <div className="admin-stat-number">{restaurantsArray.length}</div>
                  <div className="admin-stat-label">Restaurants</div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon icon-orange">📦</div>
                <div className="admin-stat-info">
                  <div className="admin-stat-number">{ordersArray.length}</div>
                  <div className="admin-stat-label">Total Orders</div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon icon-purple">⏳</div>
                <div className="admin-stat-info">
                  <div className="admin-stat-number">{restaurantsArray.filter(r => r.status === 'PENDING').length}</div>
                  <div className="admin-stat-label">Pending</div>
                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="admin-tabs">
              <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Users</button>
              <button className={`admin-tab ${activeTab === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('restaurants')}>🏪 Restaurants</button>
              <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>📦 Orders</button>
            </div>

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="admin-section">
                <div className="admin-section-header">
                  <h3 className="admin-section-title">👥 All Users</h3>
                  <span className="admin-count-badge">{usersArray.length} users</span>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Green Score</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersArray.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span className={`status-badge ${getRoleBadgeClass(user.role)}`}>{user.role}</span></td>
                        <td>🌱 {user.greenScore}</td>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* RESTAURANTS TAB */}
            {activeTab === 'restaurants' && (
              <div className="admin-section">
                <div className="admin-section-header">
                  <h3 className="admin-section-title">🏪 All Restaurants</h3>
                  <span className="admin-count-badge">{restaurantsArray.filter(r => r.status === 'PENDING').length} pending</span>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Restaurant</th>
                      <th>Owner</th>
                      <th>Cuisine</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurantsArray.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.owner?.name || r.owner?.email || 'Unknown'}</td>
                        <td>{r.cuisine}</td>
                        <td><span className={`status-badge ${getStatusBadgeClass(r.status)}`}>{r.status}</span></td>
                        <td>
                          {r.status === 'PENDING' && (
                            <>
                              <button className="action-btn btn-approve" onClick={() => handleApprove(r.id)}>✅ Approve</button>
                              <button className="action-btn btn-reject" onClick={() => handleReject(r.id)}>❌ Reject</button>
                            </>
                          )}
                          {r.status !== 'PENDING' && (
                            <span style={{ fontSize: '13px', color: '#6c757d' }}>
                              {r.status === 'APPROVED' ? '✅ Approved' : '❌ Rejected'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="admin-section">
                <div className="admin-section-header">
                  <h3 className="admin-section-title">📦 All Orders</h3>
                  <span className="admin-count-badge">{ordersArray.length} orders</span>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Food</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersArray.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer?.name || order.customer?.email || 'Customer'}</td>
                        <td>{order.foodListing?.name || 'Food'}</td>
                        <td>₹{order.totalPrice}</td>
                        <td><span className={`status-badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span></td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;