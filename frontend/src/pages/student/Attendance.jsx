import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";

const subjects = [
  { name: "Mathematics", percentage: 90 },
  { name: "Physics", percentage: 85 },
  { name: "Chemistry", percentage: 95 },
  { name: "Computer Science", percentage: 92 },
];

const StudentAttendance = () => {
  const overallAttendance = 91;

  return (
    <DashboardLayout role="student" userName="Alice Johnson">
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          📅 My Attendance
        </Typography>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Track your subject-wise attendance performance
        </Typography>

        <Box mt={3}>
          <Typography variant="h6">
            Overall Attendance: {overallAttendance}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={overallAttendance}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 1,
              backgroundColor: "rgba(255,255,255,0.3)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#fff",
              },
            }}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {subjects.map((sub) => (
          <Grid item xs={12} md={6} key={sub.name}>
            <Card
              sx={{
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="600">
                  {sub.name}
                </Typography>

                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Attendance: {sub.percentage}%
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={sub.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      mt: 1,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
};

export default StudentAttendance;
