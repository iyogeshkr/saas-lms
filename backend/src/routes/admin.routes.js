const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { USER_ROLES } = require('../utils/constants');

// Apply authentication and admin role middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware(USER_ROLES.ADMIN));

// ==================== DASHBOARD ====================
router.get('/dashboard', adminController.getDashboardStats);

// ==================== USER MANAGEMENT ====================
router.post('/teachers', adminController.addTeacher);
router.post('/students', adminController.addStudent);
router.get('/teachers', adminController.getAllTeachers);
router.get('/students', adminController.getAllStudents);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// ==================== CLASS MANAGEMENT ====================
router.post('/classes', adminController.createClass);
router.get('/classes', adminController.getAllClasses);
router.get('/classes/:id', adminController.getClassById);
router.put('/classes/:id', adminController.updateClass);
router.delete('/classes/:id', adminController.deleteClass);

// ==================== SUBJECT MANAGEMENT ====================
router.post('/subjects', adminController.createSubject);
router.get('/subjects', adminController.getAllSubjects);
router.put('/subjects/:id', adminController.updateSubject);
router.delete('/subjects/:id', adminController.deleteSubject);

// teacher-specific routes
router.post('/teachers', adminController.addTeacher);
router.get('/teachers', adminController.getAllTeachers);
router.get('/teachers/:id', adminController.getTeacherDetails);
router.put('/teachers/:id/status', adminController.updateTeacherStatus);
router.put('/teachers/:id', adminController.updateUser); 
router.delete('/teachers/:id', adminController.deleteUser);

// Test route (keep for testing)
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Admin routes are working!',
    user: req.user,
    endpoints: {
      dashboard: 'GET /api/admin/dashboard',
      teachers: 'GET /api/admin/teachers',
      addTeacher: 'POST /api/admin/teachers',
      students: 'GET /api/admin/students',
      addStudent: 'POST /api/admin/students',
      classes: 'GET /api/admin/classes',
      addClass: 'POST /api/admin/classes',
      subjects: 'GET /api/admin/subjects',
      addSubject: 'POST /api/admin/subjects'
    }
  });
});

module.exports = router;