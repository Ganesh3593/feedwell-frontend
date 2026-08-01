import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();  // ✅ FIXED - No parameter
  const [email, setEmail] = useState('');  // ✅ FIXED - Pre-filled
  const [password, setPassword] = useState('');     // ✅ FIXED - Pre-filled
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('Login form submitted with:', { email, password });

    if (!email || !password) {
      setError('Please fill all fields!');
      return;
    }

    setLoading(true);

    const result = await loginUser({ email, password });
    console.log('Login result received:', result);

    setLoading(false);

    if (result.success) {
      console.log('Login successful! User role:', result.user?.role);
      setSuccess('✅ Login successful! Redirecting...');

      setTimeout(() => {
        const role = result.user?.role;
        console.log('Redirecting based on role:', role);

        if (role === 'ADMIN') {
          navigate('/admin');
        } else if (role === 'PARTNER') {
          navigate('/partner');
        } else {
          navigate('/food');
        }
      }, 1000);
    } else {
      console.log('Login failed:', result.message);
      setError(result.message || 'Login failed!');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🌱</div>
          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">Login to your Feedwell account</p>
        </div>

        {error && <div className="alert-error">❌ {error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">📧 Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔑 Login'}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        <div className="login-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;