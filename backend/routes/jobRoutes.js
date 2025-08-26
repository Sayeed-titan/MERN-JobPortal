const express = require("express");

const {
  createJob,
  getJobs,
  applyJob,
} = require("../controllers/jobController.js");

const {getJobApplications, deleteJob} = require("../controllers/jobController.js")
const { protect, adminOnly } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Employer posts a job
router.post("/", protect, createJob);

// Candidate views all jobs
router.get("/", getJobs);

// Candidate applies to a job
router.post("/:id/apply", protect, applyJob);

// Admin: see all applicants for a job
router.get("/:id/applications", protect, adminOnly, getJobApplications);

// Admin: delete a job
router.delete("/:id", protect, adminOnly, deleteJob);

module.exports = router;
