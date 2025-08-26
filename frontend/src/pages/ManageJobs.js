import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, Stack } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const { data } = await axiosInstance.get("/jobs/my"); // your backend should filter jobs by logged-in employer
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const viewApplicants = (jobId) => {
    // redirect to job applications page or open modal
    alert(`View applicants for job: ${jobId}`);
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting job");
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Manage Posted Jobs</Typography>
      <Stack spacing={2}>
        {jobs.length === 0 ? (
          <Typography>No jobs posted yet.</Typography>
        ) : (
          jobs.map((job) => (
            <Card key={job._id}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2">{job.description}</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Button variant="outlined" onClick={() => viewApplicants(job._id)}>View Applicants</Button>
                  <Button variant="contained" color="error" onClick={() => deleteJob(job._id)}>Delete</Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default ManageJobs;
