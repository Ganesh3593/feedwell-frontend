import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getAvailableFood, getFoodByCategory } from '../services/foodService';
import './FoodListing.css';

const FoodListingPage = () => {
  const { addToCart, cartItems } = useCart();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    const result = await getAvailableFood();
    setLoading(false);
    if (result.success) {
      setFoods(result.data);
    } else {
      setError(result.message);
    }
  };

  const handleCategoryFilter = async (cat) => {
    setActiveCategory(cat);
    setLoading(true);
    if (cat === 'All') {
      const result = await getAvailableFood();
      if (result.success) setFoods(result.data);
    } else {
      const result = await getFoodByCategory(cat);
      if (result.success) setFoods(result.data);
    }
    setLoading(false);
  };

  const handleAddToCart = (food) => {
    addToCart({
      id: food.id,
      name: food.name,
      discountedPrice: food.discountedPrice,
      originalPrice: food.originalPrice,
      greenPoints: food.greenPoints,
      restaurant: food.restaurant?.name || 'Restaurant'
    });
    setAddedItem(food.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const isInCart = (foodId) => {
    return cartItems.some(item => item.id === foodId);
  };

  return (
    <div className="food-page">
      <div className="food-header">
        <div className="food-header-emoji">🍱</div>
        <h1 className="food-header-title">Available Food Near You</h1>
        <p className="food-header-subtitle">Fresh surplus food at amazing prices! Order before it expires! ⏰</p>
      </div>

      <div className="filter-section">
        <div className="filter-container">
          {['All', 'Veg', 'Non-Veg', 'Dessert', 'Beverage'].map(cat => (
            <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => handleCategoryFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="food-container">
        {loading && <div className="spinner"></div>}
        {error && !loading && <div style={{ textAlign: 'center', padding: '40px', color: '#e63946' }}>❌ {error}</div>}

        {!loading && !error && (
          <>
            <p className="results-count">Showing {foods.length} items {activeCategory !== 'All' ? `in ${activeCategory}` : ''}</p>

            {foods.length === 0 && (
              <div className="empty-state">
                <div className="empty-emoji">🍽️</div>
                <h3 className="empty-title">No food available!</h3>
                <p className="empty-subtitle">Check back later!</p>
              </div>
            )}

            <div className="food-grid">
              {foods.map(food => (
                <div key={food.id} className="food-card">
                  <div className="food-card-image">
                    <span>🍱</span>
                    <div className="discount-badge">
                      {Math.round(((food.originalPrice - food.discountedPrice) / food.originalPrice) * 100)}% OFF
                    </div>
                    <div className="category-badge">{food.category}</div>
                  </div>

                  <div className="food-card-body">
                    <h3 className="food-card-name">{food.name}</h3>
                    <p className="food-card-restaurant">🏪 {food.restaurant?.name || 'Restaurant'}</p>
                    <div className="food-card-price">
                      <span className="price-original">₹{food.originalPrice}</span>
                      <span className="price-discounted">₹{food.discountedPrice}</span>
                    </div>
                    <div className="food-card-info">
                      <div className="info-item">📦 {food.quantity} left</div>
                      <div className="info-item">{food.category}</div>
                    </div>
                    <div className="green-points-badge">🌱 +{food.greenPoints} Green Points</div>
                    <button className="add-cart-btn" onClick={() => handleAddToCart(food)} style={{ background: addedItem === food.id ? '#52b788' : undefined }}>
                      {addedItem === food.id ? '✅ Added!' : isInCart(food.id) ? '🛒 In Cart' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FoodListingPage;