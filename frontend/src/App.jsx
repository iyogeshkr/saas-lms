import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authService from './api/authService';

// Landing Page
import LandingPage from './pages/LandingPage'; 

// Auth Pages
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AddTeacher from './pages/admin/AddTeacher';
import AddStudent from './pages/admin/AddStudent';
import ManageClasses from './pages/admin/ManageClasses';
import ManageSubjects from './pages/admin/ManageSubjects';
import TeachersList from './pages/admin/TeachersList';
import StudentsList from './pages/admin/StudentsList';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAttendance from './pages/teacher/Attendance';
import AddMarks from './pages/teacher/AddMarks';
import StudentList from './pages/teacher/StudentList';
import TeacherReports from './pages/teacher/Reports';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentMarks from './pages/student/MarksView';
import FeeStatus from './pages/student/FeeStatus';

// Common Pages
import Messages from './pages/common/Messages';
import Profile from './pages/common/Profile';
import Signup from './pages/auth/Signup';

// Mock authentication check (replace with real auth later)
const isAuthenticated = () => localStorage.getItem('token') !== null;
const getUserRole = () => localStorage.getItem('role') || 'student';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getCurrentRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    switch(userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'teacher':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/home" element={<LandingPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Profile role="admin" userName="Admin User" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-teacher"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-student"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-classes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-subjects"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TeachersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StudentsList />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Profile role="teacher" userName="John Doe" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/add-marks"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AddMarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/messages"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Messages role="teacher" userName="John Doe" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/reports"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherReports />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Profile role="student" userName="Alice Johnson" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/marks"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentMarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/messages"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Messages role="student" userName="Alice Johnson" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/fees"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <FeeStatus />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;