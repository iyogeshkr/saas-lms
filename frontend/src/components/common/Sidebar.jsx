import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Subject as SubjectIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ role, drawerWidth = 260 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    admin: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
      { text: "Add Teacher", icon: <PersonAddIcon />, path: "/admin/add-teacher" },
      { text: "Add Student", icon: <PersonAddIcon />, path: "/admin/add-student" },
      { text: "Manage Classes", icon: <ClassIcon />, path: "/admin/manage-classes" },
      { text: "Manage Subjects", icon: <SubjectIcon />, path: "/admin/manage-subjects" },
      { text: "Teachers", icon: <PeopleIcon />, path: "/admin/teachers" },
      { text: "Students", icon: <PeopleIcon />, path: "/admin/students" },
      { text: "My Profile", icon: <PersonIcon />, path: "/admin/profile" },
    ],
    teacher: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/teacher/dashboard" },
      { text: "Attendance", icon: <AssignmentIcon />, path: "/teacher/attendance" },
      { text: "Add Marks", icon: <AssessmentIcon />, path: "/teacher/add-marks" },
      { text: "Students", icon: <PeopleIcon />, path: "/teacher/students" },
      { text: "Messages", icon: <MessageIcon />, path: "/teacher/messages" },
      { text: "My Profile", icon: <PersonIcon />, path: "/teacher/profile" },
    ],
    student: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/student/dashboard" },
      { text: "Attendance", icon: <AssignmentIcon />, path: "/student/attendance" },
      { text: "Marks & Performance", icon: <AssessmentIcon />, path: "/student/marks" },
      { text: "Messages", icon: <MessageIcon />, path: "/student/messages" },
      { text: "Fee Status", icon: <PaymentIcon />, path: "/student/fees" },
      { text: "My Profile", icon: <PersonIcon />, path: "/student/profile" },
    ],
  };

  const items = menuItems[role] || [];

  const handleToggle = () => {
    isMobile ? setMobileOpen(!mobileOpen) : setDesktopOpen(!desktopOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box height="100%">
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <SchoolIcon />
          <Typography fontWeight="bold">
            {role.toUpperCase()}
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton size="small" onClick={() => setDesktopOpen(false)} sx={{ color: "#fff" }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />


      <List sx={{ p: 1 }}>
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                backgroundColor: active ? "primary.light" : "transparent",
                color: active ? "primary.main" : "text.primary",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: active ? "primary.main" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton color="inherit" edge="start" onClick={handleToggle}>
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="persistent"
      open={desktopOpen}
      sx={{
        width: desktopOpen ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: desktopOpen ? drawerWidth : 0,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
