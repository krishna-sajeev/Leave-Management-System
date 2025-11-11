import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/holidays");
        setHolidays(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  // Filter holidays by search term
  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      holidays.filter(
        (h) =>
          h.holidayName.toLowerCase().includes(lower) ||
          h.description.toLowerCase().includes(lower)
      )
    );
  }, [search, holidays]);

  // Highlight upcoming holidays
  const isUpcoming = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return date >= today;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            📅 Company Holiday Calendar
          </Typography>

        

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : filtered.length === 0 ? (
            <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
              No holidays found.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Holiday</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date</TableCell>
                 
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((holiday) => (
                  <TableRow
                    key={holiday.id}
                    sx={{
                      backgroundColor: isUpcoming(holiday.date)
                        ? "#e8f5e9"
                        : "#f9f9f9",
                    }}
                  >
                    <TableCell>{holiday.holidayName}</TableCell>
                    <TableCell>
                      {new Date(holiday.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                   
                    <TableCell>
                      {isUpcoming(holiday.date)
                        ? "Upcoming 🎉"
                        : "Past"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HolidayCalendar;
