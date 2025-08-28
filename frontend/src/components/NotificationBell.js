import React, { useEffect, useState } from "react";
import { IconButton, Badge, Menu, MenuItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axiosInstance from "../api/axiosInstance"; 

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle dropdown open/close
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  // Mark one as read
  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      fetchNotifications(); // refresh
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {notifications.length === 0 && (
          <MenuItem>
            <ListItemText primary="No notifications" />
          </MenuItem>
        )}
        {notifications.map((n) => (
          <MenuItem key={n._id} onClick={() => markAsRead(n._id)}>
            <ListItemText
              primary={n.message}
              secondary={new Date(n.createdAt).toLocaleString()}
              style={{ fontWeight: n.read ? "normal" : "bold" }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;
