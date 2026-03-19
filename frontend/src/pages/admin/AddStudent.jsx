import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TextInput from "../../components/common/TextInput";
import SelectInput from "../../components/common/SelectInput";
import SubmitButton from "../../components/common/SubmitButton";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    parentPhone: "",
    class: "",
    rollNumber: "",
  });

  const classes = [
    { value: "1", label: "Class 1" },
    { value: "2", label: "Class 2" },
    { value: "3", label: "Class 3" },
    { value: "4", label: "Class 4" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data:", formData);
  };

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
          <PersonAddIcon />
          <Typography variant="h4" fontWeight="bold">
            Add New Student
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Enter student details to register them into the system
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
          Student Information
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Fill in the required details below. Fields marked mandatory must be completed.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextInput
                label="Parent's Phone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SelectInput
                label="Class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                options={classes}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextInput
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <SubmitButton>Add Student</SubmitButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default AddStudent;
