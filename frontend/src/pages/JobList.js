import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import JobCard from "../components/JobCard";
import JobFilter from "../components/JobFilter";
import { Pagination, Stack, Grid, Box, Typography } from "@mui/material";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const fetchJobs = async () => {
    try {
      const params = { page, limit: 6, ...filters }; // show 6 jobs per page
      const { data } = await axiosInstance.get("/jobs", { params });
      setJobs(data.jobs);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  const handleApply = async (jobId) => {
    try {
      await axiosInstance.post(`/applications/${jobId}/apply`);
      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Job Listings
      </Typography>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: "sticky", top: 16 }}>
            <JobFilter onFilter={setFilters} />
          </Box>
        </Grid>

        {/* Job Cards */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {jobs.length === 0 ? (
              <Typography>No jobs found.</Typography>
            ) : (
              jobs.map((job) => (
                <Grid item xs={12} sm={6} key={job._id}>
                  <JobCard job={job} onApply={handleApply} />
                </Grid>
              ))
            )}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack mt={3} alignItems="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobList;
