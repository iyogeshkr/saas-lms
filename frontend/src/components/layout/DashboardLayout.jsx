import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";

const DashboardLayout = ({ children, role, userName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const drawerWidth = 240;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      <Navbar role={role} userName={userName} />

      <Sidebar role={role} drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8, 
          p: isMobile ? 2 : 3,
          ml: isMobile ? 0 : "auto",
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Box
          sx={{
            maxWidth: "100%",
            backgroundColor: "#fff",
            borderRadius: 3,
            p: isMobile ? 2 : 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            overflowX: "auto",
            "& > *": {
              minWidth: isMobile ? "100%" : "auto",
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
