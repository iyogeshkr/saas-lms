import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  alpha,
  Fade,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  AccessTime as UptimeIcon,
  SupportAgent as SupportIcon,
  Update as UpdateIcon,
  Smartphone as MobileIcon,
  Cloud as CloudIcon,
  Language as LanguageIcon,
  Devices as DevicesIcon,
  NotificationsActive as NotificationIcon,
  Settings as SettingsIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";

const AboutSection = () => {
  // Color palette matching the navbar
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

  const platformFeatures = [
    { 
      text: "Cloud-based platform accessible from anywhere", 
      icon: <CloudIcon fontSize="small" /> 
    },
    { 
      text: "Mobile-responsive design for all devices", 
      icon: <DevicesIcon fontSize="small" /> 
    },
    { 
      text: "Real-time updates and notifications", 
      icon: <NotificationIcon fontSize="small" /> 
    },
    { 
      text: "Multi-language support", 
      icon: <LanguageIcon fontSize="small" /> 
    },
    { 
      text: "Customizable to your school needs", 
      icon: <SettingsIcon fontSize="small" /> 
    },
    { 
      text: "Regular backups and data security", 
      icon: <VerifiedIcon fontSize="small" /> 
    },
  ];

  const benefits = [
    { 
      icon: <UptimeIcon />, 
      title: "99.9% Uptime", 
      description: "Guaranteed reliability" 
    },
    { 
      icon: <SecurityIcon />, 
      title: "Bank-grade Security", 
      description: "Enterprise level protection" 
    },
    { 
      icon: <SupportIcon />, 
      title: "24/7 Support", 
      description: "Dedicated assistance" 
    },
    { 
      icon: <UpdateIcon />, 
      title: "Regular Updates", 
      description: "Latest features & improvements" 
    },
    { 
      icon: <MobileIcon />, 
      title: "Mobile App", 
      description: "Available on all devices" 
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
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
          left: 0,
          right: 0,
          height: "100%",
          background: `linear-gradient(135deg, ${alpha(colors.primaryLight, 0.3)} 0%, ${colors.background} 100%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={500}>
              <Box>
                <Chip
                  label="About Our Platform"
                  icon={<SchoolIcon />}
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
                  Designed for{" "}
                  <Box
                    component="span"
                    sx={{
                      color: colors.primary,
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 4,
                        left: 0,
                        width: "100%",
                        height: 8,
                        bgcolor: alpha(colors.primary, 0.2),
                        borderRadius: 4,
                        zIndex: -1,
                      },
                    }}
                  >
                    Modern Education
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: colors.textSecondary,
                    mb: 4,
                    lineHeight: 1.7,
                    fontSize: "1.1rem",
                    maxWidth: 520,
                  }}
                >
                  Our School Management System is crafted with modern technology
                  to deliver a seamless experience for administrators, teachers,
                  students, and parents.
                </Typography>

                {/* Feature List */}
                <Box sx={{ mb: 5 }}>
                  {platformFeatures.map((feature, index) => (
                    <Fade
                      key={index}
                      in={true}
                      timeout={600 + index * 100}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(colors.primary, 0.03),
                          border: `1px solid ${alpha(colors.primary, 0.1)}`,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateX(4px)",
                            borderColor: colors.primary,
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              color: colors.primary,
                              "& svg": { fontSize: 20 },
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              color: colors.textPrimary,
                              fontWeight: 500,
                            }}
                          >
                            {feature.text}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Fade>
                  ))}
                </Box>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    borderColor: colors.primary,
                    color: colors.primary,
                    "&:hover": {
                      bgcolor: colors.primaryLight,
                      borderColor: colors.primaryDark,
                    },
                  }}
                >
                  View All Features
                </Button>
              </Box>
            </Fade>
          </Grid>

          {/* Right Content - Benefits Card */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 5 },
                  borderRadius: 4,
                  bgcolor: colors.primary,
                  color: colors.white,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 20px 60px ${alpha(colors.primary, 0.3)}`,
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
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      mb: 4,
                      borderRadius: "16px",
                      bgcolor: alpha(colors.white, 0.2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "& svg": {
                        fontSize: 32,
                      },
                    }}
                  >
                    <SecurityIcon />
                  </Box>

                  <Typography
                    variant="h3"
                    sx={{
                      mb: 2,
                      fontWeight: 800,
                      lineHeight: 1.2,
                    }}
                  >
                    Why Schools Trust Us
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      fontSize: "1.1rem",
                    }}
                  >
                    Join thousands of educational institutions that rely on our
                    platform for their daily operations and long-term success.
                  </Typography>

                  {/* Benefits Grid */}
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    {benefits.map((benefit, index) => (
                      <Grid item xs={6} key={index}>
                        <Card
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(colors.white, 0.1),
                            height: "100%",
                            border: `1px solid ${alpha(colors.white, 0.2)}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: alpha(colors.white, 0.15),
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                            <Box
                              sx={{
                                color: colors.white,
                                mb: 1.5,
                                "& svg": { fontSize: 24 },
                              }}
                            >
                              {benefit.icon}
                            </Box>
                            <Typography
                              variant="h5"
                              fontWeight={700}
                              sx={{ mb: 0.5 }}
                            >
                              {benefit.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ opacity: 0.8 }}
                            >
                              {benefit.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2,
                      bgcolor: colors.white,
                      color: colors.primary,
                      boxShadow: `0 8px 24px ${alpha(colors.textPrimary, 0.2)}`,
                      "&:hover": {
                        bgcolor: colors.primaryLight,
                        transform: "translateY(-2px)",
                        boxShadow: `0 12px 32px ${alpha(colors.textPrimary, 0.3)}`,
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Request Demo
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Fade in={true} timeout={1000}>
          <Box
            sx={{
              mt: { xs: 8, md: 12 },
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              bgcolor: alpha(colors.primary, 0.05),
              border: `1px solid ${alpha(colors.primary, 0.1)}`,
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color={colors.textPrimary}
                  sx={{ mb: 2 }}
                >
                  Trusted by Educational Institutions Worldwide
                </Typography>
                <Typography
                  variant="body1"
                  color={colors.textSecondary}
                >
                  Our platform powers schools, colleges, and universities
                  across 50+ countries.
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  {[
                    { value: "98%", label: "Customer Satisfaction" },
                    { value: "5M+", label: "Active Users" },
                    { value: "24/7", label: "Support Coverage" },
                    { value: "99.9%", label: "System Uptime" },
                  ].map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h2"
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
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AboutSection;