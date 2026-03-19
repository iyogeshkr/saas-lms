import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const TeacherDashboard = () => {
  const stats = [
    {
      title: "My Students",
      value: "45",
      icon: <PeopleIcon />,
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    },
    {
      title: "Total Classes",
      value: "6",
      icon: <ClassIcon />,
      gradient: "linear-gradient(135deg, #43cea2, #185a9d)",
    },
    {
      title: "Pending Attendance",
      value: "2",
      icon: <AssignmentLateIcon />,
      gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
    },
    {
      title: "Assignments to Grade",
      value: "3",
      icon: <AssignmentTurnedInIcon />,
      gradient: "linear-gradient(135deg, #ff512f, #dd2476)",
    },
  ];

  return (
    <DashboardLayout role="teacher" userName="John Doe">
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          👨‍🏫 Teacher Dashboard
        </Typography>
        <Typography color="text.secondary">
          Quick overview of your classes and responsibilities
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                color: "#fff",
                background: stat.gradient,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ opacity: 0.9 }}
                  >
                    {stat.title}
                  </Typography>

                  <Box
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      borderRadius: "50%",
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>

                <Typography variant="h3" fontWeight="bold">
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

export default TeacherDashboard;
