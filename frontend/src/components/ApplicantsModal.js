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
                  <Button href={applicant.cv} target="_blank" variant="outlined" size="small" sx={{ mt: 1 }}>
                    View CV
                  </Button>
                )}
              </Paper>
            ))
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default ApplicantsModal;
