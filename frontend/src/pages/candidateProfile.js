import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Chip
} from "@mui/material";

const CandidateProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "",
    cv: "",
    skills: [],
    education: [],
    experience: [],
    languages: []
  });

  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState({ name: "", proficiency: "" });
  const [newEducation, setNewEducation] = useState({ institute: "", degree: "", resultType: "", totalMarks: "", achievedMarks: "", year: "" });
  const [newExperience, setNewExperience] = useState({ company: "", position: "", startDate: "", endDate: "", description: "" });

  // Fetch candidate profile
  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get("/users/me");
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Add skill
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  // Add language
  const handleAddLanguage = () => {
    if (newLanguage.name && newLanguage.proficiency) {
      setProfile({ ...profile, languages: [...profile.languages, newLanguage] });
      setNewLanguage({ name: "", proficiency: "" });
    }
  };

  // Add education
  const handleAddEducation = () => {
    if (newEducation.institute && newEducation.degree) {
      setProfile({ ...profile, education: [...profile.education, newEducation] });
      setNewEducation({ institute: "", degree: "", resultType: "", totalMarks: "", achievedMarks: "", year: "" });
    }
  };

  // Add experience
  const handleAddExperience = () => {
    if (newExperience.company && newExperience.position) {
      setProfile({ ...profile, experience: [...profile.experience, newExperience] });
      setNewExperience({ company: "", position: "", startDate: "", endDate: "", description: "" });
    }
  };

  // Save profile
  const handleSave = async () => {
    try {
      await axiosInstance.put("/users/me", profile);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div>
      <Typography variant="h4" mb={2}>Candidate Profile</Typography>
      <Stack spacing={3}>

        {/* Basic info */}
        <TextField label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />
        <TextField label="Email" value={profile.email} disabled fullWidth />
        <TextField label="Photo URL" value={profile.photo} onChange={(e) => setProfile({ ...profile, photo: e.target.value })} fullWidth />
        <TextField label="CV URL" value={profile.cv} onChange={(e) => setProfile({ ...profile, cv: e.target.value })} fullWidth />

        {/* Skills */}
        <Typography variant="h6">Skills</Typography>
        <Stack direction="row" spacing={1} mb={1}>
          {profile.skills.map((skill, idx) => (<Chip key={idx} label={skill} />))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField label="New Skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
          <Button variant="contained" onClick={handleAddSkill}>Add Skill</Button>
        </Stack>

        <Divider />

        {/* Languages */}
        <Typography variant="h6">Languages</Typography>
        <Stack spacing={1}>
          {profile.languages.map((lang, idx) => (<Chip key={idx} label={`${lang.name} (${lang.proficiency})`} />))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField label="Language" value={newLanguage.name} onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })} />
          <TextField label="Proficiency" value={newLanguage.proficiency} onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value })} />
          <Button variant="contained" onClick={handleAddLanguage}>Add Language</Button>
        </Stack>

        <Divider />

        {/* Education */}
        <Typography variant="h6">Education</Typography>
        {profile.education.map((edu, idx) => (
          <Card key={idx} sx={{ mb: 1 }}>
            <CardContent>
              <Typography>{edu.degree} at {edu.institute} ({edu.year})</Typography>
              <Typography>Result: {edu.resultType} - {edu.achievedMarks}/{edu.totalMarks}</Typography>
            </CardContent>
          </Card>
        ))}
        <Stack spacing={1}>
          <TextField label="Institute" value={newEducation.institute} onChange={(e) => setNewEducation({ ...newEducation, institute: e.target.value })} />
          <TextField label="Degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
          <TextField label="Result Type (GPA/CGPA)" value={newEducation.resultType} onChange={(e) => setNewEducation({ ...newEducation, resultType: e.target.value })} />
          <TextField label="Total Marks" value={newEducation.totalMarks} onChange={(e) => setNewEducation({ ...newEducation, totalMarks: e.target.value })} />
          <TextField label="Achieved Marks" value={newEducation.achievedMarks} onChange={(e) => setNewEducation({ ...newEducation, achievedMarks: e.target.value })} />
          <TextField label="Year" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} />
          <Button variant="contained" onClick={handleAddEducation}>Add Education</Button>
        </Stack>

        <Divider />

        {/* Experience */}
        <Typography variant="h6">Experience</Typography>
        {profile.experience.map((exp, idx) => (
          <Card key={idx} sx={{ mb: 1 }}>
            <CardContent>
              <Typography>{exp.position} at {exp.company}</Typography>
              <Typography>{exp.startDate} - {exp.endDate}</Typography>
              <Typography>{exp.description}</Typography>
            </CardContent>
          </Card>
        ))}
        <Stack spacing={1}>
          <TextField label="Company" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} />
          <TextField label="Position" value={newExperience.position} onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })} />
          <TextField label="Start Date" value={newExperience.startDate} onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })} />
          <TextField label="End Date" value={newExperience.endDate} onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })} />
          <TextField label="Description" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} multiline rows={2} />
          <Button variant="contained" onClick={handleAddExperience}>Add Experience</Button>
        </Stack>

        <Divider />

        <Button variant="contained" color="primary" onClick={handleSave}>Save Profile</Button>

      </Stack>
    </div>
  );
};

export default CandidateProfile;
