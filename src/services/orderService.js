import api from './api';

export const placeOrder = async (listingId, quantity, deliveryAddress) => {
  try {
    const response = await api.post('/orders/place', null, {
      params: { listingId, quantity, deliveryAddress }
    });
    return { success: true, message: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to place order!' };
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/my');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to get orders!' };
  }
};

export const getRestaurantOrders = async () => {
  try {
    const response = await api.get('/orders/restaurant');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to get orders!' };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, null, { params: { status } });
    return { success: true, message: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to update!' };
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return { success: true, message: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to cancel!' };
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders/all');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data || 'Failed to get orders!' };
  }
};

export default {
  placeOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
};