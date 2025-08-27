
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Jobs", path: "/jobs" },
    { title: "Post Job", path: "/post-job" },
    { title: "Profile", path: "/profile" },
    { title: "Login", path: "/login" },
    { title: "Register", path: "/register" },
  ];

  const drawer = (
    <List>
      {navLinks.map((link) => (
        <ListItem button key={link.title} component={Link} to={link.path} onClick={handleDrawerToggle}>
          <ListItemText primary={link.title} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Job Portal
          </Typography>
          {/* Desktop Menu */}
          <div className="hidden md:flex">
            {navLinks.map((link) => (
              <Button color="inherit" component={Link} to={link.path} key={link.title}>
                {link.title}
              </Button>
            ))}
          </div>
          {/* Mobile Menu */}
          <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} className="md:hidden">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
