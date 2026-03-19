import api from './axiosConfig';

const adminService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
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

  getTeachers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/teachers?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch teachers' };
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

  getStudents: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/students?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch students' };
    }
  },

  getUser: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  createClass: async (classData) => {
    try {
      const response = await api.post('/admin/classes', classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create class' };
    }
  },

  getClasses: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/classes?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch classes' };
    }
  },

  getClassById: async (classId) => {
    try {
      const response = await api.get(`/admin/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch class' };
    }
  },

  updateClass: async (classId, classData) => {
    try {
      const response = await api.put(`/admin/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update class' };
    }
  },

  deleteClass: async (classId) => {
    try {
      const response = await api.delete(`/admin/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete class' };
    }
  },

  createSubject: async (subjectData) => {
    try {
      const response = await api.post('/admin/subjects', subjectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create subject' };
    }
  },

  getSubjects: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/subjects?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch subjects' };
    }
  },

  updateSubject: async (subjectId, subjectData) => {
    try {
      const response = await api.put(`/admin/subjects/${subjectId}`, subjectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update subject' };
    }
  },

  deleteSubject: async (subjectId) => {
    try {
      const response = await api.delete(`/admin/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete subject' };
    }
  },
};

export default adminService;