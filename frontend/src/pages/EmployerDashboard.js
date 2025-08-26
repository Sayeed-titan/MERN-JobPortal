import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Divider
} from "@mui/material";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    skillsRequired: "",
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  // Fetch employer's jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axiosInstance.get("/jobs"); // adjust if backend has employer filter
      setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Open dialog to post new job
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Post new job
  const handleCreateJob = async () => {
    try {
      await axiosInstance.post("/jobs", {
        ...newJob,
        skillsRequired: newJob.skillsRequired.split(",").map((s) => s.trim()),
      });
      fetchJobs();
      handleClose();
      setNewJob({ title: "", description: "", company: "", location: "", salary: "", jobType: "Full-time", skillsRequired: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error creating job");
    }
  };

  // View applicants
  const handleViewApplicants = async (jobId) => {
    try {
      const { data } = await axiosInstance.get(`/jobs/${jobId}/applications`);
      setApplicants(data);
      setSelectedJob(jobId);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching applicants");
    }
  };

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Employer Dashboard</Typography>
        <Button variant="contained" onClick={handleOpen}>Post New Job</Button>
      </Stack>

      <Stack spacing={2}>
        {jobs.map((job) => (
          <Card key={job._id}>
            <CardContent>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="subtitle2">{job.company}</Typography>
              <Typography variant="body2">{job.description.substring(0, 100)}...</Typography>
              <Stack direction="row" spacing={2} mt={1}>
                <Button variant="outlined" onClick={() => handleViewApplicants(job._id)}>View Applicants</Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      {selectedJob && (
        <div>
          <Typography variant="h5">Applicants</Typography>
          <Stack spacing={1} mt={2}>
            {applicants.length === 0 ? (
              <Typography>No applicants yet</Typography>
            ) : (
              applicants.map((app) => (
                <Card key={app._id}>
                  <CardContent>
                    <Typography>Name: {app.name}</Typography>
                    <Typography>Email: {app.email}</Typography>
                    <Typography>Skills: {app.skills.join(", ")}</Typography>
                    <Typography>Role: {app.role}</Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </div>
      )}

      {/* Dialog to create job */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Post New Job</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} fullWidth />
            <TextField label="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} fullWidth multiline rows={3} />
            <TextField label="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} fullWidth />
            <TextField label="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} fullWidth />
            <TextField label="Salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} fullWidth />
            <TextField label="Job Type" value={newJob.jobType} onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })} fullWidth />
            <TextField label="Skills (comma separated)" value={newJob.skillsRequired} onChange={(e) => setNewJob({ ...newJob, skillsRequired: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateJob}>Post Job</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployerDashboard;
