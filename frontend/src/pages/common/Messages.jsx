import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Typography,
  Paper,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";

const Messages = ({ role, userName }) => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  // Conversations list
  const conversations = [
    {
      id: 1,
      name: "John Doe (Teacher)",
      lastMessage: "Submit assignment by Friday",
      time: "10:30 AM",
      unread: 2,
      role: "teacher",
    },
    {
      id: 2,
      name: "Admin Office",
      lastMessage: "Fee payment reminder",
      time: "Yesterday",
      unread: 0,
      role: "admin",
    },
    {
      id: 3,
      name: "Alice Johnson",
      lastMessage: "Can you share notes?",
      time: "2 days ago",
      unread: 1,
      role: "student",
    },
  ];

  // Chat messages
  const chatMessages = [
    { id: 1, sender: "teacher", text: "Hello, how can I help you?", time: "10:00 AM" },
    { id: 2, sender: "me", text: "I need help with math assignment.", time: "10:05 AM" },
    { id: 3, sender: "teacher", text: "Which problem?", time: "10:10 AM" },
    { id: 4, sender: "me", text: "Problem 3, chapter 5.", time: "10:15 AM" },
  ];

  const getRoleIcon = (role) =>
    role === "teacher" ? <SchoolIcon /> : <PersonIcon />;

  const getRoleColor = (role) => {
    switch (role) {
      case "teacher":
        return "primary.main";
      case "admin":
        return "error.main";
      case "student":
        return "success.main";
      default:
        return "grey.500";
    }
  };

  return (
    <DashboardLayout role={role} userName={userName}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        💬 Messages
      </Typography>

      <Paper
        sx={{
          height: "75vh",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Grid
          container
          sx={{
            height: "100%",
            flexWrap: "nowrap",
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              flexShrink: 0,
              borderRight: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <Box p={2} height="100%">
              <Typography variant="h6" mb={2}>
                Conversations
              </Typography>

              <List sx={{ overflowY: "auto", maxHeight: "calc(75vh - 80px)" }}>
                {conversations.map((c) => (
                  <ListItem
                    key={c.id}
                    onClick={() => setSelectedChat(c.id)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      backgroundColor:
                        selectedChat === c.id ? "#e8edff" : "transparent",
                      "&:hover": {
                        backgroundColor: "#f1f3ff",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getRoleColor(c.role) }}>
                        {getRoleIcon(c.role)}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography fontWeight={600}>
                            {c.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.time}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {c.lastMessage}
                          </Typography>
                          {c.unread > 0 && (
                            <Chip
                              label={c.unread}
                              color="error"
                              size="small"
                              sx={{ height: 18 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1, 
              width: "100%",
            }}
          >
            <Box
              px={3}
              py={2}
              borderBottom="1px solid #eee"
              bgcolor="#fff"
            >
              <Typography variant="h6">
                {conversations.find((c) => c.id === selectedChat)?.name ||
                  "Select a conversation"}
              </Typography>
            </Box>

            <Box
              flexGrow={1}
              p={3}
              sx={{
                overflowY: "auto",
                background: "linear-gradient(#f7f9ff, #eef1ff)",
              }}
            >
              {chatMessages.map((msg) => (
                <Box
                  key={msg.id}
                  display="flex"
                  justifyContent={
                    msg.sender === "me" ? "flex-end" : "flex-start"
                  }
                  mb={2}
                >
                  <Box
                    sx={{
                      maxWidth: "65%",
                      p: 2,
                      borderRadius: 3,
                      backgroundColor:
                        msg.sender === "me" ? "#667eea" : "#fff",
                      color: msg.sender === "me" ? "#fff" : "#000",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography>{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      align="right"
                      sx={{ opacity: 0.7, mt: 0.5 }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box
              p={2}
              borderTop="1px solid #eee"
              bgcolor="#fff"
              sx={{ display: "flex", gap: 1 }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ flexGrow: 1 }}   
              />

              <Button
                variant="contained"
                endIcon={<SendIcon />}
                disabled={!message.trim()}
                sx={{
                  px: 3,
                  whiteSpace: "nowrap",
                }}
              >
                Send
              </Button>
            </Box>

          </Grid>
        </Grid>
      </Paper>
    </DashboardLayout>
  );
};

export default Messages;
