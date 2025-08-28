import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
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
        const endpoint =
          user.role === "employer" ? "/jobs/my" : "/applications/my";
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

  // Delete job (employer only)
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
      {/* Profile Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {user.role === "employer" ? "Employer's Profile" : "Candidate's Profile" } 
        
      </Typography>

      {/* User Info */}
      <Card sx={{ mb: 4, p: 2 }}>
        <CardContent>
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Save
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleEditToggle}>
                Edit
              </Button>
            )}

          </Stack>
          <Typography mt={2}>Role: {user.role}</Typography>
        </CardContent>
      </Card>

      {/* Jobs Section */}
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold">
            {user.role === "employer" ? "Posted Jobs" : "Applied Jobs"}
          </Typography>

          {user.role === "employer" && (
            <Button
              variant="contained"
              onClick={() => navigate("/post-job")}
            >
              Post New Job
            </Button>
          )}
        </Stack>

        <Stack spacing={2}>
          {jobs.length === 0 ? (
            <Typography color="text.secondary">No jobs found.</Typography>
          ) : user.role === "employer" ? (
            // Employer Jobs
            jobs.map((job) => (
              <Card key={job._id}>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {job.description}
                  </Typography>
                  <Typography variant="body2">
                    Location: {job.location?.district || job.location?.country}
                  </Typography>
                  <Typography variant="body2">Salary: {job.salary}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" spacing={1}>
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
                </CardContent>
              </Card>
            ))
          ) : (
            // Candidate Applied Jobs
            jobs.map((app) => (
              <Card key={app._id}>
                <CardContent>
                  <Typography variant="h6">
                    {app.jobId?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {app.jobId?.description}
                  </Typography>
                  <Typography variant="body2">
                    Company: {app.jobId?.company}
                  </Typography>
                  <Typography variant="body2">
                    Location:{" "}
                    {app.jobId?.location?.district ||
                      app.jobId?.location?.country}
                  </Typography>
                  <Typography variant="body2">
                    Job Type: {app.jobId?.jobType}
                  </Typography>
                  <Typography variant="body2">
                    Salary: {app.jobId?.salary}
                  </Typography>
                  <Typography variant="body2">
                    Applied on:{" "}
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Status: {app.status}
                  </Typography>
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
