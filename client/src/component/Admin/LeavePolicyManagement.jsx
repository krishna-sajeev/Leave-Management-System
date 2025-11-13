import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const LeavePolicyManagement = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [typeName, setTypeName] = useState("");
  const [maxDaysPerYear, setMaxDaysPerYear] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  const API_URL = "http://3.106.220.39:8080/api/leave-types";
  const ADD_URL = "http://3.106.220.39:8080/api/addleave-types";

  // Load all leave types
  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get(API_URL);
      setLeaveTypes(res.data);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // Add or Update Leave Type
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!typeName.trim() || !maxDaysPerYear) {
      setSnackbar({ open: true, message: "All fields are required", severity: "warning" });
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/${editId}`, { typeName, maxDaysPerYear });
        setSnackbar({ open: true, message: "Leave type updated successfully", severity: "success" });
      } else {
        await axios.post(ADD_URL, { typeName, maxDaysPerYear });
        setSnackbar({ open: true, message: "Leave type added successfully", severity: "success" });
      }
      setTypeName("");
      setMaxDaysPerYear("");
      setEditMode(false);
      fetchLeaveTypes();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data || "Error saving leave type",
        severity: "error"
      });
    }
  };

  // Edit leave type
  const handleEdit = (type) => {
    setEditMode(true);
    setEditId(type.leaveTypeId);
    setTypeName(type.typeName);
    setMaxDaysPerYear(type.maxDaysPerYear);
  };

  // Delete leave type
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSnackbar({ open: true, message: "Leave type deleted", severity: "info" });
      fetchLeaveTypes();
      setConfirmDialog({ open: false, id: null });
    } catch (error) {
      setSnackbar({ open: true, message: "Error deleting leave type", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🏢 Leave Policy Settings
      </Typography>

      <Card sx={{ mb: 4, p: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Leave Type"
                  variant="outlined"
                  fullWidth
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Max Days / Year"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={maxDaysPerYear}
                  onChange={(e) => setMaxDaysPerYear(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: "100%" }}
                >
                  {editMode ? "Update" : "Add"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configured Leave Types
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Leave Type</b></TableCell>
                <TableCell><b>Max Days / Year</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveTypes.length > 0 ? (
                leaveTypes.map((type) => (
                  <TableRow key={type.leaveTypeId}>
                    <TableCell>{type.typeName}</TableCell>
                    <TableCell>{type.maxDaysPerYear}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(type)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setConfirmDialog({ open: true, id: type.leaveTypeId })}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No leave types configured yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this leave type?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: null })}>Cancel</Button>
          <Button color="error" onClick={() => handleDelete(confirmDialog.id)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeavePolicyManagement;
