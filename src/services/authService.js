import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const data = response.data;

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return {
      success: true,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        greenScore: data.greenScore
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || 'Registration failed!',
      user: null
    };
  }
};

export const login = async (credentials) => {
  try {
    console.log('🔐 LOGIN: Sending to backend');
    const response = await api.post('/auth/login', credentials);
    const data = response.data;

    console.log('✅ LOGIN: Response received:', data);

    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('✅ Token saved to localStorage');
    }

    return {
      success: true,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        greenScore: data.greenScore
      },
      token: data.token
    };
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error.message);
    return {
      success: false,
      message: error.response?.data || 'Login failed!',
      user: null,
      token: null
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const decoded = JSON.parse(atob(parts[1]));
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export default {
  register,
  login,
  logout,
  getToken,
  isLoggedIn
};