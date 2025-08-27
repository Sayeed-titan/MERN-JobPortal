import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, Stack, TextField, Card, CardContent } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [jobs, setJobs] = useState([]);

  // Load user jobs (applied or posted)
  const fetchJobs = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === "employer" ? "/jobs/my" : "/applications/my";
      const { data } = await axiosInstance.get(endpoint);
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
      fetchJobs();
    }
  }, [user]);

  const handleEditToggle = () => setEditing(!editing);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const { data } = await axiosInstance.put("/auth/profile", formData);
      setFormData({ name: data.name, email: data.email });
      setEditing(false);
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!user) return <Typography>Please login to view profile.</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Profile</Typography>

      {/* User Info */}
      <Box mb={4}>
        <Stack spacing={2} direction="row" alignItems="center">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!editing}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editing}
          />
          {editing ? (
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
          ) : (
            <Button variant="outlined" onClick={handleEditToggle}>Edit</Button>
          )}
          <Button variant="outlined" color="error" onClick={logout}>Logout</Button>
        </Stack>
        <Typography mt={1}>Role: {user.role}</Typography>
      </Box>

      {/* User Jobs */}
      <Box>
        <Typography variant="h5" mb={2}>
          {user.role === "employer" ? "Posted Jobs" : "Applied Jobs"}
        </Typography>
        <Stack spacing={2}>
          {jobs.length === 0 ? (
            <Typography>No jobs found.</Typography>
          ) : (
            jobs.map((job) => (
              <Card key={job._id}>
                <CardContent>
                  <Typography variant="h6">{job.title || job.job?.title}</Typography>
                  <Typography variant="body2">
                    {job.description || job.job?.description}
                  </Typography>
                  {user.role === "candidate" && job.status && (
                    <Typography>Status: {job.status}</Typography>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
