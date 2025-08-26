import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // items per page

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const { data } = await axiosInstance.get(`/jobs?search=${search}&sort=${sort}&page=${page}&limit=${limit}`);
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, sort, page]);

  const handleApply = async (jobId) => {
    try {
      await axiosInstance.post(`/jobs/${jobId}/apply`);
      alert("Applied successfully!");
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Error applying to job");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Available Jobs</Typography>

      {/* Search and Sort */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField
          label="Search Jobs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Job List */}
      <Stack spacing={2}>
        {jobs.length === 0 ? (
          <Typography>No jobs found</Typography>
        ) : (
          jobs.map((job) => (
            <Card key={job._id}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2">{job.description}</Typography>
                <Typography variant="caption">Posted by: {job.postedBy?.name}</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Button variant="contained" onClick={() => handleApply(job._id)}>Apply</Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Pagination */}
      <Stack alignItems="center" mt={3}>
        <Pagination
          count={Math.ceil(jobs.total / limit) || 1}
          page={page}
          onChange={(e, val) => setPage(val)}
        />
      </Stack>
    </Box>
  );
};

export default Jobs;
