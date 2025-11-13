import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
  Divider,
  Grid,
  Chip,
  Fade,
  Paper,
} from "@mui/material";
import {
  Email,
  Phone,
  CalendarToday,
  Person,
  Business,
  Group,
} from "@mui/icons-material";
import { blue, deepPurple, green, purple } from "@mui/material/colors";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://3.106.220.39:8080/api/profile/${userId}`)
        .then((res) => setProfile(res.data))
        .catch((err) => console.error(err));
    }
  }, [userId]);

  if (!profile) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background:
            "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // 🎨 Dynamic color by role
  const roleColor =
    profile.role === "EMPLOYEE"
      ? blue[600]
      : profile.role === "MANAGER"
      ? green[600]
      : purple[600];

  return (
    <Fade in timeout={700}>
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "95%",
            maxWidth: 950,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.85)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            p: 4,
          }}
        >
          {/* ===== Header Section ===== */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={3} textAlign="center">
              <Avatar
                alt={profile.name}
                src={profile.imageUrl || ""}
                sx={{
                  bgcolor: deepPurple[500],
                  width: 120,
                  height: 120,
                  fontSize: 40,
                  mx: "auto",
                  border: "4px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                {profile.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>

            <Grid item xs={12} sm={9}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: roleColor,
                  letterSpacing: 0.5,
                }}
              >
                {profile.name}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1, gap: 1 }}>
                <Chip
                  icon={<Person />}
                  label={profile.role}
                  sx={{
                    backgroundColor: roleColor,
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                <Chip
                  icon={<Business />}
                  label={profile.department}
                  sx={{
                    backgroundColor: "#eceff1",
                    fontWeight: "500",
                  }}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email fontSize="small" /> {profile.email}
                </Typography>
                <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone fontSize="small" /> {profile.mobileNumber}
                </Typography>
                <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday fontSize="small" /> Joined: {profile.joiningDate}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* ===== Profile Info Section ===== */}
          <Card
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: roleColor, fontWeight: "bold", mb: 2 }}
            >
              Profile Overview
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Employee ID:</strong> {profile.userId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Role:</strong> {profile.role}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Department:</strong> {profile.department}
                </Typography>
              </Grid>
              {profile.managerName && (
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Manager:</strong> {profile.managerName}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Card>

          {/* ===== Manager Section ===== */}
          {profile.role === "MANAGER" && profile.teamMembers?.length > 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: green[700],
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Group /> Team Members
              </Typography>
              <Table
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <TableHead sx={{ backgroundColor: green[50] }}>
                  <TableRow>
                    <TableCell><strong>User ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Joining Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profile.teamMembers.map((emp) => (
                    <TableRow hover key={emp.userId}>
                      <TableCell>{emp.userId}</TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.joiningDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* ===== HR Section ===== */}
          {profile.role === "HR" && profile.departments?.length > 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: purple[700],
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Business /> Department Overview
              </Typography>
              <Table
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <TableHead sx={{ backgroundColor: purple[50] }}>
                  <TableRow>
                    <TableCell><strong>Dept ID</strong></TableCell>
                    <TableCell><strong>Dept Name</strong></TableCell>
                    <TableCell><strong>Manager ID</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profile.departments.map((dept) => (
                    <TableRow hover key={dept.deptId}>
                      <TableCell>{dept.deptId}</TableCell>
                      <TableCell>{dept.deptName}</TableCell>
                      <TableCell>{dept.managerId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};

export default ProfilePage;
