import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Typography, CircularProgress, TextField, MenuItem } from "@mui/material";
import axiosInstance from "../../axiosinteceptor";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const UpcomingLeaveCalendar = () => {
  const [events, setEvents] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const managerId = localStorage.getItem("userId");
  useEffect(() => {
    fetchCalendarData();
  }, [days]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/holidays/calendar?days=${days}&managerId=${managerId}`);
      const formattedEvents = response.data.map((event) => ({
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: true,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error loading calendar events", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upcoming Leaves Calendar
      </Typography>

      <TextField
        select
        label="Show next"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        sx={{ mb: 3, width: 200 }}
      >
        {[7, 15, 30, 60].map((option) => (
          <MenuItem key={option} value={option}>
            {option} days
          </MenuItem>
        ))}
      </TextField>

      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ height: "80vh" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "100%",
              borderRadius: "10px",
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
            eventPropGetter={(event) => {
              let bgColor =
                event.title.includes("Sick") ? "#ffb74d" :
                event.title.includes("Casual") ? "#4db6ac" :
                event.title.includes("Earned") ? "#a6eb05ff" :
                "#7986cb";
              return { style: { backgroundColor: bgColor, color: "white" } };
            }}
          />
        </div>
      )}
    </Box>
  );
};

export default UpcomingLeaveCalendar;
