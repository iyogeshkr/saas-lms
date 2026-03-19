import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Stack,
  Chip,
  alpha,
  Fade,
} from "@mui/material";
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Message as MessageIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Assignment as AssignmentIcon,
  Receipt as ReceiptIcon,
  LibraryBooks as LibraryIcon,
  Cloud as CloudIcon,
} from "@mui/icons-material";

const FeaturesSection = () => {
  // Color palette matching your design system
  const colors = {
    primary: "#1a73e8",
    primaryDark: "#0d47a1",
    primaryLight: "#e8f0fe",
    secondary: "#34a853",
    background: "#ffffff",
    textPrimary: "#202124",
    textSecondary: "#5f6368",
    white: "#ffffff",
  };

  const features = [
    {
      icon: <PeopleIcon />,
      title: "User Management",
      desc: "Comprehensive role-based access for admins, teachers & students.",
      color: "#1a73e8", // Blue
      badge: "Essential",
    },
    {
      icon: <AssessmentIcon />,
      title: "Attendance Tracking",
      desc: "Real-time attendance with automated reports and notifications.",
      color: "#34a853", // Green
      badge: "Popular",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Performance Analytics",
      desc: "AI-powered insights and visual dashboards for academic tracking.",
      color: "#f57c00", // Orange
      badge: "Smart",
    },
    {
      icon: <MessageIcon />,
      title: "Communication Hub",
      desc: "Instant messaging, announcements, and parent communication.",
      color: "#9c27b0", // Purple
      badge: "Real-time",
    },
    {
      icon: <SecurityIcon />,
      title: "Secure Platform",
      desc: "Enterprise-grade security with end-to-end data encryption.",
      color: "#d32f2f", // Red
      badge: "Secure",
    },
    {
      icon: <SchoolIcon />,
      title: "Class Management",
      desc: "Smart scheduling, subject allocation, and resource management.",
      color: "#0097a7", // Teal
      badge: "Organized",
    },
    {
      icon: <CalendarIcon />,
      title: "Smart Timetable",
      desc: "Automated scheduling with conflict detection and optimization.",
      color: "#7b1fa2", // Deep Purple
      badge: "Auto",
    },
    {
      icon: <ReceiptIcon />,
      title: "Fee Management",
      desc: "Automated fee collection, receipts, and financial reporting.",
      color: "#388e3c", // Green Dark
      badge: "Finance",
    },
  ];

  const stats = [
    { value: "40%", label: "Time Saved" },
    { value: "95%", label: "Accuracy" },
    { value: "24/7", label: "Accessibility" },
    { value: "50+", label: "Features" },
  ];

  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        bgcolor: colors.background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "100%",
          bgcolor: alpha(colors.primaryLight, 0.3),
          borderTopLeftRadius: "200px",
          borderBottomLeftRadius: "200px",
          transform: "translateX(50%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          <Grid item xs={12} md={5}>
            <Fade in={true} timeout={500}>
              <Box>
                <Chip
                  label="Powerful Features"
                  icon={<DashboardIcon />}
                  sx={{
                    mb: 3,
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    fontWeight: 600,
                    py: 1,
                    "& .MuiChip-icon": {
                      color: colors.primary,
                    },
                  }}
                />

                <Typography
                  variant="h2"
                  sx={{
                    mb: 3,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: colors.textPrimary,
                    fontSize: {
                      xs: "2.5rem",
                      md: "3rem",
                      lg: "3.5rem",
                    },
                  }}
                >
                  Everything Your
                  <Box
                    component="span"
                    sx={{
                      color: colors.primary,
                      display: "block",
                    }}
                  >
                    School Needs
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: colors.textSecondary,
                    mb: 4,
                    lineHeight: 1.7,
                    fontSize: "1.1rem",
                  }}
                >
                  A comprehensive platform designed to simplify administration,
                  improve communication, and enhance student outcomes with
                  powerful tools.
                </Typography>

                {/* Stats */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Fade in={true} timeout={800 + index * 200}>
                        <Box>
                          <Typography
                            variant="h3"
                            fontWeight={800}
                            color={colors.primary}
                            sx={{ mb: 0.5 }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={colors.textSecondary}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* Features Grid */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Fade in={true} timeout={600 + index * 100}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 3,
                        bgcolor: colors.white,
                        border: `1px solid ${alpha(colors.primary, 0.1)}`,
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          borderColor: feature.color,
                          boxShadow: `0 20px 40px ${alpha(feature.color, 0.15)}`,
                          "& .feature-icon": {
                            transform: "scale(1.1)",
                            bgcolor: alpha(feature.color, 0.2),
                          },
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "4px",
                          bgcolor: feature.color,
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                        },
                      }}
                    >
                      {/* Feature Badge */}
                      {feature.badge && (
                        <Chip
                          label={feature.badge}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            bgcolor: alpha(feature.color, 0.1),
                            color: feature.color,
                            fontWeight: 600,
                            fontSize: "0.65rem",
                            height: 20,
                          }}
                        />
                      )}

                      {/* Feature Icon */}
                      <Box
                        className="feature-icon"
                        sx={{
                          width: 56,
                          height: 56,
                          mb: 2,
                          borderRadius: 2,
                          bgcolor: alpha(feature.color, 0.1),
                          color: feature.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          "& svg": {
                            fontSize: 28,
                          },
                        }}
                      >
                        {feature.icon}
                      </Box>

                      {/* Feature Content */}
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={colors.textPrimary}
                        sx={{ mb: 1 }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color={colors.textSecondary}
                        sx={{ lineHeight: 1.6 }}
                      >
                        {feature.desc}
                      </Typography>
                    </Paper>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {/* All-in-One Card */}
            <Fade in={true} timeout={1200}>
              <Paper
                elevation={0}
                sx={{
                  mt: 4,
                  p: 4,
                  borderRadius: 3,
                  bgcolor: colors.primary,
                  color: colors.white,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    bgcolor: alpha(colors.white, 0.1),
                  },
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ mb: 1 }}
                    >
                      All-in-One Solution
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ opacity: 0.9, mb: 2 }}
                    >
                      From student enrollment to graduation, manage every aspect
                      of your school with our integrated platform.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {["✅ Cloud Based", "✅ Mobile App", "✅ 24/7 Support", "✅ Free Updates"].map(
                        (item, idx) => (
                          <Chip
                            key={idx}
                            label={item}
                            size="small"
                            sx={{
                              bgcolor: alpha(colors.white, 0.2),
                              color: colors.white,
                              fontWeight: 500,
                            }}
                          />
                        )
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        "& svg": {
                          fontSize: 64,
                          opacity: 0.9,
                        },
                      }}
                    >
                      <CloudIcon />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;