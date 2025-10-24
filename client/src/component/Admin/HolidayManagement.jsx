import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const HolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({
    holidayName: "",
    date: "",
    description: "",
  });

  const fetchHolidays = async () => {
    const res = await axios.get("http://localhost:8080/api/holidays");
    setHolidays(res.data);
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleSave = async () => {
    if (editingHoliday) {
      await axios.put(`http://localhost:8080/api/holidays/${editingHoliday.id}`, formData);
    } else {
      await axios.post("http://localhost:8080/api/holidays", formData);
    }
    setOpen(false);
    fetchHolidays();
    setFormData({ holidayName: "", date: "", description: "" });
    setEditingHoliday(null);
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData(holiday);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/holidays/${id}`);
    fetchHolidays();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Holiday Management
          </Typography>
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => setOpen(true)}
          >
            Add Holiday
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Holiday Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holidays.map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell>{holiday.holidayName}</TableCell>
                  <TableCell>{holiday.date}</TableCell>
                  <TableCell>{holiday.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(holiday)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(holiday.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingHoliday ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Holiday Name"
                fullWidth
                value={formData.holidayName}
                onChange={(e) =>
                  setFormData({ ...formData, holidayName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingHoliday ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HolidayManagement;
