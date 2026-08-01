import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/orderService';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, increaseQty, decreaseQty, removeFromCart, clearCart, cartTotal, cartGreenPoints } = useCart();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError('Please enter delivery address!');
      return;
    }

    if (cartItems.length === 0) {
      setError('Cart is empty!');
      return;
    }

    setLoading(true);
    setError('');

    let allSuccess = true;
    let errorMsg = '';

    for (const item of cartItems) {
      const result = await placeOrder(item.id, item.quantity, address);
      if (!result.success) {
        allSuccess = false;
        errorMsg = result.message;
        break;
      }
    }

    setLoading(false);

    if (allSuccess) {
      setSuccess('Orders placed successfully! 🎉');
      clearCart();
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } else {
      setError(errorMsg || 'Failed to place order!');
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-header-title">🛒 Your Cart</h1>
        <p className="cart-header-subtitle">{cartItems.length} items in your cart</p>
      </div>

      <div className="cart-container">
        {cartItems.length === 0 && (
          <div className="empty-cart">
            <div className="empty-cart-emoji">🛒</div>
            <h3 className="empty-cart-title">Your cart is empty!</h3>
            <p className="empty-cart-subtitle">Add some delicious food!</p>
            <Link to="/food" className="browse-btn">🍱 Browse Food</Link>
          </div>
        )}

        {cartItems.length > 0 && (
          <>
            <div className="cart-items-section">
              {error && <div style={{ background: '#ffe0e0', color: '#e63946', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontWeight: '500' }}>❌ {error}</div>}
              {success && <div style={{ background: '#d8f3dc', color: '#1b4332', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontWeight: '500' }}>✅ {success}</div>}

              {cartItems.map(item => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-emoji">🍱</div>

                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-restaurant">🏪 {item.restaurant}</p>
                    <p className="cart-item-price">₹{item.discountedPrice}</p>
                  </div>

                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => decreaseQty(item.id)}>−</button>
                      <span className="qty-number">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                    <p className="item-total">₹{item.discountedPrice * item.quantity}</p>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>❌ Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h3 className="summary-title">📋 Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span>🎉 Free</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>

              <div className="green-points-info">🌱 You earn {cartGreenPoints} Green Points!</div>

              <div className="address-section">
                <label className="address-label">📍 Delivery Address</label>
                <textarea className="address-input" rows="3" placeholder="Enter delivery address..." value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? '⏳ Placing Orders...' : '🎉 Place Order'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;