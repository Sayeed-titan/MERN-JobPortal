const Job = require("../models/Job.js");
const Notification = require("../models/Notification");
const User = require("../models/User");



// Create job (Employer)
const createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user._id });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all my job posted my Employer
const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can view their posted jobs" });
    }
    const jobs = await Job.find({ postedBy: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    let { page = 1, limit = 10, skills, location, jobType, experience, education, search, sort } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(",");
      query.skillsRequired = { $all: skillsArray };
    }

    // Location filter
    if (location) query["location.division"] = location;

    // Job type filter
    if (jobType) query.jobType = jobType;

    // Experience filter
    if (experience) query.experienceRequired = { $regex: experience, $options: "i" };

    // Education filter
    if (education) query.educationRequired = { $regex: education, $options: "i" };

    // Keyword search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate("postedBy", "name email companyName")
      .sort(sort ? sort : "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      jobs
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a job (only employer who created it)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only the poster can update
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    // Destructure fields from request body
    const {
      title,
      description,
      company,
      salary,
      jobType,
      skillsRequired,
      experienceRequired,
      educationRequired,
      location
    } = req.body;

    // Update fields if provided
    job.title = title || job.title;
    job.description = description || job.description;
    job.company = company || job.company;
    job.salary = salary !== undefined ? salary : job.salary;
    job.jobType = jobType || job.jobType;
    job.skillsRequired = skillsRequired || job.skillsRequired;
    job.experienceRequired = experienceRequired || job.experienceRequired;
    job.educationRequired = educationRequired || job.educationRequired;
    job.location = location || job.location;

    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Apply to a job
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: "Already applied" });
    }

    job.applicants.push(req.user._id);
    await job.save();

    // Trigger notification for employer
    await Notification.create({
      user: job.postedBy,     // employer ID
      type: "application",
      referenceId: job._id
    });

    res.json({ message: "Applied successfully", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all applications for a job
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applicants", "name email skills cv education experience");
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Ensure only the employer who posted the job can see applicants
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(job.applicants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Employer: Delete job
// Delete a job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update applicant status (shortlist/reject)
const updateApplicantStatus = async (req, res) => {
  try {
    const { jobId, applicantId, status } = req.body; // status = "shortlisted" or "rejected"
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Save status in a new array or object inside job
    job.applicantStatus = job.applicantStatus || {};
    job.applicantStatus[applicantId] = status;

    await job.save();
    res.json({ message: `Applicant ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobs,
  applyJob,
  getJobApplicants ,
  updateApplicantStatus
};
