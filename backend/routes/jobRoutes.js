const express = require("express");

const {
  createJob,
  getJobs,
  applyJob,
} = require("../controllers/jobController.js");

const {getJobApplications, deleteJob} = require("../controllers/jobController.js")
const { protect, isAdmin } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Employer posts a job
router.post("/", protect, createJob);

// Candidate views all jobs
router.get("/", getJobs);

// Candidate applies to a job
router.post("/:id/apply", protect, applyJob);

//Applicant status (shortlist/reject)
router.post("/applicants/status", protect, isEmployer, updateApplicantStatus);

// Get all applicants for a job (employer only)
router.get("/:id/applicants", protect, isEmployer, getJobApplicants);

// Admin: delete a job
router.delete("/:id", protect, isAdmin, deleteJob);


module.exports = router;
