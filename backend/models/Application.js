const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: String,
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Rejected", "Accepted"],
    default: "Applied"
  },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
