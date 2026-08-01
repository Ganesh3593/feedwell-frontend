import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../services/orderService';
import './Orders.css';

const formatStatus = (status) => {
  switch(status) {
    case 'PLACED': return '📋 Placed';
    case 'PREPARING': return '👨‍🍳 Preparing';
    case 'OUT_FOR_DELIVERY': return '🚴 On the Way';
    case 'DELIVERED': return '✅ Delivered';
    case 'CANCELLED': return '❌ Cancelled';
    default: return status;
  }
};

const getStatusClass = (status) => {
  switch(status) {
    case 'PLACED': return 'status-placed';
    case 'PREPARING': return 'status-preparing';
    case 'OUT_FOR_DELIVERY': return 'status-out';
    case 'DELIVERED': return 'status-delivered';
    case 'CANCELLED': return 'status-cancelled';
    default: return 'status-placed';
  }
};

const getStepIndex = (status) => {
  switch(status) {
    case 'PLACED': return 0;
    case 'PREPARING': return 1;
    case 'OUT_FOR_DELIVERY': return 2;
    case 'DELIVERED': return 3;
    default: return 0;
  }
};

const trackerSteps = [
  { key: 'PLACED', label: 'Placed', emoji: '📋' },
  { key: 'PREPARING', label: 'Preparing', emoji: '👨‍🍳' },
  { key: 'OUT_FOR_DELIVERY', label: 'On Way', emoji: '🚴' },
  { key: 'DELIVERED', label: 'Delivered', emoji: '✅' }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getMyOrders();
    setLoading(false);
    if (result.success) {
      setOrders(Array.isArray(result.data) ? result.data : []);
    } else {
      setError(result.message);
      setOrders([]);
    }
  };

  const handleCancel = async (orderId) => {
    const result = await cancelOrder(orderId);
    if (result.success) {
      fetchOrders();
    } else {
      alert(result.message);
    }
  };

  const ordersArray = Array.isArray(orders) ? orders : [];
  const filteredOrders = activeFilter === 'All'
    ? ordersArray
    : activeFilter === 'Active'
    ? ordersArray.filter(o => o.status === 'PLACED' || o.status === 'PREPARING' || o.status === 'OUT_FOR_DELIVERY')
    : ordersArray.filter(o => o.status === activeFilter);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-header-title">📦 My Orders</h1>
        <p className="orders-header-subtitle">{ordersArray.length} total orders</p>
      </div>

      <div className="orders-filter">
        <div className="orders-filter-container">
          {['All', 'Active', 'DELIVERED', 'CANCELLED'].map(f => (
            <button key={f} className={`order-filter-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
              {f === 'All' && '🍽️ '}
              {f === 'Active' && '⏳ '}
              {f === 'DELIVERED' && '✅ '}
              {f === 'CANCELLED' && '❌ '}
              {f === 'DELIVERED' ? 'Delivered' : f === 'CANCELLED' ? 'Cancelled' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-container">
        {loading && <div className="spinner"></div>}
        {error && !loading && <div style={{ textAlign: 'center', color: '#e63946', padding: '40px' }}>❌ {error}</div>}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="empty-orders">
            <div className="empty-orders-emoji">📦</div>
            <h3 className="empty-orders-title">No orders found!</h3>
            <p className="empty-orders-subtitle">Place your first order today!</p>
            <Link to="/food" className="browse-food-btn">🍱 Browse Food</Link>
          </div>
        )}

        {!loading && filteredOrders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div>
                <div className="order-id">Order #{order.id}</div>
                <div className="order-date">📅 {new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
              <div className={`status-badge ${getStatusClass(order.status)}`}>
                {formatStatus(order.status)}
              </div>
            </div>

            <div className="order-card-body">
              <div className="order-food-emoji">🍱</div>
              <div className="order-food-details">
                <h3 className="order-food-name">{order.foodListing?.name || 'Food Item'}</h3>
                <p className="order-restaurant">🏪 {order.foodListing?.restaurant?.name || 'Restaurant'}</p>
                <div className="order-meta">
                  <span className="order-meta-item">📦 Qty: {order.quantity}</span>
                  <span className="order-meta-item">📍 {order.deliveryAddress}</span>
                </div>
              </div>
              <div className="order-total">₹{order.totalPrice}</div>
            </div>

            {order.greenPointsEarned > 0 && (
              <div className="order-green-points">🌱 +{order.greenPointsEarned} Green Points Earned</div>
            )}

            {order.status === 'PLACED' && (
              <button onClick={() => handleCancel(order.id)} style={{ background: '#ffe0e0', color: '#e63946', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>
                ❌ Cancel Order
              </button>
            )}

            {order.status !== 'CANCELLED' && (
              <div className="delivery-tracker">
                <p className="tracker-title">🚀 Order Progress</p>
                <div className="tracker-steps">
                  <div className="tracker-line">
                    <div className="tracker-line-fill" style={{ width: `${(getStepIndex(order.status) / 3) * 100}%` }} />
                  </div>
                  {trackerSteps.map((step, index) => {
                    const current = getStepIndex(order.status);
                    const isCompleted = index < current;
                    const isActive = index === current;
                    return (
                      <div key={step.key} className="tracker-step">
                        <div className={`tracker-dot ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                          {isCompleted ? '✓' : step.emoji}
                        </div>
                        <span className={`tracker-label ${isActive ? 'active' : ''}`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;