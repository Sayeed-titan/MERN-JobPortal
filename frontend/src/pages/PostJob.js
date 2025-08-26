import React, { useState } from "react";
import { Box, TextField, Button, Typography, Stack, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobType: "",
    experienceRequired: "",
    educationRequired: "",
    skillsRequired: "",
    location: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/jobs", formData);
      alert("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        jobType: "",
        experienceRequired: "",
        educationRequired: "",
        skillsRequired: "",
        location: ""
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error posting job");
    }
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" mb={2}>Post a New Job</Typography>
      <Stack spacing={2}>
        <TextField label="Job Title" name="title" value={formData.title} onChange={handleChange} fullWidth />
        <TextField label="Job Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} fullWidth />
        <TextField label="Skills Required (comma separated)" name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} fullWidth />
        <TextField label="Experience Required" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} fullWidth />
        <TextField label="Education Required" name="educationRequired" value={formData.educationRequired} onChange={handleChange} fullWidth />
        <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth />
        <FormControl>
          <InputLabel>Job Type</InputLabel>
          <Select name="jobType" value={formData.jobType} onChange={handleChange}>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit}>Post Job</Button>
      </Stack>
    </Box>
  );
};

export default PostJob;
