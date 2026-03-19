const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const messageController = require('../controllers/message.controller');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register); 

// Protected routes (require authentication)
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

// ==================== MESSAGES ====================
router.post('/messages', authMiddleware, messageController.sendMessage);
router.get('/messages/conversations', authMiddleware, messageController.getConversations);
router.get('/messages/:otherUserId', authMiddleware, messageController.getMessages);
router.put('/messages/read', authMiddleware, messageController.markAsRead);
router.delete('/messages/:messageId', authMiddleware, messageController.deleteMessage);
router.get('/messages/unread/count', authMiddleware, messageController.getUnreadCount);

// Test route (keep for testing)
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!',
    endpoints: {
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      profile: 'GET /api/auth/profile (protected)',
      updateProfile: 'PUT /api/auth/profile (protected)',
      changePassword: 'PUT /api/auth/change-password (protected)'
    }
  });
});

module.exports = router;