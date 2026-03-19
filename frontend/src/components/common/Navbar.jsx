import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Navbar = ({ role, userName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate(`/${role}/profile`);
    handleMenuClose();
  };

  const getDashboardPath = () => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "student":
        return "/student/dashboard";
      default:
        return "/";
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(getDashboardPath())}
        >
          <SchoolIcon />
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            School Management
          </Typography>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            SMS
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={{ opacity: 0.9, mr: 1 }}>
              Hi, {userName}
            </Typography>

            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate(getDashboardPath())}
            >
              Dashboard
            </Button>

            <Button
              color="inherit"
              startIcon={<AccountCircleIcon />}
              onClick={handleProfile}
            >
              Profile
            </Button>

            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {isMobile && (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)" }}>
                {userName?.charAt(0) || "U"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <MenuItem onClick={() => navigate(getDashboardPath())}>
                <DashboardIcon sx={{ mr: 1 }} /> Dashboard
              </MenuItem>
              <MenuItem onClick={handleProfile}>
                <AccountCircleIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <SettingsIcon sx={{ mr: 1 }} /> Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
