import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button, Stack, TextField, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserJobs = async () => {
      if (!user) return;
      try {
        const endpoint = user.role === "employer" ? "/jobs/my" : "/applications/my";
        const { data } = await axiosInstance.get(endpoint);
        setJobs(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      setFormData({ name: user.name, email: user.email });
      fetchUserJobs();
    }
  }, [user]);

  const handleEditToggle = () => setEditing(!editing);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

  // Delete job
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
      alert("Job deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  // Navigate to PostJob page for editing
  const handleEditJob = (job) => {
    navigate("/post-job", { state: { job } });
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" mb={2}>
            {user.role === "employer" ? "Posted Jobs" : "Applied Jobs"}
          </Typography>
          {user.role === "employer" && (
            <Button variant="contained" onClick={() => navigate("/post-job")}>
              Post New Job
            </Button>
          )}
        </Stack>

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

                  {/* Employer buttons */}
                  {user.role === "employer" && (
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditJob(job)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
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
