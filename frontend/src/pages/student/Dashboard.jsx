import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {
  School,
  BarChart,
  Payments,
  Mail,
} from "@mui/icons-material";

const stats = [
  {
    title: "Attendance",
    value: "92%",
    icon: <School />,
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  {
    title: "Average Marks",
    value: "85%",
    icon: <BarChart />,
    gradient: "linear-gradient(135deg, #43cea2, #185a9d)",
  },
  {
    title: "Pending Fees",
    value: "$0",
    icon: <Payments />,
    gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
  },
  {
    title: "Unread Messages",
    value: "3",
    icon: <Mail />,
    gradient: "linear-gradient(135deg, #ff512f, #dd2476)",
  },
];

const StudentDashboard = () => {
  return (
    <DashboardLayout role="student" userName="Alice Johnson">
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          👋 Welcome back, Alice
        </Typography>
        <Typography color="text.secondary">
          Here’s a quick overview of your academic status
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                height: "100%",
                background: stat.gradient,
                color: "#fff",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    {stat.title}
                  </Typography>
                  <Box
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "50%",
                      p: 1,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>

                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
};

export default StudentDashboard;
