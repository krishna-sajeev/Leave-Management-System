import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    joiningDate: "",
    deptId: "",
    role: "",
  });

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8080/api/users");
    setUsers(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:8080/api/departments/dept");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const handleOpen = (user = null) => {
    setEditMode(!!user);
    setForm(
      user
        ? {
            ...user,
            deptId: user.deptId?.deptId || "",
          }
        : {
            userId: "",
            fullName: "",
            email: "",
            mobileNumber: "",
            password: "",
            joiningDate: "",
            deptId: "",
            role: "",
          }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      deptId: { deptId: form.deptId }, // backend expects object
    };

    if (editMode) {
      await axios.put(
        `http://localhost:8080/api/users/${form.id}`,
        payload
      );
    } else {
      await axios.post("http://localhost:8080/api/users", payload);
    }

    fetchUsers();
    handleClose();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/users/${id}`);
    fetchUsers();
  };

  return (
    <Box p={3}>
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              👥 User Management
            </Typography>
            <Button variant="contained" onClick={() => handleOpen()}>
              + Add User
            </Button>
          </Grid>

          <Table sx={{ mt: 3 }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><b>User ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Mobile</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>{user.deptId?.deptName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
          
            <Grid item xs={6}>
              <TextField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            {!editMode && (
              <Grid item xs={6}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Department"
                name="deptId"
                value={form.deptId}
                onChange={handleChange}
                fullWidth
              >
                {departments.map((d) => (
                  <MenuItem key={d.deptId} value={d.deptId}>
                    {d.deptName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
