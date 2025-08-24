import express from "express";
import { createJob, getJobs, applyJob } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employer posts a job
router.post("/", protect, createJob);

// Candidate views all jobs
router.get("/", getJobs);

// Candidate applies to a job
router.post("/:id/apply", protect, applyJob);

export default router;
