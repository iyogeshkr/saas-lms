import api from './axiosConfig';

const messageService = {
  sendMessage: async (receiverId, message) => {
    try {
      const response = await api.post('/auth/messages', {
        receiverId,
        message,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send message' };
    }
  },

  getConversations: async () => {
    try {
      const response = await api.get('/auth/messages/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch conversations' };
    }
  },

  getMessages: async (otherUserId, limit = 50, before = null) => {
    try {
      const params = new URLSearchParams({ limit });
      if (before) params.append('before', before);
      
      const response = await api.get(`/auth/messages/${otherUserId}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch messages' };
    }
  },

  markAsRead: async (messageIds) => {
    try {
      const response = await api.put('/auth/messages/read', { messageIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark messages as read' };
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/auth/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete message' };
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/auth/messages/unread/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch unread count' };
    }
  },
};

export default messageService;