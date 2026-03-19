import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stack,
  Divider,
  Button,
  Chip,
  alpha,
  Fade,
} from "@mui/material";
import {
  School as SchoolIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  PrivacyTip as PrivacyIcon,
  SupportAgent as SupportIcon,
  Copyright as CopyrightIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Footer = () => {
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

  const footerBg = "#111827"; // Dark blue-gray background
  const footerText = "#d1d5db"; // Light gray text

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Features", to: "#features" },
    { label: "About", to: "#about" },
    { label: "How It Works", to: "#how-it-works" },
    { label: "Pricing", to: "#pricing" },
    { label: "Contact", to: "#contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
    { label: "GDPR Compliance", to: "/gdpr" },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, label: "Facebook", color: "#1877F2" },
    { icon: <TwitterIcon />, label: "Twitter", color: "#1DA1F2" },
    { icon: <LinkedInIcon />, label: "LinkedIn", color: "#0A66C2" },
    { icon: <InstagramIcon />, label: "Instagram", color: "#E4405F" },
  ];

  const contactInfo = [
    { icon: <EmailIcon />, text: "support@edusync.com", type: "email" },
    { icon: <PhoneIcon />, text: "+91 98352 12815", type: "phone" },
    { icon: <LocationIcon />, text: "GEC Jamui, Bihar, India", type: "location" },
    { icon: <SupportIcon />, text: "24/7 Support Available", type: "support" },
  ];

  const securityBadges = [
    { icon: <SecurityIcon />, label: "SSL Secured" },
    { icon: <VerifiedIcon />, label: "GDPR Compliant" },
    { icon: <PrivacyIcon />, label: "Privacy First" },
  ];

  return (
    <Box
      sx={{
        bgcolor: footerBg,
        color: footerText,
        pt: { xs: 8, md: 10 },
        pb: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${alpha(colors.primary, 0.05)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha(colors.secondary, 0.03)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={5}>
            <Fade in={true} timeout={500}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      bgcolor: colors.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      boxShadow: `0 8px 24px ${alpha(colors.primary, 0.3)}`,
                    }}
                  >
                    <SchoolIcon sx={{ color: colors.white, fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color={colors.white}
                      sx={{ mb: 0.5 }}
                    >
                      EduSync
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: alpha(colors.white, 0.7) }}
                    >
                      School Management System
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    color: alpha(colors.white, 0.8),
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                  }}
                >
                  Empowering educational institutions with modern technology.
                  We help schools simplify administration and enhance learning
                  experiences for everyone involved.
                </Typography>

                {/* Social Links */}
                <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      aria-label={social.label}
                      sx={{
                        color: alpha(colors.white, 0.7),
                        bgcolor: alpha(colors.white, 0.05),
                        border: `1px solid ${alpha(colors.white, 0.1)}`,
                        "&:hover": {
                          color: colors.white,
                          bgcolor: social.color,
                          borderColor: social.color,
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>

                {/* Newsletter Subscription */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(colors.primary, 0.1),
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color={colors.white}
                    sx={{ mb: 1 }}
                  >
                    Subscribe to Newsletter
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha(colors.white, 0.7), mb: 2, display: "block" }}
                  >
                    Get updates on new features and tips.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowIcon />}
                      sx={{
                        flex: 1,
                        bgcolor: colors.primary,
                        "&:hover": {
                          bgcolor: colors.primaryDark,
                        },
                      }}
                    >
                      Subscribe
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Quick Links & Contact */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={{ xs: 4, md: 6 }}>
              {/* Quick Links */}
              <Grid item xs={12} sm={6}>
                <Fade in={true} timeout={800}>
                  <Box>
                    <Typography
                      variant="h6"
                      color={colors.white}
                      fontWeight={700}
                      sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                    >
                      Quick Links
                      <ArrowIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                    </Typography>

                    <List dense sx={{ mt: 2 }}>
                      {quickLinks.map((link, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            px: 0,
                            py: 0.5,
                            "&:hover": {
                              "& .link-text": {
                                color: colors.primary,
                                transform: "translateX(4px)",
                              },
                              "& .link-arrow": {
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: colors.primary,
                                opacity: 0.5,
                              }}
                            />
                          </ListItemIcon>
                          <Button
                            component={Link}
                            to={link.to}
                            sx={{
                              color: alpha(colors.white, 0.8),
                              px: 0,
                              textTransform: "none",
                              justifyContent: "flex-start",
                              flex: 1,
                              "&:hover": {
                                bgcolor: "transparent",
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    className="link-text"
                                    sx={{
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    {link.label}
                                  </Typography>
                                  <ArrowIcon
                                    className="link-arrow"
                                    sx={{
                                      fontSize: 14,
                                      opacity: 0,
                                      transition: "opacity 0.2s ease",
                                    }}
                                  />
                                </Box>
                              }
                            />
                          </Button>
                        </ListItem>
                      ))}
                    </List>

                    {/* Login CTA */}
                    <Button
                      component={Link}
                      to="/login"
                      variant="outlined"
                      fullWidth
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderColor: alpha(colors.white, 0.2),
                        color: colors.white,
                        "&:hover": {
                          borderColor: colors.primary,
                          bgcolor: alpha(colors.primary, 0.1),
                        },
                      }}
                    >
                      Admin Login
                    </Button>
                  </Box>
                </Fade>
              </Grid>

              {/* Contact Info */}
              <Grid item xs={12} sm={6}>
                <Fade in={true} timeout={1000}>
                  <Box>
                    <Typography
                      variant="h6"
                      color={colors.white}
                      fontWeight={700}
                      sx={{ mb: 3 }}
                    >
                      Contact Information
                    </Typography>

                    <List dense>
                      {contactInfo.map((contact, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            px: 0,
                            py: 1.5,
                            alignItems: "flex-start",
                            "&:hover": {
                              "& .contact-icon": {
                                bgcolor: colors.primary,
                                transform: "scale(1.1)",
                              },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 44 }}>
                            <Box
                              className="contact-icon"
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                bgcolor: alpha(colors.white, 0.05),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: colors.primary,
                                transition: "all 0.2s ease",
                              }}
                            >
                              {contact.icon}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                color={colors.white}
                                fontWeight={500}
                              >
                                {contact.text}
                              </Typography>
                            }
                            secondary={
                              contact.type === "support" ? (
                                <Chip
                                  label="Available"
                                  size="small"
                                  sx={{
                                    mt: 0.5,
                                    height: 20,
                                    fontSize: "0.7rem",
                                    bgcolor: alpha(colors.secondary, 0.2),
                                    color: colors.secondary,
                                  }}
                                />
                              ) : null
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* Security Badges */}
                    <Box sx={{ mt: 4 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: alpha(colors.white, 0.6), mb: 2, display: "block" }}
                      >
                        Security & Compliance
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {securityBadges.map((badge, index) => (
                          <Chip
                            key={index}
                            icon={badge.icon}
                            label={badge.label}
                            size="small"
                            sx={{
                              mb: 1,
                              bgcolor: alpha(colors.white, 0.05),
                              color: alpha(colors.white, 0.8),
                              border: `1px solid ${alpha(colors.white, 0.1)}`,
                              "& .MuiChip-icon": {
                                color: colors.primary,
                                fontSize: 14,
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            my: { xs: 4, md: 6 },
            borderColor: alpha(colors.white, 0.08),
          }}
        />

        {/* Bottom Bar */}
        <Fade in={true} timeout={1200}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
            }}
          >
            {/* Copyright */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CopyrightIcon sx={{ fontSize: 16, opacity: 0.6 }} />
              <Typography
                variant="caption"
                sx={{ color: alpha(colors.white, 0.6) }}
              >
                {new Date().getFullYear()} EduSync School Management System.
                All rights reserved.
              </Typography>
            </Box>

            {/* Legal Links */}
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {legalLinks.map((link, index) => (
                <Button
                  key={index}
                  component={Link}
                  to={link.to}
                  size="small"
                  sx={{
                    color: alpha(colors.white, 0.6),
                    textTransform: "none",
                    fontSize: "0.75rem",
                    "&:hover": {
                      color: colors.primary,
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Footer;