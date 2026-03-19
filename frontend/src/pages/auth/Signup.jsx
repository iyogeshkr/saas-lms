import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Avatar,
  Link,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  Paper,
  Divider,
  alpha,
  Fade,
  Slide,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../api/authService";

const Signup = () => {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  // Color palette
  const colors = {
    primary: "#1a73e8",
    primaryDark: "#0d47a1",
    primaryLight: "#e8f0fe",
    secondary: "#34a853",
    background: "#ffffff",
    textPrimary: "#202124",
    textSecondary: "#5f6368",
    white: "#ffffff",
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = "Full name is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";
    if (password !== confirmPass) errors.confirmPass = "Passwords do not match";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const userData = {
        name,
        email,
        password,
        role,
        confirmPassword: confirmPass
      };

      const response = await authService.register(userData);
      
      if (response.success) {
        setSuccess(true);
        setOpenSnackbar(true);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && !success) {
      handleSignup();
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleTogglePassword = () => {
    setShowPass(!showPass);
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin': 'Administrator',
      'teacher': 'Teacher',
      'student': 'Student',
    };
    return labels[role] || role;
  };

  const getRoleDescription = () => {
    const descriptions = {
      'admin': 'Manage school system and users',
      'teacher': 'Track student progress and attendance',
      'student': 'Access classes and assignments',
    };
    return descriptions[role];
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          icon={<VerifiedIcon />}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: `0 8px 32px ${alpha(colors.secondary, 0.2)}`,
          }}
        >
          🎉 Account created successfully! Redirecting to login...
        </Alert>
      </Snackbar>

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
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {/* Left Side - Welcome Info */}
            <Grid item xs={12} md={6}>
              <Slide in={true} direction="right" timeout={500}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      bgcolor: colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: `0 8px 24px ${alpha(colors.primary, 0.3)}`,
                    }}
                  >
                    <SchoolIcon sx={{ color: colors.white, fontSize: 32 }} />
                  </Box>
                  
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    color={colors.textPrimary}
                    gutterBottom
                  >
                    Join EduSync
                  </Typography>
                  
                  <Typography
                    variant="h6"
                    color={colors.textSecondary}
                    sx={{ mb: 4, lineHeight: 1.6 }}
                  >
                    Join thousands of educational institutions using our platform 
                    to streamline school management and enhance learning experiences.
                  </Typography>

                  {/* Benefits List */}
                  <Box sx={{ mb: 4 }}>
                    {[
                      "No setup fees or hidden charges",
                      "30-day free trial for all features",
                      "24/7 dedicated support",
                      "Secure and GDPR compliant",
                      "Easy data migration assistance",
                    ].map((benefit, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <VerifiedIcon sx={{ color: colors.secondary, fontSize: 20 }} />
                        <Typography variant="body1" color={colors.textPrimary}>
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color={colors.primary}>
                        500+
                      </Typography>
                      <Typography variant="body2" color={colors.textSecondary}>
                        Schools
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color={colors.primary}>
                        99%
                      </Typography>
                      <Typography variant="body2" color={colors.textSecondary}>
                        Satisfaction
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800} color={colors.primary}>
                        24/7
                      </Typography>
                      <Typography variant="body2" color={colors.textSecondary}>
                        Support
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Slide>
            </Grid>

            {/* Right Side - Signup Form */}
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={800}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
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
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                    },
                  }}
                >
                  {/* Form Header */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={colors.textPrimary}
                      gutterBottom
                    >
                      Create Your Account
                    </Typography>
                    <Typography variant="body2" color={colors.textSecondary}>
                      Sign up as a {getRoleLabel(role)} to {getRoleDescription()}
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
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  {/* Success Message */}
                  {success && (
                    <Alert 
                      severity="success" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: alpha(colors.secondary, 0.1),
                        border: `1px solid ${alpha(colors.secondary, 0.2)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} />
                        <Typography>
                          Account created! Redirecting to login...
                        </Typography>
                      </Box>
                    </Alert>
                  )}

                  {/* Role Selection */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ 
                      bgcolor: colors.white,
                      px: 1,
                      transform: 'translate(14px, -9px) scale(0.75)',
                    }}>
                      Account Type
                    </InputLabel>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={loading || success}
                      sx={{
                        borderRadius: 2,
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
                    >
                      <MenuItem value="student">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <PersonIcon fontSize="small" />
                          <Box>
                            <Typography variant="body1">Student</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Access classes and assignments
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="teacher">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <PersonIcon fontSize="small" />
                          <Box>
                            <Typography variant="body1">Teacher</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Track student progress
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="admin">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <PersonIcon fontSize="small" />
                          <Box>
                            <Typography variant="body1">Administrator</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Manage school system
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {/* Name Field */}
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    disabled={loading || success}
                    onKeyPress={handleKeyPress}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: colors.textSecondary }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />

                  {/* Email Field */}
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    disabled={loading || success}
                    onKeyPress={handleKeyPress}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: colors.textSecondary }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />

                  {/* Password Field */}
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!formErrors.password}
                    helperText={formErrors.password || "Minimum 6 characters"}
                    disabled={loading || success}
                    onKeyPress={handleKeyPress}
                    sx={{ mb: 3 }}
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
                            disabled={loading || success}
                            sx={{ color: colors.textSecondary }}
                          >
                            {showPass ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />

                  {/* Confirm Password Field */}
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showPass ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    error={!!formErrors.confirmPass}
                    helperText={formErrors.confirmPass}
                    disabled={loading || success}
                    onKeyPress={handleKeyPress}
                    sx={{ mb: 4 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: colors.textSecondary }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />

                  {/* Signup Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSignup}
                    disabled={loading || success}
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
                    ) : success ? (
                      <>
                        <VerifiedIcon sx={{ mr: 1 }} />
                        Account Created
                      </>
                    ) : (
                      <>
                        Create {getRoleLabel(role)} Account
                        <ArrowForwardIcon sx={{ ml: 1 }} />
                      </>
                    )}
                  </Button>

                  <Divider sx={{ my: 4, color: colors.textSecondary }}>
                    <Typography variant="caption" color={colors.textSecondary}>
                      Already have an account?
                    </Typography>
                  </Divider>

                  {/* Login Link */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      component={Link}
                      onClick={() => navigate("/login")}
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        color: colors.textSecondary,
                        fontWeight: 500,
                        '&:hover': {
                          color: colors.primary,
                        },
                      }}
                    >
                      Back to Login
                    </Button>
                  </Box>

                  {/* Terms */}
                  <Typography
                    variant="caption"
                    align="center"
                    display="block"
                    sx={{ mt: 3, color: colors.textSecondary }}
                  >
                    By creating an account, you agree to our{' '}
                    <Link sx={{ color: colors.primary, fontWeight: 500 }}>Terms</Link>
                    {' '}and{' '}
                    <Link sx={{ color: colors.primary, fontWeight: 500 }}>Privacy Policy</Link>
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Signup;