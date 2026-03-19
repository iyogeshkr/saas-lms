import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
  Skeleton,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

const AddMarks = () => {
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
          <AssessmentIcon />
          <Typography variant="h4" fontWeight="bold">
            Add Marks
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Enter and manage student examination marks
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
          Marks Entry Form
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Select class, subject, and enter marks for students.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={56} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={56} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={56} />
          </Grid>

          <Grid item xs={12}>
            <Skeleton variant="rounded" height={240} />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="body2" color="text.secondary">
            📌 This section will contain the marks input table and submit action.
          </Typography>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default AddMarks;
