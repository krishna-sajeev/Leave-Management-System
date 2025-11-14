import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatBot from "./ChatBot"; // ✅ Import chatbot

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const empId = localStorage.getItem("userId");
  const id = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, requestRes] = await Promise.all([
          axios.get(`http://3.106.220.39:8080/api/leave-balance/user/${empId}`),
          axios.get(`http://3.106.220.39:8080/api/leave-requests/user/${empId}`),
        ]);
        setLeaveBalance(balanceRes.data);
        setRecentRequests(requestRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [empId]);

  if (loading) return <CircularProgress sx={{ mt: 10, ml: "50%" }} />;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Employee Dashboard
      </Typography>

      {/* Leave Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#E3F2FD" }}>
            <CardContent>
              <Typography variant="h6">Casual Leaves</Typography>
              <Typography variant="h4">{leaveBalance?.Casual ?? 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#E8F5E9" }}>
            <CardContent>
              <Typography variant="h6">Earned Leaves</Typography>
              <Typography variant="h4">{leaveBalance?.Earned ?? 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#FFF3E0" }}>
            <CardContent>
              <Typography variant="h6">Sick Leaves</Typography>
              <Typography variant="h4">{leaveBalance?.Sick ?? 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Leave Requests */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Recent Leave Requests</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/leave-request")}>
              Apply for Leave
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Type</TableCell>
                <TableCell>From Date</TableCell>
                <TableCell>To Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentRequests.length > 0 ? (
                recentRequests.map((req) => (
                  <TableRow key={req.leaveRequestId}>
                    <TableCell>{req.leaveType.typeName}</TableCell>
                    <TableCell>{req.startDate}</TableCell>
                    <TableCell>{req.endDate}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          req.status === "APPROVED"
                            ? "green"
                            : req.status === "PENDING"
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {req.status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No recent requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/*  Floating Chatbot */}
      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <ChatBot />
      </div>
    </Box>
  );
};

export default EmployeeDashboard;
