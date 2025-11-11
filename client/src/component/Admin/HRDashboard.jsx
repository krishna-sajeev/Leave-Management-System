import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const HRDashboard = () => {
  const [data, setData] = useState({
    employees: 0,
    managers: 0,
    departments: 0,
    leaves: [],
  });
  const [analytics, setAnalytics] = useState({
    totalRequests: 0,
    avgApprovalTime: 0,
    deptTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await axios.get("http://localhost:8080/api/users/employee/count");
        const mgrRes = await axios.get("http://localhost:8080/api/users/manager/count");
        const deptRes = await axios.get("http://localhost:8080/api/departments/count");
        const leaveRes = await axios.get("http://localhost:8080/api/leave-requests/all");

        // 🔹 Compute analytics
        const leaves = leaveRes.data;
        const totalRequests = leaves.length;

        // Average approval time calculation
        const approvedLeaves = leaves.filter((l) => l.status === "APPROVED" && l.approvedDate);
        const avgApprovalTime =
          approvedLeaves.length > 0
            ? (
                approvedLeaves.reduce((acc, l) => {
                  const diff =
                    (new Date(l.approvedDate) - new Date(l.requestDate)) /
                    (1000 * 60 * 60 * 24);
                  return acc + diff;
                }, 0) / approvedLeaves.length
              ).toFixed(1)
            : 0;

        // Department-wise trends
        const deptMap = {};
        leaves.forEach((l) => {
          const deptName = l.user?.deptId?.deptName || "Unknown";
          deptMap[deptName] = (deptMap[deptName] || 0) + 1;
        });
        const deptTrends = Object.entries(deptMap).map(([name, value]) => ({
          name,
          value,
        }));

        setData({
          employees: empRes.data,
          managers: mgrRes.data,
          departments: deptRes.data,
          leaves,
        });

        setAnalytics({
          totalRequests,
          avgApprovalTime,
          deptTrends,
        });
      } catch (error) {
        console.error("Error loading HR dashboard:", error);
        setSnackbar({
          open: true,
          message: "Failed to load dashboard data!",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 10, ml: "50%" }} />;

  // Pie chart for overall status
  const pending = data.leaves.filter((r) => r.status === "PENDING").length;
  const approved = data.leaves.filter((r) => r.status === "APPROVED").length;
  const rejected = data.leaves.filter((r) => r.status === "REJECTED").length;

  const chartData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#FFB74D", "#66BB6A", "#EF5350"];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        HR Dashboard
      </Typography>

      {/* Overview Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#E3F2FD" }}>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h4">{data.employees}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#E8F5E9" }}>
            <CardContent>
              <Typography variant="h6">Total Managers</Typography>
              <Typography variant="h4">{data.managers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#FFF3E0" }}>
            <CardContent>
              <Typography variant="h6">Departments</Typography>
              <Typography variant="h4">{data.departments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#E1F5FE" }}>
            <CardContent>
              <Typography variant="h6">Total Leave Requests</Typography>
              <Typography variant="h4">{analytics.totalRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Organization Leave Status Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Department-wise Leave Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.deptTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#42A5F5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Average Approval Time */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Average Approval Time</Typography>
          <Typography variant="h4" color="primary">
            {analytics.avgApprovalTime} days
          </Typography>
        </CardContent>
      </Card>

      {/* Recent Leave Requests */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Recent Leave Requests
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.leaves.slice(0, 5).map((req) => (
                <TableRow key={req.leaveRequestId}>
                  <TableCell>{req.user?.fullName}</TableCell>
                  <TableCell>{req.user?.deptId?.deptName}</TableCell>
                  <TableCell>{req.leaveType?.typeName}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Snackbar for errors */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default HRDashboard;
