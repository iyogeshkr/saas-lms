import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Select, 
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  alpha,
  Fade,
  Slide,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Person as PersonIcon,
  School as SchoolIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../api/authService';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Color palette
  const colors = {
    primary: '#1a73e8',
    primaryDark: '#0d47a1',
    primaryLight: '#e8f0fe',
    secondary: '#34a853',
    background: '#ffffff',
    textPrimary: '#202124',
    textSecondary: '#5f6368',
    white: '#ffffff',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(email, password, role);
      
      if (result.success) {
        switch(role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin': 'Administrator',
      'teacher': 'Teacher',
      'student': 'Student',
    };
    return labels[role] || role;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(colors.primary, 0.1)} 0%, ${alpha(colors.secondary, 0.05)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Slide in={true} direction="down" timeout={500}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                bgcolor: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: `0 8px 24px ${alpha(colors.primary, 0.3)}`,
              }}
            >
              <SchoolIcon sx={{ color: colors.white, fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight={800}
              color={colors.textPrimary}
              gutterBottom
            >
              EduSync
            </Typography>
            <Typography variant="subtitle1" color={colors.textSecondary}>
              School Management System
            </Typography>
            <Typography variant="body2" color={colors.textSecondary}>
              Login to access your account
            </Typography>
          </Box>
        </Slide>

        <Fade in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${alpha(colors.primary, 0.2)}`,
              boxShadow: `0 20px 60px ${alpha(colors.primary, 0.15)}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              },
            }}
          >
            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              {/* Header */}
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={colors.textPrimary}
                  gutterBottom
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" color={colors.textSecondary}>
                  Please login to continue to your {getRoleLabel(role)} dashboard
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: alpha('#f44336', 0.1),
                    border: `1px solid ${alpha('#f44336', 0.2)}`,
                    color: '#d32f2f',
                    '& .MuiAlert-icon': {
                      color: '#d32f2f',
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin}>
                {/* Role Selector */}
                <Select
                  fullWidth
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: colors.primaryLight,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(colors.primary, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                      borderWidth: 2,
                    },
                  }}
                  inputProps={{
                    sx: {
                      py: 1.5,
                      px: 2,
                      fontWeight: 500,
                    }
                  }}
                >
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PersonIcon fontSize="small" />
                      Administrator
                    </Box>
                  </MenuItem>
                  <MenuItem value="teacher">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PersonIcon fontSize="small" />
                      Teacher
                    </Box>
                  </MenuItem>
                  <MenuItem value="student">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PersonIcon fontSize="small" />
                      Student
                    </Box>
                  </MenuItem>
                </Select>
                
                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: colors.textSecondary }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                {/* Password Field */}
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: colors.textSecondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          sx={{ color: colors.textSecondary }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                {/* Login Button */}
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    bgcolor: colors.primary,
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
                    '&:hover': {
                      bgcolor: colors.primaryDark,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 30px ${alpha(colors.primary, 0.4)}`,
                    },
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      Login as {getRoleLabel(role)}
                      <ArrowForwardIcon sx={{ ml: 1 }} />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <Divider sx={{ my: 4, color: colors.textSecondary }}>
                <Typography variant="caption" color={colors.textSecondary}>
                  Don't have an account?
                </Typography>
              </Divider>

              {/* Sign Up Link */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: colors.primary,
                    color: colors.primary,
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: colors.primaryDark,
                      bgcolor: colors.primaryLight,
                    },
                  }}
                >
                  Create New Account
                </Button>
              </Box>

              {/* Back to Home */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  component={Link}
                  to="/"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    color: colors.textSecondary,
                    fontWeight: 500,
                    '&:hover': {
                      color: colors.primary,
                    },
                  }}
                >
                  Back to Home
                </Button>
              </Box>

              {/* Security Note */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color={colors.textSecondary}>
                  🔒 Your login is secure and encrypted
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Footer Note */}
        <Fade in={true} timeout={1200}>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color={colors.textSecondary}>
              Need help? Contact support@edusync.com
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;