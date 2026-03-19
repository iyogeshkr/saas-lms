import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Tab,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import studentService from "../../api/studentService";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import FilterSelect from "../../components/common/FilterSelect";

const StudentsList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [genderFilter, setGenderFilter] = useState("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [deletePermanent, setDeletePermanent] = useState(false);

  // Form state
  const [studentForm, setStudentForm] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "male",
    dateOfBirth: "",
    bloodGroup: "",
    
    // Academic Info
    class: "",
    section: "",
    academicYear: new Date().getFullYear().toString(),
    stream: "",
    
    // Address
    permanentStreet: "",
    permanentCity: "",
    permanentState: "",
    permanentPincode: "",
    sameAsPermanent: true,
    currentStreet: "",
    currentCity: "",
    currentState: "",
    currentPincode: "",
    
    // Parents
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",
    fatherEmail: "",
    fatherIncome: "",
    motherName: "",
    motherOccupation: "",
    motherPhone: "",
    motherEmail: "",
    motherIncome: "",
    guardianName: "",
    guardianRelation: "",
    guardianOccupation: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianAddress: "",
    
    // Previous School
    previousSchoolName: "",
    previousSchoolAddress: "",
    previousSchoolBoard: "",
    previousSchoolPercentage: "",
    previousSchoolYear: "",
    
    // Fee & Services
    totalFee: "",
    scholarship: "",
    concession: "",
    transportAvailing: false,
    transportBusNumber: "",
    transportPickupPoint: "",
    transportDropPoint: "",
    transportMonthlyCharge: "",
    hostelAvailing: false,
    hostelRoomNumber: "",
    hostelBlock: "",
    hostelMonthlyCharge: ""
  });

  // Fetch students data with useCallback to prevent infinite re-renders
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : "",
        class: classFilter !== "all" ? classFilter : "",
        section: sectionFilter !== "all" ? sectionFilter : "",
        gender: genderFilter !== "all" ? genderFilter : "",
        bloodGroup: bloodGroupFilter !== "all" ? bloodGroupFilter : "",
        stream: streamFilter !== "all" ? streamFilter : "",
        academicYear: new Date().getFullYear().toString()
      };

      const response = await studentService.getStudents(params);
      
      if (response.success) {
        setStudents(response.students || []);
        setTotalStudents(response.total || 0);
        setStats(response.stats || {});
        setFilters(response.filters || {});
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch students");
      console.error("Fetch students error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, classFilter, statusFilter, genderFilter, 
      bloodGroupFilter, sectionFilter, streamFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.includes(searchTerm) ||
        student.father?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.father?.phone?.includes(searchTerm) ||
        student.mother?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mother?.phone?.includes(searchTerm);

      const matchesClass =
        classFilter === "all" || student.class?._id === classFilter;

      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;

      const matchesGender =
        genderFilter === "all" || student.gender === genderFilter;

      const matchesBloodGroup =
        bloodGroupFilter === "all" || student.bloodGroup === bloodGroupFilter;

      const matchesSection =
        sectionFilter === "all" || student.section === sectionFilter;

      const matchesStream =
        streamFilter === "all" || student.stream === streamFilter;

      return matchesSearch && matchesClass && matchesStatus && 
             matchesGender && matchesBloodGroup && matchesSection && matchesStream;
    });
  }, [students, searchTerm, classFilter, statusFilter, genderFilter, 
      bloodGroupFilter, sectionFilter, streamFilter]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setClassFilter("all");
    setStatusFilter("active");
    setGenderFilter("all");
    setBloodGroupFilter("all");
    setSectionFilter("all");
    setStreamFilter("all");
  };

  const handleAddStudent = async () => {
    // Validation
    if (!studentForm.firstName || !studentForm.lastName || !studentForm.email || !studentForm.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (studentForm.password !== studentForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (studentForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setProcessing(true);
      
      const studentData = {
        firstName: studentForm.firstName,
        lastName: studentForm.lastName,
        email: studentForm.email,
        password: studentForm.password,
        phone: studentForm.phone,
        gender: studentForm.gender,
        dateOfBirth: studentForm.dateOfBirth,
        bloodGroup: studentForm.bloodGroup || undefined,
        class: studentForm.class,
        section: studentForm.section,
        academicYear: studentForm.academicYear,
        stream: studentForm.stream || undefined,
        permanentStreet: studentForm.permanentStreet,
        permanentCity: studentForm.permanentCity,
        permanentState: studentForm.permanentState,
        permanentPincode: studentForm.permanentPincode,
        sameAsPermanent: studentForm.sameAsPermanent,
        currentStreet: studentForm.currentStreet,
        currentCity: studentForm.currentCity,
        currentState: studentForm.currentState,
        currentPincode: studentForm.currentPincode,
        fatherName: studentForm.fatherName,
        fatherOccupation: studentForm.fatherOccupation,
        fatherPhone: studentForm.fatherPhone,
        fatherEmail: studentForm.fatherEmail,
        fatherIncome: studentForm.fatherIncome,
        motherName: studentForm.motherName,
        motherOccupation: studentForm.motherOccupation,
        motherPhone: studentForm.motherPhone,
        motherEmail: studentForm.motherEmail,
        motherIncome: studentForm.motherIncome,
        guardianName: studentForm.guardianName,
        guardianRelation: studentForm.guardianRelation,
        guardianOccupation: studentForm.guardianOccupation,
        guardianPhone: studentForm.guardianPhone,
        guardianEmail: studentForm.guardianEmail,
        guardianAddress: studentForm.guardianAddress,
        previousSchoolName: studentForm.previousSchoolName,
        previousSchoolAddress: studentForm.previousSchoolAddress,
        previousSchoolBoard: studentForm.previousSchoolBoard,
        previousSchoolPercentage: studentForm.previousSchoolPercentage,
        previousSchoolYear: studentForm.previousSchoolYear,
        totalFee: studentForm.totalFee,
        scholarship: studentForm.scholarship,
        concession: studentForm.concession,
        transportAvailing: studentForm.transportAvailing,
        transportBusNumber: studentForm.transportBusNumber,
        transportPickupPoint: studentForm.transportPickupPoint,
        transportDropPoint: studentForm.transportDropPoint,
        transportMonthlyCharge: studentForm.transportMonthlyCharge,
        hostelAvailing: studentForm.hostelAvailing,
        hostelRoomNumber: studentForm.hostelRoomNumber,
        hostelBlock: studentForm.hostelBlock,
        hostelMonthlyCharge: studentForm.hostelMonthlyCharge
      };

      const response = await studentService.addStudent(studentData);
      
      if (response.success) {
        toast.success("🎉 Student added successfully!");
        
        // Show credentials in toast
        if (response.loginCredentials) {
          toast.info(
            <div>
              <strong>Login Credentials:</strong><br />
              Email: {response.loginCredentials.email}<br />
              Password: {response.loginCredentials.password}<br />
              Roll Number: {response.loginCredentials.rollNumber}
            </div>,
            { autoClose: 10000 }
          );
        }
        
        setOpenAddDialog(false);
        resetForm();
        fetchStudents();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to add student");
      console.error("Add student error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateStatus = async (studentId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const reason = newStatus === 'inactive' ? 'Deactivated by admin' : '';
      
      const response = await studentService.updateStudentStatus(studentId, newStatus, reason);
      
      if (response.success) {
        toast.success(`✅ Student status updated to ${newStatus}`);
        fetchStudents();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update status");
    }
  };

  const handleViewStudent = async (studentId) => {
    try {
      const response = await studentService.getStudentDetails(studentId);
      
      if (response.success) {
        setSelectedStudent(response.student);
        setOpenViewDialog(true);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch student details");
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await studentService.deleteStudent(selectedStudent._id, deletePermanent);
      
      if (response.success) {
        toast.success(`✅ Student ${deletePermanent ? 'permanently deleted' : 'deactivated'}`);
        setOpenDeleteDialog(false);
        fetchStudents();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete student");
    }
  };

  const openDeleteConfirmation = (student) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
  };

  const resetForm = () => {
    setStudentForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      gender: "male",
      dateOfBirth: "",
      bloodGroup: "",
      class: "",
      section: "",
      academicYear: new Date().getFullYear().toString(),
      stream: "",
      permanentStreet: "",
      permanentCity: "",
      permanentState: "",
      permanentPincode: "",
      sameAsPermanent: true,
      currentStreet: "",
      currentCity: "",
      currentState: "",
      currentPincode: "",
      fatherName: "",
      fatherOccupation: "",
      fatherPhone: "",
      fatherEmail: "",
      fatherIncome: "",
      motherName: "",
      motherOccupation: "",
      motherPhone: "",
      motherEmail: "",
      motherIncome: "",
      guardianName: "",
      guardianRelation: "",
      guardianOccupation: "",
      guardianPhone: "",
      guardianEmail: "",
      guardianAddress: "",
      previousSchoolName: "",
      previousSchoolAddress: "",
      previousSchoolBoard: "",
      previousSchoolPercentage: "",
      previousSchoolYear: "",
      totalFee: "",
      scholarship: "",
      concession: "",
      transportAvailing: false,
      transportBusNumber: "",
      transportPickupPoint: "",
      transportDropPoint: "",
      transportMonthlyCharge: "",
      hostelAvailing: false,
      hostelRoomNumber: "",
      hostelBlock: "",
      hostelMonthlyCharge: ""
    });
  };

  const columns = [
    { 
      id: "profile", 
      label: "Profile", 
      align: "center",
      minWidth: 80,
      format: (value, row) => (
        <Avatar sx={{ 
          bgcolor: row.gender === 'male' ? '#1976d2' : row.gender === 'female' ? '#f50057' : '#9c27b0',
          width: 40, 
          height: 40 
        }}>
          {row.firstName?.charAt(0) || "S"}
        </Avatar>
      )
    },
    { 
      id: "rollNumber", 
      label: "Roll No", 
      minWidth: 100,
      format: (value) => (
        <Typography variant="body2" fontWeight="600">
          {value || "N/A"}
        </Typography>
      )
    },
    { 
      id: "name", 
      label: "Name", 
      minWidth: 180,
      format: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="600">
            {row.firstName} {row.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email || "No email"}
          </Typography>
        </Box>
      )
    },
    { 
      id: "class", 
      label: "Class/Section", 
      minWidth: 120,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">
            {row.class?.className || 'N/A'} - {row.section || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.academicYear || 'N/A'}
          </Typography>
        </Box>
      )
    },
    { 
      id: "contact", 
      label: "Contact", 
      minWidth: 140,
      format: (value, row) => (
        <Box>
          <Typography variant="body2">
            {row.phone || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Father: {row.father?.phone || 'N/A'}
          </Typography>
        </Box>
      )
    },
    { 
      id: "fee", 
      label: "Fee Status", 
      minWidth: 120,
      align: "center",
      format: (value, row) => {
        const paid = row.fee?.paidFee || 0;
        const total = row.fee?.totalFee || 0;
        const percentage = total > 0 ? (paid / total) * 100 : 0;
        
        return (
          <Box>
            <Chip
              label={`${percentage.toFixed(0)}%`}
              color={
                percentage >= 90 ? "success" :
                percentage >= 50 ? "warning" : "error"
              }
              size="small"
              variant="outlined"
            />
            <Typography variant="caption" display="block" color="text.secondary">
              ₹{paid}/₹{total}
            </Typography>
          </Box>
        );
      }
    },
    { 
      id: "status", 
      label: "Status", 
      align: "center",
      minWidth: 100,
      format: (value) => {
        const getStatusColor = (status) => {
          switch(status) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'alumni': return 'info';
            case 'transfered': return 'warning';
            case 'dropout': return 'error';
            default: return 'default';
          }
        };
        
        const getStatusLabel = (status) => {
          switch(status) {
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            case 'alumni': return 'Alumni';
            case 'transfered': return 'Transferred';
            case 'dropout': return 'Dropout';
            default: return status || 'Unknown';
          }
        };
        
        return (
          <Chip
            label={getStatusLabel(value)}
            color={getStatusColor(value)}
            size="small"
            sx={{ fontWeight: 500, minWidth: 80 }}
          />
        );
      }
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
              onClick={() => handleViewStudent(row._id)}
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
              onClick={() => openDeleteConfirmation(row)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Blood group options
  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" }
  ];

  // Stream options
  const streamOptions = [
    { value: "Science", label: "Science" },
    { value: "Commerce", label: "Commerce" },
    { value: "Arts", label: "Arts" },
    { value: "Vocational", label: "Vocational" }
  ];

  // Gender options with icons
  const genderOptions = [
    { value: "male", label: "Male", icon: <MaleIcon /> },
    { value: "female", label: "Female", icon: <FemaleIcon /> },
    { value: "other", label: "Other", icon: <TransgenderIcon /> }
  ];

  // Status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "alumni", label: "Alumni" },
    { value: "transfered", label: "Transferred" },
    { value: "dropout", label: "Dropout" }
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
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)"
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <PeopleIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Students Management
              </Typography>
              <Typography sx={{ opacity: 0.9, mt: 0.5 }}>
                Manage, search, and filter student records
              </Typography>
            </Box>
          </Box>
          
          {/* Stats */}
          <Grid container spacing={2} mt={3}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.totalStudents || 0}
                  </Typography>
                  <Typography variant="body2">Total Students</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="#4CAF50">
                    {stats.activeStudents || 0}
                  </Typography>
                  <Typography variant="body2">Active</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold">
                    {stats.feeSummary?.[0]?.totalFee || 0}
                  </Typography>
                  <Typography variant="body2">Total Fee (₹)</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="#FF9800">
                    {stats.feeSummary?.[0]?.pendingFee || 0}
                  </Typography>
                  <Typography variant="body2">Pending Fee (₹)</Typography>
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
              Students List
            </Typography>
            
            <Box display="flex" gap={2}>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchStudents} disabled={loading}>
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
                Add New Student
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
                  placeholder="Search by name, roll no, email, or parent phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FilterSelect
                  label="Class"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All Classes" },
                    ...(filters.classes?.map(c => ({
                      value: c._id,
                      label: `${c.className}`
                    })) || [])
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

              <Grid item xs={12} sm={6} md={1}>
                <FilterSelect
                  label="Section"
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All" },
                    ...(filters.sections?.map(s => ({
                      value: s,
                      label: s
                    })) || [])
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

              <Grid item xs={12} sm={6} md={1}>
                <FilterSelect
                  label="Blood Group"
                  value={bloodGroupFilter}
                  onChange={(e) => setBloodGroupFilter(e.target.value)}
                  options={[
                    { value: "all", label: "All" },
                    ...bloodGroupOptions
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
          {(searchTerm || classFilter !== "all" || statusFilter !== "all" || 
            genderFilter !== "all" || bloodGroupFilter !== "all" || 
            sectionFilter !== "all" || streamFilter !== "all") && (
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
                  classFilter !== "all" && `Class: ${filters.classes?.find(c => c._id === classFilter)?.className || classFilter}`,
                  statusFilter !== "all" && `Status: ${statusFilter}`,
                  genderFilter !== "all" && `Gender: ${genderFilter}`,
                  bloodGroupFilter !== "all" && `Blood: ${bloodGroupFilter}`,
                  sectionFilter !== "all" && `Section: ${sectionFilter}`,
                  streamFilter !== "all" && `Stream: ${streamFilter}`
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
              Showing {filteredStudents.length} of {totalStudents} students
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
          ) : filteredStudents.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No students found matching your criteria.
            </Alert>
          ) : (
            <DataTable
              columns={columns}
              data={filteredStudents}
              page={page}
              rowsPerPage={rowsPerPage}
              total={totalStudents}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              loading={loading}
            />
          )}
        </Paper>

        {/* Add Student Dialog */}
        <Dialog 
          open={openAddDialog} 
          onClose={() => !processing && setOpenAddDialog(false)}
          maxWidth="lg"
          fullWidth
          scroll="paper"
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight="bold">
              Add New Student
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the student details below
            </Typography>
          </DialogTitle>
          
          <DialogContent dividers>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
              <Tab label="Personal Info" />
              <Tab label="Academic Info" />
              <Tab label="Parents & Guardian" />
              <Tab label="Fee & Services" />
            </Tabs>

            {activeTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name *"
                    value={studentForm.firstName}
                    onChange={(e) => setStudentForm({...studentForm, firstName: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name *"
                    value={studentForm.lastName}
                    onChange={(e) => setStudentForm({...studentForm, lastName: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone *"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password *"
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password *"
                    type="password"
                    value={studentForm.confirmPassword}
                    onChange={(e) => setStudentForm({...studentForm, confirmPassword: e.target.value})}
                    required
                    error={studentForm.password !== studentForm.confirmPassword}
                    helperText={studentForm.password !== studentForm.confirmPassword ? "Passwords don't match" : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={studentForm.gender}
                      label="Gender"
                      onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})}
                    >
                      {genderOptions.map((gender) => (
                        <MenuItem key={gender.value} value={gender.value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {gender.icon}
                            {gender.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth *"
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Blood Group</InputLabel>
                    <Select
                      value={studentForm.bloodGroup}
                      label="Blood Group"
                      onChange={(e) => setStudentForm({...studentForm, bloodGroup: e.target.value})}
                    >
                      <MenuItem value="">
                        <em>Not specified</em>
                      </MenuItem>
                      {bloodGroupOptions.map((bg) => (
                        <MenuItem key={bg.value} value={bg.value}>
                          {bg.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Class</InputLabel>
                    <Select
                      value={studentForm.class}
                      label="Class"
                      onChange={(e) => setStudentForm({...studentForm, class: e.target.value})}
                    >
                      {filters.classes?.map((cls) => (
                        <MenuItem key={cls._id} value={cls._id}>
                          {cls.className}
                        </MenuItem>
                      )) || <MenuItem disabled>Loading classes...</MenuItem>}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Section *"
                    value={studentForm.section}
                    onChange={(e) => setStudentForm({...studentForm, section: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Academic Year *"
                    value={studentForm.academicYear}
                    onChange={(e) => setStudentForm({...studentForm, academicYear: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Stream</InputLabel>
                    <Select
                      value={studentForm.stream}
                      label="Stream"
                      onChange={(e) => setStudentForm({...studentForm, stream: e.target.value})}
                    >
                      <MenuItem value="">
                        <em>Not applicable</em>
                      </MenuItem>
                      {streamOptions.map((stream) => (
                        <MenuItem key={stream.value} value={stream.value}>
                          {stream.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {activeTab === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Father's Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Father's Name"
                    value={studentForm.fatherName}
                    onChange={(e) => setStudentForm({...studentForm, fatherName: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Occupation"
                    value={studentForm.fatherOccupation}
                    onChange={(e) => setStudentForm({...studentForm, fatherOccupation: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={studentForm.fatherPhone}
                    onChange={(e) => setStudentForm({...studentForm, fatherPhone: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Income"
                    type="number"
                    value={studentForm.fatherIncome}
                    onChange={(e) => setStudentForm({...studentForm, fatherIncome: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} mt={2}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Mother's Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mother's Name"
                    value={studentForm.motherName}
                    onChange={(e) => setStudentForm({...studentForm, motherName: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Occupation"
                    value={studentForm.motherOccupation}
                    onChange={(e) => setStudentForm({...studentForm, motherOccupation: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={studentForm.motherPhone}
                    onChange={(e) => setStudentForm({...studentForm, motherPhone: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Income"
                    type="number"
                    value={studentForm.motherIncome}
                    onChange={(e) => setStudentForm({...studentForm, motherIncome: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} mt={2}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Guardian Information (If different from parents)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Guardian's Name"
                    value={studentForm.guardianName}
                    onChange={(e) => setStudentForm({...studentForm, guardianName: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Relation"
                    value={studentForm.guardianRelation}
                    onChange={(e) => setStudentForm({...studentForm, guardianRelation: e.target.value})}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 3 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Total Annual Fee (₹)"
                    type="number"
                    value={studentForm.totalFee}
                    onChange={(e) => setStudentForm({...studentForm, totalFee: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Scholarship (₹)"
                    type="number"
                    value={studentForm.scholarship}
                    onChange={(e) => setStudentForm({...studentForm, scholarship: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Concession (₹)"
                    type="number"
                    value={studentForm.concession}
                    onChange={(e) => setStudentForm({...studentForm, concession: e.target.value})}
                  />
                </Grid>
                
                <Grid item xs={12} mt={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={studentForm.transportAvailing}
                        onChange={(e) => setStudentForm({...studentForm, transportAvailing: e.target.checked})}
                      />
                    }
                    label="Availing Transport"
                  />
                </Grid>
                
                {studentForm.transportAvailing && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Bus Number"
                        value={studentForm.transportBusNumber}
                        onChange={(e) => setStudentForm({...studentForm, transportBusNumber: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Monthly Charge (₹)"
                        type="number"
                        value={studentForm.transportMonthlyCharge}
                        onChange={(e) => setStudentForm({...studentForm, transportMonthlyCharge: e.target.value})}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Box>
                {activeTab > 0 && (
                  <Button 
                    onClick={() => setActiveTab(activeTab - 1)}
                    variant="outlined"
                  >
                    Previous
                  </Button>
                )}
              </Box>
              
              <Box display="flex" gap={2}>
                <Button 
                  onClick={() => setOpenAddDialog(false)} 
                  disabled={processing}
                  variant="outlined"
                >
                  Cancel
                </Button>
                
                {activeTab < 3 ? (
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(activeTab + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleAddStudent}
                    disabled={processing}
                    startIcon={processing ? <CircularProgress size={20} /> : <AddIcon />}
                  >
                    {processing ? "Adding..." : "Add Student"}
                  </Button>
                )}
              </Box>
            </Box>
          </DialogActions>
        </Dialog>

        {/* View Student Dialog */}
        <Dialog 
          open={openViewDialog} 
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedStudent && (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ 
                    bgcolor: selectedStudent.gender === 'male' ? '#1976d2' : 
                             selectedStudent.gender === 'female' ? '#f50057' : '#9c27b0',
                    width: 60, 
                    height: 60 
                  }}>
                    {selectedStudent.firstName?.charAt(0) || "S"}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedStudent.rollNumber || 'N/A'} • {selectedStudent.class?.className || 'N/A'} - {selectedStudent.section || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow icon={<PersonIcon />} label="Full Name" 
                      value={`${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim()} />
                    <InfoRow icon={<EmailIcon />} label="Email" value={selectedStudent.email || 'N/A'} />
                    <InfoRow icon={<PhoneIcon />} label="Phone" value={selectedStudent.phone || 'N/A'} />
                    <InfoRow icon={<PersonIcon />} label="Gender" value={selectedStudent.gender || 'N/A'} />
                    <InfoRow icon={<BloodtypeIcon />} label="Blood Group" 
                      value={selectedStudent.bloodGroup || "Not specified"} />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <InfoRow icon={<SchoolIcon />} label="Class" 
                      value={`${selectedStudent.class?.className || 'N/A'} - ${selectedStudent.section || 'N/A'}`} />
                    <InfoRow icon={<SchoolIcon />} label="Academic Year" value={selectedStudent.academicYear || 'N/A'} />
                    <InfoRow icon={<SchoolIcon />} label="Stream" value={selectedStudent.stream || "Not applicable"} />
                    <InfoRow icon={<CalendarTodayIcon />} label="Admission Date" value={
                      selectedStudent.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : 'N/A'
                    } />
                    <InfoRow icon={<CalendarTodayIcon />} label="Date of Birth" value={
                      selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : "N/A"
                    } />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Fee Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">₹{selectedStudent.fee?.totalFee || 0}</Typography>
                            <Typography variant="caption" color="text.secondary">Total Fee</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="success.main">₹{selectedStudent.fee?.paidFee || 0}</Typography>
                            <Typography variant="caption" color="text.secondary">Paid</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="error.main">₹{selectedStudent.fee?.pendingFee || 0}</Typography>
                            <Typography variant="caption" color="text.secondary">Pending</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="info.main">₹{selectedStudent.fee?.scholarship || 0}</Typography>
                            <Typography variant="caption" color="text.secondary">Scholarship</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  {selectedStudent.father?.name && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Parent Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle2" gutterBottom>
                                Father
                              </Typography>
                              <Typography variant="body2">{selectedStudent.father.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {selectedStudent.father.occupation || 'N/A'} • {selectedStudent.father.phone || 'N/A'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle2" gutterBottom>
                                Mother
                              </Typography>
                              <Typography variant="body2">{selectedStudent.mother?.name || 'N/A'}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {selectedStudent.mother?.occupation || 'N/A'} • {selectedStudent.mother?.phone || 'N/A'}
                              </Typography>
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

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={openDeleteDialog} 
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>
            Confirm Deletion
          </DialogTitle>
          
          <DialogContent>
            {selectedStudent && (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  You are about to delete student: <strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong>
                </Alert>
                
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Deletion Type</FormLabel>
                  <RadioGroup
                    value={deletePermanent ? "permanent" : "soft"}
                    onChange={(e) => setDeletePermanent(e.target.value === "permanent")}
                  >
                    <FormControlLabel 
                      value="soft" 
                      control={<Radio />} 
                      label="Soft Delete (Deactivate student - Can be restored)" 
                    />
                    <FormControlLabel 
                      value="permanent" 
                      control={<Radio />} 
                      label="Permanent Delete (Cannot be undone)" 
                    />
                  </RadioGroup>
                </FormControl>
                
                {deletePermanent && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    ⚠️ Warning: Permanent deletion will remove all student records and cannot be recovered!
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenDeleteDialog(false)} 
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteStudent}
              startIcon={<DeleteIcon />}
            >
              {deletePermanent ? "Delete Permanently" : "Deactivate Student"}
            </Button>
          </DialogActions>
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

export default StudentsList;