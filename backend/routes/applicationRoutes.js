const express = require("express");
const router = express.Router();
const { protect, isEmployer, isAdmin } = require("../middleware/authMiddleware");
const {
  applyToJob,
  getApplicationsByJob,
  getAllApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");

// Candidate applies
router.post("/", protect, applyToJob);

// Employer views applications for their job
router.get("/job/:jobId", protect, isEmployer, getApplicationsByJob);

// Admin: view all applications
router.get("/", protect, isAdmin, getAllApplications);

// Employer/Admin updates status
router.put("/:id/status", protect, isEmployer, updateApplicationStatus);

module.exports = router;
