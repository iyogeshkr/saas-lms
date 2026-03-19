module.exports = {
  USER_ROLES: {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
  },
  
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
  },
  
  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    EXCUSED: 'excused'
  },
  
  EXAM_TYPES: {
    TEST1: 'test1',
    TEST2: 'test2',
    FINAL: 'final',
    ASSIGNMENT: 'assignment',
    QUIZ: 'quiz'
  },
  
  // Frontend form field mappings
  FORM_FIELDS: {
    // User fields
    NAME: 'name',
    EMAIL: 'email',
    PASSWORD: 'password',
    PHONE: 'phone',
    ROLE: 'role',
    
    // Student fields
    ROLL_NUMBER: 'rollNumber',
    PARENT_PHONE: 'parentPhone',
    CLASS: 'class',
    
    // Teacher fields
    SUBJECT: 'subject',
    QUALIFICATION: 'qualification',
    EXPERIENCE: 'experience',
    
    // Class fields
    CLASS_NAME: 'className',
    SECTION: 'section',
    CLASS_TEACHER: 'classTeacher',
    ROOM_NUMBER: 'roomNumber',
    ACADEMIC_YEAR: 'academicYear',
    MAX_STUDENTS: 'maxStudents'
  }
};