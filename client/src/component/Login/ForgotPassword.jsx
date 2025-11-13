import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email, 2: OTP + Password
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("http://3.106.220.39:8080/api/users/send-otp", {
        email: form.email,
      });
      setSuccess(res.data.message);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post("http://3.106.220.39:8080/api/users/forgot-password", {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      setSuccess(res.data.message);

      // ✅ Redirect after short delay (optional)
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      // Reset form
      setStep(1);
      setForm({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid OTP or error resetting password."
      );
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        mx: "auto",
        mt: 16,
        p: 4,
        border: "1px solid #ccc",
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>

      {step === 1 ? (
        <>
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <Button variant="contained" fullWidth onClick={handleSendOtp}>
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="OTP"
            name="otp"
            fullWidth
            margin="normal"
            value={form.otp}
            onChange={handleChange}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            fullWidth
            margin="normal"
            value={form.newPassword}
            onChange={handleChange}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <Button variant="contained" fullWidth onClick={handleResetPassword}>
            Reset Password
          </Button>
        </>
      )}

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" mt={2}>
          {success}
        </Typography>
      )}
    </Box>
  );
};

export default ForgotPassword;
