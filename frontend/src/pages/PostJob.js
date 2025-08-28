import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Stack, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const PostJob = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if job is passed in state (edit mode)
  const editingJob = location.state?.job;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobType: "Full-time",
    experienceRequired: "",
    educationRequired: "",
    skillsRequired: "",
    location: "",
    company: "",
    salary: "",
  });

  useEffect(() => {
    if (editingJob) {
      // Pre-fill form with job data
      setFormData({
        title: editingJob.title || "",
        description: editingJob.description || "",
        jobType: editingJob.jobType || "Full-time",
        experienceRequired: editingJob.experienceRequired || "",
        educationRequired: editingJob.educationRequired || "",
        skillsRequired: (editingJob.skillsRequired || []).join(", "),
        location: editingJob.location?.address || "",
        company: editingJob.company || "",
        salary: editingJob.salary || "",
      });
    }
  }, [editingJob]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      description,
      jobType,
      experienceRequired,
      educationRequired,
      skillsRequired,
      location,
      company,
      salary,
    } = formData;

    if (!title) {
      alert("Title is required");
      return;
    }

    const jobData = {
      title,
      description,
      jobType,
      experienceRequired,
      educationRequired,
      skillsRequired: skillsRequired.split(",").map((s) => s.trim()),
      location: { address: location, country: "Bangladesh" }, // optional
      company,
      salary: Number(salary),
    };

    try {
      if (editingJob) {
        // Update job
        await axiosInstance.put(`/jobs/${editingJob._id}`, jobData);
        alert("Job updated successfully!");
      } else {
        // Create new job
        await axiosInstance.post("/jobs", jobData);
        alert("Job posted successfully!");
      }

      navigate("/profile"); // Go back to profile after posting/updating
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Failed to submit job");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" mb={2}>
        {editingJob ? "Edit Job" : "Post a New Job"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Job Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Job Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
        />
        <TextField
          label="Skills Required (comma separated)"
          name="skillsRequired"
          value={formData.skillsRequired}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Experience Required"
          name="experienceRequired"
          value={formData.experienceRequired}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Education Required"
          name="educationRequired"
          value={formData.educationRequired}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Salary"
          name="salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Job Type</InputLabel>
          <Select name="jobType" value={formData.jobType} onChange={handleChange}>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Freelance">Freelance</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {editingJob ? "Update Job" : "Post Job"}
        </Button>
      </Stack>
    </Box>
  );
};

export default PostJob;
