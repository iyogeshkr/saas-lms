import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Login as LoginIcon,
  Close as CloseIcon,
  PersonAdd as SignUpIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "#features" },
    { label: "About", path: "#about" },
    { label: "How It Works", path: "#how-it-works" },
    { label: "Contact", path: "#contact" },
  ];

  // Dark color palette for good contrast on light backgrounds
  const colors = {
    primary: "#1a73e8", // Google Blue
    primaryDark: "#0d47a1",
    primaryLight: "#e8f0fe",
    secondary: "#34a853", // Google Green
    background: "#ffffff",
    textPrimary: "#202124", // Dark grey for good contrast
    textSecondary: "#5f6368", // Medium grey
    border: "#dadce0", // Light grey border
    white: "#ffffff",
  };

  // Mobile Drawer
  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: colors.background }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: colors.primary,
          color: colors.white,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <SchoolIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              EduSync
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              School Management
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: colors.white }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ p: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <Button
              component="a"
              href={item.path}
              fullWidth
              onClick={handleDrawerToggle}
              sx={{
                justifyContent: "flex-start",
                py: 1.5,
                px: 2,
                borderRadius: 1,
                color: colors.textPrimary,
                "&:hover": {
                  bgcolor: colors.primaryLight,
                  color: colors.primary,
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Action Buttons */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          startIcon={<LoginIcon />}
          fullWidth
          onClick={handleDrawerToggle}
          sx={{
            py: 1.5,
            mb: 2,
            borderRadius: 1,
            bgcolor: colors.primary,
            "&:hover": {
              bgcolor: colors.primaryDark,
            },
          }}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/signup"
          variant="outlined"
          startIcon={<SignUpIcon />}
          fullWidth
          onClick={handleDrawerToggle}
          sx={{
            py: 1.5,
            borderRadius: 1,
            borderColor: colors.primary,
            color: colors.primary,
            "&:hover": {
              borderColor: colors.primaryDark,
              bgcolor: colors.primaryLight,
            },
          }}
        >
          Sign Up Free
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: colors.background,
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "all 0.3s ease",
          borderBottom: scrolled
            ? `1px solid ${colors.border}`
            : "none",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexGrow: { xs: 1, md: 0 },
                textDecoration: "none",
                color: colors.textPrimary,
                mr: { md: 6 },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  bgcolor: colors.primary,
                  color: colors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 2px 8px ${alpha(colors.primary, 0.3)}`,
                }}
              >
                <SchoolIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  EduSync
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: colors.textSecondary,
                  }}
                >
                  School Management System
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ flexGrow: 1, justifyContent: "center" }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    href={item.path}
                    sx={{
                      color: colors.textPrimary,
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      position: "relative",
                      "&:hover": {
                        color: colors.primary,
                        bgcolor: colors.primaryLight,
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: "3px",
                        bgcolor: colors.primary,
                        borderRadius: "3px",
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": {
                        width: "60%",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Action Buttons - Desktop */}
            {!isMobile && (
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: colors.primary,
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 1,
                    border: `1px solid ${colors.border}`,
                    "&:hover": {
                      bgcolor: colors.primaryLight,
                      borderColor: colors.primary,
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  startIcon={<SignUpIcon />}
                  sx={{
                    px: 3,
                    borderRadius: 1,
                    bgcolor: colors.primary,
                    boxShadow: `0 2px 12px ${alpha(colors.primary, 0.4)}`,
                    "&:hover": {
                      bgcolor: colors.primaryDark,
                      boxShadow: `0 4px 16px ${alpha(colors.primary, 0.5)}`,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Sign Up Free
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  color: colors.primary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: colors.primaryLight,
                  },
                }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer */}
      <Toolbar sx={{ minHeight: { xs: "76px", md: "84px" } }} />
    </>
  );
};

export default LandingNavbar;