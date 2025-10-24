import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

const LeaveRequest = () => {
  const userId = localStorage.getItem("userId"); // ✅ Define userId once

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: { leaveTypeId: "" },
    startDate: "",
    endDate: "",
    reason: "",
    user: { userId }, // ✅ userId reference fixed
  });

  // ✅ Fetch Leave Types
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/leave-types")
      .then((res) => setLeaveTypes(res.data))
      .catch((err) => console.error("Error fetching leave types:", err));
  }, []);

  // ✅ Fetch all leave requests (for logged-in user)
  useEffect(() => {
    if (!userId) return; // safety check
    axios
      .get(`http://localhost:8080/api/leave-requests/user/${userId}`)
      .then((res) => setLeaveRequests(res.data))
      .catch((err) => console.error("Error fetching leave requests:", err));
  }, [userId]);

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/api/leave-requests/apply", formData)
      .then(() => {
        alert("Leave request submitted successfully!");
        setFormData({
          leaveType: { leaveTypeId: "" },
          startDate: "",
          endDate: "",
          reason: "",
          user: { userId },
        });
        window.location.reload();
      })
      .catch((err) => console.error("Error submitting request:", err));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Leave Request
      </Typography>

      {/* 📝 Apply for Leave Section */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Apply for Leave
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Leave Type"
                  value={formData.leaveType.leaveTypeId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leaveType: { leaveTypeId: e.target.value },
                    })
                  }
                  fullWidth
                  required
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.leaveTypeId} value={type.leaveTypeId}>
                      {type.typeName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Box mt={3}>
              <Button variant="contained" color="primary" type="submit">
                Submit Request
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* 📋 Leave Request History */}
      <Card component={Paper} sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Leave Request History
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.map((req) => (
                <TableRow key={req.leaveRequestId}>
                  <TableCell>{req.leaveType?.typeName}</TableCell>
                  <TableCell>{req.startDate}</TableCell>
                  <TableCell>{req.endDate}</TableCell>
                  <TableCell>{req.reason}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color:
                          req.status === "APPROVED"
                            ? "green"
                            : req.status === "REJECTED"
                            ? "red"
                            : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {req.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeaveRequest;
