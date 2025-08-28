const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");


// Candidate applies to a job
exports.applyToJob = async (req, res) => {
  try {
    // Only candidates can apply
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply for jobs" });
    }

    // Find the job by ID
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if candidate has already applied
    const existingApp = await Application.findOne({
      jobId: job._id,
      candidateId: req.user._id,
    });
    if (existingApp)
      return res.status(400).json({ message: "You have already applied for this job" });

    // Create new application
    const application = await Application.create({
      jobId: job._id,
      candidateId: req.user._id,
    });

    // Create notification for employer (postedBy)
    if (job.postedBy) {
      await Notification.create({
        userId: job.postedBy, // this now matches your Job schema
        type: "APPLICATION_RECEIVED",
        message: `${req.user.name} has applied for your job: ${job.title}`,
        jobId: job._id,
        referenceId: application._id,
        isRead: false,
      });
    } else {
      console.warn("Job has no postedBy user. Skipping notification.");
    }

    res.status(201).json({ message: "Applied successfully", application });
  } catch (err) {
    console.error("Error in applyToJob:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Employer or Admin: get applications for a job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("candidateId", "name email skills experience education");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("candidateId", "name email skills")
      .populate("jobId", "title company");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update application status (Shortlist/Reject/Accept)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Applied", "Shortlisted", "Rejected", "Accepted"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate({
        path: "jobId",
        select: "title description company location jobType skillsRequired salary"
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};