import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getMyListings, addFoodListing, deleteFoodListing, donateFoodListing } from '../services/foodService';
import { getRestaurantOrders, updateOrderStatus } from '../services/orderService';
import './PartnerDashboard.css';

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('restaurant');
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    quantity: '',
    category: 'Veg',
    expiresAt: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const listingsRes = await getMyListings();
      const ordersRes = await getRestaurantOrders();
      
      if (listingsRes.success) {
      const all = Array.isArray(listingsRes.data) ? listingsRes.data : [];
      setListings(all.filter(l => l.status !== 'REMOVED'));
      } else {
      setListings([]);
}

      if (ordersRes.success) {
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } else {
        setOrders([]);
      }

      try {
        const restRes = await api.get('/restaurants/my');
        setRestaurant(restRes.data);
      } catch (err) {
        setRestaurant(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setListings([]);
      setOrders([]);
    }
    setLoading(false);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddFood = async () => {
  console.log('🔵 Button clicked!');  // ← ADD THIS
  console.log('Form data:', newFood);  // ← ADD THIS

  if (!newFood.name || !newFood.originalPrice || !newFood.discountedPrice || !newFood.quantity || !newFood.expiresAt) {
    console.log('❌ Missing fields!');  // ← ADD THIS
    showMessage('❌ Please fill all fields!');
    return;
  }

  console.log('✅ All fields filled, sending request...');  // ← ADD THIS

  const expiresAtFormatted = newFood.expiresAt.length === 16
    ? newFood.expiresAt + ':00'
    : newFood.expiresAt;

  const foodData = {
    name: newFood.name,
    description: newFood.description,
    originalPrice: Number(newFood.originalPrice),
    discountedPrice: Number(newFood.discountedPrice),
    quantity: Number(newFood.quantity),
    category: newFood.category,
    expiresAt: expiresAtFormatted,
    greenPoints: 10
  };

  console.log('📤 Sending foodData:', foodData);  // ← ADD THIS

  const result = await addFoodListing(foodData);

  console.log('📥 Response:', result);  // ← ADD THIS

  if (result.success) {
    showMessage('✅ Food listing added!');
    setNewFood({ 
      name: '', 
      description: '', 
      originalPrice: '', 
      discountedPrice: '', 
      quantity: '', 
      category: 'Veg',
      expiresAt: '' 
    });
    fetchAllData();
  } else {
    showMessage('❌ ' + result.message);
  }
};

 const handleDelete = async (id) => {
  if (!window.confirm('Delete this listing?')) return;

  const result = await deleteFoodListing(id);
  showMessage(result.success ? '✅ Listing deleted!' : '❌ ' + (result.message || 'Failed to delete listing'));
  if (result.success) fetchAllData();
};

  const handleDonate = async (id) => {
    const result = await donateFoodListing(id);
    if (result.success) {
      showMessage('🙏 Food donated!');
      fetchAllData();
    } else {
      showMessage('❌ ' + result.message);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    const result = await updateOrderStatus(orderId, status);
    if (result.success) {
      showMessage('✅ Status updated!');
      fetchAllData();
    } else {
      showMessage('❌ ' + result.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN');
  };

  const ordersArray = Array.isArray(orders) ? orders : [];
  const listingsArray = Array.isArray(listings) ? listings : [];

  return (
    <div className="partner-page">
      <div className="partner-header">
        <div className="partner-header-top">
          <div>
            <h1 className="partner-title">🍽️ Partner Dashboard</h1>
            <p className="partner-subtitle">Manage your restaurant and food</p>
          </div>
          <div className="partner-badge">🏪 {restaurant?.name || 'My Restaurant'}</div>
        </div>
      </div>

      <div className="partner-container">
        {message && (
          <div style={{ background: message.includes('❌') ? '#ffe0e0' : '#d8f3dc', color: message.includes('❌') ? '#e63946' : '#1b4332', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', fontSize: '15px' }}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <div className="partner-stats">
              <div className="partner-stat-card">
                <div className="partner-stat-emoji">🍱</div>
                <div className="partner-stat-number">{listingsArray.length}</div>
                <div className="partner-stat-label">Total Listings</div>
              </div>

              <div className="partner-stat-card">
                <div className="partner-stat-emoji">📦</div>
                <div className="partner-stat-number">{ordersArray.filter(o => o.status === 'PLACED').length}</div>
                <div className="partner-stat-label">New Orders</div>
              </div>

              <div className="partner-stat-card">
                <div className="partner-stat-emoji">✅</div>
                <div className="partner-stat-number">{ordersArray.filter(o => o.status === 'DELIVERED').length}</div>
                <div className="partner-stat-label">Delivered</div>
              </div>

              <div className="partner-stat-card">
                <div className="partner-stat-emoji">🙏</div>
                <div className="partner-stat-number">{listingsArray.filter(l => l.status === 'DONATED').length}</div>
                <div className="partner-stat-label">Donated</div>
              </div>
            </div>

            <div className="partner-tabs">
              <button className={`partner-tab ${activeTab === 'restaurant' ? 'active' : ''}`} onClick={() => setActiveTab('restaurant')}>🏪 Restaurant</button>
              <button className={`partner-tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>🍱 Listings</button>
              <button className={`partner-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>📦 Orders</button>
            </div>

          {activeTab === 'restaurant' && (
  <div className="partner-section">
    <div className="partner-section-header">
      <h3 className="partner-section-title">🏪 My Restaurant</h3>
      {restaurant && <span className={`status-badge ${restaurant.status === 'APPROVED' ? 'badge-available' : 'badge-pending'}`}>{restaurant.status}</span>}
    </div>

    {!restaurant ? (
      <div className="add-restaurant-form">
        <h4>Register Your Restaurant</h4>
        <div className="form-group">
          <label>Restaurant Name</label>
          <input type="text" placeholder="Restaurant name" id="restName" className="form-input" />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" placeholder="Address" id="restAddress" className="form-input" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" placeholder="Phone" id="restPhone" className="form-input" />
        </div>
        <div className="form-group">
          <label>Cuisine</label>
          <input type="text" placeholder="Cuisine" id="restCuisine" className="form-input" />
        </div>
        <div className="form-group">
          <label>FSSAI License</label>
          <input type="text" placeholder="FSSAI License" id="restFssai" className="form-input" />
        </div>
        <button className="add-food-btn" onClick={() => {
          const restData = {
            name: document.getElementById('restName').value,
            address: document.getElementById('restAddress').value,
            phone: document.getElementById('restPhone').value,
            cuisine: document.getElementById('restCuisine').value,
            fssaiLicense: document.getElementById('restFssai').value
          };
          
          api.post('/restaurants/add', restData)
            .then(res => {
              showMessage('✅ Restaurant added!');
              fetchAllData();
            })
            .catch(err => {
              showMessage('❌ Failed: ' + err.response?.data?.message);
            });
        }}>
          ➕ Add Restaurant
        </button>
      </div>
    ) : (
      <div className="restaurant-info-card">
        <div className="restaurant-emoji">🏪</div>
        <div className="restaurant-details">
          <h3>{restaurant.name}</h3>
          <p>🍽️ {restaurant.cuisine}</p>
          <p>📍 {restaurant.address}</p>
          <p>📞 {restaurant.phone}</p>
          {restaurant.fssaiLicense && <p>🏛️ FSSAI: {restaurant.fssaiLicense}</p>}
        </div>
      </div>
    )}
  </div>
)}  
          

            {activeTab === 'listings' && (
              <>
                <div className="partner-section">
                  <div className="partner-section-header">
                    <h3 className="partner-section-title">➕ Add New Listing</h3>
                  </div>
                  <div className="add-food-form">
                    <div className="form-group">
                      <label className="form-label">Food Name *</label>
                      <input className="form-input" placeholder="" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-input" value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})}>
                        <option>Veg</option>
                        <option>Non-Veg</option>
                        <option>Dessert</option>
                        <option>Beverage</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Original Price ₹ *</label>
                      <input className="form-input" type="number" placeholder="" value={newFood.originalPrice} onChange={e => setNewFood({...newFood, originalPrice: e.target.value})} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Discounted Price ₹ *</label>
                      <input className="form-input" type="number" placeholder="" value={newFood.discountedPrice} onChange={e => setNewFood({...newFood, discountedPrice: e.target.value})} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Quantity *</label>
                      <input className="form-input" type="number" placeholder="" value={newFood.quantity} onChange={e => setNewFood({...newFood, quantity: e.target.value})} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Expires At *</label>
                      <input className="form-input" type="datetime-local" value={newFood.expiresAt} onChange={e => setNewFood({...newFood, expiresAt: e.target.value})} />
                    </div>

                    <div className="form-group form-full">
                      <label className="form-label">Description</label>
                      <input className="form-input" placeholder="Brief description..." value={newFood.description} onChange={e => setNewFood({...newFood, description: e.target.value})} />
                    </div>

                    <button className="add-food-btn" onClick={handleAddFood}>➕ Add Food Listing</button>
                  </div>
                </div>

                <div className="partner-section">
                  <div className="partner-section-header">
                    <h3 className="partner-section-title">🍱 My Food Listings</h3>
                    <span style={{ background: '#d8f3dc', color: '#1b4332', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                      {listingsArray.length} listings
                    </span>
                  </div>

                  {listingsArray.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>No listings yet! Add your first food listing.</p>
                  ) : (
                    <table className="partner-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Food</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listingsArray.map(l => (
                          <tr key={l.id}>
                            <td>{l.id}</td>
                            <td>{l.name}</td>
                            <td>{l.category}</td>
                            <td><span style={{ textDecoration: 'line-through', color: '#aaa', fontSize: '12px' }}>₹{l.originalPrice}</span> ₹{l.discountedPrice}</td>
                            <td>{l.quantity}</td>
                            <td><span className={`status-badge`} style={{ background: l.status === 'AVAILABLE' ? '#d8f3dc' : '#e8f4fd', color: '#1b4332' }}>{l.status}</span></td>
                            <td>
                              {l.status === 'AVAILABLE' && (
                                <button className="listing-action-btn btn-donate" onClick={() => handleDonate(l.id)}>🙏 Donate</button>
                              )}
                              <button className="listing-action-btn btn-delete" onClick={() => handleDelete(l.id)}>🗑️ Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="partner-section">
                <div className="partner-section-header">
                  <h3 className="partner-section-title">📦 Incoming Orders</h3>
                  <span style={{ background: '#fff3cd', color: '#d4a017', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                    {ordersArray.filter(o => o.status === 'PLACED').length} new
                  </span>
                </div>

                {ordersArray.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>No orders yet!</p>
                ) : (
                  <table className="partner-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Food</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Update</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersArray.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.customer?.name || order.customer?.email || 'Customer'}</td>
                          <td>{order.foodListing?.name || 'Food'}</td>
                          <td>{order.quantity}</td>
                          <td>₹{order.totalPrice}</td>
                          <td><span className={`status-badge`} style={{ background: order.status === 'PLACED' ? '#e8f4fd' : '#d8f3dc', color: '#1b4332' }}>{order.status}</span></td>
                          <td>
                            {order.status === 'PLACED' && (
                              <button className="listing-action-btn btn-donate" onClick={() => handleUpdateStatus(order.id, 'PREPARING')}>👨‍🍳 Prepare</button>
                            )}
                            {order.status === 'PREPARING' && (
                              <button className="listing-action-btn btn-donate" onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}>🚴 Send Out</button>
                            )}
                            {order.status === 'OUT_FOR_DELIVERY' && (
                              <button className="listing-action-btn btn-donate" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}>✅ Delivered</button>
                            )}
                            {order.status === 'DELIVERED' && (
                              <span style={{ color: '#2d6a4f', fontSize: '13px' }}>✅ Done</span>
                            )}
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;