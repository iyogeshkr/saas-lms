const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./src/models/User');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  
  // Create default admin if not exists
  await createDefaultAdmin();
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const adminRoutes = require('./src/routes/admin.routes');
const teacherRoutes = require('./src/routes/teacher.routes');
const studentRoutes = require('./src/routes/student.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
// Add payment routes
app.use('/api/payments', require('./src/routes/payments.routes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'School Management System API',
    version: '1.0.0',
    status: 'Server is running',
    endpoints: {
      auth: 'POST /api/auth/login',
      admin: 'GET /api/admin/test',
      teacher: 'GET /api/teacher/test',
      student: 'GET /api/student/test',
      health: 'GET /api/health'
    }
  });
});


const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@school.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
    
    if (!existingAdmin) {
      const admin = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '+1234567890',
        status: 'active'
      });
      
      await admin.save();
      console.log('✅ Default admin user created');
      console.log(`   📧 Email: ${adminEmail}`);
      console.log(`   🔑 Password: ${adminPassword}`);
    } else {
      console.log('✅ Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};
// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/login',
      'GET /api/admin/test',
      'GET /api/teacher/test',
      'GET /api/student/test'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Documentation:`);
  console.log(`   🔐 Auth:      http://localhost:${PORT}/api/auth/test`);
  console.log(`   👑 Admin:     http://localhost:${PORT}/api/admin/test`);
  console.log(`   👩‍🏫 Teacher:   http://localhost:${PORT}/api/teacher/test`);
  console.log(`   👨‍🎓 Student:   http://localhost:${PORT}/api/student/test`);
  console.log(`   ❤️  Health:    http://localhost:${PORT}/api/health`);
});