import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  isLoggedIn,
  getToken
} from '../services/authService';

import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth on app start...');
      
      // Check if token exists in sessionStorage
      const token = getToken();
      console.log('Token from sessionStorage:', token);

      if (token && isLoggedIn()) {
        console.log('Token is valid, fetching user...');
        try {
          const response = await api.get('/auth/me');
          console.log('User from /auth/me:', response.data);
          setUser(response.data);
        } catch (error) {
          console.log('Failed to get user:', error);
          logoutService();
          setUser(null);
        }
      } else {
        console.log('No valid token found');
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    console.log('Logging in with:', credentials);
    
    const result = await loginService(credentials);
    console.log('Login result:', result);

    if (result.success) {
      console.log('Login successful, setting user...');
      setUser(result.user);
      return result;
    } else {
      console.log('Login failed:', result.message);
      setUser(null);
      return result;
    }
  };

  const register = async (userData) => {
    console.log('Registering with:', userData);
    
    const result = await registerService(userData);
    console.log('Register result:', result);

    if (result.success) {
      console.log('Register successful, setting user...');
      setUser(result.user);
      return result;
    } else {
      console.log('Register failed:', result.message);
      setUser(null);
      return result;
    }
  };

  const logoutUser = () => {
    console.log('Logging out...');
    logoutService();
    setUser(null);
  };

  const isAdmin = () => {
    const role = user?.role;
    console.log('Checking isAdmin, user role:', role);
    return role === 'ADMIN';
  };

  const isPartner = () => {
    const role = user?.role;
    console.log('Checking isPartner, user role:', role);
    return role === 'PARTNER';
  };

  const isCustomer = () => {
    const role = user?.role;
    console.log('Checking isCustomer, user role:', role);
    return role === 'CUSTOMER';
  };

  console.log('AuthProvider rendering, user:', user, 'loading:', loading);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginUser,
      register,
      logoutUser,
      isAdmin,
      isPartner,
      isCustomer,
      isLoggedIn: !!user
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be inside AuthProvider');
  }
  return context;
};