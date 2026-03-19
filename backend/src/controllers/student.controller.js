const User = require('../models/User');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const Subject = require('../models/Subject');
const Fee = require('../models/Fee');
const { USER_ROLES, EXAM_TYPES } = require('../utils/constants');

// ==================== STUDENT DASHBOARD ====================
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await User.findById(studentId)
      .select('-password')
      .populate('class', 'className section classTeacher roomNumber');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const attendanceSummary = await Attendance.aggregate([
      {
        $match: {
          student: studentId,
          class: student.class?._id
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalAttendance = attendanceSummary.reduce((sum, item) => sum + item.count, 0);
    const presentCount = attendanceSummary.find(item => item._id === 'present')?.count || 0;
    const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;
    
    const marksSummary = await Mark.aggregate([
      {
        $match: {
          student: studentId,
          class: student.class?._id
        }
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$percentage' },
          highest: { $max: '$percentage' },
          lowest: { $min: '$percentage' },
          count: { $sum: 1 }
        }
      }
    ]);

    const recentMarks = await Mark.find({ student: studentId })
      .populate('subject', 'subjectName subjectCode')
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const allSubjects = await Subject.find({
      class: student.class?._id,
      status: 'active'
    }).select('subjectName subjectCode');
    
    const subjectsWithMarks = [...new Set(recentMarks.map(m => m.subject._id.toString()))];
    const upcomingSubjects = allSubjects.filter(
      subject => !subjectsWithMarks.includes(subject._id.toString())
    );
    
    res.status(200).json({
      success: true,
      dashboard: {
        student,
        attendance: {
          percentage: attendancePercentage.toFixed(1),
          present: presentCount,
          total: totalAttendance,
          summary: attendanceSummary
        },
        marks: {
          average: marksSummary[0]?.average || 0,
          highest: marksSummary[0]?.highest || 0,
          lowest: marksSummary[0]?.lowest || 0,
          totalExams: marksSummary[0]?.count || 0
        },
        recentMarks,
        upcomingSubjects: upcomingSubjects.slice(0, 3)
      }
    });
    
  } catch (error) {
    console.error('Get student dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student dashboard'
    });
  }
};

// ==================== ATTENDANCE ====================

const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { startDate, endDate, limit = 50 } = req.query;
 
    const query = { student: studentId };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    
    const attendance = await Attendance.find(query)
      .populate('class', 'className section')
      .populate('markedBy', 'name')
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    // Calculate statistics
    const totalRecords = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
    
    // Group by month for chart data
    const monthlyData = attendance.reduce((acc, record) => {
      const monthYear = record.date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = { present: 0, total: 0 };
      }
      acc[monthYear].total++;
      if (record.status === 'present') {
        acc[monthYear].present++;
      }
      return acc;
    }, {});
    
    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      percentage: (data.present / data.total) * 100
    }));
    
    res.status(200).json({
      success: true,
      attendance: {
        records: attendance,
        statistics: {
          total: totalRecords,
          present: presentCount,
          absent: attendance.filter(a => a.status === 'absent').length,
          late: attendance.filter(a => a.status === 'late').length,
          excused: attendance.filter(a => a.status === 'excused').length,
          percentage: attendancePercentage.toFixed(1)
        },
        chartData
      }
    });
    
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance'
    });
  }
};

// ==================== MARKS & PERFORMANCE ====================

const getStudentMarks = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { subjectId, examType } = req.query;
    const query = { student: studentId };
    
    if (subjectId) {
      query.subject = subjectId;
    }
    
    if (examType) {
      query.examType = examType;
    }
    
    const marks = await Mark.find(query)
      .populate('subject', 'subjectName subjectCode')
      .populate('class', 'className section')
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });
   
    const marksBySubject = marks.reduce((acc, mark) => {
      const subjectId = mark.subject._id.toString();
      if (!acc[subjectId]) {
        acc[subjectId] = {
          subject: mark.subject,
          marks: []
        };
      }
      acc[subjectId].marks.push({
        examType: mark.examType,
        marksObtained: mark.marksObtained,
        totalMarks: mark.totalMarks,
        percentage: mark.percentage,
        grade: mark.grade,
        date: mark.createdAt,
        addedBy: mark.addedBy
      });
      return acc;
    }, {});

    const overallStats = marks.length > 0 ? {
      averagePercentage: marks.reduce((sum, m) => sum + m.percentage, 0) / marks.length,
      totalExams: marks.length,
      subjectsCount: Object.keys(marksBySubject).length
    } : null;

    const student = await User.findById(studentId).populate('class');
    const allSubjects = student.class ? await Subject.find({
      class: student.class._id,
      status: 'active'
    }) : [];
    
    res.status(200).json({
      success: true,
      marks: {
        bySubject: Object.values(marksBySubject),
        allRecords: marks,
        statistics: overallStats,
        availableSubjects: allSubjects,
        examTypes: Object.values(EXAM_TYPES)
      }
    });
    
  } catch (error) {
    console.error('Get student marks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marks'
    });
  }
};

const getPerformanceData = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { timeframe = 'monthly' } = req.query;
    
    let groupByFormat;
    let dateRange;
    
    // Set date range based on timeframe
    const now = new Date();
    if (timeframe === 'monthly') {
      dateRange = new Date(now);
      dateRange.setMonth(now.getMonth() - 6); // Last 6 months
      groupByFormat = { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
    } else if (timeframe === 'weekly') {
      dateRange = new Date(now);
      dateRange.setDate(now.getDate() - 30); // Last 30 days
      groupByFormat = { week: { $week: '$createdAt' }, year: { $year: '$createdAt' } };
    } else { // yearly
      dateRange = new Date(now);
      dateRange.setFullYear(now.getFullYear() - 2); // Last 2 years
      groupByFormat = { year: { $year: '$createdAt' } };
    }
    
    // Get performance data grouped by time period
    const performanceData = await Mark.aggregate([
      {
        $match: {
          student: studentId,
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: groupByFormat,
          averagePercentage: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 }
      }
    ]);
    
    // Format data for charts
    const formattedData = performanceData.map(item => {
      let label;
      if (timeframe === 'monthly') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      } else if (timeframe === 'weekly') {
        label = `Week ${item._id.week}, ${item._id.year}`;
      } else {
        label = item._id.year.toString();
      }
      
      return {
        label,
        percentage: item.averagePercentage.toFixed(1),
        count: item.count
      };
    });
    
    // Get subject-wise performance
    const subjectPerformance = await Mark.aggregate([
      {
        $match: {
          student: studentId
        }
      },
      {
        $group: {
          _id: '$subject',
          averagePercentage: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      {
        $unwind: '$subject'
      },
      {
        $project: {
          subjectName: '$subject.subjectName',
          averagePercentage: 1,
          count: 1
        }
      },
      {
        $sort: { averagePercentage: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      performance: {
        timeline: formattedData,
        bySubject: subjectPerformance,
        timeframe
      }
    });
    
  } catch (error) {
    console.error('Get performance data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance data'
    });
  }
};

// ==================== STUDENT PROFILE ====================

const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const student = await User.findById(studentId)
      .select('-password')
      .populate('class', 'className section classTeacher roomNumber academicYear');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    let classTeacher = null;
    if (student.class && student.class.classTeacher) {
      classTeacher = await User.findById(student.class.classTeacher)
        .select('name email phone subject');
    }
    
    // Get current subjects
    const subjects = student.class ? await Subject.find({
      class: student.class._id,
      status: 'active'
    }).populate('teacher', 'name') : [];
    
    res.status(200).json({
      success: true,
      profile: {
        ...student.toObject(),
        classTeacher,
        subjects
      }
    });
    
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user._id;
    const updates = req.body;
    
    // Remove restricted fields
    delete updates.password;
    delete updates.role;
    delete updates.email;
    delete updates.class;
    delete updates.rollNumber;
    
    const student = await User.findByIdAndUpdate(
      studentId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      student
    });
    
  } catch (error) {
    console.error('Update student profile error:', error);
    
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
      message: 'Failed to update profile'
    });
  }
};

// ==================== FEE STATUS ====================

const getFeeStatus = async (req, res) => {
  try {
    const studentId = req.user._id;
    const currentYear = new Date().getFullYear();

    // Get fees from database
    const fees = await Fee.find({
      student: studentId,
      academicYear: currentYear.toString()
    }).sort({ dueDate: 1 });

    // Calculate summary
    const totalPaid = fees.filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0);
    const totalPending = fees.filter(f => f.status === 'pending')
      .reduce((sum, f) => sum + f.amount, 0);
    const totalUpcoming = fees.filter(f => f.status === 'upcoming')
      .reduce((sum, f) => sum + f.amount, 0);

    res.status(200).json({
      success: true,
      fees: {
        summary: {
          totalPaid,
          totalPending,
          totalUpcoming,
          totalAnnual: totalPaid + totalPending + totalUpcoming
        },
        details: fees.map(fee => ({
          id: fee._id,
          term: fee.term,
          amount: fee.amount,
          dueDate: fee.dueDate,
          status: fee.status,
          invoice: fee.invoiceNumber || `INV-${currentYear}-${String(fee._id).slice(-4)}`,
          paidDate: fee.paidDate,
          paymentMethod: fee.paymentMethod
        }))
      }
    });

  } catch (error) {
    console.error('Get fee status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fee status'
    });
  }
};

module.exports = {
  getStudentDashboard,
  getStudentAttendance,
  getStudentMarks,
  getPerformanceData,
  getStudentProfile,
  updateStudentProfile,
  getFeeStatus
};