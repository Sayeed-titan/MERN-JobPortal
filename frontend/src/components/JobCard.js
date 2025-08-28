import React, { useContext } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const JobCard = ({ job, onApply }) => {
  const { user } = useContext(AuthContext);

  return (
    <Card
      elevation={3}
      sx={{
        mb: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardHeader
        title={job.title}
        subheader={job.company || "Unknown Company"}
      />

      <CardContent>
        <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
          <Chip label={job.jobType} color="primary" size="small" />
          {job.location?.country && <Chip label={job.location.country} size="small" />}
          {job.location?.division && <Chip label={job.location.division} size="small" />}
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {job.description?.slice(0, 150)}...
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
          {job.skillsRequired?.map((skill, idx) => (
            <Chip key={idx} label={skill} variant="outlined" size="small" />
          ))}
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={1}>
          Experience: {job.experienceRequired || "N/A"} | Education: {job.educationRequired || "N/A"}
        </Typography>

        {user?.role === "candidate" && onApply && (
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => onApply(job._id)}
          >
            Apply
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
