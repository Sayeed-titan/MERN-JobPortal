import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, Stack } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ApplicantsModal from "../components/ApplicantsModal"; 
import { useSocket } from "../realtime/SocketProvider";

const ManageJobs = () => {
  const { socket } = useSocket();   // ✅ moved inside component
  const [jobs, setJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await axiosInstance.get("/jobs/my");
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();   // ✅ fetch once on mount
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onNewApp = ({ jobId, applicantId }) => {
      setJobs((prev) =>
        prev.map((j) =>
          j._id === jobId
            ? { ...j, newApplicants: (j.newApplicants || 0) + 1 }
            : j
        )
      );
    };

    socket.on("application:new", onNewApp);
    return () => socket.off("application:new", onNewApp);
  }, [socket]);

  const viewApplicants = (jobId) => {
    setSelectedJobId(jobId);
    setModalOpen(true);
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

                {/* 🔔 Show badge if new applicants came in */}
                {job.newApplicants > 0 && (
                  <Typography color="primary" variant="body2">
                    {job.newApplicants} new applicant(s)
                  </Typography>
                )}

                <Stack direction="row" spacing={1} mt={1}>
                  <Button variant="outlined" onClick={() => viewApplicants(job._id)}>
                    View Applicants
                  </Button>
                  <Button variant="contained" color="error" onClick={() => deleteJob(job._id)}>
                    Delete
                  </Button>
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
