const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  company: String,
  location: {
    country: { type: String, default: "Bangladesh" },
    division: String,
    district: String,
    address: String
  },
  salary: Number,
  jobType: { type: String, enum: ["Full-time", "Part-time", "Freelance"], default: "Full-time" },
  skillsRequired: [String],
  experienceRequired: String, // e.g., "2-5 years"
  educationRequired: String,  // e.g., "Bachelor's in CS"
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
