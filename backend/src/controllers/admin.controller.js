const User = require('../models/User');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Mark = require('../models/Mark');
const Teacher = require('../models/Teacher');
const { USER_ROLES } = require('../utils/constants');

// ==================== DASHBOARD STATISTICS ====================
const getDashboardStats = async (req, res) => {
  try {
    // Get counts for each role
    const [totalStudents, totalTeachers, totalClasses, totalSubjects] = await Promise.all([
      User.countDocuments({ role: USER_ROLES.STUDENT, status: 'active' }),
      User.countDocuments({ role: USER_ROLES.TEACHER, status: 'active' }),
      Class.countDocuments({ status: 'active' }),
      Subject.countDocuments({ status: 'active' })
    ]);

    // Get recent activities
    const recentStudents = await User.find({ role: USER_ROLES.STUDENT })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email rollNumber createdAt');

    const recentTeachers = await User.find({ role: USER_ROLES.TEACHER })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject createdAt');

    // Get class-wise student distribution
    const classDistribution = await Class.aggregate([
      { $match: { status: 'active' } },
      { $project: { className: 1, section: 1, currentStudents: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSubjects,
        classDistribution
      },
      recent: {
        students: recentStudents,
        teachers: recentTeachers
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// ==================== USER MANAGEMENT ====================

const addTeacher = async (req, res) => {
  try {
    const {
      name, email, password, phone, alternatePhone, gender,
      dateOfBirth, subject, qualification, experience,
      street, city, state, pincode, country,
      basicSalary, allowances, deductions,
      emergencyContactName, emergencyContactRelationship, emergencyContactPhone,
      accountNumber, bankName, ifscCode
    } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher already exists with this email'
      });
    }

    // Calculate net salary
    const basic = parseFloat(basicSalary) || 0;
    const allowance = parseFloat(allowances) || 0;
    const deduction = parseFloat(deductions) || 0;
    const netSalary = basic + allowance - deduction;

    // Create teacher
    const teacher = new Teacher({
      name,
      email,
      password: password || 'Teacher@123', // Default password
      phone,
      alternatePhone,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      subject,
      qualification,
      experience: parseInt(experience) || 0,
      address: {
        street,
        city,
        state,
        pincode,
        country: country || 'India'
      },
      salary: {
        basic,
        allowances: allowance,
        deductions: deduction,
        netSalary,
        bankAccount: {
          accountNumber,
          bankName,
          ifscCode
        }
      },
      emergencyContact: {
        name: emergencyContactName,
        relationship: emergencyContactRelationship,
        phone: emergencyContactPhone
      },
      status: 'active',
      metadata: {
        createdBy: req.user._id
      }
    });

    await teacher.save();

    // Also create a User record for login
    const user = new User({
      name,
      email,
      password: password || 'Teacher@123',
      phone,
      role: USER_ROLES.TEACHER,
      teacherId: teacher._id,
      status: 'active'
    });

    await user.save();

    // Remove password from response
    const teacherData = teacher.toObject();
    delete teacherData.password;

    res.status(201).json({
      success: true,
      message: 'Teacher added successfully',
      teacher: teacherData,
      loginCredentials: {
        email,
        password: password || 'Teacher@123'
      }
    });

  } catch (error) {
    console.error('Add teacher error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add teacher'
    });
  }
};

const addStudent = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password, phone, gender, dateOfBirth,
      bloodGroup, class: classId, section, academicYear, stream,
      permanentStreet, permanentCity, permanentState, permanentPincode,
      currentStreet, currentCity, currentState, currentPincode, sameAsPermanent,
      fatherName, fatherOccupation, fatherPhone, fatherEmail, fatherIncome,
      motherName, motherOccupation, motherPhone, motherEmail, motherIncome,
      guardianName, guardianRelation, guardianOccupation, guardianPhone, guardianEmail, guardianAddress,
      previousSchoolName, previousSchoolAddress, previousSchoolBoard, previousSchoolPercentage, previousSchoolYear,
      totalFee, scholarship, concession, transportAvailing, transportBusNumber, transportPickupPoint, transportDropPoint,
      transportMonthlyCharge, hostelAvailing, hostelRoomNumber, hostelBlock, hostelMonthlyCharge
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student already exists with this email'
      });
    }

    // Check if class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Generate roll number
    const lastStudent = await Student.findOne({ class: classId, section })
      .sort({ rollNumber: -1 });
    
    let rollNumber = '001';
    if (lastStudent && lastStudent.rollNumber) {
      const lastRoll = parseInt(lastStudent.rollNumber);
      rollNumber = String(lastRoll + 1).padStart(3, '0');
    }

    // Create student
    const student = new Student({
      firstName,
      lastName,
      email,
      password: password || 'Student@123',
      phone,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      bloodGroup,
      class: classId,
      section,
      academicYear,
      stream,
      address: {
        permanent: {
          street: permanentStreet,
          city: permanentCity,
          state: permanentState,
          pincode: permanentPincode,
          country: 'India'
        },
        current: sameAsPermanent ? undefined : {
          street: currentStreet,
          city: currentCity,
          state: currentState,
          pincode: currentPincode,
          country: 'India'
        },
        sameAsPermanent
      },
      father: {
        name: fatherName,
        occupation: fatherOccupation,
        phone: fatherPhone,
        email: fatherEmail,
        annualIncome: fatherIncome
      },
      mother: {
        name: motherName,
        occupation: motherOccupation,
        phone: motherPhone,
        email: motherEmail,
        annualIncome: motherIncome
      },
      guardian: guardianName ? {
        name: guardianName,
        relation: guardianRelation,
        occupation: guardianOccupation,
        phone: guardianPhone,
        email: guardianEmail,
        address: guardianAddress
      } : undefined,
      previousSchool: previousSchoolName ? {
        name: previousSchoolName,
        address: previousSchoolAddress,
        board: previousSchoolBoard,
        percentage: previousSchoolPercentage,
        yearOfPassing: previousSchoolYear
      } : undefined,
      fee: {
        totalFee: parseFloat(totalFee) || 0,
        scholarship: parseFloat(scholarship) || 0,
        concession: parseFloat(concession) || 0,
        paidFee: 0,
        pendingFee: parseFloat(totalFee) - (parseFloat(scholarship) || 0) - (parseFloat(concession) || 0)
      },
      transport: {
        availing: transportAvailing || false,
        busNumber: transportBusNumber,
        pickupPoint: transportPickupPoint,
        dropPoint: transportDropPoint,
        monthlyCharge: transportMonthlyCharge
      },
      hostel: {
        availing: hostelAvailing || false,
        roomNumber: hostelRoomNumber,
        block: hostelBlock,
        monthlyCharge: hostelMonthlyCharge
      },
      rollNumber,
      status: 'active',
      createdBy: req.user._id
    });

    await student.save();

    // Also create a User record for login
    const user = new User({
      name: `${firstName} ${lastName}`,
      email,
      password: password || 'Student@123',
      phone,
      role: USER_ROLES.STUDENT,
      studentId: student._id,
      status: 'active'
    });

    await user.save();

    // Update class student count
    classExists.currentStudents += 1;
    await classExists.save();

    // Remove password from response
    const studentData = student.toObject();
    delete studentData.password;

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      student: studentData,
      loginCredentials: {
        email,
        password: password || 'Student@123',
        rollNumber
      }
    });

  } catch (error) {
    console.error('Add student error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or roll number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add student'
    });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const { 
      search = '', 
      status = 'active', 
      subject = '',
      gender = '',
      qualification = '',
      city = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    
    if (gender && gender !== 'all') {
      query.gender = gender;
    }
    
    if (qualification && qualification !== 'all') {
      query.qualification = qualification;
    }
    
    if (city && city !== 'all') {
      query['address.city'] = city;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Get teachers with pagination
    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .select('-password -salary.bankAccount.accountNumber')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Teacher.countDocuments(query)
    ]);
    
    // Get unique values for filters
    const [subjects, cities, qualifications, genders] = await Promise.all([
      Teacher.distinct('subject'),
      Teacher.distinct('address.city'),
      Teacher.distinct('qualification'),
      Teacher.distinct('gender')
    ]);
    
    // Calculate statistics
    const stats = {
      totalTeachers: await Teacher.countDocuments(),
      activeTeachers: await Teacher.countDocuments({ status: 'active' }),
      bySubject: await Teacher.aggregate([
        { $group: { _id: '$subject', count: { $sum: 1 } } }
      ]),
      byCity: await Teacher.aggregate([
        { $group: { _id: '$address.city', count: { $sum: 1 } } }
      ])
    };
    
    res.status(200).json({
      success: true,
      count: teachers.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      teachers,
      stats,
      filters: {
        subjects: subjects.filter(s => s),
        cities: cities.filter(c => c),
        qualifications: qualifications.filter(q => q),
        genders: genders.filter(g => g),
        statuses: ['active', 'inactive', 'on-leave', 'resigned']
      }
    });
    
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teachers'
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { 
      search = '', 
      status = 'active', 
      class: classId = '',
      section = '',
      gender = '',
      bloodGroup = '',
      academicYear = '',
      stream = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (classId && classId !== 'all') {
      query.class = classId;
    }
    
    if (section && section !== 'all') {
      query.section = section;
    }
    
    if (gender && gender !== 'all') {
      query.gender = gender;
    }
    
    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }
    
    if (academicYear && academicYear !== 'all') {
      query.academicYear = academicYear;
    }
    
    if (stream && stream !== 'all') {
      query.stream = stream;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { 'father.name': { $regex: search, $options: 'i' } },
        { 'father.phone': { $regex: search, $options: 'i' } },
        { 'mother.name': { $regex: search, $options: 'i' } },
        { 'mother.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Get students with pagination
    const [students, total] = await Promise.all([
      Student.find(query)
        .select('-password -fee.paymentHistory')
        .populate('class', 'className')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Student.countDocuments(query)
    ]);
    
    // Get unique values for filters
    const [classes, sections, academicYears, streams, bloodGroups] = await Promise.all([
      Class.distinct('_id'),
      Student.distinct('section'),
      Student.distinct('academicYear'),
      Student.distinct('stream'),
      Student.distinct('bloodGroup')
    ]);
    
    // Get class details for filter display
    const classDetails = await Class.find({ _id: { $in: classes } })
      .select('className section')
      .sort({ className: 1 });
    
    // Calculate statistics
    const stats = {
      totalStudents: await Student.countDocuments(),
      activeStudents: await Student.countDocuments({ status: 'active' }),
      byClass: await Student.aggregate([
        { $group: { _id: '$class', count: { $sum: 1 } } },
        { $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'class'
        }},
        { $unwind: '$class' },
        { $project: { className: '$class.className', count: 1 } }
      ]),
      byGender: await Student.aggregate([
        { $group: { _id: '$gender', count: { $sum: 1 } } }
      ]),
      feeSummary: await Student.aggregate([
        { $group: {
          _id: null,
          totalFee: { $sum: '$fee.totalFee' },
          collectedFee: { $sum: '$fee.paidFee' },
          pendingFee: { $sum: '$fee.pendingFee' }
        }}
      ])
    };
    
    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      students,
      stats,
      filters: {
        classes: classDetails,
        sections: sections.filter(s => s),
        academicYears: academicYears.filter(y => y),
        streams: streams.filter(s => s),
        bloodGroups: bloodGroups.filter(b => b),
        genders: ['male', 'female', 'other'],
        statuses: ['active', 'inactive', 'alumni', 'transfered', 'dropout']
      }
    });
    
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reasonForLeaving } = req.body;
    
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    student.status = status;
    if (status === 'transfered' || status === 'dropout') {
      student.leavingDate = new Date();
      student.reasonForLeaving = reasonForLeaving;
    }
    
    await student.save();
    
    // Also update User status
    await User.findOneAndUpdate(
      { email: student.email },
      { status: status === 'active' ? 'active' : 'inactive' }
    );
    
    res.status(200).json({
      success: true,
      message: `Student status updated to ${status}`,
      student
    });
    
  } catch (error) {
    console.error('Update student status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student status'
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.body;
    
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    if (permanent) {
      // Delete student and associated user
      await Student.findByIdAndDelete(id);
      await User.findOneAndDelete({ email: student.email });
      
      // Update class student count
      await Class.findByIdAndUpdate(student.class, {
        $inc: { currentStudents: -1 }
      });
    } else {
      // Soft delete - change status
      student.status = 'inactive';
      student.leavingDate = new Date();
      student.reasonForLeaving = 'Deleted by admin';
      await student.save();
      
      // Also update User status
      await User.findOneAndUpdate(
        { email: student.email },
        { status: 'inactive' }
      );
    }
    
    res.status(200).json({
      success: true,
      message: permanent ? 'Student permanently deleted' : 'Student deactivated'
    });
    
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student'
    });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findById(id)
      .select('-password')
      .populate('class', 'className section classTeacher roomNumber')
      .populate('subjects', 'subjectName subjectCode')
      .populate('class.classTeacher', 'name email phone');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Get attendance summary
    const attendanceStats = await Attendance.aggregate([
      { $match: { student: student._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);
    
    // Get marks summary
    const marksStats = await Mark.aggregate([
      { $match: { student: student._id } },
      { $group: {
        _id: null,
        average: { $avg: '$percentage' },
        highest: { $max: '$percentage' },
        lowest: { $min: '$percentage' },
        count: { $sum: 1 }
      }}
    ]);
    
    res.status(200).json({
      success: true,
      student,
      performance: {
        attendance: attendanceStats,
        marks: marksStats[0] || null
      }
    });
    
  } catch (error) {
    console.error('Get student details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student details'
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('-password')
      .populate('class', 'className section');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent role and email changes
    delete updates.role;
    delete updates.email;
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

const updateTeacherStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    teacher.status = status;
    await teacher.save();
    
    // Also update User status
    await User.findOneAndUpdate(
      { email: teacher.email },
      { status: status === 'active' ? 'active' : 'inactive' }
    );
    
    res.status(200).json({
      success: true,
      message: `Teacher status updated to ${status}`,
      teacher
    });
    
  } catch (error) {
    console.error('Update teacher status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update teacher status'
    });
  }
};

const getTeacherDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const teacher = await Teacher.findById(id)
      .select('-password')
      .populate('classesAssigned', 'className section')
      .populate('subjectsAssigned', 'subjectName subjectCode');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      success: true,
      teacher
    });
    
  } catch (error) {
    console.error('Get teacher details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher details'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Soft delete - change status to inactive
    user.status = 'inactive';
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// ==================== CLASS MANAGEMENT ====================

const createClass = async (req, res) => {
  try {
    const { className, section, classTeacher, roomNumber, academicYear, maxStudents } = req.body;
    
    // Check if class already exists
    const existingClass = await Class.findOne({ className, section, academicYear });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: 'Class with this name, section and academic year already exists'
      });
    }
    
    // Check if teacher exists and is a teacher
    const teacher = await User.findOne({ _id: classTeacher, role: USER_ROLES.TEACHER });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found or is not a teacher'
      });
    }
    
    // Create class
    const newClass = new Class({
      className,
      section,
      classTeacher,
      roomNumber,
      academicYear,
      maxStudents,
      currentStudents: 0,
      status: 'active'
    });
    
    await newClass.save();
    
    // Populate teacher details
    await newClass.populate('classTeacher', 'name email phone');
    
    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      class: newClass
    });
    
  } catch (error) {
    console.error('Create class error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create class'
    });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const { search = '', academicYear = '', section = '' } = req.query;
    
    // Build query
    const query = { status: 'active' };
    
    if (academicYear && academicYear !== 'all') {
      query.academicYear = academicYear;
    }
    
    if (section && section !== 'all') {
      query.section = section;
    }
    
    if (search) {
      query.$or = [
        { className: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const classes = await Class.find(query)
      .populate('classTeacher', 'name email phone')
      .populate('subjects', 'subjectName subjectCode')
      .sort({ className: 1, section: 1 });
    
    // Get unique academic years and sections for filters
    const academicYears = await Class.distinct('academicYear');
    const sections = await Class.distinct('section');
    
    res.status(200).json({
      success: true,
      count: classes.length,
      classes,
      filters: {
        academicYears: academicYears.filter(y => y),
        sections: sections.filter(s => s)
      }
    });
    
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
};

const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const classData = await Class.findById(id)
      .populate('classTeacher', 'name email phone subject')
      .populate('subjects', 'subjectName subjectCode teacher')
      .populate({
        path: 'subjects',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      });
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    // Get students in this class
    const students = await User.find({ 
      class: id, 
      role: USER_ROLES.STUDENT,
      status: 'active'
    }).select('name email rollNumber phone');
    
    res.status(200).json({
      success: true,
      class: classData,
      students
    });
    
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch class'
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const classData = await Class.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('classTeacher', 'name email');
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      class: classData
    });
    
  } catch (error) {
    console.error('Update class error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update class'
    });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    
    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    // Check if class has students
    if (classData.currentStudents > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete class with students. Transfer students first.'
      });
    }
    
    // Soft delete
    classData.status = 'inactive';
    await classData.save();
    
    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete class'
    });
  }
};

// ==================== SUBJECT MANAGEMENT ====================

const createSubject = async (req, res) => {
  try {
    const { subjectCode, subjectName, description, teacher, class: classId, credits } = req.body;
    
    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ subjectCode });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject code already exists'
      });
    }
    
    // Check if teacher exists and is a teacher
    if (teacher) {
      const teacherUser = await User.findOne({ _id: teacher, role: USER_ROLES.TEACHER });
      if (!teacherUser) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found or is not a teacher'
        });
      }
    }
    
    // Check if class exists
    if (classId) {
      const classExists = await Class.findById(classId);
      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
    }
    
    // Create subject
    const subject = new Subject({
      subjectCode,
      subjectName,
      description,
      teacher,
      class: classId,
      credits,
      status: 'active'
    });
    
    await subject.save();
    
    // Populate references
    await subject.populate('teacher', 'name email');
    await subject.populate('class', 'className section');
    
    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      subject
    });
    
  } catch (error) {
    console.error('Create subject error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create subject'
    });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const { search = '', teacher = '', class: classId = '' } = req.query;
    
    // Build query
    const query = { status: 'active' };
    
    if (teacher && teacher !== 'all') {
      query.teacher = teacher;
    }
    
    if (classId && classId !== 'all') {
      query.class = classId;
    }
    
    if (search) {
      query.$or = [
        { subjectCode: { $regex: search, $options: 'i' } },
        { subjectName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const subjects = await Subject.find(query)
      .populate('teacher', 'name email')
      .populate('class', 'className section')
      .sort({ subjectCode: 1 });
    
    // Get available teachers and classes for filters
    const teachers = await User.find({ role: USER_ROLES.TEACHER, status: 'active' })
      .select('name email')
      .sort({ name: 1 });
    
    const classes = await Class.find({ status: 'active' })
      .select('className section')
      .sort({ className: 1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
      filters: {
        teachers,
        classes
      }
    });
    
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects'
    });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const subject = await Subject.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
    .populate('teacher', 'name email')
    .populate('class', 'className section');
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      subject
    });
    
  } catch (error) {
    console.error('Update subject error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update subject'
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    // Soft delete
    subject.status = 'inactive';
    await subject.save();
    
    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subject'
    });
  }
};

module.exports = {
  getDashboardStats,
  addTeacher,
  addStudent,
  getAllTeachers,
  getAllStudents,
  updateStudentStatus,
  deleteStudent,
  getStudentDetails,
  getUserById,
  updateUser,
  updateTeacherStatus,
  getTeacherDetails,
  deleteUser,
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  
  // Subject Management
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject
};