import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import TextInput from "../../components/common/TextInput";
import SelectInput from "../../components/common/SelectInput";
import SubmitButton from "../../components/common/SubmitButton";

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
  });

  const subjects = [
    { value: "math", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Teacher Data:", formData);
  };

  return (
    <DashboardLayout role="admin" userName="Admin User">
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          color: "#fff",
          background: "linear-gradient(135deg, #43cea2, #185a9d)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <SchoolIcon />
          <Typography variant="h4" fontWeight="bold">
            Add New Teacher
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Register a teacher and assign subject responsibilities
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
          Teacher Information
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Please fill in the teacher’s personal and academic details.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Full Name"
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
              <SelectInput
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                options={subjects}
              />
            </Grid>

            <Grid item xs={12}>
              <TextInput
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <SubmitButton>Add Teacher</SubmitButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default AddTeacher;
