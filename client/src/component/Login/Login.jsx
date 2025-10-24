import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import { Box } from '@mui/material';
import axiosInstance from '../../axiosinteceptor';

export default function Login(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/users/login", user);
    
      if (res.data.token) {
        const roles = res.data.user.role;
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", roles);
        localStorage.setItem("userId", res.data.user.userId);
        localStorage.setItem("id", res.data.user.id);
        localStorage.setItem("userName", res.data.user.fullName);
        alert("Login successful!");
      

if (roles === "EMPLOYEE") {
  navigate("/employee-dashboard");
} else if (roles === "MANAGER") {
  navigate("/manager-dashboard");
} else if (roles === "HR") {
  navigate("/hr-dashboard");
}

      } else {
        alert(res.data.status || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.response?.data?.status || "Login failed: " + err.message);
    }
  };

  return (
    <main>
      <CssVarsProvider {...props}>
        <CssBaseline />
        <Sheet
          sx={{
            width: 300,
            mx: 'auto',
            my: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}
          variant="outlined"
        >
          <div>
            <Typography level="h4" component="h1"><b>Welcome!</b></Typography>
            <Typography level="body-sm">Sign in to continue.</Typography>
          </div>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Input
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" sx={{ mt: 1 }}>Log in</Button>
            <Typography
              endDecorator={<Link href="/forgot-password">Forgot password?</Link>}
              sx={{ fontSize: 'sm', alignSelf: 'center' }}
            />
          </Box>
        </Sheet>
      </CssVarsProvider>
    </main>
  );
}
