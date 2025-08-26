import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

const JobFilter = ({ onFilter }) => {
  const [search, setSearch] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");

  const handleApplyFilter = () => {
    onFilter({ search, skills, location });
  };

  return (
    <Stack direction="row" spacing={2} mb={2}>
      <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <TextField label="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
      <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Button variant="contained" onClick={handleApplyFilter}>Filter</Button>
    </Stack>
  );
};

export default JobFilter;
