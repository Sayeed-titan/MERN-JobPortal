import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, MenuItem } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";


const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      await axiosInstance.post("/auth/register", { name, email, password, role });
      // Automatically login after registration
      const { data } = await axiosInstance.post("/auth/login", { email, password });
      login(data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" align="center">Register</Typography>
        {error && <Typography color="error" mt={1}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="candidate">Candidate</MenuItem>
            <MenuItem value="employer">Employer</MenuItem>
          </TextField>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
