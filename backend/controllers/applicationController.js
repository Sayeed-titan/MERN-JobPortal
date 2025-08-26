const Application = require("../models/Application");
const Job = require("../models/Job");

// Candidate applies to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if already applied
    const existing = await Application.findOne({ jobId, candidateId: req.user._id });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const application = new Application({
      jobId,
      candidateId: req.user._id,
      coverLetter
    });
    await application.save();

    // Add to job applicants
    await Job.findByIdAndUpdate(jobId, { $push: { applicants: req.user._id } });

    res.status(201).json({ message: "Applied successfully", application });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
