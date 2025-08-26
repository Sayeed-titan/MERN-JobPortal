import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import JobCard from "../components/JobCard";
import JobFilter from "../components/JobFilter";
import { Pagination, Stack } from "@mui/material";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const fetchJobs = async () => {
    try {
      const params = { page, limit: 5, ...filters };
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
      await axiosInstance.post(`/jobs/${jobId}/apply`);
      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <div>
      <JobFilter onFilter={setFilters} />
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onApply={handleApply} />
      ))}
      <Stack mt={2} alignItems="center">
        <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} />
      </Stack>
    </div>
  );
};

export default JobList;
