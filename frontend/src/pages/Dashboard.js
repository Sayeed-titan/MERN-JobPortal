import React, { useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Notifications from "../components/Notifications";
import CandidateProfile from "./CandidateProfile";
import Messaging from "../components/Messaging";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("profile");
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <List>
        <ListItem button onClick={() => setSelectedPage("profile")}>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button onClick={() => setSelectedPage("jobs")}>
          <ListItemText primary="Jobs" />
        </ListItem>
        <ListItem button onClick={() => setSelectedPage("messages")}>
          <ListItemText primary="Messages" />
        </ListItem>
      </List>
    </div>
  );

  const renderPage = () => {
    switch (selectedPage) {
      case "profile":
        return <CandidateProfile />;
      case "jobs":
        return <Typography variant="h5">Jobs Page (to be implemented)</Typography>;
      case "messages":
        return selectedChatUser ? <Messaging conversationWith={selectedChatUser} /> : <Typography>Select a user to chat</Typography>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Job Portal Dashboard</Typography>
          <Notifications />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderPage()}
      </Box>
    </Box>
  );
};

export default Dashboard;
