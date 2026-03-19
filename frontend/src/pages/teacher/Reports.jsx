import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AttendanceReport from "../../components/reports/AttendanceReport";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const Reports = () => {
  const [reportType, setReportType] = useState("attendance");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [classFilter, setClassFilter] = useState("all");

  const attendanceData = [
    { rollNo: "101", name: "Alice Johnson", status: "Present", date: "2024-03-15", remarks: "" },
    { rollNo: "102", name: "Bob Smith", status: "Absent", date: "2024-03-15", remarks: "Sick" },
    { rollNo: "103", name: "Charlie Brown", status: "Present", date: "2024-03-15", remarks: "" },
    { rollNo: "104", name: "Diana Prince", status: "Present", date: "2024-03-15", remarks: "" },
    { rollNo: "105", name: "Edward Wilson", status: "Late", date: "2024-03-15", remarks: "Traffic" },
  ];

  const handleGenerateReport = () => {
    console.log("Generating report:", {
      reportType,
      startDate,
      endDate,
      classFilter,
    });
  };

  return (
    <DashboardLayout role="teacher" userName="John Doe">
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          color: "#fff",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <AnalyticsIcon />
          <Typography variant="h4" fontWeight="bold">
            Reports & Analytics
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Generate and analyze academic & attendance reports
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Generate Report
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="attendance">Attendance Report</MenuItem>
                <MenuItem value="marks">Marks Report</MenuItem>
                <MenuItem value="performance">Performance Report</MenuItem>
                <MenuItem value="fees">Fees Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} size="small" fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} size="small" fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Class</InputLabel>
              <Select
                value={classFilter}
                label="Class"
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <MenuItem value="all">All Classes</MenuItem>
                <MenuItem value="10">Class 10</MenuItem>
                <MenuItem value="9">Class 9</MenuItem>
                <MenuItem value="8">Class 8</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: 40, borderRadius: 2 }}
              onClick={handleGenerateReport}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {reportType === "attendance" && (
        <AttendanceReport
          data={attendanceData}
          title={`Attendance Report - ${
            classFilter === "all" ? "All Classes" : "Class " + classFilter
          }`}
        />
      )}

      {reportType === "marks" && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6">Marks Report</Typography>
          <Typography color="text.secondary">
            Select parameters and generate marks report
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3} mt={1}>
        <QuickStat
          icon={<AssessmentIcon />}
          value="24"
          label="Reports Generated"
          color="#667eea"
        />
        <QuickStat
          icon={<TrendingUpIcon />}
          value="18"
          label="This Month"
          color="#43cea2"
        />
        <QuickStat
          icon={<AnalyticsIcon />}
          value="85%"
          label="Avg. Attendance"
          color="#ff9800"
        />
        <QuickStat
          icon={<PendingActionsIcon />}
          value="3"
          label="Pending Reports"
          color="#f44336"
        />
      </Grid>
    </DashboardLayout>
  );
};

const QuickStat = ({ icon, value, label, color }) => (
  <Grid item xs={12} md={3}>
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          mx: "auto",
          mb: 1,
          borderRadius: "50%",
          backgroundColor: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  </Grid>
);

export default Reports;
