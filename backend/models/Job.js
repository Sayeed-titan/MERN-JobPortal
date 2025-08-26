const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Freelance"],
      default: "Full-time",
    },
    skillsRequired: [{ type: String }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
