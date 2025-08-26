// frontend/src/pages/CandidateApplications.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import axios from "axios";

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token"); // auth token
        const res = await axios.get("/api/applications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        My Applications
      </Typography>
      {applications.length === 0 ? (
        <Typography>You haven’t applied to any jobs yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {applications.map((app) => (
            <Card key={app._id}>
              <CardContent>
                <Typography variant="h6">{app.job?.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.job?.companyName} – {app.job?.location?.division}
                </Typography>

                <Stack direction="row" spacing={1} mt={1}>
                  <Chip
                    label={app.status || "Pending"}
                    color={
                      app.status === "accepted"
                        ? "success"
                        : app.status === "rejected"
                        ? "error"
                        : "warning"
                    }
                  />
                </Stack>

                {app.job?.description && (
                  <Typography variant="body2" mt={1}>
                    {app.job.description.slice(0, 100)}...
                  </Typography>
                )}

                <Button
                  href={`/jobs/${app.job?._id}`}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  View Job
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CandidateApplications;
