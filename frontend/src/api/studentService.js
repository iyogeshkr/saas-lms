import api from './axiosConfig';

const studentService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/student/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard' };
    }
  },

  getAttendance: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/student/attendance?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attendance' };
    }
  },

  getMarks: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/student/marks?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch marks' };
    }
  },

  getPerformanceData: async (timeframe = 'monthly') => {
    try {
      const response = await api.get(`/student/performance?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch performance data' };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/student/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/student/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  getFeeStatus: async () => {
    try {
      const response = await api.get('/student/fees');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch fee status' };
    }
  },

   getStudents: async (filters = {}) => {
      try {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/admin/students?${params}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch students' };
      }
    },

    addStudent: async (studentData) => {
        try {
          const response = await api.post('/admin/students', studentData);
          return response.data;
        } catch (error) {
          throw error.response?.data || { message: 'Failed to add student' };
        }
      },

      getStudentDetails: async (studentId) => {
          try {
            const response = await api.get(`/admin/students/${studentId}`);
            return response.data;
          } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch student details' };
          }
        },

        updateStudentStatus: async (studentId, status, reason = '') => {
            try {
              const response = await api.put(`/admin/students/${studentId}/status`, { 
                status, 
                reasonForLeaving: reason 
              });
              return response.data;
            } catch (error) {
              throw error.response?.data || { message: 'Failed to update student status' };
            }
          },

          deleteStudent: async (studentId, permanent = false) => {
              try {
                const response = await api.delete(`/admin/students/${studentId}`, {
                  data: { permanent }
                });
                return response.data;
              } catch (error) {
                throw error.response?.data || { message: 'Failed to delete student' };
              }
            },

            updateStudent: async (studentId, studentData) => {
              try {
                const response = await api.put(`/admin/students/${studentId}`, studentData);
                return response.data;
              } catch (error) {
                throw error.response?.data || { message: 'Failed to update student' };
              }
            },

        getStudentStats: async () => {
            try {
              const response = await api.get('/admin/students?limit=1');
              return response.data.stats;
            } catch (error) {
              throw error.response?.data || { message: 'Failed to fetch student stats' };
            }
          }
};

export default studentService;