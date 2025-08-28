const express = require("express");

const {
  createJob,
  getMyJobs,
  getJobs,
  applyJob,

} = require("../controllers/jobController.js");

const {getJobApplicants, updateApplicantStatus, deleteJob, updateJob} = require("../controllers/jobController.js")
const { protect, isAdmin, isEmployer, isCandidate } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Employer posts a job
router.post("/", protect, isEmployer, createJob);

// Employer updates a job
router.put("/:id", protect, isEmployer, updateJob);

// Employer deletes a job
router.delete("/:id", protect, isEmployer,  deleteJob);

// Employer's posted jobs
router.get("/my", protect, isEmployer,  getMyJobs);

// Candidate views all jobs
router.get("/", getJobs);

// Candidate applies to a job
router.post("/:id/apply", protect, isCandidate, applyJob);

//Applicant status (shortlist/reject)
router.post("/applicants/status", protect, isEmployer, updateApplicantStatus);

// Get all applicants for a job (employer only)
router.get("/:id/applicants", protect, isEmployer, getJobApplicants);

// Admin: delete a job
router.delete("/:id", protect, isEmployer, deleteJob);


module.exports = router;
