const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const { protect, isEmployer, isAdmin, isCandidate } = require("../middleware/authMiddleware");
const {
  applyToJob,
  getApplicationsByJob,
  getAllApplications,
  updateApplicationStatus,
  getMyApplications
} = require("../controllers/applicationController");

// Candidate applies
router.post("/:id/apply", protect, isCandidate, applyToJob);

// Candidate views their applications
router.get("/my", protect, isCandidate, getMyApplications);

// Employer views applications for their job
router.get("/job/:jobId", protect, isEmployer, getApplicationsByJob);

// Admin: view all applications
router.get("/", protect, isAdmin, getAllApplications);

// Employer/Admin updates status
router.put("/:id/status", protect, isEmployer, updateApplicationStatus);

module.exports = router;
