const User = require('../models/User');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const Subject = require('../models/Subject');
const { USER_ROLES, ATTENDANCE_STATUS, EXAM_TYPES } = require('../utils/constants');

// ==================== TEACHER DASHBOARD ====================
const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const teacherClasses = await Class.find({ classTeacher: teacherId, status: 'active' })
      .select('className section currentStudents roomNumber');
 
    const totalStudents = teacherClasses.reduce((sum, cls) => sum + cls.currentStudents, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAttendance = await Attendance.aggregate([
      {
        $match: {
          markedBy: teacherId,
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get assignments to grade (marks not added yet)
    const pendingMarks = await Mark.countDocuments({
      addedBy: teacherId,
      marksObtained: null
    });
    
    // Get recent students
    const recentStudents = await User.find({
      class: { $in: teacherClasses.map(c => c._id) },
      role: USER_ROLES.STUDENT,
      status: 'active'
    })
    .select('name email rollNumber class')
    .populate('class', 'className section')
    .sort({ createdAt: -1 })
    .limit(5);
    
    res.status(200).json({
      success: true,
      dashboard: {
        totalClasses: teacherClasses.length,
        totalStudents,
        teacherClasses,
        todayAttendance,
        pendingMarks,
        recentStudents
      }
    });
    
  } catch (error) {
    console.error('Get teacher dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher dashboard'
    });
  }
};

// ==================== ATTENDANCE MANAGEMENT ====================

const markAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceRecords } = req.body;
    const teacherId = req.user._id;
    
    // Validate class exists and teacher is assigned to it
    const classData = await Class.findOne({ 
      _id: classId, 
      classTeacher: teacherId,
      status: 'active' 
    });
    
    if (!classData) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to mark attendance for this class'
      });
    }
    
    // Parse date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    
    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({
      class: classId,
      date: attendanceDate
    });
    
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this date'
      });
    }
    
    // Process each attendance record
    const attendancePromises = attendanceRecords.map(async (record) => {
      // Check if student exists and belongs to this class
      const student = await User.findOne({
        _id: record.studentId,
        class: classId,
        role: USER_ROLES.STUDENT,
        status: 'active'
      });
      
      if (!student) {
        throw new Error(`Student ${record.studentId} not found in class`);
      }
      
      // Create attendance record
      const attendance = new Attendance({
        student: record.studentId,
        class: classId,
        date: attendanceDate,
        status: record.status,
        remarks: record.remarks,
        markedBy: teacherId
      });
      
      return attendance.save();
    });
    
    await Promise.all(attendancePromises);
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      date: attendanceDate,
      count: attendanceRecords.length
    });
    
  } catch (error) {
    console.error('Mark attendance error:', error);
    
    if (error.message.includes('not found in class')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance'
    });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const { classId, date } = req.params;
    const teacherId = req.user._id;
    
    // Validate class and teacher
    const classData = await Class.findOne({ 
      _id: classId, 
      classTeacher: teacherId,
      status: 'active' 
    }).populate('classTeacher', 'name');
    
    if (!classData) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view attendance for this class'
      });
    }
    
    // Parse date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Get attendance for the date
    const attendance = await Attendance.find({
      class: classId,
      date: { $gte: attendanceDate, $lt: nextDay }
    })
    .populate('student', 'name rollNumber')
    .sort('student.name');
    
    // Get all students in class for comparison
    const allStudents = await User.find({
      class: classId,
      role: USER_ROLES.STUDENT,
      status: 'active'
    }).select('name rollNumber _id');
    
    // Create a map of attendance by student
    const attendanceMap = {};
    attendance.forEach(record => {
      attendanceMap[record.student._id.toString()] = {
        status: record.status,
        remarks: record.remarks,
        _id: record._id
      };
    });
    
    // Combine all students with their attendance status
    const attendanceWithStudents = allStudents.map(student => ({
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber
      },
      attendance: attendanceMap[student._id.toString()] || {
        status: 'absent', // Default if not marked
        remarks: ''
      }
    }));
    
    res.status(200).json({
      success: true,
      class: {
        _id: classData._id,
        className: classData.className,
        section: classData.section,
        classTeacher: classData.classTeacher
      },
      date: attendanceDate,
      attendance: attendanceWithStudents,
      summary: {
        total: allStudents.length,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        late: attendance.filter(a => a.status === 'late').length,
        excused: attendance.filter(a => a.status === 'excused').length
      }
    });
    
  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance'
    });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;
    const teacherId = req.user._id;
    
    // Validate class and teacher
    const classData = await Class.findOne({ 
      _id: classId, 
      classTeacher: teacherId,
      status: 'active' 
    });
    
    if (!classData) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view reports for this class'
      });
    }
    
    // Parse dates
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    // Get attendance in date range
    const attendance = await Attendance.find({
      class: classId,
      date: { $gte: start, $lte: end }
    })
    .populate('student', 'name rollNumber')
    .sort({ date: -1, 'student.name': 1 });
    
    // Get all students in class
    const students = await User.find({
      class: classId,
      role: USER_ROLES.STUDENT,
      status: 'active'
    }).select('name rollNumber');
    
    // Generate report summary
    const reportSummary = {
      period: { start, end },
      totalRecords: attendance.length,
      uniqueDates: [...new Set(attendance.map(a => a.date.toDateString()))].length,
      byStatus: attendance.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      }, {}),
      byDate: attendance.reduce((acc, record) => {
        const dateStr = record.date.toDateString();
        if (!acc[dateStr]) {
          acc[dateStr] = {
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            total: 0
          };
        }
        acc[dateStr][record.status]++;
        acc[dateStr].total++;
        return acc;
      }, {})
    };
    
    res.status(200).json({
      success: true,
      report: {
        class: classData.className,
        section: classData.section,
        students,
        attendance,
        summary: reportSummary
      }
    });
    
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate attendance report'
    });
  }
};

// ==================== MARKS MANAGEMENT ====================

const addMarks = async (req, res) => {
  try {
    const { classId, subjectId, examType, marksData } = req.body;
    const teacherId = req.user._id;
    
    // Validate teacher has access to this class and subject
    const classData = await Class.findOne({
      _id: classId,
      classTeacher: teacherId,
      status: 'active'
    });
    
    if (!classData) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add marks for this class'
      });
    }
    
    const subject = await Subject.findOne({
      _id: subjectId,
      teacher: teacherId,
      status: 'active'
    });
    
    if (!subject) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add marks for this subject'
      });
    }
    
    // Process each mark record
    const markPromises = marksData.map(async (record) => {
      // Check if student exists and belongs to this class
      const student = await User.findOne({
        _id: record.studentId,
        class: classId,
        role: USER_ROLES.STUDENT,
        status: 'active'
      });
      
      if (!student) {
        throw new Error(`Student ${record.studentId} not found in class`);
      }
      
      // Check if marks already exist for this exam
      const existingMark = await Mark.findOne({
        student: record.studentId,
        subject: subjectId,
        examType,
        class: classId
      });
      
      if (existingMark) {
        // Update existing marks
        existingMark.marksObtained = record.marks;
        existingMark.totalMarks = record.totalMarks || 100;
        existingMark.remarks = record.remarks;
        return existingMark.save();
      } else {
        // Create new marks record
        const mark = new Mark({
          student: record.studentId,
          subject: subjectId,
          class: classId,
          examType,
          marksObtained: record.marks,
          totalMarks: record.totalMarks || 100,
          remarks: record.remarks,
          addedBy: teacherId
        });
        
        return mark.save();
      }
    });
    
    await Promise.all(markPromises);
    
    res.status(201).json({
      success: true,
      message: 'Marks added/updated successfully',
      count: marksData.length,
      examType,
      subject: subject.subjectName
    });
    
  } catch (error) {
    console.error('Add marks error:', error);
    
    if (error.message.includes('not found in class')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add marks'
    });
  }
};

const getClassMarks = async (req, res) => {
  try {
    const { classId, subjectId, examType } = req.params;
    const teacherId = req.user._id;
    
    // Validate teacher has access
    const classData = await Class.findOne({
      _id: classId,
      classTeacher: teacherId,
      status: 'active'
    });
    
    if (!classData) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view marks for this class'
      });
    }
    
    const subject = await Subject.findOne({
      _id: subjectId,
      teacher: teacherId,
      status: 'active'
    });
    
    if (!subject) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view marks for this subject'
      });
    }
    
    // Get all students in class
    const students = await User.find({
      class: classId,
      role: USER_ROLES.STUDENT,
      status: 'active'
    }).select('name rollNumber _id');
    
    // Get marks for specified exam type
    const marks = await Mark.find({
      class: classId,
      subject: subjectId,
      examType
    }).populate('student', 'name rollNumber');
    
    // Create map of marks by student
    const marksMap = {};
    marks.forEach(mark => {
      marksMap[mark.student._id.toString()] = {
        marksObtained: mark.marksObtained,
        totalMarks: mark.totalMarks,
        percentage: mark.percentage,
        grade: mark.grade,
        remarks: mark.remarks,
        _id: mark._id
      };
    });
    
    // Combine students with their marks
    const studentsWithMarks = students.map(student => ({
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber
      },
      marks: marksMap[student._id.toString()] || null
    }));
    
    // Calculate class statistics
    const validMarks = marks.filter(m => m.marksObtained !== null);
    const classStats = validMarks.length > 0 ? {
      average: validMarks.reduce((sum, m) => sum + m.marksObtained, 0) / validMarks.length,
      highest: Math.max(...validMarks.map(m => m.marksObtained)),
      lowest: Math.min(...validMarks.map(m => m.marksObtained)),
      totalStudents: students.length,
      marksEntered: validMarks.length
    } : null;
    
    res.status(200).json({
      success: true,
      class: {
        _id: classData._id,
        className: classData.className,
        section: classData.section
      },
      subject: {
        _id: subject._id,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode
      },
      examType,
      marks: studentsWithMarks,
      statistics: classStats
    });
    
  } catch (error) {
    console.error('Get class marks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marks'
    });
  }
};

const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user._id;
    
    // Validate teacher has access to this class
    const classData = await Class.findOne({
      _id: classId,
      classTeacher: teacherId,
      status: 'active'
    });
    
    if (!classData) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view students of this class'
      });
    }
    
    const students = await User.find({
      class: classId,
      role: USER_ROLES.STUDENT,
      status: 'active'
    })
    .select('-password')
    .populate('class', 'className section')
    .sort('rollNumber');
    
    // Get attendance summary for each student
    const studentsWithAttendance = await Promise.all(
      students.map(async (student) => {
        const attendanceSummary = await Attendance.aggregate([
          {
            $match: {
              student: student._id,
              class: classId
            }
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        
        // Get marks summary
        const marksSummary = await Mark.aggregate([
          {
            $match: {
              student: student._id,
              class: classId
            }
          },
          {
            $group: {
              _id: null,
              average: { $avg: '$percentage' },
              count: { $sum: 1 }
            }
          }
        ]);
        
        return {
          ...student.toObject(),
          attendance: attendanceSummary.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          marksAverage: marksSummary[0]?.average || 0
        };
      })
    );
    
    res.status(200).json({
      success: true,
      class: {
        _id: classData._id,
        className: classData.className,
        section: classData.section,
        classTeacher: classData.classTeacher
      },
      students: studentsWithAttendance,
      count: students.length
    });
    
  } catch (error) {
    console.error('Get class students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

// ==================== TEACHER PROFILE ====================

const getTeacherSubjects = async (req, res) => {
  try {
    const teacherId = req.user._id;
    
    const subjects = await Subject.find({
      teacher: teacherId,
      status: 'active'
    })
    .populate('class', 'className section')
    .sort('subjectName');
    
    res.status(200).json({
      success: true,
      subjects,
      count: subjects.length
    });
    
  } catch (error) {
    console.error('Get teacher subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects'
    });
  }
};

const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user._id;
    
    const classes = await Class.find({
      classTeacher: teacherId,
      status: 'active'
    })
    .populate('subjects', 'subjectName subjectCode')
    .sort('className');
    
    res.status(200).json({
      success: true,
      classes,
      count: classes.length
    });
    
  } catch (error) {
    console.error('Get teacher classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
};

module.exports = {
  // Dashboard
  getTeacherDashboard,
  
  // Attendance
  markAttendance,
  getClassAttendance,
  getAttendanceReport,
  
  // Marks
  addMarks,
  getClassMarks,
  
  // Students
  getClassStudents,
  
  // Profile
  getTeacherSubjects,
  getTeacherClasses
};