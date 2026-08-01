import api from './api';

// export const getAvailableFood = async () => {
//   try {
//     const response = await api.get('/food/available');
//     return { success: true, data: response.data };
//   } catch (error) {
//     return { success: false, message: error.response?.data || 'Failed to get food!' };
//   }
// };

// export const getFoodByCategory = async (category) => {
//   try {
//     const response = await api.get(`/food/category/${category}`);
//     return { success: true, data: response.data };
//   } catch (error) {
//     return { success: false, message: error.response?.data || 'Failed to get food!' };
//   }
// };

// export const getMyListings = async () => {
//   try {
//     const response = await api.get('/food/my');
//     return { success: true, data: response.data };
//   } catch (error) {
//     return { success: false, message: error.response?.data || 'Failed to get listings!' };
//   }
// };

// export const addFoodListing = async (foodData) => {
//   try {
//     const response = await api.post('/api/food/add', foodData);
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error('Error adding food:', error);
//     return { 
//       success: false, 
//       message: error.response?.data || 'Failed to add food'  // ✅ remove ?.message
//     };
//   }
// };

// // export const addFoodListing = async (foodData) => {
// //   try {
// //     const response = await api.post('/food/add', foodData);
// //     return { success: true, message: response.data };
// //   } catch (error) {
// //     return { success: false, message: error.response?.data || 'Failed to add food!' };
// //   }
// // };

// export const deleteFoodListing = async (id) => {
//   try {
//     const response = await api.delete(`/food/${id}`);
//     return { success: true, message: response.data };
//   } catch (error) {
//     return { success: false, message: error.response?.data || 'Failed to delete!' };
//   }
// };

// export const donateFoodListing = async (id) => {
//   try {
//     const response = await api.put(`/food/${id}/donate`);
//     return { success: true, message: response.data };
//   } catch (error) {
//     return { success: false, message: error.response?.data || 'Failed to donate!' };
//   }
// };

// export default {
//   getAvailableFood,
//   getFoodByCategory,
//   getMyListings,
//   addFoodListing,
//   deleteFoodListing,
//   donateFoodListing
// };
export const getAvailableFood = async () => {
  try {
    const response = await api.get('/food/available');  // ✅ ADD /api
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to get food!' };
  }
};

export const getFoodByCategory = async (category) => {
  try {
    const response = await api.get(`/food/category/${category}`);  // ✅ ADD /api
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to get food!' };
  }
};

export const getMyListings = async () => {
  try {
    const response = await api.get('/food/my');  // ✅ ADD /api
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to get listings!' };
  }
};

export const addFoodListing = async (foodData) => {
  try {
    const response = await api.post('/food/add', foodData);  // ✅ ADD /api
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding food:', error);
    return { 
      success: false, 
      message: error.response?.data || 'Failed to add food'
    };
  }
};

export const deleteFoodListing = async (id) => {
  try {
    const response = await api.delete(`/food/${id}`);  // ✅ ADD /api
    return { success: true, message: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to delete!' };
  }
};

export const donateFoodListing = async (id) => {
  try {
    const response = await api.put(`/food/${id}/donate`);  // ✅ ADD /api
    return { success: true, message: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to donate!' };
  }
};

export default {
  getAvailableFood,
  getFoodByCategory,
  getMyListings,
  addFoodListing,
  deleteFoodListing,
  donateFoodListing
};