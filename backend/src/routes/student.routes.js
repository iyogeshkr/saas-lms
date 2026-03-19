const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { USER_ROLES } = require('../utils/constants');

router.use(authMiddleware);
router.use(roleMiddleware(USER_ROLES.STUDENT));
router.get('/dashboard', studentController.getStudentDashboard);
router.get('/attendance', studentController.getStudentAttendance);
router.get('/marks', studentController.getStudentMarks);
router.get('/performance', studentController.getPerformanceData);
router.get('/profile', studentController.getStudentProfile);
router.put('/profile', studentController.updateStudentProfile);
router.get('/fees', studentController.getFeeStatus);
router.post('/messages', messageController.sendMessage);
router.get('/messages/conversations', messageController.getConversations);
router.get('/messages/:otherUserId', messageController.getMessages);
router.put('/messages/read', messageController.markAsRead);
router.delete('/messages/:messageId', messageController.deleteMessage);
router.get('/messages/unread/count', messageController.getUnreadCount);


module.exports = router;