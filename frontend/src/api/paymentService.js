import api from './axiosConfig';

const paymentService = {
  // Create payment order
  createOrder: async (feeId, amount) => {
    try {
      const response = await api.post('/payments/create-order', {
        amount: amount * 100, // Convert to paise
        feeId: feeId,
        description: `Fee Payment`
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create payment order' };
    }
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment verification failed' };
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment history' };
    }
  },

  // Test payment connection
  testConnection: async () => {
    try {
      const response = await api.get('/payments/test');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment service unavailable' };
    }
  }
};

export default paymentService;