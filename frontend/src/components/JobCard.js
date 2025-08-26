import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const JobCard = ({ job, onApply }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{job.title}</Typography>
        <Typography variant="subtitle2">{job.company}</Typography>
        <Typography variant="body2">{job.description.substring(0, 100)}...</Typography>
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" color="primary" onClick={() => onApply(job._id)}>
            Apply
          </Button>
          <Typography variant="body2">
            {job.jobType} | {job.location?.division || "Unknown"} | Skills: {job.skillsRequired?.join(", ")}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default JobCard;
