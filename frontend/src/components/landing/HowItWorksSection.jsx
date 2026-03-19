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
  ArrowForward as ArrowForwardIcon,
  PersonAdd as SignUpIcon,
  GroupAdd as UsersIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  RocketLaunch as RocketIcon,
} from "@mui/icons-material";

const HowItWorksSection = () => {
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

  const steps = [
    {
      title: "Sign Up & Setup",
      description: "Create your school account and complete the initial setup in minutes with our guided wizard.",
      icon: <SignUpIcon />,
      color: colors.primary,
      time: "5 minutes",
      features: ["Free Trial", "No Credit Card", "Guided Setup"],
    },
    {
      title: "Add Users",
      description: "Add administrators, teachers, students, and parents to the system with bulk import options.",
      icon: <UsersIcon />,
      color: colors.secondary,
      time: "10 minutes",
      features: ["Bulk Import", "Role-based Access", "Custom Permissions"],
    },
    {
      title: "Start Managing",
      description: "Begin managing attendance, marks, communication, and more with our intuitive dashboard.",
      icon: <DashboardIcon />,
      color: "#9c27b0",
      time: "Immediate",
      features: ["Live Dashboard", "Real-time Data", "Mobile App"],
    },
  ];

  const benefits = [
    "No technical expertise required",
    "24/7 customer support",
    "Free training sessions",
    "Regular platform updates",
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
          left: 0,
          right: 0,
          height: "50%",
          bgcolor: alpha(colors.primaryLight, 0.2),
          zIndex: 0,
        }}
      />

      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: alpha(colors.primary, 0.08),
          animation: "pulse 6s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.1)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: alpha(colors.secondary, 0.06),
          animation: "pulse 8s ease-in-out infinite 1s",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <Fade in={true} timeout={500}>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Chip
              label="Simple Setup Process"
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
                mb: 2,
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
              Get Started in{" "}
              <Box component="span" sx={{ color: colors.primary }}>
                3 Simple Steps
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: colors.textSecondary,
                maxWidth: 720,
                mx: "auto",
                lineHeight: 1.7,
                fontSize: "1.1rem",
              }}
            >
              Simple, guided steps to transform how your school operates.
              Start your journey in under 30 minutes.
            </Typography>
          </Box>
        </Fade>

        {/* Steps Section */}
        <Grid container spacing={{ xs: 4, md: 2 }} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in={true} timeout={800 + index * 200}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                  }}
                >
                  {/* Step Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 },
                      height: "100%",
                      borderRadius: 3,
                      bgcolor: colors.white,
                      border: `1px solid ${alpha(step.color, 0.2)}`,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        borderColor: step.color,
                        boxShadow: `0 20px 40px ${alpha(step.color, 0.15)}`,
                        "& .step-icon": {
                          transform: "scale(1.1)",
                          bgcolor: alpha(step.color, 0.2),
                        },
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        bgcolor: step.color,
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                      },
                    }}
                  >
                    {/* Step Number */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: alpha(step.color, 0.1),
                        color: step.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      {index + 1}
                    </Box>

                    {/* Step Icon */}
                    <Box
                      className="step-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: alpha(step.color, 0.1),
                        color: step.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        "& svg": {
                          fontSize: 32,
                        },
                      }}
                    >
                      {step.icon}
                    </Box>

                    {/* Step Content */}
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={colors.textPrimary}
                      sx={{ mb: 1 }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color={colors.textSecondary}
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      {step.description}
                    </Typography>

                    {/* Time Badge */}
                    <Chip
                      label={step.time}
                      size="small"
                      sx={{
                        mb: 2,
                        bgcolor: alpha(step.color, 0.1),
                        color: step.color,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />

                    {/* Features */}
                    <Stack spacing={1}>
                      {step.features.map((feature, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <CheckIcon
                            sx={{
                              fontSize: 16,
                              color: step.color,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color={colors.textSecondary}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>

                  {/* Arrow Connector (Desktop only) */}
                  {index < steps.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: "none", md: "flex" },
                        position: "absolute",
                        top: "50%",
                        right: -24,
                        transform: "translateY(-50%)",
                        alignItems: "center",
                        color: alpha(colors.primary, 0.4),
                        zIndex: 2,
                      }}
                    >
                      <ArrowForwardIcon
                        sx={{
                          fontSize: 32,
                          animation: "slide 2s ease-in-out infinite",
                          "@keyframes slide": {
                            "0%, 100%": { transform: "translateX(0)" },
                            "50%": { transform: "translateX(4px)" },
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Benefits Section */}
        <Fade in={true} timeout={1200}>
          <Paper
            elevation={0}
            sx={{
              mt: { xs: 6, md: 8 },
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
                  fontWeight={700}
                  color={colors.textPrimary}
                  sx={{ mb: 2 }}
                >
                  Why It's Easy
                </Typography>
                <Typography
                  variant="body1"
                  color={colors.textSecondary}
                >
                  We've designed the process to be intuitive and straightforward.
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  {benefits.map((benefit, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: colors.white,
                          border: `1px solid ${alpha(colors.primary, 0.1)}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: colors.primary,
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: alpha(colors.primary, 0.1),
                            color: colors.primary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <RocketIcon fontSize="small" />
                        </Box>
                        <Typography
                          variant="body1"
                          color={colors.textPrimary}
                          fontWeight={500}
                        >
                          {benefit}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Call to Action */}
        <Fade in={true} timeout={1500}>
          <Box
            sx={{
              mt: { xs: 6, md: 8 },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color={colors.textPrimary}
              sx={{ mb: 3 }}
            >
              Ready to Transform Your School?
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: colors.white,
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                boxShadow: `0 8px 32px ${alpha(colors.primary, 0.1)}`,
              }}
            >
              <Typography
                variant="body1"
                color={colors.textPrimary}
                fontWeight={600}
              >
                Start your free 30-day trial today
              </Typography>
              <ArrowForwardIcon
                sx={{
                  color: colors.primary,
                  animation: "bounce 2s infinite",
                  "@keyframes bounce": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "50%": { transform: "translateX(4px)" },
                  },
                }}
              />
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;