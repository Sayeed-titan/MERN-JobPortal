const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  fieldOfStudy: String,
  resultType: { type: String, enum: ["CGPA", "GPA", "Percentage"], default: "CGPA" },
  resultAchieved: Number,
  resultTotal: Number,
  startDate: Date,
  endDate: Date,
});

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
});

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"],
    default: "Intermediate",
  },
});

const addressSchema = new mongoose.Schema({
  country: { type: String, default: "Bangladesh" },
  division: String,
  district: String,
  policeStation: String,
  postOffice: String,
  postCode: String,
  address: String // house/road/building details
});

const userSchema = new mongoose.Schema(
  {
    // Core User
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["candidate", "employer", "admin"], default: "candidate" },

    // Candidate Specific
    bio: String,
    phone: String,
    photo: String, // profile picture URL
    cv: String, // uploaded CV (PDF/doc link)
    skills: [String],
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    languages: [languageSchema],
    address: addressSchema,

    // Employer-specific
    companyName: String,
    website: String,

  },

  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
