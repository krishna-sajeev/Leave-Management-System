import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Tooltip, Snackbar, Alert, FormControl, MenuItem, Select, InputLabel
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';

const API_BASE_URL = "http://localhost:8080/api/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName:'', email:'', role:'', deptId:'', mobileNumber:'', joiningDate:'' });
  const [alert, setAlert] = useState({ open:false, message:'', severity:'success' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { 
      const res = await axios.get(API_BASE_URL);
      setUsers(res.data);
    } catch(err) {
      setAlert({ open:true, message:"Failed to load users", severity:"error" });
    }
  };

  const handleSaveUser = async () => {
    try {
      const payload = { ...formData, deptId: { deptId: formData.deptId } };
      if(editingUser) await axios.put(`${API_BASE_URL}/edit/${editingUser.id}`, payload);
      else await axios.post(`${API_BASE_URL}/add`, payload);

      setOpen(false); setEditingUser(null);
      setFormData({ fullName:'', email:'', role:'', deptId:'', mobileNumber:'', joiningDate:'' });
      fetchUsers();
      setAlert({ open:true, message:"Saved successfully", severity:"success" });
    } catch(err) {
      setAlert({ open:true, message:"Save failed", severity:"error" });
    }
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm("Delete user?")) return;
    try { 
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      fetchUsers();
      setAlert({ open:true, message:"Deleted successfully", severity:"success" });
    } catch(err) { setAlert({ open:true, message:"Delete failed", severity:"error" }); }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role || '',
      deptId: user.deptId?.dept_id || '',
      mobileNumber: user.mobileNumber || '',
      joiningDate: user.joiningDate || ''
    });
    setOpen(true);
  };

  const columns = [
  { field:'fullName', headerName:'Name', flex:1 },
  { field:'email', headerName:'Email', flex:1 },
  { field:'role', headerName:'Role', flex:1 },
  { field:'mobileNumber', headerName:'Mobile', flex:1 },
  { 
    field:'joiningDate', 
    headerName:'Joining Date', 
    flex:1, 
   },
  { 
    field:'deptId', 
    headerName:'Department', 
    flex:1, 
     },
  {
    field:'actions', headerName:'Actions', flex:1, renderCell: (params) => (
      <>
        <Tooltip title="Edit">
          <IconButton onClick={() => handleEditUser(params.row)}><Edit /></IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDeleteUser(params.row.id)}><Delete /></IconButton>
        </Tooltip>
      </>
    )
  }
];

  return (
    <Box sx={{ p:4 }}>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={()=>{setEditingUser(null); setFormData({ fullName:'', email:'', role:'', deptId:'', mobileNumber:'', joiningDate:'' }); setOpen(true);}}>Add User</Button>
      
      <Box sx={{ height:400, mt:2 }}>
        <DataGrid rows={users} columns={columns} pageSize={5} getRowId={row => row.id || row.userId} />
      </Box>

      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>{editingUser ? "Edit User":"Add User"}</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2, mt:1 }}>
          <TextField label="Name" value={formData.fullName} onChange={(e)=>setFormData({...formData, fullName:e.target.value})} />
          <TextField label="Email" value={formData.email} onChange={(e)=>setFormData({...formData, email:e.target.value})} />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={formData.role} onChange={(e)=>setFormData({...formData, role:e.target.value})}>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
              <MenuItem value="MANAGER">MANAGER</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Department ID" value={formData.deptId} onChange={(e)=>setFormData({...formData, deptId:e.target.value})} />
          <TextField label="Mobile Number" value={formData.mobileNumber} onChange={(e)=>setFormData({...formData, mobileNumber:e.target.value})} />
          <TextField label="Joining Date" type="date" value={formData.joiningDate} onChange={(e)=>setFormData({...formData, joiningDate:e.target.value})} InputLabelProps={{shrink:true}} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={()=>setAlert({...alert, open:false})} anchorOrigin={{vertical:'bottom', horizontal:'center'}}>
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
