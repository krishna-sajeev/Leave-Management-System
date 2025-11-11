import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, AddBusiness } from "@mui/icons-material";
import axios from "axios";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]); // ✅ New state for manager list
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    id: "",
    deptId: "",
    deptName: "",
    managerId: "",
  });

  // ✅ Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/departments/dept");
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // ✅ Fetch all MANAGER users
  const fetchManagers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users");
      const managerList = res.data.filter((u) => u.role === "MANAGER");
      setManagers(managerList);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchManagers();
  }, []);

  const handleOpen = (department = null) => {
    setEditMode(!!department);
    setForm(
      department
        ? { ...department }
        : { id: "", deptId: "", deptName: "", managerId: "" }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:8080/api/departments/${form.id}`,
          form
        );
      } else {
        await axios.post("http://localhost:8080/api/departments", form);
      }
      fetchDepartments();
      handleClose();
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:8080/api/departments/${id}`);
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  return (
    <Box p={3}>
      <Card
        sx={{
          boxShadow: 5,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 50%, #f3e5f5 100%)",
        }}
      >
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" color="primary">
              🏢 Department Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddBusiness />}
              onClick={() => handleOpen()}
              sx={{
                background: "linear-gradient(90deg, #1565c0, #6a1b9a)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(90deg, #0d47a1, #4a148c)",
                },
              }}
            >
              Add Department
            </Button>
          </Grid>

          <Table sx={{ mt: 3, backgroundColor: "white", borderRadius: 2 }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <b>Department ID</b>
                </TableCell>
                <TableCell>
                  <b>Department Name</b>
                </TableCell>
                <TableCell>
                  <b>Manager</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <TableRow
                    hover
                    key={dept.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f9f9f9" },
                      transition: "0.3s",
                    }}
                  >
                    <TableCell>{dept.deptId}</TableCell>
                    <TableCell>{dept.deptName}</TableCell>
                    <TableCell>
                      {dept.managerId
                        ? managers.find((m) => m.userId === dept.managerId)?.fullName ||
                          dept.managerId
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(dept)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Departments Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ===== Add/Edit Dialog ===== */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: 6, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#1565c0" }}>
          {editMode ? "Edit Department" : "Add New Department"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Department ID"
                name="deptId"
                value={form.deptId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Department Name"
                name="deptName"
                value={form.deptName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Manager"
                name="managerId"
                value={form.managerId}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">
                  <em>Select Manager</em>
                </MenuItem>
                {managers.map((m) => (
                  <MenuItem key={m.userId} value={m.userId}>
                    {m.fullName} ({m.userId})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: "linear-gradient(90deg, #1565c0, #6a1b9a)",
              "&:hover": {
                background: "linear-gradient(90deg, #0d47a1, #4a148c)",
              },
            }}
          >
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentManagement;
