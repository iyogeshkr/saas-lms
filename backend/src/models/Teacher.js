const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't return password in queries
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  alternatePhone: String,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: [
      'Mathematics', 'Science', 'English', 'History', 'Physics',
      'Chemistry', 'Biology', 'Computer Science', 'Physical Education',
      'Arts', 'Music', 'Geography', 'Economics', 'Business Studies'
    ]
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    enum: ['B.Ed', 'M.Ed', 'PhD', 'M.Sc', 'B.Sc', 'MA', 'BA']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave', 'resigned'],
    default: 'active'
  },
  profileImage: String,
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: Date
  }],
  classesAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  subjectsAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  salary: {
    basic: Number,
    allowances: Number,
    deductions: Number,
    netSalary: Number,
    bankAccount: {
      accountNumber: String,
      bankName: String,
      ifscCode: String
    }
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
teacherSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to calculate age
teacherSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Index for faster queries
teacherSchema.index({ email: 1 });
teacherSchema.index({ status: 1 });
teacherSchema.index({ subject: 1 });
teacherSchema.index({ 'address.city': 1 });

// Pre-save middleware to hash password
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate teacher ID
teacherSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate teacher ID like TEA2024001
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100 + Math.random() * 900);
    this.teacherId = `TEA${year}${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);