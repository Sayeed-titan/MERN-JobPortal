const Job = require("../models/Job.js");
const Notification = require("../models/Notification");


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
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("applicants", "name email skills role");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createJob,
  getJobs,
  applyJob,
  getJobApplications,
  deleteJob
};
