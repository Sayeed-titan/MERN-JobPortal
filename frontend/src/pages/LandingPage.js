import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Box textAlign="center" sx={{ py: 10 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Job Portal
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Find your dream job or the perfect candidate
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <Button variant="contained" component={Link} to="/jobs">
          Find Jobs
        </Button>
        <Button variant="outlined" component={Link} to="/post-job">
          Post a Job
        </Button>
      </Stack>
    </Box>
  );
};

export default LandingPage;
