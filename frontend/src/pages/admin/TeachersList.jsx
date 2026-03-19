import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Chip,
  Grid,
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Tabs,
  Tab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import teacherService from "../../api/teacherService";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import FilterSelect from "../../components/common/FilterSelect";

const TeachersList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    alternatePhone: "",
    gender: "male",
    dateOfBirth: "",
    subject: "Mathematics",
    qualification: "B.Ed",
    experience: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    basicSalary: "",
    allowances: "",
    deductions: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    accountNumber: "",
    bankName: "",
    ifscCode: ""
  });

  // Fetch teachers data
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : "",
        subject: subjectFilter !== "all" ? subjectFilter : "",
        gender: genderFilter !== "all" ? genderFilter : "",
        qualification: qualificationFilter !== "all" ? qualificationFilter : "",
        city: cityFilter !== "all" ? cityFilter : ""
      };

      const response = await teacherService.getTeachers(params);
      
      if (response.success) {
        setTeachers(response.teachers);
        setTotalTeachers(response.total);
        setStats(response.stats || {});
        setFilters(response.filters || {});
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch teachers");
      console.error("Fetch teachers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, rowsPerPage, searchTerm, subjectFilter, statusFilter, genderFilter, qualificationFilter, cityFilter]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone?.includes(searchTerm) ||
        teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject =
        subjectFilter === "all" || teacher.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "all" || teacher.status === statusFilter;

      const matchesGender =
        genderFilter === "all" || teacher.gender === genderFilter;

      const matchesQualification =
        qualificationFilter === "all" || teacher.qualification === qualificationFilter;

      const matchesCity =
        cityFilter === "all" || teacher.address?.city === cityFilter;

      return matchesSearch && matchesSubject && matchesStatus && matchesGender && matchesQualification && matchesCity;
    });
  }, [teachers, searchTerm, subjectFilter, statusFilter, genderFilter, qualificationFilter, cityFilter]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSubjectFilter("all");
    setStatusFilter("all");
    setGenderFilter("all");
    setQualificationFilter("all");
    setCityFilter("all");
  };

  const handleAddTeacher = async () => {
    // Validation
    if (!teacherForm.name || !teacherForm.email || !teacherForm.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (teacherForm.password !== teacherForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (teacherForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setProcessing(true);
      
      const teacherData = {
        name: teacherForm.name,
        email: teacherForm.email,
        password: teacherForm.password,
        phone: teacherForm.phone,
        alternatePhone: teacherForm.alternatePhone,
        gender: teacherForm.gender,
        dateOfBirth: teacherForm.dateOfBirth,
        subject: teacherForm.subject,
        qualification: teacherForm.qualification,
        experience: teacherForm.experience,
        street: teacherForm.street,
        city: teacherForm.city,
        state: teacherForm.state,
        pincode: teacherForm.pincode,
        country: teacherForm.country,
        basicSalary: teacherForm.basicSalary,
        allowances: teacherForm.allowances,
        deductions: teacherForm.deductions,
        emergencyContactName: teacherForm.emergencyContactName,
        emergencyContactRelationship: teacherForm.emergencyContactRelationship,
        emergencyContactPhone: teacherForm.emergencyContactPhone,
        accountNumber: teacherForm.accountNumber,
        bankName: teacherForm.bankName,
        ifscCode: teacherForm.ifscCode
      };

      const response = await teacherService.addTeacher(teacherData);
      
      if (response.success) {
        toast.success("🎉 Teacher added successfully!");
        
        // Show credentials in toast
        if (response.loginCredentials) {
          toast.info(
            <div>
              <strong>Login Credentials:</strong><br />
              Email: {response.loginCredentials.email}<br />
              Password: {response.loginCredentials.password}
            </div>,
            { autoClose: 10000 }
          );
        }
        
        setOpenAddDialog(false);
        resetForm();
        fetchTeachers();
      }
    } catch (err) {
      toast.error(err.message || "Failed to add teacher");
      console.error("Add teacher error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateStatus = async (teacherId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const response = await teacherService.updateTeacherStatus(teacherId, newStatus);
      
      if (response.success) {
        toast.success(`✅ Teacher status updated to ${newStatus}`);
        fetchTeachers();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleViewTeacher = async (teacherId) => {
    try {
      const response = await teacherService.getTeacherDetails(teacherId);
      
      if (response.success) {
        setSelectedTeacher(response.teacher);
        setOpenViewDialog(true);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch teacher details");
    }
  };

  const handleDeleteTeacher = async (teacherId, teacherName) => {
    if (window.confirm(`Are you sure you want to delete ${teacherName}?`)) {
      try {
        const response = await teacherService.deleteTeacher(teacherId);
        
        if (response.success) {
          toast.success("✅ Teacher deleted successfully");
          fetchTeachers();
        }
      } catch (err) {
        toast.error(err.message || "Failed to delete teacher");
      }
    }
  };

  const resetForm = () => {
    setTeacherForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      alternatePhone: "",
      gender: "male",
      dateOfBirth: "",
      subject: "Mathematics",
      qualification: "B.Ed",
      experience: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      basicSalary: "",
      allowances: "",
      deductions: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      accountNumber: "",
      bankName: "",
      ifscCode: ""
    });
  };

  const columns = [
    { 
      id: "profile", 
      label: "Profile", 
      align: "center",
      format: (value, row) => (
        <Avatar sx={{ bgcolor: row.gender === 'male' ? '#1976d2' : '#f50057' }}>
          {row.name?.charAt(0) || "T"}
        </Avatar>
      )
    },
    { id: "name", label: "Name", minWidth: 150 },
    { id: "email", label: "Email", minWidth: 180 },
    { id: "phone", label: "Phone" },
    { id: "subject", label: "Subject" },
    { 
      id: "qualification", 
      label: "Qualification",
      format: (value) => (
        <Chip label={value} size="small" variant="outlined" />
      )
    },
    { 
      id: "experience", 
      label: "Exp (Yrs)",
      align: "center",
      format: (value) => `${value || 0} yrs`
    },
    { 
      id: "status", 
      label: "Status", 
      align: "center",
      format: (value) => (
        <Chip
          label={value}
          color={
            value === 'active' ? 'success' : 
            value === 'on-leave' ? 'warning' : 'error'
          }
          size="small"
          sx={{ fontWeight: 500 }}
        />
      )
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      minWidth: 200,
      format: (value, row) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              onClick={() => handleViewTeacher(row._id)}
              color="info"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Edit">
            <IconButton size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={row.status === 'active' ? 'Deactivate' : 'Activate'}>
            <IconButton 
              size="small" 
              onClick={() => handleUpdateStatus(row._id, row.status)}
              color={row.status === 'active' ? 'warning' : 'success'}
            >
              {row.status === 'active' ? '🚫' : '✅'}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              onClick={() => handleDeleteTeacher(row._id, row.name)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Subject options based on model
  const subjectOptions = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "English", label: "English" },
    { value: "History", label: "History" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Biology", label: "Biology" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Arts", label: "Arts" },
    { value: "Music", label: "Music" },
    { value: "Geography", label: "Geography" },
    { value: "Economics", label: "Economics" },
    { value: "Business Studies", label: "Business Studies" }
  ];

  const qualificationOptions = [
    { value: "B.Ed", label: "B.Ed" },
    { value: "M.Ed", label: "M.Ed" },
    { value: "PhD", label: "PhD" },
    { value: "M.Sc", label: "M.Sc" },
    { value: "B.Sc", label: "B.Sc" },
    { value: "MA", label: "MA" },
    { value: "BA", label: "BA" }
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on-leave", label: "On Leave" },
    { value: "resigned", label: "Resigned" }
  ];

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <DashboardLayout role="admin" userName="Admin User">
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            color: "#fff",
            background: "linear-gradient(135deg, #43cea2, #185a9d)",
            boxShadow: "0 10px 30px rgba(24, 90, 157, 0.3)"
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <SchoolIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Teachers Management
              </Typography>
              <Typography sx={{ opacity: 0.9, mt: 0.5 }}>
                Manage, search, and filter teacher records
              </Typography>
            </Box>
          </Box>
          
          {/* Stats */}
          <Grid container spacing={2} mt={3}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.totalTeachers || 0}
                  </Typography>
                  <Typography variant="body2">Total Teachers</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="#4CAF50">
                    {stats.activeTeachers || 0}
                  </Typography>
                  <Typography variant="body2">Active</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold">
                    {filters.subjects?.length || 0}
                  </Typography>
                  <Typography variant="body2">Subjects</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold">
                    {filters.cities?.length || 0}
                  </Typography>
                  <Typography variant="body2">Cities</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header Actions */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h5" fontWeight="600">
              Teachers List
            </Typography>
            
            <Box display="flex" gap={2}>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchTeachers} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Export">
                <IconButton>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2 }}
                onClick={() => setOpenAddDialog(true)}
              >
                Add New Teacher
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filters Section */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <FilterListIcon color="action" />
              <Typography variant="subtitle1" fontWeight="500">
                Filters
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <SearchBar
                  placeholder="Search by name, email, phone or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FilterSelect
                  label="Subject"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Subjects" },
                    ...subjectOptions
                  ]}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Status" },
                    ...statusOptions
                  ]}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FilterSelect
                  label="Gender"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Genders" },
                    ...genderOptions
                  ]}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FilterSelect
                  label="Qualification"
                  value={qualificationFilter}
                  onChange={(e) => setQualificationFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Qualifications" },
                    ...qualificationOptions
                  ]}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  fullWidth
                  sx={{ height: '56px' }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Active Filters Indicator */}
          {(searchTerm || subjectFilter !== "all" || statusFilter !== "all" || 
            genderFilter !== "all" || qualificationFilter !== "all") && (
            <Box mb={2} display="flex" alignItems="center" gap={1}>
              <Chip
                label="Active Filters"
                color="primary"
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {[
                  searchTerm && `Search: "${searchTerm}"`,
                  subjectFilter !== "all" && `Subject: ${subjectFilter}`,
                  statusFilter !== "all" && `Status: ${statusFilter}`,
                  genderFilter !== "all" && `Gender: ${genderFilter}`,
                  qualificationFilter !== "all" && `Qualification: ${qualificationFilter}`
                ].filter(Boolean).join(', ')}
              </Typography>
            </Box>
          )}

          {/* Results Info */}
          <Box
            mb={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              Showing {filteredTeachers.length} of {totalTeachers} teachers
              {page > 0 && ` (Page ${page + 1})`}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <Select
                size="small"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{ minWidth: 70 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Data Table */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : filteredTeachers.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No teachers found matching your criteria.
            </Alert>
          ) : (
            <DataTable
              columns={columns}
              data={filteredTeachers}
              page={page}
              rowsPerPage={rowsPerPage}
              total={totalTeachers}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              loading={loading}
            />
          )}
        </Paper>

        {/* Add Teacher Dialog */}
        <Dialog 
          open={openAddDialog} 
          onClose={() => !processing && setOpenAddDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight="bold">
              Add New Teacher
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the teacher details below
            </Typography>
          </DialogTitle>
          
          <DialogContent dividers>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
              <Tab label="Personal Info" />
              <Tab label="Professional Details" />
              <Tab label="Address & Contact" />
              <Tab label="Salary & Bank" />
            </Tabs>

            {activeTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password *"
                    type="password"
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm({...teacherForm, password: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password *"
                    type="password"
                    value={teacherForm.confirmPassword}
                    onChange={(e) => setTeacherForm({...teacherForm, confirmPassword: e.target.value})}
                    required
                    error={teacherForm.password !== teacherForm.confirmPassword}
                    helperText={teacherForm.password !== teacherForm.confirmPassword ? "Passwords don't match" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone *"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({...teacherForm, phone: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alternate Phone"
                    value={teacherForm.alternatePhone}
                    onChange={(e) => setTeacherForm({...teacherForm, alternatePhone: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={teacherForm.gender}
                      label="Gender"
                      onChange={(e) => setTeacherForm({...teacherForm, gender: e.target.value})}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth *"
                    type="date"
                    value={teacherForm.dateOfBirth}
                    onChange={(e) => setTeacherForm({...teacherForm, dateOfBirth: e.target.value})}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={teacherForm.subject}
                      label="Subject"
                      onChange={(e) => setTeacherForm({...teacherForm, subject: e.target.value})}
                    >
                      {subjectOptions.map((sub) => (
                        <MenuItem key={sub.value} value={sub.value}>
                          {sub.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Qualification</InputLabel>
                    <Select
                      value={teacherForm.qualification}
                      label="Qualification"
                      onChange={(e) => setTeacherForm({...teacherForm, qualification: e.target.value})}
                    >
                      {qualificationOptions.map((qual) => (
                        <MenuItem key={qual.value} value={qual.value}>
                          {qual.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experience (Years) *"
                    type="number"
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm({...teacherForm, experience: e.target.value})}
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={teacherForm.street}
                    onChange={(e) => setTeacherForm({...teacherForm, street: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={teacherForm.city}
                    onChange={(e) => setTeacherForm({...teacherForm, city: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={teacherForm.state}
                    onChange={(e) => setTeacherForm({...teacherForm, state: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    value={teacherForm.pincode}
                    onChange={(e) => setTeacherForm({...teacherForm, pincode: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={teacherForm.country}
                    onChange={(e) => setTeacherForm({...teacherForm, country: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    value={teacherForm.emergencyContactName}
                    onChange={(e) => setTeacherForm({...teacherForm, emergencyContactName: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Relationship"
                    value={teacherForm.emergencyContactRelationship}
                    onChange={(e) => setTeacherForm({...teacherForm, emergencyContactRelationship: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Phone"
                    value={teacherForm.emergencyContactPhone}
                    onChange={(e) => setTeacherForm({...teacherForm, emergencyContactPhone: e.target.value})}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 3 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Basic Salary"
                    type="number"
                    value={teacherForm.basicSalary}
                    onChange={(e) => setTeacherForm({...teacherForm, basicSalary: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Allowances"
                    type="number"
                    value={teacherForm.allowances}
                    onChange={(e) => setTeacherForm({...teacherForm, allowances: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Deductions"
                    type="number"
                    value={teacherForm.deductions}
                    onChange={(e) => setTeacherForm({...teacherForm, deductions: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Number"
                    value={teacherForm.accountNumber}
                    onChange={(e) => setTeacherForm({...teacherForm, accountNumber: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={teacherForm.bankName}
                    onChange={(e) => setTeacherForm({...teacherForm, bankName: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    value={teacherForm.ifscCode}
                    onChange={(e) => setTeacherForm({...teacherForm, ifscCode: e.target.value})}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenAddDialog(false)} 
              disabled={processing}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddTeacher}
              disabled={processing}
              startIcon={processing ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {processing ? "Adding..." : "Add Teacher"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Teacher Dialog */}
        <Dialog 
          open={openViewDialog} 
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedTeacher && (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ 
                    bgcolor: selectedTeacher.gender === 'male' ? '#1976d2' : '#f50057',
                    width: 60, 
                    height: 60 
                  }}>
                    {selectedTeacher.name?.charAt(0) || "T"}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedTeacher.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedTeacher.subject} • {selectedTeacher.qualification}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow icon={<PersonIcon />} label="Full Name" value={selectedTeacher.name} />
                    <InfoRow icon={<EmailIcon />} label="Email" value={selectedTeacher.email} />
                    <InfoRow icon={<PhoneIcon />} label="Phone" value={selectedTeacher.phone} />
                    <InfoRow icon={<PhoneIcon />} label="Alternate Phone" value={selectedTeacher.alternatePhone} />
                    <InfoRow icon={<PersonIcon />} label="Gender" value={selectedTeacher.gender} />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <InfoRow icon={<SchoolIcon />} label="Subject" value={selectedTeacher.subject} />
                    <InfoRow icon={<WorkIcon />} label="Qualification" value={selectedTeacher.qualification} />
                    <InfoRow icon={<WorkIcon />} label="Experience" value={`${selectedTeacher.experience || 0} years`} />
                    <InfoRow icon={<CalendarTodayIcon />} label="Joining Date" value={
                      new Date(selectedTeacher.joiningDate).toLocaleDateString()
                    } />
                    <InfoRow icon={<CalendarTodayIcon />} label="Date of Birth" value={
                      selectedTeacher.dateOfBirth ? new Date(selectedTeacher.dateOfBirth).toLocaleDateString() : "N/A"
                    } />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Address
                    </Typography>
                    <InfoRow icon={<LocationOnIcon />} label="Address" value={
                      `${selectedTeacher.address?.street || ''}, ${selectedTeacher.address?.city || ''}, ${selectedTeacher.address?.state || ''} - ${selectedTeacher.address?.pincode || ''}`
                    } />
                  </Grid>
                  
                  {selectedTeacher.salary && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Salary Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Card variant="outlined">
                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h6">₹{selectedTeacher.salary.basic || 0}</Typography>
                              <Typography variant="caption" color="text.secondary">Basic</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Card variant="outlined">
                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h6" color="success.main">+ ₹{selectedTeacher.salary.allowances || 0}</Typography>
                              <Typography variant="caption" color="text.secondary">Allowances</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Card variant="outlined">
                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h6" color="error.main">- ₹{selectedTeacher.salary.deductions || 0}</Typography>
                              <Typography variant="caption" color="text.secondary">Deductions</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight="bold">₹{selectedTeacher.salary.netSalary || 0}</Typography>
                              <Typography variant="caption" color="text.secondary">Net Salary</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ p: 3 }}>
                <Button 
                  onClick={() => setOpenViewDialog(false)} 
                  variant="outlined"
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenViewDialog(false);
                    // Navigate to edit or perform action
                  }}
                >
                  Edit Details
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </DashboardLayout>
    </>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Box mr={2} color="primary.main">
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {value || "Not provided"}
      </Typography>
    </Box>
  </Box>
);

export default TeachersList;