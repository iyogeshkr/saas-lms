const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { USER_ROLES } = require('../utils/constants');

router.use(authMiddleware);
router.use(roleMiddleware(USER_ROLES.TEACHER));

// ==================== DASHBOARD ====================
router.get('/dashboard', teacherController.getTeacherDashboard);

// ==================== ATTENDANCE ====================
router.post('/attendance', teacherController.markAttendance);
router.get('/attendance/:classId/:date', teacherController.getClassAttendance);
router.get('/attendance/report/:classId', teacherController.getAttendanceReport);

// ==================== MARKS ====================
router.post('/marks', teacherController.addMarks);
router.get('/marks/:classId/:subjectId/:examType', teacherController.getClassMarks);

// ==================== STUDENTS ====================
router.get('/students/:classId', teacherController.getClassStudents);

// ==================== PROFILE ====================
router.get('/subjects', teacherController.getTeacherSubjects);
router.get('/classes', teacherController.getTeacherClasses);

// ==================== MESSAGES ====================
router.post('/messages', messageController.sendMessage);
router.get('/messages/conversations', messageController.getConversations);
router.get('/messages/:otherUserId', messageController.getMessages);
router.put('/messages/read', messageController.markAsRead);
router.delete('/messages/:messageId', messageController.deleteMessage);
router.get('/messages/unread/count', messageController.getUnreadCount);

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Teacher routes are working!',
    user: req.user,
    endpoints: {
      dashboard: 'GET /api/teacher/dashboard',
      markAttendance: 'POST /api/teacher/attendance',
      getAttendance: 'GET /api/teacher/attendance/:classId/:date',
      addMarks: 'POST /api/teacher/marks',
      getStudents: 'GET /api/teacher/students/:classId',
      getSubjects: 'GET /api/teacher/subjects',
      getClasses: 'GET /api/teacher/classes',
      sendMessage: 'POST /api/teacher/messages'
    }
  });
});

module.exports = router;