import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import FoodListingPage from './pages/FoodListingPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext.jsx'
import DonationPage from './pages/DonationPage.jsx'
import PartnerDashboard from './pages/PartnerDashboard.jsx'

function App() {
  // useEffect(() => {
  //   // Check if running on localhost
  //   if (window.location.hostname === 'localhost' || 
  //       window.location.hostname === '127.0.0.1') {
      
  //     if (import.meta.env.VITE_LOCK_LOCAL_HOST === 'true') {
  //       // Block localhost
  //       window.location.href = 'https://feedwell-frontend.vercel.app';
  //     }
  //   }
  // }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/food" element={<FoodListingPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/partner" element={<PartnerDashboard/>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App