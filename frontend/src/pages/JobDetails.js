import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams(); // Job ID from URL
  const [job, setJob] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchJob = async () => {
    try {
      const { data } = await axiosInstance.get(`/jobs/${id}`);
      setJob(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    try {
      await axiosInstance.post(`/jobs/${id}/apply`);
      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (!job) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>{job.title}</Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={1}>
        Posted by: {job.postedBy?.name} ({job.postedBy?.email})
      </Typography>
      <Typography variant="body1" mb={2}>{job.description}</Typography>

      <Stack direction="row" spacing={1} mb={2}>
        {job.skillsRequired?.map((skill) => (
          <Chip key={skill} label={skill} color="primary" />
        ))}
      </Stack>

      <Typography variant="body2">Location: {job.location?.division}, {job.location?.city}</Typography>
      <Typography variant="body2">Job Type: {job.jobType}</Typography>
      <Typography variant="body2">Experience Required: {job.experienceRequired}</Typography>
      <Typography variant="body2">Education Required: {job.educationRequired}</Typography>

      {/* Apply button: only for non-employers */}
      {user?.role !== "employer" && (
        <Button variant="contained" color="primary" onClick={handleApply} sx={{ mt: 2 }}>
          Apply
        </Button>
      )}
    </Box>
  );
};

export default JobDetails;
