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
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "../../axiosinteceptor";

const ManagerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const managerId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchRequests = async () => {
     
      try {
        const response = await axiosInstance.get(`/api/leave-requests/manager/${managerId}`);
        const data = response.data;

        setRequests(data);

        const pending = data.filter((r) => r.status === "PENDING").length;
        const approved = data.filter((r) => r.status === "APPROVED").length;
        const rejected = data.filter((r) => r.status === "REJECTED").length;
        setStats({ pending, approved, rejected });
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      await axiosInstance.post(`/api/leave-approvals/${requestId}/action`, null, {
  params: {
    approverId: managerId,   // Example: "MNG001"
    action: action           // Example: "APPROVED" or "REJECTED"
  }
});

      setSnackbar({
        open: true,
        message: `Leave ${action.toLowerCase()} successfully!`,
        severity: "success",
      });

      setRequests((prev) =>
        prev.map((req) =>
          req.leaveRequestId === requestId ? { ...req, status: action } : req
        )
      );
    } catch (error) {
      console.error("Error updating leave request:", error);
      setSnackbar({ open: true, message: "Action failed!", severity: "error" });
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Manager Dashboard
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#FFF3E0" }}>
            <CardContent>
              <Typography variant="h6">Pending Requests</Typography>
              <Typography variant="h4">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#E8F5E9" }}>
            <CardContent>
              <Typography variant="h6">Approved</Typography>
              <Typography variant="h4">{stats.approved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#FFEBEE" }}>
            <CardContent>
              <Typography variant="h6">Rejected</Typography>
              <Typography variant="h4">{stats.rejected}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Requests Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Pending Leave Requests
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req.leaveRequestId}>
                    <TableCell>{req.user?.fullName || "-"}</TableCell>
                    <TableCell>{req.leaveType.typeName || "-"}</TableCell>
                    <TableCell>{req.startDate}</TableCell>
                    <TableCell>{req.endDate}</TableCell>
                    <TableCell>{req.reason}</TableCell>
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
                    <TableCell align="center">
                      {req.status === "PENDING" ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleAction(req.leaveRequestId, "APPROVED")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleAction(req.leaveRequestId, "REJECTED")}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Snackbar */}
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

export default ManagerDashboard;
