import axios from 'axios';

// ============================================================
// api.js — Axios Setup for API Calls
//
// PURPOSE:
//   All API calls go through this file
//   Automatically adds JWT token to every request
//
// HOW IT WORKS:
//   1. Create axios instance with base URL
//   2. Before every request → add token to Authorization header
//   3. If response is 401 (token expired) → logout user
//   4. Return response or error
// ============================================================

// Step 1: Create axios instance
const api = axios.create({
  baseURL: 'https://feedwell-backend.onrender.com',
  withCredentials: false
});

// Step 2: Request interceptor
// Runs BEFORE every API call
// Job: Add JWT token to Authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (persists!)
  //  const token = sessionStorage.getItem('token');
    const token = localStorage.getItem('token'); 

    console.log('Token being sent:', token ? 'exists' : 'null');

    // If token exists, add it to request header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header added');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Step 3: Response interceptor
// Runs AFTER every API response
// Job: Check if token expired (401 error)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If server returns 401 (Unauthorized)
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Token expired');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;