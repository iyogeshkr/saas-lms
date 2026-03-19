import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MarksView = () => {
  const [tabValue, setTabValue] = useState(0);

  const marksData = [
    { month: "Jan", math: 85, science: 78, english: 90 },
    { month: "Feb", math: 88, science: 82, english: 92 },
    { month: "Mar", math: 82, science: 85, english: 88 },
    { month: "Apr", math: 90, science: 80, english: 85 },
    { month: "May", math: 87, science: 88, english: 91 },
    { month: "Jun", math: 92, science: 85, english: 89 },
  ];

  const subjectData = [
    { subject: "Math", marks: 92, grade: "A" },
    { subject: "Science", marks: 85, grade: "B+" },
    { subject: "English", marks: 89, grade: "A-" },
    { subject: "History", marks: 78, grade: "C+" },
    { subject: "Physics", marks: 88, grade: "B+" },
    { subject: "Chemistry", marks: 81, grade: "B" },
  ];

  const attendanceData = [
    { name: "Present", value: 92, color: "#4CAF50" },
    { name: "Absent", value: 5, color: "#F44336" },
    { name: "Late", value: 3, color: "#FF9800" },
  ];

  const marksTable = [
    { id: 1, subject: "Mathematics", test1: 85, test2: 88, final: 92, total: 265, grade: "A" },
    { id: 2, subject: "Science", test1: 78, test2: 82, final: 85, total: 245, grade: "B+" },
    { id: 3, subject: "English", test1: 90, test2: 92, final: 89, total: 271, grade: "A" },
    { id: 4, subject: "History", test1: 75, test2: 70, final: 78, total: 223, grade: "C+" },
    { id: 5, subject: "Physics", test1: 82, test2: 85, final: 88, total: 255, grade: "B+" },
  ];

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A": return "success";
      case "B+": return "primary";
      case "B": return "info";
      case "C+": return "warning";
      default: return "error";
    }
  };

  return (
    <DashboardLayout role="student" userName="Alice Johnson">
      {/* Header */}
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
          📊 Marks & Performance
        </Typography>
        <Typography sx={{ opacity: 0.9 }}>
          Track academic progress & performance insights
        </Typography>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          centered
          sx={{
            "& .MuiTab-root": { fontWeight: 600 },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Detailed Marks" />
          <Tab label="Charts" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
  <Grid container spacing={3}>

    {/* KPI CARDS */}
    <Grid item xs={12} md={3}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography color="text.secondary">Overall %</Typography>
          <Typography variant="h3" fontWeight="bold">87.5%</Typography>
          <Chip label="Grade A-" color="success" sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={3}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography color="text.secondary">Class Rank</Typography>
          <Typography variant="h3" fontWeight="bold">15</Typography>
          <Typography color="text.secondary">Out of 200</Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={3}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography color="text.secondary">Best Subject</Typography>
          <Typography variant="h4" fontWeight="bold">Math</Typography>
          <Typography color="text.secondary">92 Marks</Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={3}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography color="text.secondary">Attendance</Typography>
          <Typography variant="h3" fontWeight="bold">92%</Typography>
          <Chip label="Excellent" color="success" sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    </Grid>

    {/* MAIN PERFORMANCE TREND */}
    <Grid item xs={12}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          📈 Performance Trend (Monthly)
        </Typography>

        <Box height={350}>
          <ResponsiveContainer>
            <LineChart data={marksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="math" stroke="#667eea" strokeWidth={3} />
              <Line dataKey="science" stroke="#43cea2" strokeWidth={3} />
              <Line dataKey="english" stroke="#ff9800" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Grid>

    {/* SUPPORTING CHARTS */}
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Subject-wise Marks
        </Typography>

        <Box height={280}>
          <ResponsiveContainer>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#667eea" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Grid>

    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          🧾 Attendance Summary
        </Typography>

        <Box height={280}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={attendanceData}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {attendanceData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Grid>
  </Grid>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detailed Marks
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f5f7fb" }}>
                  <TableCell>Subject</TableCell>
                  <TableCell align="center">Test 1</TableCell>
                  <TableCell align="center">Test 2</TableCell>
                  <TableCell align="center">Final</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marksTable.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell align="center">{row.test1}</TableCell>
                    <TableCell align="center">{row.test2}</TableCell>
                    <TableCell align="center">{row.final}</TableCell>
                    <TableCell align="center"><b>{row.total}/300</b></TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.grade}
                        color={getGradeColor(row.grade)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 2 && (
  <Grid container spacing={3}>

    <Grid item xs={12}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          📈 Overall Performance Trend
        </Typography>

        <Box height={400}>
          <ResponsiveContainer>
            <LineChart data={marksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="math" stroke="#667eea" strokeWidth={3} />
              <Line dataKey="science" stroke="#43cea2" strokeWidth={3} />
              <Line dataKey="english" stroke="#ff9800" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Grid>

    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Subject Comparison
        </Typography>

        <Box height={300}>
          <ResponsiveContainer>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#764ba2" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Grid>

    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎯 Performance Insight
        </Typography>

        <Typography color="text.secondary">
          • Strongest subject: Mathematics  
          <br />
          • Needs improvement: History  
          <br />
          • Consistent growth in English  
        </Typography>
      </Paper>
    </Grid>

  </Grid>
      )}

    </DashboardLayout>
  );
};

export default MarksView;
