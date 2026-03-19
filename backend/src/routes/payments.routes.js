const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { USER_ROLES } = require('../utils/constants');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Student-only routes
router.post('/create-order', 
  roleMiddleware(USER_ROLES.STUDENT), 
  paymentController.createOrder
);

router.post('/verify',
  roleMiddleware(USER_ROLES.STUDENT),
  paymentController.verifyPayment
);

router.get('/history',
  roleMiddleware(USER_ROLES.STUDENT),
  paymentController.getPaymentHistory
);

// Test route
router.get('/test', paymentController.test);

module.exports = router;