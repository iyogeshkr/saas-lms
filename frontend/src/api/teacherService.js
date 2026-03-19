import api from './axiosConfig';

const teacherService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/teacher/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard' };
    }
  },

  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/teacher/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark attendance' };
    }
  },

  getClassAttendance: async (classId, date) => {
    try {
      const response = await api.get(`/teacher/attendance/${classId}/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attendance' };
    }
  },

  getAttendanceReport: async (classId, startDate, endDate) => {
    try {
      const params = new URLSearchParams({ startDate, endDate }).toString();
      const response = await api.get(`/teacher/attendance/report/${classId}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attendance report' };
    }
  },

  addMarks: async (marksData) => {
    try {
      const response = await api.post('/teacher/marks', marksData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add marks' };
    }
  },

  getClassMarks: async (classId, subjectId, examType) => {
    try {
      const response = await api.get(`/teacher/marks/${classId}/${subjectId}/${examType}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch marks' };
    }
  },

  getClassStudents: async (classId) => {
    try {
      const response = await api.get(`/teacher/students/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch students' };
    }
  },

  getTeacherSubjects: async () => {
    try {
      const response = await api.get('/teacher/subjects');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch subjects' };
    }
  },

  getTeacherClasses: async () => {
    try {
      const response = await api.get('/teacher/classes');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch classes' };
    }
  },

  getTeachers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/teachers?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch teachers' };
    }
  },

  addTeacher: async (teacherData) => {
    try {
      const response = await api.post('/admin/teachers', teacherData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add teacher' };
    }
  },

  getTeacherDetails: async (teacherId) => {
    try {
      const response = await api.get(`/admin/teachers/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch teacher details' };
    }
  },

  updateTeacherStatus: async (teacherId, status) => {
    try {
      const response = await api.put(`/admin/teachers/${teacherId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update teacher status' };
    }
  },

  updateTeacher: async (teacherId, teacherData) => {
    try {
      const response = await api.put(`/admin/teachers/${teacherId}`, teacherData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update teacher' };
    }
  },

  deleteTeacher: async (teacherId) => {
    try {
      const response = await api.delete(`/admin/teachers/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete teacher' };
    }
  },

  getTeacherStats: async () => {
    try {
      const response = await api.get('/admin/teachers?limit=1');
      return response.data.stats;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch teacher stats' };
    }
  }
};

export default teacherService;