import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, Stack } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ApplicantsModal from "../components/ApplicantsModal"; // <-- import here

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);       // <-- modal state
  const [selectedJobId, setSelectedJobId] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await axiosInstance.get("/jobs/my"); 
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const viewApplicants = (jobId) => {
    setSelectedJobId(jobId);
    setModalOpen(true); // open modal
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

      {/* Applicants Modal */}
      <ApplicantsModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        jobId={selectedJobId} 
      />
    </Box>
  );
};

export default ManageJobs;
