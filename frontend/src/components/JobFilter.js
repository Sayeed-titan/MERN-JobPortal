import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

const JobFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = { jobType: "", location: "", skills: "" };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filter Jobs
        </Typography>

        <Stack spacing={2}>
          <TextField
            select
            label="Job Type"
            name="jobType"
            value={filters.jobType}
            onChange={handleChange}
            fullWidth
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
            <MenuItem value="Freelance">Freelance</MenuItem>
          </TextField>

          <TextField
            label="Location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="City, Division, Country"
            fullWidth
            size="small"
          />

          <TextField
            label="Skills"
            name="skills"
            value={filters.skills}
            onChange={handleChange}
            placeholder="Comma separated skills"
            fullWidth
            size="small"
          />

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              fullWidth
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              fullWidth
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default JobFilter;
