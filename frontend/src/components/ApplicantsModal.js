import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Stack, Button, Paper } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  maxHeight: "80vh",
  overflowY: "auto"
};

const ApplicantsModal = ({ open, onClose, jobId }) => {
  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = async () => {
    try {
      const { data } = await axiosInstance.get(`/jobs/${jobId}/applicants`);
      setApplicants(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) fetchApplicants();
  }, [open]);

  // ✅ Now inside component (has access to setApplicants)
  const handleStatusChange = async (applicantId, status) => {
    try {
      // Optimistic update
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === applicantId ? { ...a, status } : a
        )
      );

      // Persist to backend
      await axiosInstance.put(`/applications/${applicantId}/status`, { status });
    } catch (error) {
      console.error("Failed to update status:", error);
      // Rollback on failure
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === applicantId ? { ...a, status: a.status || "pending" } : a
        )
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Applicants</Typography>
        <Stack spacing={2}>
          {applicants.length === 0 ? (
            <Typography>No applicants yet.</Typography>
          ) : (
            applicants.map((applicant) => (
              <Paper key={applicant._id} sx={{ p: 2 }}>
                <Typography variant="subtitle1">{applicant.name}</Typography>
                <Typography variant="body2">Email: {applicant.email}</Typography>
                <Typography variant="body2">Skills: {applicant.skills.join(", ")}</Typography>

                {applicant.cv && (
                  <Button
                    href={applicant.cv}
                    target="_blank"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    View CV
                  </Button>
                )}

                {/* ✅ Instant Status */}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    color:
                      applicant.status === "shortlisted"
                        ? "green"
                        : applicant.status === "rejected"
                        ? "red"
                        : "grey",
                  }}
                >
                  Status: {applicant.status || "pending"}
                </Typography>

                {/* ✅ Instant Buttons */}
                <Stack direction="row" spacing={1} mt={1}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={applicant.status === "shortlisted"}
                    onClick={() => handleStatusChange(applicant._id, "shortlisted")}
                  >
                    Shortlist
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={applicant.status === "rejected"}
                    onClick={() => handleStatusChange(applicant._id, "rejected")}
                  >
                    Reject
                  </Button>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default ApplicantsModal;
