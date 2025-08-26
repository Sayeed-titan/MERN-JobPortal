import React, { useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Notifications from "../components/Notifications";
import PostJob from "./PostJob";
import ManageJobs from "./ManageJobs";

const EmployerDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("postJob");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <List>
        <ListItem button onClick={() => setSelectedPage("postJob")}>
          <ListItemText primary="Post Job" />
        </ListItem>
        <ListItem button onClick={() => setSelectedPage("manageJobs")}>
          <ListItemText primary="Manage Jobs" />
        </ListItem>
      </List>
    </div>
  );

  const renderPage = () => {
    switch (selectedPage) {
      case "postJob":
        return <PostJob />;
      case "manageJobs":
        return <ManageJobs />;
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Employer Dashboard</Typography>
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

export default EmployerDashboard;
