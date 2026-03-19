import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from "../../api/authService";
import { useNavigate } from "react-router-dom";

const Profile = ({ role, userName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    class: "",
    joinDate: "",
    address: "",
    bio: "",
    rollNumber: "",
    subjects: [],
    classTeacher: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch real profile data
  useEffect(() => {
    fetchProfileData();
    fetchActivities();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();

      if (response && response.success) {
        // Handle different response structures
        const userData = response.user || response.profile || response.data || response;
        
        setProfileData({
          name: userData?.name || authService.getCurrentUserName() || "User",
          email: userData?.email || "",
          phone: userData?.phone || "",
          department: userData?.department || (role === "teacher" ? "Mathematics Department" : ""),
          class: userData?.class?.className || userData?.className || 
                (role === "student" ? "Class 10-A" : ""),
          joinDate: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 
                   userData?.joinDate || "2022-09-01",
          address: userData?.address || "123 Main St, City, Country",
          bio: userData?.bio || `${role.charAt(0).toUpperCase() + role.slice(1)} at School Management System`,
          rollNumber: userData?.rollNumber || "",
          subjects: userData?.subjects || [],
          classTeacher: userData?.classTeacher || null
        });
      } else {
        // If API fails, use localStorage data
        useLocalStorageData();
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Failed to load profile. Using default data.");
      useLocalStorageData();
    } finally {
      setLoading(false);
    }
  };

  const useLocalStorageData = () => {
    const storedName = authService.getCurrentUserName() || "User";
    const storedEmail = localStorage.getItem('userEmail') || `${storedName.toLowerCase().replace(/\s+/g, '.')}@school.com`;
    
    setProfileData({
      name: storedName,
      email: storedEmail,
      phone: "+1 234 567 8900",
      department: role === "teacher" ? "Mathematics Department" : "",
      class: role === "student" ? "Class 10-A" : "",
      joinDate: "2022-09-01",
      address: "123 Main St, City, Country",
      bio: `${role.charAt(0).toUpperCase() + role.slice(1)} at School Management System`,
      rollNumber: role === "student" ? "STU2024001" : "",
      subjects: role === "student" ? ["Mathematics", "Science", "English"] : [],
      classTeacher: role === "student" ? { name: "Mr. Smith" } : null
    });
  };

  const fetchActivities = async () => {
    // Mock activities - replace with real API call
    const mockActivities = [
      { id: 1, action: "Logged in", time: "Today, 09:30 AM" },
      { id: 2, action: "Updated profile picture", time: "Yesterday, 02:20 PM" },
      { id: 3, action: "Changed password", time: "Mar 10, 2024" },
      { id: 4, action: "Submitted assignment", time: "Mar 09, 2024" },
      { id: 5, action: "Viewed marks", time: "Mar 08, 2024" },
    ];
    setActivities(mockActivities);
  };

  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "error";
      case "teacher":
        return "primary";
      case "student":
        return "success";
      default:
        return "default";
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setUpdating(true);
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio
      };
      
      const response = await authService.updateProfile(updateData);
      
      if (response && response.success) {
        toast.success("✅ Profile updated successfully!");
        setIsEditing(false);
        
        // Update local storage with new name
        const updatedUser = response.user || response.profile || response.data;
        if (updatedUser?.name) {
          localStorage.setItem('userName', updatedUser.name);
          // Update component state
          setProfileData(prev => ({ ...prev, name: updatedUser.name }));
        } else if (profileData.name) {
          localStorage.setItem('userName', profileData.name);
        }
        
        // Show success message
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      
      // Even if API fails, update localStorage for better UX
      if (profileData.name) {
        localStorage.setItem('userName', profileData.name);
        toast.success("Profile updated locally!");
        setIsEditing(false);
      } else {
        toast.error(err.message || "Failed to update profile");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Current password is required");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setUpdating(true);
      const response = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (response && response.success) {
        toast.success("✅ Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setIsPasswordEditing(false);
      } else {
        toast.error(response?.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Change password error:", err);
      toast.error(err.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchProfileData(); // Reset to original data
  };

  

  if (loading) {
    return (
      <DashboardLayout role={role} userName={userName}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <DashboardLayout role={role} userName={userName}>
       
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            color: "#fff",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            👤 My Profile
          </Typography>
          <Typography sx={{ opacity: 0.9 }}>
            Manage your personal information & settings
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontSize: '0.9rem',
                fontWeight: 500,
                py: 2,
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  color: '#667eea',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#667eea',
                height: 3,
              }
            }}
          >
            <Tab label="Personal Info" />
            <Tab label="Account Settings" />
            <Tab label="Activity Log" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 3, 
                textAlign: "center",
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
              }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    bgcolor: `${getRoleColor()}.main`,
                    fontSize: "2.5rem",
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {profileData.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>

                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {profileData.name}
                </Typography>

                <Chip
                  label={role.toUpperCase()}
                  color={getRoleColor()}
                  sx={{ 
                    mt: 1, 
                    mb: 2,
                    fontWeight: 600,
                    letterSpacing: 0.5
                  }}
                />

                <Divider sx={{ my: 2 }} />

                <Box textAlign="left">
                  <InfoRow icon={<EmailIcon />} text={profileData.email} />
                  <InfoRow icon={<PhoneIcon />} text={profileData.phone || "Not provided"} />
                  
                  {role === "teacher" && profileData.department && (
                    <InfoRow icon={<SchoolIcon />} text={profileData.department} />
                  )}
                  
                  {role === "student" && profileData.class && (
                    <InfoRow icon={<SchoolIcon />} text={profileData.class} />
                  )}
                  
                  {role === "student" && profileData.rollNumber && (
                    <InfoRow icon={<PersonIcon />} text={`Roll No: ${profileData.rollNumber}`} />
                  )}
                  
                  <InfoRow
                    icon={<CalendarTodayIcon />}
                    text={`Joined: ${profileData.joinDate}`}
                  />
                </Box>

                <Button
                  fullWidth
                  variant={isEditing ? "contained" : "outlined"}
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  sx={{ 
                    mt: 3,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  disabled={updating}
                >
                  {updating ? <CircularProgress size={24} /> : (isEditing ? "Save Changes" : "Edit Profile")}
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="600">
                    Personal Information
                  </Typography>
                  {isEditing && (
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                        disabled={updating}
                        sx={{ borderRadius: 2 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                        onClick={handleSaveProfile}
                        disabled={updating}
                        sx={{ borderRadius: 2 }}
                      >
                        {updating ? "Saving..." : "Save"}
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing || updating}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={true} // Email usually can't be changed
                      variant="outlined"
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing || updating}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      disabled={!isEditing || updating}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      multiline
                      rows={3}
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      disabled={!isEditing || updating}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>

                  {/* Additional role-specific fields */}
                  {role === "student" && profileData.subjects && profileData.subjects.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Enrolled Subjects:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {profileData.subjects.map((subject, index) => (
                          <Chip
                            key={index}
                            label={subject.subjectName || subject}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }
          }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Account Settings
            </Typography>

            <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight="600">Change Password</Typography>
                  <Button
                    size="small"
                    variant={isPasswordEditing ? "contained" : "outlined"}
                    onClick={() => setIsPasswordEditing(!isPasswordEditing)}
                    sx={{ borderRadius: 2 }}
                  >
                    {isPasswordEditing ? "Cancel" : "Change Password"}
                  </Button>
                </Box>
                
                {isPasswordEditing && (
                  <Box>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          disabled={updating}
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: 2 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          disabled={updating}
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: 2 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  edge="end"
                                >
                                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          disabled={updating}
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: 2 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      variant="contained"
                      onClick={handleUpdatePassword}
                      disabled={updating}
                      startIcon={updating ? <CircularProgress size={20} /> : null}
                      sx={{ mt: 2, borderRadius: 2 }}
                    >
                      {updating ? "Updating..." : "Update Password"}
                    </Button>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      Password must be at least 6 characters long
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography fontWeight="600" gutterBottom>
                  Danger Zone
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Once you delete your account, there is no going back. Please be certain.
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => toast.warning("Account deletion feature coming soon!")}
                  sx={{ borderRadius: 2 }}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }
          }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Recent Activity
            </Typography>

            <List>
              {activities.map((a) => (
                <ListItem
                  key={a.id}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight={500}>
                        {a.action}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {a.time}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </DashboardLayout>
    </>
  );
};

const InfoRow = ({ icon, text }) => (
  <Box display="flex" alignItems="center" mb={1.5}>
    <Box mr={1.5} color="primary.main">
      {icon}
    </Box>
    <Typography variant="body2" color="text.primary">
      {text}
    </Typography>
  </Box>
);

export default Profile;