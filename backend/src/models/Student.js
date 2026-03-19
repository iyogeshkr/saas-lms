const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    uppercase: true
  },
  admissionNumber: {
    type: String,
    unique: true,
    uppercase: true
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
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
    default: null
  },
  
  // Academic Information
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  section: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    enum: ['Science', 'Commerce', 'Arts', 'Vocational', null],
    default: null
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  
  // Address Information
  address: {
    permanent: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    current: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    sameAsPermanent: {
      type: Boolean,
      default: true
    }
  },
  
  // Parent/Guardian Information
  father: {
    name: String,
    occupation: String,
    phone: String,
    email: String,
    annualIncome: Number
  },
  mother: {
    name: String,
    occupation: String,
    phone: String,
    email: String,
    annualIncome: Number
  },
  guardian: {
    name: String,
    relation: String,
    occupation: String,
    phone: String,
    email: String,
    address: String
  },
  
  // Previous Education
  previousSchool: {
    name: String,
    address: String,
    board: String,
    percentage: Number,
    yearOfPassing: Number
  },
  
  // Fee Information
  fee: {
    totalFee: Number,
    paidFee: {
      type: Number,
      default: 0
    },
    pendingFee: {
      type: Number,
      default: 0
    },
    scholarship: {
      type: Number,
      default: 0
    },
    concession: {
      type: Number,
      default: 0
    },
    lateFee: {
      type: Number,
      default: 0
    },
    paymentHistory: [{
      term: String,
      amount: Number,
      paidDate: Date,
      paymentMethod: String,
      transactionId: String,
      receiptNo: String
    }]
  },
  
  // Documents
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['aadhar', 'birth-certificate', 'transfer-certificate', 'marksheet', 'photo', 'other']
    },
    url: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Status & Metadata
  status: {
    type: String,
    enum: ['active', 'inactive', 'alumni', 'transfered', 'dropout'],
    default: 'active'
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  leavingDate: Date,
  reasonForLeaving: String,
  
  // Medical Information
  medicalInfo: {
    height: Number, // in cm
    weight: Number, // in kg
    disabilities: String,
    allergies: [String],
    bloodPressure: String,
    vision: {
      leftEye: String,
      rightEye: String
    },
    lastCheckup: Date
  },
  
  // Extra-curricular Activities
  extracurricular: [{
    activity: String,
    position: String,
    achievement: String,
    year: Number
  }],
  
  // Performance
  attendance: {
    present: {
      type: Number,
      default: 0
    },
    absent: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  
  // Transport
  transport: {
    availing: {
      type: Boolean,
      default: false
    },
    busNumber: String,
    pickupPoint: String,
    dropPoint: String,
    monthlyCharge: Number
  },
  
  // Hostel
  hostel: {
    availing: {
      type: Boolean,
      default: false
    },
    roomNumber: String,
    block: String,
    monthlyCharge: Number
  },
  
  // Metadata
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
studentSchema.virtual('age').get(function() {
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

// Virtual for class display
studentSchema.virtual('classDisplay').get(function() {
  if (this.populated('class')) {
    return `${this.class.className} - ${this.section}`;
  }
  return `${this.section}`;
});

// Pre-save middleware
studentSchema.pre('save', function(next) {
  // Generate admission number if not provided
  if (!this.admissionNumber && this.isNew) {
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.admissionNumber = `ADM${year}${randomNum}`;
  }
  
  // Calculate fee
  if (this.fee && this.fee.totalFee) {
    this.fee.pendingFee = this.fee.totalFee - this.fee.paidFee - this.fee.scholarship - this.fee.concession;
  }
  
  // Calculate attendance percentage
  if (this.attendance && this.attendance.present + this.attendance.absent > 0) {
    this.attendance.percentage = (this.attendance.present / (this.attendance.present + this.attendance.absent)) * 100;
  }
  
  next();
});

// Pre-save middleware to hash password
studentSchema.pre('save', async function(next) {
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
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes for faster queries
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ class: 1, section: 1 });
studentSchema.index({ 'father.phone': 1 });
studentSchema.index({ 'mother.phone': 1 });

module.exports = mongoose.model('Student', studentSchema);