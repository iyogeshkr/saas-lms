import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  alpha,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  PlayCircle as PlayIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

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

  const stats = [
    { icon: <SchoolIcon />, value: "500+", label: "Schools" },
    { icon: <GroupIcon />, value: "50K+", label: "Users" },
    { icon: <TrendingIcon />, value: "99%", label: "Satisfaction" },
    { icon: <SecurityIcon />, value: "100%", label: "Secure" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "auto", md: "90vh", lg: "85vh", xl: "80vh" },
        display: "flex",
        alignItems: "center",
        bgcolor: colors.background,
        overflow: "hidden",
        py: { xs: 8, md: 4, lg: 6, xl: 8 },
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: { xs: "65%", md: "75%", lg: "80%" },
          bgcolor: colors.primaryLight,
          borderBottomLeftRadius: { xs: "30px", md: "40px", lg: "50px" },
          borderBottomRightRadius: { xs: "30px", md: "40px", lg: "50px" },
          zIndex: 1,
        }}
      />

      {/* Animated circles */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "15%", md: "10%", lg: "8%" },
          right: { xs: "5%", md: "8%", lg: "10%" },
          width: { xs: 200, md: 300, lg: 400, xl: 500 },
          height: { xs: 200, md: 300, lg: 400, xl: 500 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(colors.primary, 0.05)} 0%, transparent 70%)`,
          animation: "float 8s ease-in-out infinite",
          zIndex: 1,
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-30px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "15%", md: "20%", lg: "25%" },
          left: { xs: "5%", md: "8%", lg: "10%" },
          width: { xs: 150, md: 250, lg: 300, xl: 350 },
          height: { xs: 150, md: 250, lg: 300, xl: 350 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(colors.secondary, 0.04)} 0%, transparent 70%)`,
          animation: "float 10s ease-in-out infinite 1s",
          zIndex: 1,
        }}
      />

      <Container
        maxWidth={isLargeScreen ? false : "xl"}
        disableGutters={isLargeScreen}
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          mx: isLargeScreen ? 8 : "auto",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 6, md: 8, lg: 12, xl: 16 },
            width: "100%",
          }}
        >
          {/* Left Content Section */}
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", md: "50%", lg: "55%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Slide in={true} direction="right" timeout={500}>
              <Box sx={{ width: "100%" }}>
                {/* Badge */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: { xs: 2, md: 2.5, lg: 3 },
                    py: { xs: 0.75, md: 1 },
                    mb: { xs: 3, md: 4, lg: 5 },
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    borderRadius: "24px",
                    fontSize: { xs: "0.75rem", md: "0.875rem", lg: "1rem" },
                    fontWeight: 600,
                    letterSpacing: { xs: 0.5, md: 1 },
                    whiteSpace: "nowrap",
                  }}
                >
                  <SchoolIcon fontSize="small" />
                  SMART SCHOOL MANAGEMENT
                </Box>

                {/* Main Heading */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: {
                      xs: "2.5rem",
                      sm: "3rem",
                      md: "3.5rem",
                      lg: "4rem",
                      xl: "4.5rem",
                    },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: { xs: 2, md: 3, lg: 4 },
                    color: colors.textPrimary,
                  }}
                >
                  Transform Your{" "}
                  <Box
                    component="span"
                    sx={{
                      color: colors.primary,
                      display: "block",
                      fontSize: {
                        xs: "2.8rem",
                        sm: "3.3rem",
                        md: "3.8rem",
                        lg: "4.3rem",
                        xl: "4.8rem",
                      },
                    }}
                  >
                    School Management
                  </Box>
                </Typography>

                {/* Description */}
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.textSecondary,
                    lineHeight: 1.7,
                    mb: { xs: 4, md: 5, lg: 6 },
                    fontSize: {
                      xs: "1.1rem",
                      sm: "1.2rem",
                      md: "1.3rem",
                      lg: "1.4rem",
                      xl: "1.5rem",
                    },
                    maxWidth: { xs: "100%", md: "90%", lg: "85%" },
                  }}
                >
                  Streamline administration, enhance communication, and improve
                  student outcomes with one powerful, easy-to-use platform. Join
                  thousands of schools already transforming education.
                </Typography>

                {/* CTA Buttons */}
                <Fade in={true} timeout={800}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 2, sm: 3, md: 4 }}
                    sx={{
                      mb: { xs: 5, md: 6, lg: 8 },
                      width: "100%",
                      maxWidth: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: { xs: 3, md: 4, lg: 5 },
                        py: { xs: 1.5, md: 1.75, lg: 2 },
                        fontSize: { xs: "1rem", md: "1.1rem", lg: "1.2rem" },
                        fontWeight: 600,
                        borderRadius: "12px",
                        bgcolor: colors.primary,
                        boxShadow: `0 6px 24px ${alpha(colors.primary, 0.3)}`,
                        minWidth: { xs: "100%", sm: "200px", md: "220px", lg: "240px" },
                        "&:hover": {
                          bgcolor: colors.primaryDark,
                          transform: "translateY(-3px)",
                          boxShadow: `0 12px 32px ${alpha(colors.primary, 0.4)}`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Get Started Free
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayIcon />}
                      sx={{
                        px: { xs: 3, md: 4, lg: 5 },
                        py: { xs: 1.5, md: 1.75, lg: 2 },
                        fontSize: { xs: "1rem", md: "1.1rem", lg: "1.2rem" },
                        fontWeight: 600,
                        borderRadius: "12px",
                        borderWidth: 2,
                        borderColor: colors.primary,
                        color: colors.primary,
                        minWidth: { xs: "100%", sm: "180px", md: "200px", lg: "220px" },
                        "&:hover": {
                          borderColor: colors.primaryDark,
                          bgcolor: alpha(colors.primary, 0.05),
                          transform: "translateY(-3px)",
                          borderWidth: 2,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                </Fade>

                {/* Stats Grid */}
                <Grid container spacing={{ xs: 2, md: 3, lg: 4 }} sx={{ width: "100%" }}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} key={index} sx={{ display: "flex" }}>
                      <Fade in={true} timeout={1000 + index * 200}>
                        <Card
                          sx={{
                            flex: 1,
                            border: `1px solid ${alpha(colors.primary, 0.15)}`,
                            borderRadius: "16px",
                            bgcolor: "transparent",
                            height: "100%",
                            minHeight: { xs: 100, md: 120, lg: 140 },
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: colors.primary,
                              transform: "translateY(-4px)",
                              boxShadow: `0 12px 32px ${alpha(colors.primary, 0.15)}`,
                            },
                          }}
                        >
                          <CardContent
                            sx={{
                              p: { xs: 2, md: 2.5, lg: 3 },
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                color: colors.primary,
                                mb: { xs: 1, md: 1.5, lg: 2 },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "& svg": {
                                  fontSize: { xs: 24, md: 28, lg: 32, xl: 36 },
                                },
                              }}
                            >
                              {stat.icon}
                            </Box>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 800,
                                color: colors.textPrimary,
                                fontSize: { xs: "1.75rem", md: "2rem", lg: "2.25rem", xl: "2.5rem" },
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: colors.textSecondary,
                                fontSize: { xs: "0.75rem", md: "0.875rem", lg: "1rem" },
                                fontWeight: 500,
                                textAlign: "center",
                              }}
                            >
                              {stat.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Slide>
          </Box>

          {/* Right Image Section */}
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", md: "45%", lg: "40%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              mt: { xs: 4, md: 0 },
            }}
          >
            <Fade in={true} timeout={1000}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: "400px", md: "500px", lg: "600px", xl: "700px" },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: { xs: -16, md: -24, lg: -32 },
                    left: { xs: -16, md: -24, lg: -32 },
                    right: { xs: 16, md: 24, lg: 32 },
                    bottom: { xs: 16, md: 24, lg: 32 },
                    bgcolor: alpha(colors.primary, 0.08),
                    borderRadius: { xs: "24px", md: "32px", lg: "40px" },
                    zIndex: 0,
                    display: { xs: "none", md: "block" },
                  },
                }}
              >
                {/* Main Image */}
                <Box
                  component="img"
                  src="/images/image.png"
                  alt="School Management Dashboard"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: { xs: "20px", md: "28px", lg: "36px" },
                    boxShadow: `0 25px 80px ${alpha(colors.primary, 0.2)}`,
                    position: "relative",
                    zIndex: 1,
                    transform: {
                      xs: "none",
                      md: "perspective(1500px) rotateY(-8deg) rotateX(2deg)",
                    },
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: {
                        xs: "scale(1.02)",
                        md: "perspective(1500px) rotateY(-4deg) rotateX(1deg) scale(1.02)",
                      },
                      boxShadow: `0 35px 100px ${alpha(colors.primary, 0.3)}`,
                    },
                  }}
                />

                {/* Floating Elements - Hidden on mobile */}
                {!isMobile && (
                  <>
                    <Card
                      sx={{
                        position: "absolute",
                        top: { md: "-10%", lg: "-12%", xl: "-15%" },
                        right: { md: "-10%", lg: "-12%", xl: "-15%" },
                        p: { md: 2, lg: 2.5, xl: 3 },
                        borderRadius: { md: "20px", lg: "24px" },
                        bgcolor: colors.white,
                        boxShadow: `0 15px 50px ${alpha(colors.primary, 0.2)}`,
                        zIndex: 2,
                        animation: "float 6s ease-in-out infinite 0.5s",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(colors.primary, 0.1)}`,
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        sx={{
                          fontSize: { md: "0.875rem", lg: "1rem", xl: "1.125rem" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        🎯 Real-time Analytics
                      </Typography>
                    </Card>

                    <Card
                      sx={{
                        position: "absolute",
                        bottom: { md: "-10%", lg: "-12%", xl: "-15%" },
                        left: { md: "-10%", lg: "-12%", xl: "-15%" },
                        p: { md: 2, lg: 2.5, xl: 3 },
                        borderRadius: { md: "20px", lg: "24px" },
                        bgcolor: colors.white,
                        boxShadow: `0 15px 50px ${alpha(colors.primary, 0.2)}`,
                        zIndex: 2,
                        animation: "float 7s ease-in-out infinite",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(colors.primary, 0.1)}`,
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        sx={{
                          fontSize: { md: "0.875rem", lg: "1rem", xl: "1.125rem" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        ⚡ Instant Updates
                      </Typography>
                    </Card>
                  </>
                )}
              </Box>
            </Fade>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;