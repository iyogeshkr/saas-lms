import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Chip,
  alpha,
  Fade,
  Slide,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  RocketLaunch as RocketIcon,
  School as SchoolIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const CTASection = () => {
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

  const benefits = [
    { icon: <VerifiedIcon />, text: "No credit card required" },
    { icon: <SchoolIcon />, text: "Full platform access" },
    { icon: <GroupIcon />, text: "Dedicated support" },
    { icon: <StarIcon />, text: "30-day free trial" },
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
          bottom: 0,
          background: `radial-gradient(circle at 30% 20%, ${alpha(colors.primary, 0.08)} 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, ${alpha(colors.secondary, 0.06)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Slide in={true} direction="up" timeout={500}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: { xs: 4, md: 0 },
              bgcolor: colors.white,
              border: `1px solid ${alpha(colors.primary, 0.2)}`,
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 20px 60px ${alpha(colors.primary, 0.15)}`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              },
            }}
          >
            <Grid container>
              {/* Left Content */}
              <Grid item xs={12} md={7}>
                <Box sx={{ p: { xs: 4, md: 6 } }}>
                  <Fade in={true} timeout={800}>
                    <Box>
                      <Chip
                        label="Start Your Journey"
                        icon={<RocketIcon />}
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
                          },
                        }}
                      >
                        Transform Your School
                        <Box
                          component="span"
                          sx={{
                            color: colors.primary,
                            display: "block",
                          }}
                        >
                          Today
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
                        Join thousands of educational institutions already
                        simplifying administration, improving communication,
                        and delivering better learning experiences.
                      </Typography>

                      {/* Benefits List */}
                      <Grid container spacing={2} sx={{ mb: 4 }}>
                        {benefits.map((benefit, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Fade in={true} timeout={1000 + index * 200}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    bgcolor: alpha(colors.primary, 0.1),
                                    color: colors.primary,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  {benefit.icon}
                                </Box>
                                <Typography
                                  variant="body1"
                                  color={colors.textPrimary}
                                  fontWeight={500}
                                >
                                  {benefit.text}
                                </Typography>
                              </Box>
                            </Fade>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Trust Indicators */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        {[
                          { value: "500+", label: "Schools" },
                          { value: "99%", label: "Satisfaction" },
                          { value: "24/7", label: "Support" },
                        ].map((stat, index) => (
                          <Box key={index}>
                            <Typography
                              variant="h4"
                              fontWeight={800}
                              color={colors.primary}
                            >
                              {stat.value}
                            </Typography>
                            <Typography
                              variant="caption"
                              color={colors.textSecondary}
                            >
                              {stat.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Fade>
                </Box>
              </Grid>

              {/* Right CTA Card */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    p: { xs: 4, md: 6 },
                    height: "100%",
                    bgcolor: colors.primary,
                    color: colors.white,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -100,
                      right: -100,
                      width: 300,
                      height: 300,
                      borderRadius: "50%",
                      bgcolor: alpha(colors.white, 0.1),
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -80,
                      left: -80,
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      bgcolor: alpha(colors.white, 0.05),
                    },
                  }}
                >
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Fade in={true} timeout={1200}>
                      <Stack spacing={4}>
                        {/* Header */}
                        <Box>
                          <Typography
                            variant="h3"
                            fontWeight={800}
                            sx={{ mb: 1 }}
                          >
                            Ready to Start?
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ opacity: 0.9 }}
                          >
                            Get full access to all features for 30 days.
                            No commitment required.
                          </Typography>
                        </Box>

                        {/* Features List */}
                        <Stack spacing={2}>
                          {[
                            "Full platform access",
                            "Unlimited users",
                            "Dedicated support",
                            "All features included",
                            "Export your data anytime",
                          ].map((feature, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  bgcolor: alpha(colors.white, 0.2),
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <VerifiedIcon
                                  sx={{
                                    fontSize: 14,
                                  }}
                                />
                              </Box>
                              <Typography variant="body1">
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>

                        {/* CTA Button */}
                        <Box>
                          <Button
                            component={Link}
                            to="/register"
                            variant="contained"
                            size="large"
                            fullWidth
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              py: 2,
                              borderRadius: 2,
                              bgcolor: colors.white,
                              color: colors.primary,
                              fontWeight: 700,
                              fontSize: "1rem",
                              boxShadow: `0 8px 32px ${alpha(colors.textPrimary, 0.3)}`,
                              "&:hover": {
                                bgcolor: colors.primaryLight,
                                transform: "translateY(-2px)",
                                boxShadow: `0 12px 40px ${alpha(colors.textPrimary, 0.4)}`,
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            Start Free Trial
                          </Button>

                          <Button
                            component={Link}
                            to="/login"
                            variant="text"
                            size="large"
                            fullWidth
                            sx={{
                              mt: 2,
                              py: 1.5,
                              color: colors.white,
                              fontWeight: 600,
                              "&:hover": {
                                bgcolor: alpha(colors.white, 0.1),
                              },
                            }}
                          >
                            Already have an account? Sign In
                          </Button>
                        </Box>

                        {/* Security Badge */}
                        <Box
                          sx={{
                            pt: 2,
                            borderTop: `1px solid ${alpha(colors.white, 0.2)}`,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ opacity: 0.8 }}
                          >
                            🔒 Secure • SOC 2 Compliant • GDPR Ready
                          </Typography>
                        </Box>
                      </Stack>
                    </Fade>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Slide>

        {/* Bottom Stats */}
        <Fade in={true} timeout={1500}>
          <Grid
            container
            spacing={2}
            sx={{ mt: 4, justifyContent: "center" }}
          >
            {[
              "No setup fees",
              "Cancel anytime",
              "Data ownership",
              "Free migration",
              "Training included",
            ].map((item, index) => (
              <Grid item key={index}>
                <Chip
                  label={item}
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: alpha(colors.primary, 0.2),
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default CTASection;