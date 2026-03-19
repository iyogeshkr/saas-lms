import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Skeleton,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

const StudentList = () => {
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
          <PeopleIcon />
          <Typography variant="h4" fontWeight="bold">
            Student List
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          View and manage students under your classes
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Students Overview
        </Typography>

        <Typography color="text.secondary" mb={3}>
          The student table will be displayed here with filters and actions.
        </Typography>

        <Grid container spacing={2}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="rounded" height={48} />
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <Typography variant="body2" color="text.secondary">
            📌 This section will include search, filters, and student actions.
          </Typography>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default StudentList;
