import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) { setError('Please enter your name!'); return false; }
    if (!email.trim()) { setError('Please enter your email!'); return false; }
    if (!phone.trim()) { setError('Please enter your phone!'); return false; }
    if (!password) { setError('Please enter password!'); return false; }
    if (password.length < 4) { setError('Password min 4 characters!'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match!'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await register({ name, email, phone, password, role });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message || 'Account created successfully!');
      setTimeout(() => { navigate('/login'); }, 1500);
    } else {
      setError(result.message || 'Registration failed!');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">🌱</div>
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join Feedwell — Save food, Save money!</p>
        </div>

        {error && <div className="alert-error">❌ {error}</div>}
        {success && <div className="alert-success">✅ {success}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">👤 Full Name</label>
            <input type="text" className="form-input" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">📧 Email Address</label>
            <input type="email" className="form-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">📱 Phone Number</label>
            <input type="text" className="form-input" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <input type="password" className="form-input" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Confirm Password</label>
            <input type="password" className="form-input" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="role-label">I am a:</label>
            <div className="role-cards">
              <div className={`role-card ${role === 'CUSTOMER' ? 'selected' : ''}`} onClick={() => setRole('CUSTOMER')}>
                <div className="role-icon">🛒</div>
                <div className="role-name">Customer</div>
                <div className="role-desc">Order food</div>
              </div>
              <div className={`role-card ${role === 'PARTNER' ? 'selected' : ''}`} onClick={() => setRole('PARTNER')}>
                <div className="role-icon">🍽️</div>
                <div className="role-name">Partner</div>
                <div className="role-desc">List food</div>
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? '⏳ Creating Account...' : '🌱 Create Account'}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        <div className="register-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;