import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Skeleton,
} from "@mui/material";
import SubjectIcon from "@mui/icons-material/Subject";

const ManageSubjects = () => {
  return (
    <DashboardLayout role="admin" userName="Admin User">
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
          <SubjectIcon />
          <Typography variant="h4" fontWeight="bold">
            Manage Subjects
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Add, update, and organize academic subjects
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
          Subjects Overview
        </Typography>

        <Typography color="text.secondary" mb={3}>
          The subjects table will be displayed here with edit and delete actions.
        </Typography>

        <Grid container spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Skeleton variant="rounded" height={52} />
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <Typography variant="body2" color="text.secondary">
            📌 Use this section to manage subject assignments and curriculum details.
          </Typography>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default ManageSubjects;
